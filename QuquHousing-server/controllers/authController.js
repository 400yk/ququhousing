// const userDB = {
//     users: require('../model/users.json'),
//     setUsers: function (data) {
//         this.users = data
//     }
// }

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
require('dotenv').config();
// const fsPromises = require('fs').promises;
// const path = require('path');
// const { USE_SMS } = require('../config/smsAlibaba');
const query = require('../config/query');
const { verifyCode } = require('../controllers/smsController');

const handleLogin = async (req, res) => {
    // UserDB.users 不是实时读取的，所以auth之后立刻来refresh无法找到对应refreshToken，因为auth后面生成了新的
    // refreshToken， 而UserDB.users还是之前的（即使auth里面已经写入了文件）
    // 这里用readFile就可以实时获取最新写入了文件的refreshToken
    // const data = await fsPromises.readFile(path.join(__dirname, '..', 'model', 'users.json'));
    // const users = JSON.parse(data);

    const user = req.body.user;
    let pwd;
    let vericode;
    if (req.body?.pwd) {
        pwd = req.body.pwd;
        if (!user || !pwd) return res.status(400).json({
            "message": "Username and password are required."
        });
    } else {
        vericode = req.body.vericode;
    }

    // const foundUser = users.find(person => person.username === user);
    var foundUser = await query(`SELECT * FROM userInfo WHERE username = ${user}`);
    if (foundUser?.length === 0) return res.sendStatus(401); // Unauthorized 

    foundUser = foundUser[0];
    // evaluate password
    let match = false;
    if (req.body?.pwd) {
        match = await bcrypt.compare(pwd, foundUser.password);
    } else {
        match = verifyCode(user, vericode);
    }
    if (match) {
        // const roles = Object.values(foundUser.roles); // just sending the code instead of role name
        var roles = foundUser.roles.split(',');
        roles = roles.map((role) => parseInt(role));

        // create JWTs
        const accessToken = jwt.sign(
            { 
                "UserInfo": {
                    "username": foundUser.username,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30s' }
        );
        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '2h' }
        );

        // saving refreshToken with current user
        await query(`INSERT INTO userAuth (userId, refresh_token) \
            VALUES (${foundUser.userId}, '${refreshToken}') \ 
            ON DUPLICATE KEY UPDATE refresh_token = '${refreshToken}'`);

        // const otherUsers = userDB.users.filter(person => person.username !== foundUser.username);
        // const currentUser = { ...foundUser, refreshToken };
        // userDB.setUsers([...otherUsers, currentUser]);
        // await fsPromises.writeFile(
        //     path.join(__dirname, '..', 'model', 'users.json'),
        //     JSON.stringify(userDB.users)
        // );

        // need to store the accessToken in memory, not in local storage!
        // send in http cookie, which is NOT javascript available! not 100% secure, but more secure than local storage
        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 }); // one day length
        // Just for thunderclient testing, set secure to false, see https://github.com/rangav/thunder-client-support/issues/872 and https://stackoverflow.com/questions/74402197/cookie-in-thunder-client-vs-code-extension
        // TODO: in production, set secure: true


        res.json({ 
            "roles": roles,
            "accessToken": accessToken
        });
    } else {
        res.sendStatus(401);
    }
}

module.exports = {handleLogin};