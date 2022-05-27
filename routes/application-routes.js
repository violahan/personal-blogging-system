const express = require("express");
const { json } = require("express/lib/response");
const router = express.Router();
const { v4: uuid } = require("uuid");
const { verifyAuthenticated } = require("../middleware/auth-middleware.js");
const imageDAO = require("../modules/images-dao");
const articleDAO = require("../modules/article-dao.js");
const articleFunctions = require("../modules/display-articles");

const userDao = require("../modules/user-dao.js");
const subscribeDao = require("../modules/subscribe-dao.js");
const commentDao = require("../modules/comment-dao.js");
const likeDao = require("../modules/like-dao.js");


const bcrypt = require("../Helper/bcrypt-helper");



// Display the home page with list of all articles
router.get("/", verifyAuthenticated, async function(req, res) {



    const user = res.locals.user;

    // Get default article view - all articles in descending order from latest:
    let orderColumn = "publishDate";
    let orderBy = "desc";

    let orderedArticles = await articleDAO.getArticleCardInformationOrderedBy(orderColumn, orderBy);
    let totalArticles = orderedArticles.length;

    // This call can be adjusted (change total articles) to change the number of articles initially loaded
    let cardsToDisplay = await articleFunctions.loadArticles(orderedArticles, totalArticles)

    res.locals.allArticleToDisplay = cardsToDisplay;

    if(user != ""){
      let userOrderedArticles = await articleDAO.getArticlesCardInformationByUserOrderedBy(user.userID, orderColumn, orderBy);
      let totalUserArticles = userOrderedArticles.length;
      let userCardsToDisplay = await articleFunctions.loadArticles(userOrderedArticles, totalUserArticles)
      res.locals.userAllArticlesToDisplay = userCardsToDisplay;
    }

    res.render("home");
});

//Basic homepage showing all articles - but no user specific items
router.get("/noUser", async function(req, res) {

    // Get default article view - all articles in descending order from latest:
  let orderColumn = "publishDate";
  let orderBy = "desc";

  let orderedArticles = await articleDAO.getArticleCardInformationOrderedBy(orderColumn, orderBy);
  let totalArticles = orderedArticles.length;

  // This call can be adjusted (change total articles) to change the number of articles initially loaded
  let cardsToDisplay = await articleFunctions.loadArticles(orderedArticles, totalArticles)

  res.locals.allArticleToDisplay = cardsToDisplay;

  res.render("home");
});


router.get("/signup", async function (req, res) {
  res.locals.title = "Sign up";
  res.render("signup");
});

router.post("/signup", async function (req, res) {
  if (req.body.password !== req.body.passwordCheck) {
    res.locals.error = "Passwords are not match";
    res.render("signup");
  }
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
  //hash password
  user.password = await bcrypt.hashPassword(user.password);
  //save user, return the user_id we might need it later
  const userId = await userDao.createNewUser(user);
  res.redirect("/");
});


// Route to allow AJAX request from clientside JS for ordered articles
router.get("/sortedArticles", async function (req, res) {
  
  // Obtain the sort option, and the order option from the 
  // request generated on change of the filters in handlebars
  const orderColumn = req.query.value;
  const orderBy = req.query.order;
   
  // make database call for articles sorted by the required options. Include User fields to extract user name
  let orderedArticles = await articleDAO.getArticleCardInformationOrderedBy(orderColumn, orderBy);
  
  // loop through articles and add thumbnail path
  for (let i = 0; i < orderedArticles.length; i++) {
    
    let thumbnailImage = await imageDAO.getThumbnailImageByArticleID(orderedArticles[i].articleID);
        
        let thumbnailImagePath = "";

        if(thumbnailImage != ""){
             thumbnailImagePath = await thumbnailImage[0].path; 
         } else {
            thumbnailImagePath = "";
        }

    orderedArticles[i].thumbnailImagePath = thumbnailImagePath;    
    
  }

  // Pass JSON of the ordered articles back to the client side
  res.json(orderedArticles)

});


// Route to allow AJAX request from clientside JS for ordered articles
router.get("/sortedUserArticles", async function (req, res) {
  

  if(res.locals.user){
    
    
    // Obtain the sort option, and the order option from the 
    // request generated on change of the filters in handlebars
    const orderColumn = req.query.value;
    const orderBy = req.query.order;
    
    userID = res.locals.user.userID;

    // make database call for articles sorted by the required options. Include User fields to extract user name
    let orderedArticles = await articleDAO.getArticlesCardInformationByUserOrderedBy(userID, orderColumn, orderBy);
    

    // loop through articles and add thumbnail path
    for (let i = 0; i < orderedArticles.length; i++) {
      
      let thumbnailImage = await imageDAO.getThumbnailImageByArticleID(orderedArticles[i].articleID);
          
          let thumbnailImagePath = "";

          if(thumbnailImage != ""){
              thumbnailImagePath = await thumbnailImage[0].path; 
          } else {
              thumbnailImagePath = "";
          }

      orderedArticles[i].thumbnailImagePath = thumbnailImagePath;
    }
   
     // Pass JSON of the ordered articles back to the client side
      res.json(orderedArticles)
    
  } else {

    res.json(null)

  }

});


router.get("/analytics", async function (req, res) {
    let userId = req.query.userId;

    let followersNumber = (await subscribeDao.getFollowerByAuthor(userId)).length;
    let commentsNumber = (await commentDao.getCommentsByArticleAuthor(userId)).length;
    let likesNumber = (await likeDao.getLikesByArticleAuthor(userId)).length;
    let commentCountByDay = await commentDao.getCommentsCountPerDayByArticleAuthor(userId,5);
    let subscribeCumulativeCount = await commentDao.getCumulativeSubscribeCountByArticleAuthor(userId);

    console.log(commentCountByDay);

    res.locals.followersNumber = followersNumber;
    res.locals.commentsNumber = commentsNumber;
    res.locals.likesNumber = likesNumber;
    res.locals.commentCountByDay = commentCountByDay;
    res.locals.subscribeCumulativeCount = subscribeCumulativeCount;
    res.render("analytics");
});

module.exports = router;
