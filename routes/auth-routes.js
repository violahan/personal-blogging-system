const { v4: uuid } = require("uuid");
const express = require("express");
const router = express.Router();
const userDao = require("../modules/user-dao.js");
const bcrypt = require("../Helper/bcrypt-helper");
const { verifyAuthenticated } = require("../middleware/auth-middleware.js");

// Whenever we navigate to /login, if we're already logged in, redirect to "/".
// Otherwise, render the "login" view.
router.get("/login", function (req, res) {
  if (res.locals.user) {
    res.redirect("/");
  } else {
    res.locals.title = "Login";
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
      user.authToken = authToken;
      await userDao.giveAuthToken(user);
      res.cookie("authToken", authToken);
      res.locals.user = user;

      res.redirect("/");
    } else {
      // Auth fail
      res.locals.user = null;
      //    res.setToastMessage("Password is incorrect!");
      res.redirect("/");
    }

    // if no matching user:
  } else {
    // Auth fail
    res.locals.user = null;
    //    res.setToastMessage("No such user!");
    res.redirect("/");
  }
});

// Whenever we navigate to /logout, delete the authToken cookie.
// redirect to "/login", supplying a "logged out successfully" message.
router.get("/logout", function (req, res) {
  res.clearCookie("authToken");
  res.locals.user = null;
  //  res.setToastMessage("Successfully logged out!");
  res.redirect("./");
});

router.get("/signup", async function (req, res) {
  res.locals.title = "Sign up";
  res.render("signup");
});

router.post("/signup", async function (req, res) {
  //get user data
  const user = {
    username: req.body.username,
    password: req.body.password,
    fname: req.body.fname,
    lname: req.body.lname,
    dob: req.body.dob,
    bio: req.body.bio,
    avatarPath: req.body.avatar,
    adminFlag: 0,
  };
  //hash password
  user.password = await bcrypt.hashPassword(user.password);
  //save user, return the user_id we might need it later
  const userId = await userDao.createNewUser(user);
  res.redirect("/login");
});

router.get("/deleteUser", async function (req, res) {
  const userId = req.query.userId;
  const articleImages = await imageDAO.getAllImagesByAuthorID(userId);
  if (articleImages) {
    for (let i = 0; i < articleImages.length; i++) {
      let imagePathToDelete = articleImages[i].path;
      let fullImageFilePath =
        "./public" +
        imagePathToDelete.substring(imagePathToDelete.indexOf("/"));
      if (articleImages[i].fileName != "default_thumbnail.png") {
        fs.unlinkSync(fullImageFilePath);
      }
    }
  }
  await notificationDAO.deleteAllNotificationsRelatedToUser(userId);
  await commentDao.deleteCommentsByUserID(userId);
  await userDao.deleteUser(userId);
  res.locals.user = null;
  res.clearCookie("authToken");
  res.redirect("/");
});

router.get("/changePassword", verifyAuthenticated, async function (req, res) {
  res.locals.title = "Change password";
  res.render("change-password");
});

router.post("/changePassword", async function (req, res) {
  const user = await userDao.getUserByID(req.body.userID);
  if (user) {
    const currentPassword = req.body.currentPassword;
    const validPassword = await bcrypt.comparePassword(
      currentPassword,
      user.password
    );
    if (validPassword) {
      let newPassword = req.body.password;
      newPassword = await bcrypt.hashPassword(newPassword);
      await userDao.changePassword(user.userID, newPassword);
      //re-login after user change password successfully
      res.clearCookie("authToken");
      res.locals.user = null;
      res.redirect("./login");
    } else {
      res.locals.error = "Wrong current password";
      res.render("change-password");
    }
  } else {
    res.locals.error = "User not exists";
    res.render("change-password");
  }
});

module.exports = router;
