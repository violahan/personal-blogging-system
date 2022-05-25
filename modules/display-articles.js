const res = require("express/lib/response");
const articleDAO = require("./article-dao.js");
const userDAO = require("./user-dao");
const imageDAO = require("./images-dao");

// Initial function to load a number of articles
async function loadArticles(orderedArticleArray, numberToLoad){

let cardsToDisplay = "";

    for (let i = 0; i < numberToLoad; i++) {
        let articleID = orderedArticleArray[i].articleID;
        let title = orderedArticleArray[i].title;
        let authorID = orderedArticleArray[i].authorID;
        let author = await userDAO.getUserByID(authorID)
        let authorName = (author.fName + " " + author.lName);
        let publishDate = orderedArticleArray[i].publishDate;

        let thumbnailImage = await imageDAO.getThumbnailImageByArticleID(articleID);
        
        let thumbnailImagePath = "";

        if(thumbnailImage != ""){
             thumbnailImagePath = await thumbnailImage[0].path; 
         } else {
            thumbnailImagePath = "";
        }
       
        let cardHTML = `
                <div class="card">
                    <div class="cardImage">
                        <img src="${thumbnailImagePath}" alt="">
                    </div>
                    <div class="cardContent">
                        <p>ArticleID = ${articleID}</p>
                        <a href="">
                            <h3>${title}</h3>
                        </a>
                        <a href="/userLoad">
                            <h4>${authorName}</h4>
                        </a>
                            
                        <p>${publishDate}</p>
                    </div>
                </div>
                `    
        
        cardsToDisplay = cardsToDisplay+cardHTML;
    };


     return cardsToDisplay;
     
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
  //  articleCard.innerHTML =  

    // Return card to be appended to another element from where it was called
 //   return articleCard;

};

// Export functions.
module.exports = {
    loadArticles
};
