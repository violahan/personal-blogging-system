const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

async function createNewUser(user) {
    const db = await dbPromise;

    const result = await db.run(SQL`
        insert into user (userName, password, fName, lName, DOB, description, avatarFilePath, adminFlag)
        values(${user.username}, ${user.password}, ${user.fname}, ${user.lname}, ${user.dob}, ${user.bio}, ${user.avatarPath}, ${user.isAdmin})`);

    return result.lastID;
}

module.exports = {
    createNewUser
};
