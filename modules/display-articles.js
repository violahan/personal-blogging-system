const res = require("express/lib/response");
const articleDAO = require("./article-dao.js");
const commentDAO = require("./comment-dao.js");
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
                        <a href="./getArticle?articleID=${articleID}">
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

function makeNestedCommentsHTML(topLevelCommentsByArticleByDate, nestedCommentsByArticleByDate){

    let topCommentArray = topCommentsDBQuery;
    let nestCommentArray = nestedCommentsByArticleByDate;

    //Update nested comments with relevant HTML to display
    for (let i = 0; i < nestCommentArray.length; i++) {
        for (let j = 0; j < nestCommentArray.length; j++) {
            if(nestCommentArray[j].parentID == nestCommentArray[i].commentID){
                nestCommentArray[i].nestedHTML = nestCommentArray[i].nestedHTML+
                    `
                        <div class="nest-level-2-comment">
                            <p>${nestCommentArray[j].content}</p>
                        </div>
                    `
            }   
        }        
    }

    //Update Parent comments with nested HTML
    for (let i = 0; i < topCommentArray.length; i++) {
        
        topCommentArray[i].displayHTML = 
                `
                <div class="top-level-comment">
                    <p>${topCommentArray[i].content}</p>
                </div>
                `

        for (let j = 0; j < nestCommentArray.length; j++) {
            
            if(nestCommentArray[j].parentID == topCommentArray[i].commentID){
                topCommentArray[i].displayHTML = topCommentArray[i].displayHTML+
                `
                    <div class="nest-level-1-comment">
                        ${nestCommentArray[j].nestedHTML}
                    </div>
                `
            }
            
        }
        
    }

    // Create full comment string HTML:
    let commentHTMLtoDisplay = "";
    for (let i = 0; i < topCommentArray.length; i++) {
        
        commentHTMLtoDisplay = commentHTMLtoDisplay+topCommentArray[i].displayHTML; 
        
    }

    return commentHTMLtoDisplay;

}



// Export functions.
module.exports = {
    loadArticles,
    makeNestedCommentsHTML
};
