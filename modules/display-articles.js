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
        let userName = orderedArticleArray[i].userName;
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
                            <h4>${userName}</h4>
                        </a>
                            
                        <p>${publishDate}</p>
                    </div>
                </div>
                `    
        
        cardsToDisplay = cardsToDisplay+cardHTML;
    };


     return cardsToDisplay;
     
}


// Export functions.
module.exports = {
    loadArticles
};
