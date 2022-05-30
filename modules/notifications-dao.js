const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

async function addNotification(typeOfNotificaiton, content, userToBeNotified) {
    const db = await dbPromise;

    const notification = await db.run(SQL`
        insert into notifications (typeOFNotification, content, userToBeNotifiedID, hasBeenViewed)
        values (${typeOfNotificaiton}, ${content}, ${userToBeNotified}, 0)`);
    return notification;
}


// Export functions.
module.exports = {
    addNotification
    
};