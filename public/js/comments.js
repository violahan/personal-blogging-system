
async function displayComments(articleID){
  
    // Get the details of comments to display:
    const response = await fetch(`./getArticleComments?articleID=${articleID}`)
    const commentsToDisplayJSON = await response.json();  

    const displayCommentHTML = await templateCommentHTML(commentsToDisplayJSON);

    document.getElementById('comments-container').appendChild(displayCommentHTML)

}


async function templateCommentHTML(commentsTreeStrucutre){
// Loops through the tree structure array of comments on an article.
// For each article it creates a comment card with the content.
// If there are child comments, these are created and placed below the parent.

    let displayCommentContainer = document.createElement('div')

    for (let i = 0; i < commentsTreeStrucutre.length; i++) {
        // Make comment HTML for top level comments
        let topCommentCardHTML = commentCardHTML(commentsTreeStrucutre[i])
        topCommentCardHTML.setAttribute("class", "top-level-comment");
       
        let topLevelReply = await makeReplyButtons(commentsTreeStrucutre[i])
        topCommentCardHTML.appendChild(topLevelReply)

        let topLevelDelete = await makeDeleteButtons(commentsTreeStrucutre[i])
        topCommentCardHTML.appendChild(topLevelDelete)

        if(commentsTreeStrucutre[i].children != ""){

            for (let j = 0; j < commentsTreeStrucutre[i].children.length; j++) {
                
                // Make comment HTML for Level 1 comments
                let level1CommentCardHTML = commentCardHTML(commentsTreeStrucutre[i].children[j]);
                level1CommentCardHTML.setAttribute("class", "level-1-comment");
                
                let level1Reply = await makeReplyButtons(commentsTreeStrucutre[i].children[j]);
                level1CommentCardHTML.appendChild(level1Reply);
                
                let level1Delete = await makeDeleteButtons(commentsTreeStrucutre[i].children[j])
                level1CommentCardHTML.appendChild(level1Delete)

                 if(commentsTreeStrucutre[i].children[j].children != ""){  

                    for (let k = 0; k < commentsTreeStrucutre[i].children[j].children.length; k++) {
                    
                        // Make comment HTML for Level 2 comments
                        
                        let level2CommentCardHTML = commentCardHTML(commentsTreeStrucutre[i].children[j].children[k]);
                        level2CommentCardHTML.setAttribute("class", "level-2-comment");
                     
                        let level2Delete = await makeDeleteButtons(commentsTreeStrucutre[i].children[j].children[k])
                        level2CommentCardHTML.appendChild(level2Delete)

                        level1CommentCardHTML.appendChild(level2CommentCardHTML)

                    }
                  }     
                
                topCommentCardHTML.appendChild(level1CommentCardHTML);

            }
        }
        
        displayCommentContainer.appendChild(topCommentCardHTML)

    }

    return displayCommentContainer;

}

// Generates a tempalted comment, based on supplied comment details.
function commentCardHTML(commentDetails){

    let commentCard = document.createElement('div');
    commentCard.setAttribute("id", `comment-card-${commentDetails.commentID}`);
    
    if(commentDetails.commentAuthorID == 1){
        // If the commentAuthorID is 1 this means the comment has been deleted.
        // Remove the user details, leave only the content "Deleted comment"
        commentCard.innerHTML =
        `
            <p>${commentDetails.content}</p>
        `
    } else {
    commentCard.innerHTML =
        `
            <p><img src="${commentDetails.avatarFilePath}" class="avatar"> <a href="./profile?id=${commentDetails.commentAuthorID}">${commentDetails.userName}</a></p>
            <p>Date: ${commentDetails.publishDate}</p>
            <p>${commentDetails.content}</p>
        `
    }

    return commentCard;
}


async function makeReplyButtons(commentDetails){

    let response = await fetch("./getUserID");
    let userIDjson = await response.json();

    let replyBox = document.createElement('div');
    replyBox.setAttribute("class", "reply-box");

    let replyButton = document.createElement('button');
    replyButton.setAttribute("id", `let-reply-${commentDetails.commentID}`)
    replyButton.setAttribute("onclick", `letReply(${commentDetails.commentID}, ${commentDetails.articleID}, ${userIDjson})`)
    replyButton.innerText = "Reply";
    
    let replyFormContainer = document.createElement('div');
    replyFormContainer.setAttribute("id", `reply-form-container-${commentDetails.commentID}`)

    replyBox.appendChild(replyButton)
    replyBox.appendChild(replyFormContainer)

    return replyBox;

}


async function makeDeleteButtons(commentDetails){

    let userIDresponse = await fetch("./getUserID");
    let userIDjson = await userIDresponse.json();

    let authorIDresponse = await fetch(`./getArticleAuthorID?articleID=${commentDetails.articleID}`);
    let authorIDjson = await authorIDresponse.json();


    if(userIDjson == commentDetails.commentAuthorID || userIDjson == authorIDjson){

        let deleteCommentBox = document.createElement('div');
        deleteCommentBox.setAttribute("class", "delete-comment-box");

        let confirmMessage = document.createElement('p')
        confirmMessage.setAttribute("id", `confirm-message-${commentDetails.commentID}`)

        let deleteButton = document.createElement('button');
        deleteButton.setAttribute("id", `delete-comment-${commentDetails.commentID}`)
        deleteButton.setAttribute("onclick", `deleteComment(${commentDetails.commentID})`)
        deleteButton.innerText = "Delete Comment";
        
        let deleteLink = document.createElement('a')
        deleteLink.setAttribute("href", `./deleteComment?commentID=${commentDetails.commentID}&commentAuthorID=${commentDetails.commentAuthorID}&articleAuthorID=${authorIDjson}&articleID=${commentDetails.articleID}`)

        let confirmDeleteButton = document.createElement('button');
        confirmDeleteButton.setAttribute("id", `confirm-delete-${commentDetails.commentID}`)
        confirmDeleteButton.setAttribute("style", "display: none");
        confirmDeleteButton.innerText = "Yes - Delete the comment"

        deleteLink.appendChild(confirmDeleteButton);

        deleteCommentBox.appendChild(confirmMessage);
        deleteCommentBox.appendChild(deleteButton);
        deleteCommentBox.appendChild(deleteLink)

        return deleteCommentBox;

    } else {
        return document.createElement('div');
    };

};




// Functions to confirm comment/reply boxes have content before submission
function checkCommentHasContent(){

    let commentTextBox = document.getElementById('comment-text-box')
    let commentSubmitButton = document.getElementById('comment-submit-button')
    if(commentTextBox.value == ""){
        commentSubmitButton.disabled = true;        
    } else {
        commentSubmitButton.disabled = false;
    }
}
function checkReplyHasContent(parentCommentID){

    let replyTextBox = document.getElementById(`reply-to-comment-${parentCommentID}-text-box`)
    let replySubmitButton = document.getElementById(`submit-reply-to-comment-${parentCommentID}-button`)
    if(replyTextBox.value == ""){
        replySubmitButton.disabled = true;        
    } else {
        replySubmitButton.disabled = false;
    }
}