const { json } = require("express/lib/response");
const res = require("express/lib/response");
const notificationDAO = require("../modules/notifications-dao.js")

// Types of notifiction for DB are:
// newArticle
// newComment
// newSubscriber

async function createNewNotification(typeOfNotificaiton, content, usersToBeNotified){

    // Add notifications to the DB based on the information provided:
    for (let i = 0; i < usersToBeNotified.length; i++) {
        
        await notificationDAO.addNotification(typeOfNotificaiton, content, usersToBeNotified[i].userSubscriberID)
        
    }

}


// Export functions.
module.exports = {
    createNewNotification,

};