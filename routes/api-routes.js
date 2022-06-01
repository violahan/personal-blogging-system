const express = require("express");
const { json } = require("express/lib/response");
const router = express.Router();
const { v4: uuid } = require("uuid");
const { verifyAuthenticated } = require("../middleware/auth-middleware.js");
const imageDAO = require("../modules/images-dao");
const articleDAO = require("../modules/article-dao.js");
const articleFunctions = require("../modules/display-articles");
const userDao = require("../modules/user-dao.js");
const commentDao = require("../modules/comment-dao.js");
const bcrypt = require("../Helper/bcrypt-helper");
const likeDao = require("../modules/like-dao");
const subscribeDao = require("../modules/subscribe-dao");
const { route } = require("express/lib/application");
const cookieParser = require("cookie-parser");
const authRoutes = require("./auth-routes");

router.use(express.json())



router.post("/api/login", async function (req, res) {

    // Get the username and password submitted in the form
    const username = req.body.userName;
    const password = req.body.password;

    // Find a matching user in the database
    const user = await userDao.getUserByUserName(username);

    if (user) {

    // If there is a user, check the plain password matches the hash password:
        const validPassword = await bcrypt.comparePassword(password, user.password);

    // If there is a user, and the password returns valid
        if (validPassword == true) {
        
        // Auth success - give that user an authToken, save the token in a cookie
        const authToken = uuid();
        user.authToken = authToken;
        await userDao.giveAuthToken(user);
        res.cookie("authToken", authToken);
        res.locals.user = user;

        res.statusCode = 204;
        res.send();

// b. If unsuccessful, instead a 401 response should be returned.
    } else {
        res.locals.user = null;
        res.statusCode = 401;
        res.send();
    }

}

});

router.get("/api/users", async function(req, res) {
    try {
        const user = res.locals.user;
    if (user.adminFlag === 1) {
        const allUsers = await userDao.getAllUsers();
        res.json(allUsers);
    } else {
        res.statusCode = 401;
        res.send();
    }
    } catch (error) {
        res.statusCode = 401;
        res.send();
    }
    
})

module.exports = router;