const express = require("express");
const { json } = require("express/lib/response");
const router = express.Router();

const articleDAO = require("../modules/article-dao.js");
const articleFunctions = require("../modules/display-articles");
const userDao = require("../modules/user-dao.js");
const bcrypt = require("../middleware/bcrypt-hashing");


// Display the home page with list of articles
router.get("/", async function(req, res) {

    // Get default article view - articles in descending order from latest:
    let orderColumn = "publishDate";
    let orderBy = "desc";

    let orderedArticles = await articleDAO.getAllArticlesOrderedBy(orderColumn, orderBy);
    
    let articleCards = await articleFunctions.loadArticles(orderedArticles);

    // res.locals.articleCards = articleCards;

    // Call display articles function to get article cards


    res.render("home");
};


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

module.exports = router;
