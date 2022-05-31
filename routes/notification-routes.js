const express = require("express");
const router = express.Router();
const { verifyAuthenticated } = require("../middleware/auth-middleware.js");
const notificationDAO = require("../modules/notifications-dao.js")

router.get("/getNumberOfNotifications", async function(req, res){

    const userID = req.query.userID;
    const notificationsByUser = await notificationDAO.getNotificationsByUserID(userID);
    // const numberOfNotifications = notificationsByUser.length;

    res.json(notificationsByUser);

});

router.get("/removeNotification", async function (req, res){

    // Check current user is the user that the notification belongs to
    if(res.locals.user.userID == req.query.userID){
        await notificationDAO.deleteNotificationByNotificationID(req.query.notificationID)
        res.json("Notification deleted")
    } else {
        res.json("Not authorised to delete notification")
    }

})

router.get("/removeAllNotifications", async function (req, res){

    // Check current user is the user that the notification belongs to
    if(res.locals.user.userID == req.query.userID){
        await notificationDAO.deleteAllNotificationByUserID(req.query.userID)
        res.json("All notifications deleted")
    } else {
        res.json("Not authorised to delete notification")
    }

})

module.exports = router;