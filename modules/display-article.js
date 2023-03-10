const commentDAO = require("./comment-dao");

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
                            <span style="float: left"><i class="fa-solid fa-comment-dots"></i> ${articleData.commentCount} comments</span>
                            <span style="float: right"><i class="fa-solid fa-heart"></i> ${articleData.likeCount} likes</span>
                        </div>
                    </div>
                </div>
            </div>
        `
        cardsToDisplay = cardsToDisplay + cardHTML;
    }
    return cardsToDisplay;
}

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
};