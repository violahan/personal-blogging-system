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


async function getComments(articleID){

  

    const topLevelComments = await commentDAO.getDateOrderTopLevelCommentsByArticleID(articleID);

    const nestedComments = await commentDAO.getDateOrderNestedCommentsByArticleID(articleID);
  


    const commentsToDisplay = makeNestedCommentsHTML(topLevelComments, nestedComments);


    return commentsToDisplay;
    
  }



function makeNestedCommentsHTML(topLevelCommentsByArticleByDate, nestedCommentsByArticleByDate){

    let topCommentArray = topLevelCommentsByArticleByDate;
    let nestCommentArray = nestedCommentsByArticleByDate;


    // Make top level comment HTML
    for (let i = 0; i < topCommentArray.length; i++) {
        topCommentArray[i].displayHTML =
            `
            <div class="top-level-comment">
                <p>Publishdate =${topCommentArray[i].publishDate} CommentID = ${topCommentArray[i].commentID} Content = ${topCommentArray[i].content}</p>
            </div>
            `
    }
    


    // Make first level comment HTML
    for (let i = 0; i < nestCommentArray.length; i++) {
        
        for (let j = 0; j < topCommentArray.length; j++) {
            
            if(nestCommentArray[i].parentID == topCommentArray[j].commentID){
                nestCommentArray[i].displayHTML =
                `
                    <div class="level-1-comment">
                        <p>Publishdate =${nestCommentArray[i].publishDate} CommentID = ${nestCommentArray[i].commentID} Content = ${nestCommentArray[i].content}</p>
                    </div>
                `
            }
        }
    }



    // Make second level comment HTML
    for (let i = 0; i < nestCommentArray.length; i++) {
        
        for (let j = 0; j < nestCommentArray.length; j++) {
            
            if(nestCommentArray[i].parentID == nestCommentArray[j].commentID){
                nestCommentArray[i].displayHTML =
                `
                    <div class="level-2-comment">
                        <p>Publishdate =${nestCommentArray[i].publishDate} CommentID = ${nestCommentArray[i].commentID} Content = ${nestCommentArray[i].content}</p>
                    </div>
                `
            }
        }
    }

  

    // Add second level comment HTML to first level comment HTML
    for (let i = 0; i < nestCommentArray.length; i++) {
        
        for (let j = 0; j < nestCommentArray.length; j++) {
            
            if(nestCommentArray[i].commentID == nestCommentArray[j].parentID){

                nestCommentArray[i].displayHTML = nestCommentArray[i].displayHTML+nestCommentArray[j].displayHTML;

            }
        }
    }

  

    // Add first level comments to top level comments
    for (let i = 0; i < topCommentArray.length; i++) {
        
        for (let j = 0; j < nestCommentArray.length; j++) {
            
            if(topCommentArray[i].commentID == nestCommentArray[j].parentID){

                topCommentArray[i].displayHTML = topCommentArray[i].displayHTML+nestCommentArray[j].displayHTML

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
    getComments,
    makeNestedCommentsHTML
};
