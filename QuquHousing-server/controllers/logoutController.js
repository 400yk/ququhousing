// const userDB = {
//     users: require('../model/users.json'),
//     setUsers: function (data) {
//         this.users = data
//     }
// }

// const fsPromises = require('fs').promises;
// const path = require('path');

const query = require('../config/query');

const handleLogout = async (req, res) => {
    // TODO: in production, on client, also need to delete the acess token

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); // No content
    const refreshToken = cookies.jwt;

    // Is refresh token in db?
    // const foundUser = userDB.users.find(person => person.refreshToken === refreshToken);
    var foundUser = await query(`SELECT * FROM userAuth WHERE refresh_token = '${refreshToken}'`);
    if (foundUser?.length === 0) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(204); // successful but no content
    }

    foundUser = foundUser[0];
    // Delete the refresh token in db
    await query(`UPDATE userAuth SET refresh_token = NULL WHERE userId = ${foundUser.userId}`);
    // const otherUsers = userDB.users.filter(person => person.refreshToken !== foundUser.refreshToken);
    // const currentUser = {...foundUser, refreshToken: ''};
    // userDB.setUsers([...otherUsers, currentUser]);
    // await fsPromises.writeFile(
    //     path.join(__dirname, '..', 'model', 'users.json'),
    //     JSON.stringify(userDB.users)
    // );
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true }); // TODO: in production, set secure: true - only serves on https
    res.sendStatus(204);
}

module.exports = { handleLogout };