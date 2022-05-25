const res = require("express/lib/response");
const articleDAO = require("./article-dao.js");
// const userDAO = require();
// const imageDAO = require();

// Adjust this number to change the initial number of articles to load and number loaded on updates
const loadArticleCount = 3;

// Will be updated when new articles are loaded
let loadArticleNext = 0;


// Initial function to load a number of articles
async function loadArticles(orderedArticleArray){

console.log("Test 1: Load article function called");


// orderedArticleArray should be an array of articles in the
// order/filter that is wanted to be displayed - this should be prepared before passing
// to this function

    const articleCardContainer = document.createElement("div");

    // Loop through array, to display first set of articles
    for (let i = 0; i < loadArticleCount+1; i++) {
        
        let articleCard = await displayArticleCard(orderedArticleArray[i])
        
        articleCardContainer.appendChild(articleCard);

    }

     // Update the loadArticleNext variable so that in subsequent calls it picks other articles
     loadArticleNext +=loadArticleCount;


     return articleCardContainer;
     
    // let articleCardContainer = document.querySelector("#all-article-card-container");

}

async function loadMoreArticles(orderedArticleArray){

    let articleCardContainer = document.querySelector("#all-article-card-container");

    // Loop through array, to display first set of articles
    for (let i = loadArticleNext; i < loadArticleNext+loadArticleCount+1; i++) {
        
        let articleCard = await displayArticleCard(articleArray[i])
        
        articleCardContainer.appendChild(articleCard);

    }



    // Update the loadArticleNext variable so that in subsequent calls it picks other articles
    loadArticleNext +=loadArticleCount;


}


// Receive an article as an object, display contents as a card
async function displayArticleCard(articleObj){

    const articleID = articleObj.articleID;
    const authorID = articleObj.authorID;
    const title = articleObj.title;
    const publishDate = articleObj.authorID;
    const content = articleObj.authorID;
    const numComments = articleObj.numberOfComments;
    const numLikes = articleObj.numberOfLikes;

//    const authorName = await userDAO.getUserByID(authorID);
//    const thumbnailImagePath = await imageDAO.getThumbnailImageByArticleID(articleID);



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
            <a href="${articleID}">
                <h3>${title}</h3>
            </a>
            <a href="/userLoad">
                <h4>${authorID}</h4>
            </a>
                
            <p>${publishDate}</p>
        </div>
    `

    // Return card to be appended to another element from where it was called
    return articleCard;
}

// Export functions.
module.exports = {
    loadArticles
};

