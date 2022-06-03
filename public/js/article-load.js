const imageDAO = require("../../modules/images-dao");
const commentDAO = require("../../modules/comment-dao");

function generateArticlesHTML(articleArray, numberToLoad){
    let cardsToDisplay = "";
    for (let i = 0; i < numberToLoad; i++) {
        let articleData = articleArray[i];

        let cardHTML = `
            <div class="card">
                <div class="card-left">
                    <img src="${articleData.thumbnailImagePath}" alt="">
                </div>
                <div class="card-right">
                    <div class="card-title">
                        <a href="./getArticle?articleID=${articleData.articleID}">
                            <h3>${articleData.title}</h3>
                        </a>
                    </div>
                    <div class="card-author">
                        <span>
                            <i class="fa-solid fa-user-pen"></i><a href="./profile?id=${articleData.authorID}"> ${articleData.userName}</a>
                        </span>
                        <span>
                            <i class="fa-solid fa-calendar-days"></i> ${articleData.publishDate}
                        </span>
                    </div>
                    <div class="card-content">
                        <p>${articleData.content}</p>
                    </div>
                    <div class="card-info">
                        <div class="card-breakline"></div>
                        <div>
                            <span style="float: left"><i class="fa-solid fa-comment-dots"></i> ${articleData.authorID} comments</span>
                            <span style="float: right"><i class="fa-solid fa-heart"></i> ${articleData.authorID} likes</span>
                        </div>
                    </div>
                </div>
            </div>
        `
        cardsToDisplay = cardsToDisplay + cardHTML;
    }
    return cardsToDisplay;
}



async function refreshArticleCards(){
    // Obtain the selected option from the dropdown menu - returns the value
    let sortByElement = document.getElementById('sortBy');
    let sortByValue = sortByElement.options[sortByElement.selectedIndex].value;
    // Obtain the sort order from the radio boxes - defauls to descending
    let sortOrderElement = document.getElementById('sortOrder');
    let sortOrderValue = sortOrderElement.options[sortOrderElement.selectedIndex].value;

    let userId;
    if(document.getElementById("only-display-users-article").checked){
        let userIdResponse = await fetch("./getUserID");
        userId = await userIdResponse.json();
    }
    let response;
    if(userId){
        response = await fetch(`./sortedAllArticles?value=${sortByValue}&order=${sortOrderValue}&userId=${userId}`);
    }else {
        response = await fetch(`./sortedAllArticles?value=${sortByValue}&order=${sortOrderValue}`);
    }
    const articleArray = await response.json();
    const articleNumber = articleArray.length;
    let articlesHTML = generateArticlesHTML(articleArray, articleNumber);
    document.getElementById('all-card-container').innerHTML = articlesHTML;
}

function switchDisplayedArticles(){

    if(document.getElementById('switch-article-button').innerText == "Show User Articles"){
        document.getElementById('all-card-container').style.display = "none"
        document.getElementById('user-card-container').style.display = "block"
        document.getElementById('switch-article-button').innerText = "Show All Articles"
    } else {
        document.getElementById('all-card-container').style.display = "block"
        document.getElementById('user-card-container').style.display = "none"
        document.getElementById('switch-article-button').innerText = "Show User Articles"
    }
   
}

function deleteArticle(articleID){
    let deleteID = "delete-article-"+articleID;
    let confirmMessageID = "confirm-message-"+articleID;
    let confirmDeleteID = "confirm-delete-"+articleID;

    if (document.getElementById(deleteID).innerText == "Delete Article"){
        document.getElementById(confirmMessageID).innerText = "Are you sure you want to delete the article?";        
        document.getElementById(deleteID).innerText = "No, don't delete the article";
        document.getElementById(confirmDeleteID).style.display = "inline-block";
    } else {
        document.getElementById(confirmDeleteID).style.display = "none";
        document.getElementById(deleteID).innerText = "Delete Article";
        document.getElementById(confirmMessageID).innerText = "";
    }

}



//***************************************************************************
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
    generateArticlesHTML,
    getAllCommentsByArticleIDOrdered,
    unflattenComments

};