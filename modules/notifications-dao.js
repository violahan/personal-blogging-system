const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

async function addNotification(typeOfNotificaiton, content, userToBeNotified) {
    const db = await dbPromise;

    const notification = await db.run(SQL`
        insert into notifications (typeOFNotification, content, userToBeNotifiedID, hasBeenViewed)
        values (${typeOfNotificaiton}, ${content}, ${userToBeNotified}, 0)`);
    return notification;
}

async function getNotificationsByUserID(userID){
    const db = await dbPromise;

    const notifications = await db.all(SQL`
        select *
        from notifications
        where userToBeNotifiedID = ${userID}
    `);
    return notifications;
}

// Export functions.
module.exports = {
    addNotification,
    getNotificationsByUserID
    
};