const express = require("express");
const router = express.Router();
const articleFunctions = require("../modules/display-articles");
const articleDAO = require("../modules/article-dao.js");
const commentDao = require("../modules/comment-dao.js");

router.get("/getArticleComments", async function (req, res){

    const articleID = req.query.articleID;

    // Gets all comments on an article - in a tree structure array
    const commentDetails = await articleFunctions.getAllCommentsByArticleIDOrdered(articleID)

    res.json(commentDetails)
})

router.get("/getUserID", function (req, res){

    res.json(res.locals.user.userID)

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
    
  
    res.redirect("/getArticle?articleID="+articleID+"&deleteMessage="+deleteMessage)
  
  })

module.exports = router;