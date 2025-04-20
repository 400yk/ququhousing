// const fsPromises = require('fs').promises;
// const path = require('path');

// const userDB = {
//     users: require('../model/users.json'),
//     setUsers: function (data) {
//         this.users = data
//     }
// }
const query = require('../config/query');
const moment = require('moment');

const membershipRenew = async (user, renewMonths) => {
    // UserDB.users 不是实时读取的，所以auth之后立刻来refresh无法找到对应refreshToken，因为auth后面生成了新的
    // refreshToken， 而UserDB.users还是之前的（即使auth里面已经写入了文件）
    // 这里用readFile就可以实时获取最新写入了文件的refreshToken
    // const data = await fsPromises.readFile(path.join(__dirname, '..', 'model', 'users.json'));
    // const users = JSON.parse(data);

    // const foundUser = users.find(person => person.username === user);
    var foundUser = await query(`SELECT * FROM userInfo WHERE username = ${user}`);
    if (foundUser?.length === 0) {
        console.log("用户未找到");
        return false;
    }

    foundUser = foundUser[0];

    // const jsReady_datetime = foundUser.memberExpiration.replace(' ', 'T') + 'Z';

    const currentExpiration = new Date(foundUser.memberExpiration);
    const today = new Date();

    let newExpiration;
    if (currentExpiration > today) {
        newExpiration = new Date(currentExpiration.setMonth(currentExpiration.getMonth() + renewMonths));
    } else {
        newExpiration = new Date(today.setMonth(today.getMonth() + renewMonths));
    }

    process.env.NODE_ENV === 'development'?
        newExpiration = newExpiration.toLocaleString().replaceAll('/','-') :
        newExpiration = moment(newExpiration.toLocaleString(), "M-D-YYYY h:mm:ss A").format("YYYY-M-D HH:mm:ss");

    // update expiration date in db
    await query(`UPDATE userInfo SET memberExpiration = '${newExpiration}' WHERE userId = ${foundUser.userId}`);
    // const otherUsers = users.filter(person => person.username !== foundUser.username);
    // const currentUser = { ...foundUser,  expirationDate: newExpiration};
    // userDB.setUsers([...otherUsers, currentUser]);
    // await fsPromises.writeFile(
    //     path.join(__dirname, '..', 'model', 'users.json'),
    //     JSON.stringify(userDB.users)
    // );
    return newExpiration; //renew successful
}

// const renewMembership = async (req, res) => {
//     const renewMonths = req.body.renewMonths;
//     // UserDB.users 不是实时读取的，所以auth之后立刻来refresh无法找到对应refreshToken，因为auth后面生成了新的
//     // refreshToken， 而UserDB.users还是之前的（即使auth里面已经写入了文件）
//     // 这里用readFile就可以实时获取最新写入了文件的refreshToken
//     const data = await fsPromises.readFile(path.join(__dirname, '..', 'model', 'users.json'));
//     const users = JSON.parse(data);

//     const foundUser = users.find(person => person.username === req.user);
//     if (!foundUser) {
//         return res.sendStatus(204); // successful but no content
//     }

//     const currentExpiration = new Date(foundUser.expirationDate);
//     const today = new Date();
//     let newExpiration;
//     if (currentExpiration > today) {
//         newExpiration = new Date(currentExpiration.setMonth(currentExpiration.getMonth() + renewMonths));
//     } else {
//         newExpiration = new Date(today.setMonth(today.getMonth() + renewMonths));
//     }

//     // update expiration date in db
//     const otherUsers = users.filter(person => person.username !== foundUser.username);
//     const currentUser = { ...foundUser,  expirationDate: newExpiration};
//     userDB.setUsers([...otherUsers, currentUser]);
//     await fsPromises.writeFile(
//         path.join(__dirname, '..', 'model', 'users.json'),
//         JSON.stringify(userDB.users)
//     );
//     res.sendStatus(200);
// }

// module.exports = { renewMembership, membershipRenew }
module.exports = { membershipRenew }