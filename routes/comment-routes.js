const express = require("express");
const router = express.Router();
const articleFunctions = require("../modules/display-articles");
const articleDAO = require("../modules/article-dao.js");
const commentDao = require("../modules/comment-dao.js");
const subscribeDao = require("../modules/subscribe-dao");
const notificationFunctions = require("../modules/notification-functions.js");
const notificationDAO = require("../modules/notifications-dao.js")



router.get("/getArticleComments", async function (req, res){

    const articleID = req.query.articleID;

    // Gets all comments on an article - in a tree structure array
    const commentDetails = await articleFunctions.getAllCommentsByArticleIDOrdered(articleID)

    res.json(commentDetails)
})

router.get("/getUserID", function (req, res){

    if(res.locals.user){
       res.json(res.locals.user.userID)
    } else {
        res.json("")
    }
})

router.get("/getArticleAuthorID", async function (req, res){
    
    const articleDetails = await articleDAO.getArticleByID(req.query.articleID)

    res.json(articleDetails.authorID);

})


router.get("/deleteComment", async function (req, res){

    //As the deleting a comment is a get request, check that the 
    // user is allowed to delete the comment - either they are the
    // article author, or the comment author
  
    const articleID = req.query.articleID;
    const commentID = req.query.commentID;
    const commentAuthorID = req.query.commentAuthorID;
    const articleAuthorID = req.query.articleAuthorID;
    const currentUserID = res.locals.user.userID
  
    let deleteMessage;
  
    //Check if the comment has any children - if it does overwrite the comment.
    // If it doesnt, delete the comment entirely.
    const childComments = await commentDao.getCommentsByParent(commentID);
  
      if(commentAuthorID == currentUserID || articleAuthorID == currentUserID){
        
        if(childComments != ""){
          
          let updatedComment = await commentDao.deleteCommentByOverWriting(commentID);
          deleteMessage = "Comment deleted"
        } else {
  
          deleteMessage = "Comment deleted"
  
          await commentDao.removeComment(commentID)
  
        }
      } else {
        deleteMessage = "Not authorised to delete comment"
      }
  
      // Once a comment is deleted, check to see if any notifications related to it
      // and remove them
      await notificationDAO.removeNotificationsByTypeAndIDLink("newComment", commentID)


  
    res.redirect("/getArticle?articleID="+articleID+"&deleteMessage="+deleteMessage)
  
})


router.post("/makeComment", async function (req, res){

    let commentAuthorID = res.locals.user.userID;
    let commentContent = req.body.comment;
 
 // Code to remove line breaks in comments if required
 //   let commentContentFromUser = req.body.comment;
 //   let commentContent = commentContentFromUser.replace(/(\r\n|\n|\r)/gm," ");
 
    let commentArticleID = req.query.articleID;
    let commentID = await commentDao.addComment(commentArticleID, commentAuthorID, commentContent);
  
  
    // Create notificaiton related to this comment event:
        // Check if any subscribers:
        const subscribers = await subscribeDao.getSubscribesByAuthorId(commentAuthorID);
  
        // If there are subscribers - create a notification:
            if(subscribers != ""){
                const notificationType = "newComment";
                const notificaitonContent = res.locals.user.userName+" has made a new comment";
                const usersToBeNotified = subscribers;
                const idForLink = commentID;
                const articleIDForLink = commentArticleID;
                await notificationFunctions.createNewNotification(notificationType, notificaitonContent, usersToBeNotified, idForLink, articleIDForLink);
            } else {
                // No subscribers, no notifications made
            }
  
  
    res.redirect("/getArticle?articleID="+commentArticleID+"#comment-card-"+commentID)
  
  })


  router.post("/makeReply", async function (req, res){

    let commentAuthorID = res.locals.user.userID;
    let commentContent = req.body.reply;
    let commentArticleID = req.query.articleID
    let parentCommentID = req.query.parentID
    let commentID = await commentDao.addReplyComment(commentArticleID, commentAuthorID, parentCommentID, commentContent)
  
     // Create notificaiton related to this comment event:
        // Check if any subscribers:
        const subscribers = await subscribeDao.getSubscribesByAuthorId(commentAuthorID);
  
      // If there are subscribers - create a notification:
      if(subscribers  != ""){
        const notificationType = "newComment";
        const notificaitonContent = res.locals.user.userName+" has made a new comment";
        const usersToBeNotified = subscribers;
        const idForLink = commentID;
        const articleIDForLink = commentArticleID;
        await notificationFunctions.createNewNotification(notificationType, notificaitonContent, usersToBeNotified, idForLink, articleIDForLink);
      } else {
        // No subscribers, no notifications made
      }
  
  
    res.redirect("/getArticle?articleID="+commentArticleID+"#comment-card-"+commentID)
  
  })
  

module.exports = router;