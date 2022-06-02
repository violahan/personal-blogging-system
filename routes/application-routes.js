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
const notificationFunctions = require("../modules/notification-functions.js");
const notificationDAO = require("../modules/notifications-dao.js")


const bcrypt = require("../Helper/bcrypt-helper");
const likeDao = require("../modules/like-dao");
const subscribeDao = require("../modules/subscribe-dao");
const { route } = require("express/lib/application");
const cookieParser = require("cookie-parser");

// set up fs to allow renaming and moving uploaded files
const fs = require("fs");
const { resourceLimits } = require("worker_threads");


// Display the home page with list of all articles
router.get("/", verifyAuthenticated, async function(req, res) {

    const user = res.locals.user;

    if(req.query.deleteMessage){
      res.locals.deleteMessage = req.query.deleteMessage
    }

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
    res.locals.title = 'Home';
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
  res.locals.title = 'Home';
  res.render("home");
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

// load page to display a given article will require /getArticle?articleID=XXX in the URL
router.get("/getArticle", async function (req, res){
 
  if(req.query.deleteMessage){
    res.locals.deleteMessage = req.query.deleteMessage
  }

  const articleID = req.query.articleID;
  const articleInfo = await articleDAO.getArticleByID(articleID);

  const articleImages = await imageDAO.getMainImageByArticleID(articleID)

  if(articleImages == "undefined"){
    res.locals.articleImages = "";
  } else {
    res.locals.articleImages = articleImages[0];
  }

  const commentsToDisplay = await articleFunctions.getAllCommentsByArticleIDOrdered(articleID)

// Get details of all likes on article
  const likesOnArticle = await likeDao.getLikesByArticle(articleID)

  res.locals.numberOfLikes = likesOnArticle.length

  // Check if user has liked the article
    if (res.locals.user){
      // There is a logged in user

      
      let userHasLiked = "";
      for (let i = 0; i < likesOnArticle.length; i++) {
        
        if (res.locals.user.userID == likesOnArticle[i].userID){
          userHasLiked = "true";
        }
        
      }
      
      res.locals.userHasLiked = userHasLiked;

    } else {
      
      // There is no logged in user - user has not liked
      res.locals.userHasLiked = ""

    }

  // Check if user has subscribed to author
    if (res.locals.user){
      // There is a logged in user

      // Get details of all subscribers to the author
      const subscribersToAuthor = await subscribeDao.getSubscribesByAuthorId(articleInfo.authorID)
      
      let userHasSubscribed = "";
      for (let i = 0; i < subscribersToAuthor.length; i++) {
        
        if (res.locals.user.userID == subscribersToAuthor[i].userSubscriberID){
          userHasSubscribed = "true";
        }
        
      }
      
      res.locals.userHasSubscribed = userHasSubscribed;

    } else {
      
      // There is no logged in user - user has not Subscribed
      res.locals.userHasSubscribed = ""

    }
// 


  res.locals.articleInfo = articleInfo;
  res.locals.commentsToDisplay = commentsToDisplay;
  res.locals.title = "Article";

  res.render("article")
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

router.get("/profile", verifyAuthenticated, async function (req, res) {
  const userId = req.query.id;
 
  let user;


  if (userId == res.locals.user.userID) {
    res.locals.isCurrentUser = true;
    user = res.locals.user;
  } else {
    user = await userDao.getUserByID(userId);
    const isSubscribed = await subscribeDao.getSubscribesByAuthorIdAndSubscriberId(user.userID, res.locals.user.userID);
    if (isSubscribed) res.locals.isSubscribed = true;
    else res.locals.isSubscribed = false;
    res.locals.isCurrentUser = false;
  }
  const articles = await articleDAO.getArticlesByAuthorId(userId);
  const comments = await commentDao.getCommentsAndArticleTitleByAuthorId(userId);
  const likes = await likeDao.getLikesAndArticleTitleByUserId(userId);
  const followers = await subscribeDao.getSubscribesByAuthorId(userId);
  const following = await subscribeDao.getSubscribesBySubscriberId(userId);
  const profileObj = {
    authorID: userId,
    name: user.fName + " " + user.lName,
    avatarFilePath: user.avatarFilePath,
    bio: user.description,
    totalArticleNos: articles.length,
    totalFollowerNos: followers.length,
    totalFollowingNos: following.length,
    articles: articles,
    comments: comments,
    likes: likes
  }
  res.locals.profileObj = profileObj;
  res.locals.title = 'Profile';
  res.render("user-profile");
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

    let followersNumber = (await subscribeDao.getSubscribesByAuthorId(userId)).length;
    let commentsNumber = (await commentDao.getCommentsByArticleAuthor(userId)).length;
    let likesNumber = (await likeDao.getLikesByArticleAuthor(userId)).length;
    let commentCountByDay = await commentDao.getCommentsCountPerDayByArticleAuthor(userId,5);
    let subscribeCumulativeCount = await subscribeDao.getCumulativeSubscribeCountByArticleAuthor(userId);
    let popularArticles = await  articleDAO.getArticleSortedByPopularity(userId, 3);


    res.locals.followersNumber = followersNumber;
    res.locals.commentsNumber = commentsNumber;
    res.locals.likesNumber = likesNumber;
    res.locals.commentCountByDay = commentCountByDay;
    res.locals.subscribeCumulativeCount = subscribeCumulativeCount;
    res.locals.popularArticles = popularArticles;
    res.locals.title = 'Analytics';

    res.render("analytics");
});








router.get("/getAllUsernames", async function (req, res) {
  const usernames = await userDao.getAllUsernames();
  res.json(usernames);
})
  
router.get("/deleteArticle", async function (req, res){

  //As the deleting an article is a get request, check that the 
  // user is allowed to delete the article - either they are the
  // article author

  const articleID = req.query.articleID;
  const articleAuthorID = req.query.articleAuthorID;
  const currentUserID = res.locals.user.userID

    if(articleAuthorID == currentUserID){
      
      // Allowed to delete the article
      deleteMessage = "Article deleted"
      
      // Delete items in order to ensure no database issues:
      
      // Delete all comments on article
      await commentDao.deleteAllArticleComments(articleID);
      
      // Delete all likes
      await likeDao.deleteAllArticleLikes(articleID)

      // Delete images
      // Delete images from server
      const articleImages = await imageDAO.getAllImageByArticleID(articleID)
      
      if(articleImages){
        for (let i = 0; i < articleImages.length; i++) {
          let imagePathToDelete = articleImages[i].path;
          let fullImageFilePath = "./public"+imagePathToDelete.substring(imagePathToDelete.indexOf("/"));
      
          if(articleImages[i].fileName == "default_thumbnail.png"){
            // Do not delete the default thumbnail image 
          } else {
            // Delete the image on the server
            fs.unlinkSync(fullImageFilePath)
          }
        }
      }
    
      // Delete images from Database
      await imageDAO.deleteAllArticleImages(articleID)

      // Delete the article from the Database
      await articleDAO.deleteArticle(articleID)

    } else {
      deleteMessage = "Not authorised to delete comment"
    }
  
    // Once an article is deleted, check to see if any notifications related to it
      // and remove them
      await notificationDAO.removeNotificationsByTypeAndIDLink("newArticle", articleID)


  res.redirect("/?deleteMessage="+deleteMessage)

})

router.get("/likeArticle", async function (req, res){

  const articleID = req.query.articleID;
  const articleAuthorID = await articleDAO.getAuthorByArticleID(articleID)
  const likeUserID = req.query.userID;
  const likesOnArticle = await likeDao.getLikesByArticle(articleID)

  // Check in place to ensure that the current user, is the user that hit like
  // Required as this is a get request and URL could be entered by anyone.
  if(res.locals.user.userID == likeUserID){

    let userHasLikedArticle = 0
    for (let i = 0; i < likesOnArticle.length; i++) {
      
      if(likeUserID == likesOnArticle[i].userID){
        // User has liked the article - Remove Like
        userHasLikedArticle += 1
      } else {
        // User has not liked - do nothing here
      }
    }

    if (userHasLikedArticle == 1){
      //Remove like:
      await likeDao.removeLike(articleID, likeUserID);
      res.json("Like")
    } else {
      // Add like:
      await likeDao.addLike(articleID, likeUserID);
      res.json("Unlike")
    }

  } else {
    // No logged in user / user does not match user that hit like - do nothing.
  }

})

router.get("/subscribeToAuthor", async function (req, res){

  const authorID = req.query.authorID;
  const subscribeUserID = req.query.userID;

  const subscriberDetails = await userDao.getUserByID(subscribeUserID);
  const subscriberUserName = subscriberDetails.userName;
  const subscribersToAuthor = await subscribeDao.getSubscribesByAuthorId(authorID);
  
  // Check in place to ensure that the current user, is the user that hit like
  // Required as this is a get request and URL could be entered by anyone.
  if(res.locals.user.userID == subscribeUserID){

    let userHasSubscribedToAuthor = 0
    for (let i = 0; i < subscribersToAuthor.length; i++) {
      
      if(subscribeUserID == subscribersToAuthor[i].userSubscriberID){
        // User has liked the article - Remove Like
        userHasSubscribedToAuthor += 1
      } else {
        // User has not liked - do nothing here
      }
    }

    if (userHasSubscribedToAuthor == 1){
      //Remove subscriber:
      await subscribeDao.removeFollow(subscribeUserID, authorID);


      // Once a user has unsubscribed, check to see if any notifications related to it
      // and remove them
      await notificationDAO.removeNotificationsByTypeAndIDLink("newSubscriber", subscribeUserID)


      res.json("Subscribe")
    } else {
      // Add like:
      await subscribeDao.addFollow(subscribeUserID, authorID);

      // Create notificaiton related to this new subscriber:
        const notificationType = "newSubscriber";
        const notificaitonContent = subscriberUserName+" has subscribed to you!";
        const usersToBeNotified = [{userSubscriberID: authorID}];
        const idForLink = subscribeUserID;
        const articleIDForLink = ""
        await notificationFunctions.createNewNotification(notificationType, notificaitonContent, usersToBeNotified, idForLink, articleIDForLink);
      

      res.json("Unsubscribe")
    }

  } else {
    // No logged in user / user does not match user that hit like - do nothing.
  }

})

router.get("/editProfile", verifyAuthenticated, async function (req, res) {
  res.locals.title = "Edit Profile";
  res.locals.userToEdit = res.locals.user;
  res.render("edit-profile");
});

router.post("/editProfile", async function (req, res) {
  const userToEdit = {
    userID: req.body.userID,
    userName: req.body.userName,
    fName: req.body.fname,
    lName: req.body.lname,
    DOB: req.body.dob,
    description: req.body.bio,
    avatarFilePath: req.body.avatar
  };

  await userDao.updateUser(userToEdit);
  res.redirect("/profile?id="+userToEdit.userID)
})

router.get("/deleteUser", async function (req, res) {
  const userId = req.query.userId;

  const articleImages = await imageDAO.getAllImagesByAuthorID(userId)
      
  if(articleImages){
    for (let i = 0; i < articleImages.length; i++) {
      let imagePathToDelete = articleImages[i].path;
      let fullImageFilePath = "./public"+imagePathToDelete.substring(imagePathToDelete.indexOf("/"));
  
      if(articleImages[i].fileName != "default_thumbnail.png"){
        fs.unlinkSync(fullImageFilePath)
      }
    }
  }
  await notificationDAO.deleteAllNotificationsRelatedToUser(userId);
  await commentDao.deleteCommentsByUserID(userId);
  await userDao.deleteUser(userId);
  res.locals.user = null;
  res.clearCookie("authToken");
  res.redirect("/");
})

router.get("/changePassword", verifyAuthenticated, async function (req, res) {
  res.locals.title = "Change password";
  res.render("change-password");
});

router.post("/changePassword", async function (req, res) {

  const user = await userDao.getUserByID(req.body.userID);
  if (user) {
    const currentPassword = req.body.currentPassword;
    const validPassword = await bcrypt.comparePassword(currentPassword, user.password);
    if (validPassword) {
      let newPassword = req.body.password;
      newPassword= await bcrypt.hashPassword(newPassword);
      await userDao.changePassword(user.userID, newPassword);
      //re-login after user change password successfully
      res.clearCookie("authToken");
      res.locals.user = null;
      res.redirect("./login");
    } else {
      res.locals.error = 'Wrong current password';
      res.render("change-password");
    }
  } else {
    res.locals.error = 'User not exists';
    res.render("change-password");
  }
})


router.get("/getCurrentUser", async function (req, res) {
  if (res.locals.user) {
    res.json(res.locals.user);
  } else {
    res.json(null);
  }
});


router.get("/getLikes", async function (req, res){
  const likesOnArticle = await likeDao.getLikesByArticle(req.query.articleID)
  res.json(likesOnArticle.length)
})




module.exports = router;




