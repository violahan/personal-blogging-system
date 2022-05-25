const express = require("express");
const router = express.Router();

const articleDAO = require();
const userDAO = require();

// const testDao = require("../modules/test-dao.js");

// Display the home page with list of articles
router.get("/", async function(req, res) {

    // Get default article view - articles in descending order from latest:
    const articlesByDateDes = await articleDAO. ...


    









    res.render("home");
});

// Receive an article as an object, display contents as a card
async function displayArticleCard(articleObj){

    const articleID = articleObj.articleID;
    const authorID = articleObj.authorID;
    const title = articleObj.title;
    const publishDate = articleObj.authorID;
    const content = articleObj.authorID;
    const numComments = articleObj.numberOfComments;
    const numLikes = articleObj.numberOfLikes;

    const authorName = await userDAO.getUserByID(authorID);
    const thumbnailImagePath = await imageDAO.getThumbnailImageByArticleID(articleID);



    // Create an article card containing:
    // Article Thumbnail
    // Article Title
    // Article Author
    // Article Date
    const articleCard = document.createElement("div");
    articleCard.innerHTML = `
        <div class="cardImage">
            <img src="${thumbnailImagePath}" alt="">
        </div>
        <div class="cardContent">
            <a href="${UPDATE-ROUTE-WITH-ARTICLE-ID}">
                <h3>${title}</h3>
            </a>
            <a href="/userLoad">
                <h4>${authorName}</h4>
            </a>
                
            <p>${publishDate}</p>
        </div>
    `

    // Return card to be appended to another element from where it was called
    return articleCard;

}




module.exports = router;