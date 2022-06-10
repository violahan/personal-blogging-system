const express = require("express");
const { json } = require("express/lib/response");
const router = express.Router();
const { v4: uuid } = require("uuid");
const { verifyAuthenticated } = require("../middleware/auth-middleware.js");
const imageDAO = require("../modules/images-dao");
const articleDAO = require("../modules/article-dao.js");
const articleFunctions = require("../public/js/article-load");
const userDao = require("../modules/user-dao.js");
const commentDao = require("../modules/comment-dao.js");
const bcrypt = require("../Helper/bcrypt-helper");
const likeDao = require("../modules/like-dao");
const subscribeDao = require("../modules/subscribe-dao");
const { route } = require("express/lib/application");
const cookieParser = require("cookie-parser");
const authRoutes = require("./auth-routes");
const SQL = require("sql-template-strings");
const dbPromise = require("../modules/database.js");

router.use(express.json())


//api POST request to login
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
            res.send({
                "message": "Login succeeded.",
                "authToken": authToken
            });

        // b. If unsuccessful, instead a 401 response should be returned.
            } else {
                res.locals.user = null;
                res.statusCode = 401;
                res.send({"message": "Login failed: Password is incorrect."});
            }
    
    } else{
        res.locals.user = null;
        res.statusCode = 401;
        res.send({"message": "Login failed: User does not exist."});
    }

});

//api GET request to logout
router.get("/api/logout", async function (req, res) {
    
    if(req.cookies.authToken){
        
        res.clearCookie("authToken");
        res.setToastMessage("Successfully logged out!");
        res.statusCode = 204;
        res.send({"message": "Logout succeeded."});

    } else {
        res.clearCookie("authToken");
        res.statusCode = 401;
        res.send({"message": "Logout failed - no user logged in."});
    }

});

//api GET request to get all users
router.get("/api/users", async function(req, res) {
    try {
        const user = res.locals.user;
    if (user.adminFlag === 1) {
        // const allUsers = await userDao.getAllUsers();

        const db = await dbPromise;
            const allUsers = await db.all(SQL`
                select 
                    u.userID,
                    u.userName,
                    u.fName,
                    u.lName,
                    u.DOB,
                    u.description,
                    u.adminFlag,
                    count(a.articleID) as articleCount
                from user u left join articles a on u.userID = a.authorID
                group by u.userID
            `);

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

//api DELETE request
router.delete("/api/users/:id", async function(req, res){
    
    
    if(req.cookies.authToken){
        
        if (res.locals.user.adminFlag === 1){
            const userID = req.params.id;

            // check user exists:
            const user = await userDao.getUserByID(userID);
            if (user == undefined){
                res.statusCode = 401;
                res.send({"message": "Error: No such user exists to delete."});
            } else {

                await commentDao.deleteCommentsByUserID(userID);
                await userDao.deleteUser(userID);
                res.statusCode = 204;
                res.send({"message": "Delete user succeeded."});
            }     

        } else {(res.locals.user = null)
            res.statusCode = 401;
            res.send({"message": "Error: you are not the admin user."});
        }

    } else {
        res.statusCode = 401;
        res.send({"message": "Error: No use logged in, cannot perform delete."});
    }
})

module.exports = router;