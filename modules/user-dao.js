const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

async function createNewUser(user) {
    const db = await dbPromise;

    const result = await db.run(SQL`
        insert into user (userName, password, fName, lName, DOB, description, avatarFilePath, adminFlag)
        values(${user.username}, ${user.password}, ${user.fname}, ${user.lname}, ${user.dob}, ${user.bio}, ${user.avatarPath}, ${user.isAdmin})`);

    return result.lastID;
}

async function getUserByUserName(username){
    const db = await dbPromise;

    const user = await db.get(SQL`
            select *
                from user
                where userName = ${username}
        `);

    return user;
}

async function getUserByAuthToken(authTOken) {
    const db = await dbPromise;

    //this will work after auth token table added
    const user = await db.get(SQL`
            select u
                from user as u 
                join authToken as t
                on u.userID = t.user_ID
                where t.token = ${authTOken}
        `);

    return "user";
}

module.exports = {
    createNewUser,
    getUserByUserName,
    getUserByAuthToken
};
