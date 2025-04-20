// const userDB = {
//     users: require('../model/users.json'),
//     setUsers: function (data) {
//         this.users = data
//     }
// }
const jwt = require('jsonwebtoken');
require('dotenv').config();
const query = require('../config/query');
// const fsPromises = require('fs').promises;
// const path = require('path');

const handleRefreshToken = async (req, res) => {
    // UserDB.users 不是实时读取的，所以auth之后立刻来refresh无法找到对应refreshToken，因为auth后面生成了新的
    // refreshToken， 而UserDB.users还是之前的（即使auth里面已经写入了文件）
    // 这里用readFile就可以实时获取最新写入了文件的refreshToken
    // const data = await fsPromises.readFile(path.join(__dirname, '..', 'model', 'users.json'));
    // const users = JSON.parse(data);
    
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401); // Unauthorized
    const refreshToken = cookies.jwt;

    var foundUserAuth = await query(`SELECT * FROM userAuth WHERE refresh_token = '${refreshToken}'`);
    // const foundUser = users.find(person => person.refreshToken === refreshToken);
    if (foundUserAuth?.length === 0) return res.sendStatus(403); // Forbidden

    foundUserAuth = foundUserAuth[0];
    var foundUser = await query(`SELECT * FROM userInfo WHERE userId = ${foundUserAuth.userId}`);
    if (foundUser?.length === 0) return res.sendStatus(403); // Forbidden

    foundUser = foundUser[0];
    // evaluate jwt
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.username !== decoded.username) return res.sendStatus(403);
            // const roles = Object.values(foundUser.roles);
            var roles = foundUser.roles.split(',');
            roles = roles.map((role) => parseInt(role));
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": decoded.username,
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30s' } // TODO: Set it longer in production app
            );
            res.json({ roles, accessToken });
        }
    )
}

module.exports = { handleRefreshToken };