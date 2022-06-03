const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

async function createNewUser(user) {
    const db = await dbPromise;

    const result = await db.run(SQL`
        insert into user (userName, password, fName, lName, DOB, description, avatarFilePath, adminFlag)
        values(${user.username}, ${user.password}, ${user.fname}, ${user.lname}, ${user.dob}, ${user.bio}, ${user.avatarPath}, ${user.adminFlag})`);

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

async function getUserByID(userID){
    const db = await dbPromise;

    const user = await db.get(SQL`
            select *
                from user
                where userID = ${userID}
        `);

    return user;
}


// Gets the user with the given authToken from the database.
// If there is no such user, undefined will be returned.
async function retrieveUserWithAuthToken(authToken) {
    const db = await dbPromise;

    const user = await db.get(SQL`
        select * from user
        where authToken = ${authToken}`);

    return user;
}

async function giveAuthToken(user) {
    const db = await dbPromise;

    await db.run(SQL`
        update user
            set authToken = ${user.authToken}
            where userID = ${user.userID}
        `);
}

async function getAllUsers() {
    const db = await dbPromise;

    const allUsers = await db.all(SQL`
            select *
                from user
        `);

    return allUsers;
}

async function getAllUsernames() {
    const db = await dbPromise;

    const usernames = await db.all(SQL`
        select userName from user`);
    
    return usernames;
}

async function updateUser(user) {
    const db = await dbPromise;

    await db.run(SQL`
        update user
            set userName = ${user.userName},
            fName = ${user.fName},
            lName = ${user.lName},
            DOB = ${user.DOB},
            description = ${user.description},
            avatarFilePath = ${user.avatarFilePath}
            where userID = ${user.userID}
        `);
}

async function deleteUser(userId) {
    const db = await dbPromise;

    await db.run(SQL`
        delete from user where userID = ${userId}`)
}

async function changePassword(userID, newPassword) {
    const db = await dbPromise;

    await db.run(SQL`
        update user
            set password = ${newPassword}
            where userID = ${userID}
        `);
}

async function getAllFollowersByUserId(userId) {
    const db = await dbPromise;

    return await db.all(SQL`
        select * from user
        where userID in (
            select userSubscriberID
            from subscribes
            where articleAuthorID = ${userId}
        )
    `);
}

async function getAllFollowingUserByUserId(userId) {
    const db = await dbPromise;

    return await db.all(SQL`
        select * from user
        where userID in (
            select articleAuthorID
            from subscribes
            where userSubscriberID = ${userId}
        )
    `);
}

module.exports = {
    createNewUser,
    getUserByUserName,
    getUserByID,
    retrieveUserWithAuthToken,
    getAllUsers,
    giveAuthToken,
    getAllUsernames,
    updateUser,
    deleteUser,
    changePassword,
    getAllFollowersByUserId,
    getAllFollowingUserByUserId
};
