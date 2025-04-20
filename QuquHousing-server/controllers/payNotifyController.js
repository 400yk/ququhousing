const query = require('../config/query');
const fsPromises = require('fs').promises;
const path = require('path');

const paymentSuccess = async (req, res) => {
    const orderMsg = req.query.orderMsg;

    const money_1 = orderMsg.includes('到账')
        ? orderMsg.slice(orderMsg.lastIndexOf('到账') + 2, orderMsg.lastIndexOf('元'))
        : orderMsg.slice(orderMsg.lastIndexOf('收款') + 2, orderMsg.lastIndexOf('元'));
    const money_2 = parseFloat(money_1);

    var currentDateTime = Math.floor(Date.now() / 1000);
    var twoMinutesAgo = currentDateTime - 2 * 60;
    currentDateTime = currentDateTime.toString();
    twoMinutesAgo = twoMinutesAgo.toString();

    const getOrderQuery = `SELECT * FROM orderList 
            WHERE order_time > ${twoMinutesAgo} AND order_time < ${currentDateTime}
            AND round(order_money,2) = ${money_2}`;

    const getOrderPayStatus = await query(getOrderQuery);
    let order_num = null;
    let updateOrderResult = null;

    if (getOrderPayStatus.length > 1) {
        // TODO: 多于一笔订单的情况
    } else if (getOrderPayStatus.length === 1) {
        order_num = getOrderPayStatus[0].order_num;
        const updateQuery = `UPDATE orderList SET order_status = 2, order_paytime = '${currentDateTime}', \
                order_msg = '${orderMsg}' WHERE order_status = 1 AND order_num = '${order_num}'`;

        updateOrderResult = await query(updateQuery);
    }

    if (updateOrderResult?.affectedRows === 1) { //数据库更新成功
        const ret = {
            code: 200,
            msg: '支付成功',
            order_num,
            order_money: money_2,
            order_msg: orderMsg,
        };
        console.log(ret);
        // TODO：更新会员有效期时长
        const skmPhoto = await fsPromises.readFile(path.join(__dirname, '..', 'imgs', 'success.png'));
        const base64Image = Buffer.from(skmPhoto).toString('base64');
        res.status(200).json({
            "QRPayImage": `data:image/png;base64,${base64Image}`,
            "message": "订单支付成功"
        });
        return;
    } else {
        const ret = {
            code: 203,
            msg: '支付失败',
            order_num,
        };
        console.log(ret);
        res.status(203);
        return;
    }

}

module.exports = { paymentSuccess };
