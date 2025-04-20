const query = require('../config/query');
const { MEMBERSHIP_TYPES } = require('../config/memberOfferings');
const fsPromises = require('fs').promises;
const { membershipRenew } = require('./renewalController');
const path = require('path');


const createOrder = async (req, res) => {
    const user = req.user;
    const orderNum = req.body.orderNum;
    const orderPrice = req.body.orderPrice;

    const orderTime = Math.floor(Date.now() / 1000);

    // 获取2分钟未支付的订单
    let unpaidOrders = [];
    let thisUserUnpaidOrders = [];

    // // 先获取用户ID （TODO：现在比之前多了一步骤，可能会降低速度）
    // var foundUser = await query(`SELECT userID from userInfo WHERE username = ${user}`);
    // if (foundUser?.length === 0) {
    //     res.sendStatus(403); // Forbidden
    //     return;
    // }
    // foundUser = foundUser[0];

    try {
        unpaidOrders = await query(`SELECT * FROM orderList WHERE order_status = 1 \
            AND (${orderTime} - order_time) <= 120 AND order_price = ${orderPrice};`);
        thisUserUnpaidOrders = await query(`SELECT * FROM orderList WHERE order_status = 1 \
            AND (${orderTime} - order_time) <= 120 AND username = ${user};`);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            "message": "获取数据库信息失败!"
        });
        return;
    }

    if (thisUserUnpaidOrders?.length >= 4) {
        // 该用户点击了太多未支付订单
        res.status(503).json({
            "message": "提交订单次数过多，请稍等2分钟再支付！"
        });
        return;
    }

    let needPay;
    let needPay_min;
    // 判断是否有2分钟未支付的订单
    if (unpaidOrders.length == 0) {
        needPay = orderPrice;
    } else {

        // 获取2分钟未支付的订单的最小金额-0.01
        needPay_min = parseFloat((Math.min(...unpaidOrders.map(order => order.order_money)) - 0.01).toFixed(2));

        // 找到应付价格和订单最小金额直接的数字，如果存在价格且没有应支付订单，优先输出该价格
        var found_i = false;
        for (var i = orderPrice; i > needPay_min; i = i - 0.01) {
            if ([...unpaidOrders.map(order => order.order_money)].indexOf(i) === -1) {
                needPay = i;
                found_i = true;
                break;
            }
        }
                
        if (!found_i) needPay = needPay_min;
    }

    // 太多人同时支付
    if (unpaidOrders.length >= 10) {
        res.status(503).json({
            "message": "当前支付人数过多，请稍等再刷新页面！"
        });
        return;
    } else {
        // 数据库中插入该笔未支付订单
        const insertQuery = "INSERT INTO orderList(username, order_num, order_time, order_price, order_money) \
        VALUES (?,?,?,?,?)";

        const insertValues = [user, orderNum, orderTime, orderPrice, needPay];

        try {
            await query(insertQuery, insertValues);
            const skmPhoto = await fsPromises.readFile(path.join(__dirname, '..', 'imgs', 'skm.png'));
            const base64Image = Buffer.from(skmPhoto).toString('base64');
            res.status(200).json({
                "needPayFromServer": needPay,
                "QRPayImage": `data:image/png;base64,${base64Image}`,
                "message": "订单已创建，等待支付"
            });
            return;
        } catch (err) {
            console.error(err);
            res.status(500).json({
                "message": "订单创建出错!"
            });
            return;
        }
    }
}

const getOfferings = async (req, res) => {
    // const data = await fsPromises.readFile(path.join(__dirname, '..', 'model', 'users.json'));
    // const users = JSON.parse(data);
    // const foundUser = users.find(person => person.username === req.user);
    var foundUser = await query(`SELECT * FROM userInfo WHERE username = ${req.user}`);

    if (foundUser?.length === 0) {
        return res.status(400).json({ 'message': `用户 ${req.user} 未找到。 `});
    }
    foundUser = foundUser[0];

    res.json({
        "memberOfferings": MEMBERSHIP_TYPES,
        "expirationDate": foundUser.memberExpiration,
    });
}

const checkPay = async (req, res) => {
    const user = req.user;
    const orderNum = req.query.orderNum;
    const needPay = req.query.needPay;

    const checkQuery = "SELECT * FROM orderList WHERE (username = ?) AND (order_num = ?) AND (ROUND(order_price) = ?)";
    const checkValues = [user, orderNum, needPay];

    const orderPayStatus = await query(checkQuery, checkValues);
    console.log("checking payment status...");

    if (orderPayStatus) {
        if (orderPayStatus[0]?.order_status === 2) {
            //支付成功
            const successPhoto = await fsPromises.readFile(path.join(__dirname, '..', 'imgs', 'success.png'));
            const base64Image = Buffer.from(successPhoto).toString('base64');


            // 删除该用户未支付的订单 （可以考虑，为了数据分析可以保留）
            const deleteUnpaidQuery = `DELETE FROM orderList WHERE username=${user} AND order_status=1`;
            try {
                await query(deleteUnpaidQuery);
            } catch (err) {
                console.log("删除用户 " + user + " 未支付订单失败！");
                console.log(err);
            }

            // 延长会员时长
            const memberType = [...MEMBERSHIP_TYPES.map(mem => mem.totalPrice)].indexOf(parseInt(needPay));
            const memberMonths = MEMBERSHIP_TYPES[memberType].memberMonths;
            const newExpiration = await membershipRenew(user, memberMonths);

            // 发送成功信息
            res.status(200).json({
                "message": "支付成功",
                "QRPayImage": `data:image/png;base64,${base64Image}`,
                "newExpiration": newExpiration,
            });

            return;

        } else {
            res.status(202).json({
                "message": "未支付"
            });
            return;
        }
    } else {
        res.status(201).json({
            "message": "未支付"
        });
        return;
    }
}


module.exports = { createOrder, getOfferings, checkPay };

