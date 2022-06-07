const express = require("express");
const router = express.Router();
const { verifyAuthenticated } = require("../middleware/auth-middleware.js");
const bcrypt = require("../Helper/bcrypt-helper");

const imageDAO = require("../modules/images-dao");
const articleDAO = require("../modules/article-dao.js");
const articleFunctions = require("../modules/display-article");
const userDao = require("../modules/user-dao.js");
const commentDao = require("../modules/comment-dao.js");
const notificationDAO = require("../modules/notifications-dao.js")
const notificationFunctions = require("../modules/notification-functions.js");
const likeDao = require("../modules/like-dao");
const subscribeDao = require("../modules/subscribe-dao");


const { json } = require("express/lib/response");
const { v4: uuid } = require("uuid");
const { route } = require("express/lib/application");
const cookieParser = require("cookie-parser");

// set up fs to allow renaming and moving uploaded files
const fs = require("fs");
const { resourceLimits } = require("worker_threads");


// Display the home page with list of all articles
router.get("/", async function(req, res) {

  const user = res.locals.user;
  if (!user) {
    res.redirect("./noUser");
  } else {
    if(req.query.deleteMessage){
      res.locals.deleteMessage = req.query.deleteMessage
    }
  
    // Get default article view - all articles in descending order from latest:
    let orderColumn = "publishDate";
    let orderBy = "desc";
    let articlesData = await articleDAO.getAllSortedArticles(orderColumn, orderBy);
    let totalArticles = articlesData.length;
    res.locals.articlesHTML = await articleFunctions.generateArticlesHTML(articlesData, totalArticles);
  
    let userOrderedArticles = await articleDAO.getAllSortedArticlesByUser(user.userID, orderColumn, orderBy);
    let totalUserArticles = userOrderedArticles.length;
    res.locals.userArticlesHTML = await articleFunctions.generateArticlesHTML(userOrderedArticles, totalUserArticles);
    
    res.locals.title = 'Home';
    res.render("home");
  }
});

//Basic homepage showing all articles - but no user specific items
router.get("/noUser", async function(req, res) {
   // Get default article view - all articles in descending order from latest:
  let orderColumn = "publishDate";
  let orderBy = "desc";
  let articlesData = await articleDAO.getAllSortedArticles(orderColumn, orderBy);
  let totalArticles = articlesData.length;
  res.locals.articlesHTML = await articleFunctions.generateArticlesHTML(articlesData, totalArticles);
  res.locals.title = 'Home';
  res.render("home");
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

router.get("/removeSubscriber", async function (req, res){

  const authorID = req.query.authorID;
  const subscribeUserID = req.query.userID;

  const subscriberDetails = await userDao.getUserByID(subscribeUserID);
  const subscriberUserName = subscriberDetails.userName;
  const subscribersToAuthor = await subscribeDao.getSubscribesByAuthorId(authorID);
  
  // Check in place to ensure that the current user, is the user that hit like
  // Required as this is a get request and URL could be entered by anyone.
  if(res.locals.user.userID == authorID){
    
      //Remove subscriber:
      await subscribeDao.removeFollow(subscribeUserID, authorID);
      // Once a user has unsubscribed, check to see if any notifications related to it
      // and remove them
      await notificationDAO.removeNotificationsByTypeAndIDLink("newSubscriber", subscribeUserID)
      res.json("Followed Removed")
     
    }
  else {
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

router.get("/subscribes", verifyAuthenticated, async function (req, res) {
  const userId = req.query.userId;
  const user = await userDao.getUserByID(userId);
  const followers = await userDao.getAllFollowersByUserId(userId);
  const following = await userDao.getAllFollowingUserByUserId(userId);
  if (res.locals.user.userID == userId) {
    following.forEach(f => {
      f.isSubscribed = true;
    })
    followers.forEach(f => {
      f.isSubscribed = following.findIndex(u => u.userID == f.userID) >= 0;
    })
  } else {
    const currentUserFollowing = await userDao.getAllFollowingUserByUserId(res.locals.user.userID);
    following.forEach(f => {
      f.isSubscribed = currentUserFollowing.findIndex(u => u.userID == f.userID) >= 0;
    })
    followers.forEach(f => {
      f.isSubscribed = currentUserFollowing.findIndex(u => u.userID == f.userID) >= 0;
    })
  }
  
  const resultToRender = {
    name: user.fName + " " + user.lName,
    avatarFilePath: user.avatarFilePath,
    followers: followers,
    following: following
  }
  res.locals.title = "Subscribes";
  res.locals.result = resultToRender;
  res.render('subscribe');
})




module.exports = router;




