const express = require("express");
const router = express.Router();
const articleFunctions = require("../modules/display-articles");
const articleDAO = require("../modules/article-dao.js");

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


module.exports = router;