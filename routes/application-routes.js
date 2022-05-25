const express = require("express");
const { json } = require("express/lib/response");
const router = express.Router();

const articleDAO = require("../modules/article-dao.js");
const articleFunctions = require("../modules/display-articles");


// const testDao = require("../modules/test-dao.js");

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
});

module.exports = router;