const express = require("express");
const router = express.Router();
const { v4: uuid } = require("uuid");
const userDao = require("../modules/user-dao.js");
const bcrypt = require("../middleware/bcrypt-hashing");

router.get("/", async function (req, res) {
  
    console.log("Test - hit home page / ")

  res.render("home");
});

router.get("/signup", async function (req, res) {
  res.locals.title = "Sign up";
  res.render("signup");
});

router.post("/createUser", async function (req, res) {
  //get user data
  const user = {
    username: req.body.username,
    password: req.body.password,
    fname: req.body.fname,
    lname: req.body.lname,
    dob: req.body.dob,
    bio: req.body.bio,
    avatarPath: req.body.avatar,
    isAdmin: false,
  };
  //check if user type in the same password twice
  if (user.password !== req.body.passwordCheck) {
    res.locals.error = "Passwords are not match";
    res.render("signup");
  }
  //hash password
  user.password = await bcrypt.hashPassword(user.password);
  //save user, return the user_id we might need it later
  const userId = await userDao.createNewUser(user);

  res.render("home");
});


// Whenever we navigate to /login, if we're already logged in, redirect to "/".
// Otherwise, render the "login" view.
router.get("/login", function (req, res) {

    // TODO - Update this redirect if required - for home page/main article page

    if (res.locals.user) {
        res.redirect("/");
    }

    else {
        res.render("login");
    }

});


// Whenever we POST to /login, check the username and password submitted by the user.
// If they match a user in the database, give that user an authToken, save the authToken
// in a cookie, and redirect to "/". Otherwise, redirect to "/login", with a "login failed" message.
router.post("/login", async function (req, res) {

    // Get the username and password submitted in the form
    const username = req.body.userName;
    const password = req.body.password;

    // Find a matching user in the database
    const user = await userDao.getUserByUserName(username);

    // Check if username exists - if so check password, otherwise return error
    if (user) {

        // If there is a user, check the plain password matches the hash password:
        const validPassword = await bcrypt.comparePassword(password, user.password);

        // If there is a user, and the password returns valid
        if (validPassword == true) {
            
            // Auth success - give that user an authToken, save the token in a cookie, and redirect to the homepage.
            const authToken = uuid();

            //Does the auth token need to be saved to the database??
//            user.authToken = authToken;
//           await userDao.updateUser(user);


            res.cookie("authToken", authToken);
            res.locals.user = user;
            res.redirect("/");

        } else {
            // Auth fail
            res.locals.user = null;
            //    res.setToastMessage("Password is incorrect!");
            res.redirect("./login");

        }

    // if no matching user:
    } else {
        // Auth fail
        res.locals.user = null;
        //    res.setToastMessage("No such user!");
        res.redirect("./login");

    }

});


module.exports = router;
