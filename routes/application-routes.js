const express = require("express");
const { json } = require("express/lib/response");
const router = express.Router();
const { v4: uuid } = require("uuid");
const { verifyAuthenticated } = require("../middleware/auth-middleware.js");

const articleDAO = require("../modules/article-dao.js");
const articleFunctions = require("../modules/display-articles");

const userDao = require("../modules/user-dao.js");
const bcrypt = require("../middleware/bcrypt-hashing");



// Display the home page with list of all articles
router.get("/", verifyAuthenticated, async function(req, res) {

    // Get default article view - articles in descending order from latest:
    let orderColumn = "publishDate";
    let orderBy = "desc";

    let orderedArticles = await articleDAO.getAllArticlesOrderedBy(orderColumn, orderBy);
    
    let totalArticles = orderedArticles.length;

    // This call can be adjusted (change total articles) to change the number of articles initially loaded
    let cardsToDisplay = await articleFunctions.loadArticles(orderedArticles, totalArticles)

    res.locals.articleToDisplayTest = cardsToDisplay;

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


// Route to allow AJAX request from clientside JS for ordered articles
route.get("/sortedArticles"){

  const sortMethod = 


}




module.exports = router;
