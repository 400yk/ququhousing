// const fsPromises = require('fs').promises;
// const path = require('path');

// const userDB = {
//     users: require('../model/users.json'),
//     setUsers: function (data) {
//         this.users = data
//     }
// }
const query = require('../config/query');
const _ = require('lodash');
const { ROLES_NAME } = require('../config/roles_list');
const bcrypt = require('bcrypt');

const getProfile = async (req, res) => {
    // const data = await fsPromises.readFile(path.join(__dirname, '..', 'model', 'users.json'));
    // const users = JSON.parse(data);
    // const foundUser = users.find(person => person.username === req.user);

    var foundUser = await query(`SELECT * FROM userInfo WHERE username = ${req.user}`);
    if (foundUser?.length === 0) {
        return res.status(400).json({ 'message': `用户 ${req.user} 未找到。 `});
    }
    foundUser = foundUser[0];
    const selectedKeys = ["username", "nickname", "demandDescription", "roles", "registeredSince", "memberExpiration"];
    let userProfile = _.pick(foundUser, selectedKeys);
    var roles = userProfile.roles.split(',');
    roles = roles.map((role) => parseInt(role));
    userProfile["rolename"] = ROLES_NAME[Math.max.apply(null, roles)];
    res.json(userProfile);
    return;
}

const updateProfile = async (req, res) => {
    // const data = await fsPromises.readFile(path.join(__dirname, '..', 'model', 'users.json'));
    // const users = JSON.parse(data);
    // const foundUser = users.find(person => person.username === req.user);
    var foundUser = await query(`SELECT * FROM userInfo WHERE username = ${req.user}`);

    if (foundUser?.length === 0) {
        return res.status(400).json({ 'message': `用户 ${req.user} 未找到。 `});
    }

    foundUser = foundUser[0];

    if (req.body.nickname) foundUser.nickname = req.body.nickname;
    if (req.body.demandDescription) foundUser.demandDescription = req.body.demandDescription;

    //TODO: 对于更新密码的加密以及确认
    if (req.body.password) {
        foundUser.password = await bcrypt.hash(req.body.password, 10);
    }
    // const otherUsers = users.filter(person => person.username !== req.user);
    // userDB.setUsers([...otherUsers, foundUser]);
    // await fsPromises.writeFile(
    //     path.join(__dirname, '..', 'model', 'users.json'),
    //     JSON.stringify(userDB.users)
    // );
    await query(`UPDATE userInfo SET nickname = '${foundUser.nickname}', demandDescription = '${foundUser.demandDescription}', \
        password = '${foundUser.password}' WHERE userId = ${foundUser.userId}`);
    res.status(200).json({
        "message": "更新个人信息成功"
    });
    return;
}

const deleteProfile = async (req, res) => {
    // const data = await fsPromises.readFile(path.join(__dirname, '..', 'model', 'users.json'));
    // const users = JSON.parse(data);
    // const foundUser = users.find(person => person.username === req.user);
    var foundUser = await query(`SELECT userId FROM userInfo WHERE username = ${req.user}`);

    if (foundUser?.length === 0) {
        return res.status(400).json({ 'message': `用户 ${req.user} 未找到。 `});
    }
    foundUser = foundUser[0];
    await query(`DELETE FROM userInfo WHERE userId = ${foundUser.userId}`);
    // const otherUsers = users.filter(person => person.username !== req.user);
    // userDB.setUsers([...otherUsers]);
    res.status(200).json({
        "message": "删除账户成功"
    });
    return;
}



module.exports = {
    getProfile,
    updateProfile, 
    deleteProfile,    
}