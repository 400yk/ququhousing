const query = require('../config/query');
const bcrypt = require('bcrypt');
const smsController = require('./smsController');
const { USE_SMS } = require('../config/smsAlibaba');
const { NEW_REGISTER_TRIAL_DAYS } = require('../config/memberOfferings');
const moment = require('moment');

const handleNewUser = async (req, res) => {
    const { user, vericode, pwd } = req.body;
    if (!user || !pwd || !vericode) return res.status(400).json({
        "message": "手机号、密码、验证码都是必填项."
    });

    // 先通过验证码确认真实手机号
    if (USE_SMS && !smsController.verifyCode(user, vericode)) {
        res.status(403).json({
            "message": "验证码错误",
        });
        return;
    }

    // Check for duplicate usernames in db
    const duplicate = await query(`SELECT userId FROM userInfo WHERE username = ${user}`);
    // const duplicate = userDB.users.find(person => person.username === user);
    if (duplicate.length > 0) return res.status(409).json({"message": "此用户名已经存在！"}); // Conflict
    try {
        // encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10);
        const registerTime = new Date(Date.now());
        const curTime = new Date();
        const memberExpiration = new Date(curTime.getFullYear(), curTime.getMonth(), curTime.getDate() + NEW_REGISTER_TRIAL_DAYS, 23, 59, 59, 999);

        let registeredSince;
        let memExpiration;
        if (process.env.NODE_ENV === "development") {
            registeredSince = registerTime.toLocaleString().replaceAll('/','-');
            memExpiration = memberExpiration.toLocaleString().replaceAll('/','-');
        } else { //针对Centos系统对于Date的不同格式问题
            registeredSince = moment(registerTime.toLocaleString(), "M-D-YYYY h:mm:ss A").format("YYYY-M-D HH:mm:ss");
            memExpiration = moment(memberExpiration.toLocaleString(), "M-D-YYYY h:mm:ss A").format("YYYY-M-D HH:mm:ss");
        }
        // store the user
        const newUser = { 
            "username": user, 
            "roles": 2001,
            "nickname": "蛐蛐用户" + user.slice(-4), //用户名+手机号后四位作为默认
            "password": hashedPwd,
            "level": 1, //会员等级
            "point": 100, //会员积分
            "demandDescription": "", //描述：购房需求
            "registeredSince": registeredSince,
            "memberExpiration": memExpiration, // 3 days from now, until end of the day
        };
        await query(`INSERT INTO userInfo (username, phone, roles, nickname, password, level, point, demandDescription, registeredSince, memberExpiration) \
            VALUES (${newUser.username}, ${newUser.username}, '${newUser.roles}', '${newUser.nickname}', '${newUser.password}', ${newUser.level}, ${newUser.point}, \ 
                "", '${newUser.registeredSince}', '${newUser.memberExpiration}')`);

        // userDB.setUsers([...userDB.users, newUser]);
        // await fsPromises.writeFile(
        //     path.join(__dirname, '..', 'model', 'users.json'),
        //     JSON.stringify(userDB.users)
        // );
        // console.log(userDB.users);
        res.status(201).json({ 
            "success": `New user ${user} created!`
        })
    } catch (err) {
        res.status(500).json({
            "message": err.message,
        });
    }
}

module.exports = {handleNewUser};
