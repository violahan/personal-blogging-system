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



module.exports = router;