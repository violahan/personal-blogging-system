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
        let avatarFilePath = orderedArticleArray[i].avatarFilePath;

        let thumbnailImage = await imageDAO.getThumbnailImageByArticleID(articleID);
        
        
        let thumbnailImagePath = "";

        if(thumbnailImage != ""){
             thumbnailImagePath = await thumbnailImage[0].path; 
         
         } else {
            thumbnailImagePath = "";
        }
       
        let cardHTML = `
            <div class="card">
                <div class="card-left">
                    <img src="${thumbnailImagePath}" alt="">
                </div>
                <div class="card-right">
                    <div class="card-title">
                        <a href="./getArticle?articleID=${articleID}">
                            <h3>${title}</h3>
                        </a>
                    </div>
                    <div class="card-author">
                        <span>
                            <i class="fa-solid fa-user-pen"></i><a href="./profile?id=${authorID}"> ${userName}</a>
                        </span>
                        <span>
                            <i class="fa-solid fa-calendar-days"></i> ${publishDate}
                        </span>
                    </div>
                    <div class="card-content">
                        <p>content</p>
                    </div>
                    <div class="card-breakline">
                        
                    </div>
                    <div class="card-info">
                        
                    </div>
                </div>
            </div>
        `
        
        cardsToDisplay = cardsToDisplay+cardHTML;
    };


     return cardsToDisplay;
     
}



//Testing tree structure array
//Testing tree structure array
async function getAllCommentsByArticleIDOrdered(articleID){
    const topLevelComments = await commentDAO.getAllCommentsByArticleIDOrdered(articleID);
    const treeStructureComments = unflattenComments(topLevelComments) 
   
    return treeStructureComments;
}


// This is not a proper unflattening function, but works to make required two levels of comments
function unflattenComments(flatArrayOfComments){

    let treeArray = [];

    // Add children placehodler array to each comment:
    for (let i = 0; i < flatArrayOfComments.length; i++) {
        flatArrayOfComments[i].children = [];
    }

    // make top level of array
    for (let i = 0; i < flatArrayOfComments.length; i++) {
        if(flatArrayOfComments[i].parentID == null){
            treeArray.push(flatArrayOfComments[i])
        }
    }

    // add first level of array
    for (let i = 0; i < flatArrayOfComments.length; i++) {
        for (let j = 0; j < treeArray.length; j++) {
            if(flatArrayOfComments[i].parentID == treeArray[j].commentID){
                treeArray[j].children.push(flatArrayOfComments[i]);
            }
        }
    }


    // add second level of array
    for (let i = 0; i < flatArrayOfComments.length; i++) {
        for (let j = 0; j < treeArray.length; j++) {
            for (let k = 0; k < treeArray[j].children.length; k++) {
                if(flatArrayOfComments[i].parentID == treeArray[j].children[k].commentID){
                    treeArray[j].children[k].children.push(flatArrayOfComments[i]);
                }
            }
        }
    }

    return treeArray;
}









// Export functions.
module.exports = {
    loadArticles,
    getAllCommentsByArticleIDOrdered,
    unflattenComments

};
