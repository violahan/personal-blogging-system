const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

async function addNotification(typeOfNotificaiton, content, userToBeNotified, idForLink, articleIDForLink) {
    const db = await dbPromise;

    const notification = await db.run(SQL`
        insert into notifications (typeOFNotification, content, userToBeNotifiedID, hasBeenViewed, idForLink, articleIDForLink)
        values (${typeOfNotificaiton}, ${content}, ${userToBeNotified}, 0, ${idForLink}, ${articleIDForLink})`);
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

async function deleteNotificationByNotificationID(notificationID) {
    const db = await dbPromise;

    const deletedNotification = await db.run(SQL`
        delete
        from notifications
        where notificationID = ${notificationID}
    `);

    return deletedNotification;
}

async function deleteAllNotificationByUserID(userID) {
    const db = await dbPromise;

    const deletedNotifications = await db.run(SQL`
        delete
        from notifications
        where userToBeNotifiedID = ${userID}
    `);

    return deletedNotifications;
}


// Export functions.
module.exports = {
    addNotification,
    getNotificationsByUserID,
    deleteNotificationByNotificationID,
    deleteAllNotificationByUserID
    
};