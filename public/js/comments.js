function hideComments() {
    document.getElementById('hide-comments-button').style.display = "none"
    document.getElementById('comments-message').innerText = "Comments are hidden"
    document.getElementById('comments-container').style.display = "none"
    document.getElementById('show-comments-button').style.display = "inline-block"
}

function showComments() {
    document.getElementById('show-comments-button').style.display = "none"
    document.getElementById('comments-message').innerText = ""
    document.getElementById('comments-container').style.display = "block"
    document.getElementById('hide-comments-button').style.display = "inline-block"
}


// Read URL within this function - then manually set page to that place holder.
async function displayComments(articleID, url) {

    // Get the details of comments to display:
    const response = await fetch(`./getArticleComments?articleID=${articleID}`)
    const commentsToDisplayJSON = await response.json();
    const displayCommentHTML = await generateCommentHTML(commentsToDisplayJSON);
    document.getElementById('comments-container').appendChild(displayCommentHTML)

    // Scroll window to selected comment:
    if (url.includes("#")) {
        const commentID = url.substring(url.indexOf("#") + 1)
        const elementOnPage = document.getElementById(commentID)
        const rect = elementOnPage.getBoundingClientRect();
        window.scrollTo(0, rect.top);
    }
}


// Loops through the tree structure array of comments on an article.
// For each article it creates a comment card with the content.
// If there are child comments, these are created and placed below the parent.
async function generateCommentHTML(commentsData) {
    let commentsContainer = document.createElement('div')
    for (let i = 0; i < commentsData.length; i++) {

        // Comment Card Level 0
        let commentCardLevel0 = generateBasicCommentCard(commentsData[i], 0, "Level "+(i+1));
        let commentOpsLevel0 = await generateOperationDiv(commentsData[i], 0);
        commentCardLevel0.appendChild(commentOpsLevel0);
        commentsContainer.appendChild(commentCardLevel0)

        // If this comment has "children" comments
        if (commentsData[i].children !== "") {
            for (let j = 0; j < commentsData[i].children.length; j++) {
                // Comment Card Level 1
                let commentCardLevel1 = generateBasicCommentCard(commentsData[i].children[j], 1, "Reply "+(j+1));
                let commentOpsLevel1 = await generateOperationDiv(commentsData[i].children[j], 1);
                commentCardLevel1.appendChild(commentOpsLevel1);
                commentsContainer.appendChild(commentCardLevel1);
                // If this comment has "grandchildren" comments
                if (commentsData[i].children[j].children !== "") {
                    for (let k = 0; k < commentsData[i].children[j].children.length; k++) {
                        let commentCardLevel2 = generateBasicCommentCard(commentsData[i].children[j].children[k], 2, "Reply "+(k+1));
                        let commentOpsLevel2 = await generateOperationDiv(commentsData[i].children[j].children[k], 2);
                        commentCardLevel2.appendChild(commentOpsLevel2);
                        commentsContainer.appendChild(commentCardLevel2);
                    }
                }
            }
        }
    }
    return commentsContainer;
}


// Generates a basic comment card based on supplied comment details
function generateBasicCommentCard(commentDetails, level, label) {
    let commentCard = document.createElement('div');
    commentCard.setAttribute("id", `comment-card-${commentDetails.commentID}`);
    commentCard.setAttribute("class", `level-${level}-comment`);

    // If the commentAuthorID is 1 this means the comment has been deleted.
    // Remove the user details, leave only the content "Deleted comment"
    if (commentDetails.commentAuthorID === 1) {
        commentCard.innerHTML = `
                <div class="comment-title">
                    <div class="comment-title-left">
                        <span>Deleted User</span>
                    </div>
                    <div class="comment-title-right">
                        <span><i class="fa-solid fa-calendar-days"></i> ${commentDetails.publishDate}</span>
                    </div>
                </div>
                <div class="comment-content">
                    <p>${commentDetails.content}</p>
                </div>
            `
    } else {
        commentCard.innerHTML = `
            <div class="comment-title">
                <div class="comment-title-left">
                <span>
                    <img src="${commentDetails.avatarFilePath}" alt="" class="avatar">
                </span>
                <span>
                    <p><a href="./profile?id=${commentDetails.commentAuthorID}">${commentDetails.userName}</a></p>
                </span>
                </div>
                
                <div class="comment-title-right">
                <span>
                    <i class="fa-solid fa-calendar-days"></i> ${commentDetails.publishDate}
                </span>
                </div>
            </div>
            <div class="comment-content">
                <p>${commentDetails.content}</p>
            </div>
        `
    }
    return commentCard;
}

// Generate an ops div which contains "delete button" and "reply button"
async function generateOperationDiv(commentDetails, level) {
    let userIdResponse = await fetch("./getUserID");
    let currentUserId = await userIdResponse.json();

    let authorIdResponse = await fetch(`./getArticleAuthorID?articleID=${commentDetails.articleID}`);
    let authorId = await authorIdResponse.json();

    let commentOpsDiv = document.createElement('div');
    commentOpsDiv.setAttribute("class", "comment-ops");

    // 1. Delete Comment
    // if current user is the author of the comment or author of the article
    if (currentUserId === commentDetails.commentAuthorID || currentUserId === authorId) {
        let deleteCommentBox = document.createElement('div');
        deleteCommentBox.setAttribute("class", "delete-comment-box");

        let confirmMessage = document.createElement('p');
        confirmMessage.setAttribute("id", `confirm-message-${commentDetails.commentID}`);

        let deleteButton = document.createElement('button');
        deleteButton.setAttribute("id", `delete-comment-${commentDetails.commentID}`);
        deleteButton.setAttribute("onclick", `deleteComment(${commentDetails.commentID})`);
        deleteButton.setAttribute("class", 'comment-delete-button');
        deleteButton.innerText = "Delete Comment";

        let deleteLink = document.createElement('a');
        deleteLink.setAttribute("href", `./deleteComment?commentID=${commentDetails.commentID}&commentAuthorID=${commentDetails.commentAuthorID}&articleAuthorID=${authorId}&articleID=${commentDetails.articleID}`);

        let confirmDeleteButton = document.createElement('button');
        confirmDeleteButton.setAttribute("id", `confirm-delete-${commentDetails.commentID}`)
        confirmDeleteButton.setAttribute("class", "comment-delete-confirm-button");
        confirmDeleteButton.setAttribute("style", "display: none");
        confirmDeleteButton.innerText = "Yes - Delete the comment";

        deleteLink.appendChild(confirmDeleteButton);

        deleteCommentBox.appendChild(confirmMessage);
        deleteCommentBox.appendChild(deleteButton);
        deleteCommentBox.appendChild(deleteLink)

        commentOpsDiv.appendChild(deleteCommentBox);
    }

    // 2. Reply Comment
    if (commentDetails.commentAuthorID !== 1 && currentUserId !== "" && level < 2) {

        let replyBox = document.createElement('div');
        replyBox.setAttribute("class", "reply-box");

        let replyButton = document.createElement('button');
        replyButton.setAttribute("id", `let-reply-${commentDetails.commentID}`)
        replyButton.setAttribute("onclick", `letReply(${commentDetails.commentID}, ${commentDetails.articleID}, ${currentUserId})`)
        replyButton.setAttribute("class", "comment-reply-button");
        replyButton.innerText = "Reply";

        let replyFormContainer = document.createElement('div');
        replyFormContainer.setAttribute("id", `reply-form-container-${commentDetails.commentID}`)
        replyBox.appendChild(replyButton)
        replyBox.appendChild(replyFormContainer)

        commentOpsDiv.appendChild(replyBox);
    }

    return commentOpsDiv;

}

// Functions to confirm comment/reply boxes have content before submission
function checkCommentHasContent() {

    let commentTextBox = document.getElementById('comment-text-box')
    let commentSubmitButton = document.getElementById('comment-submit-button')
    if (commentTextBox.value == "") {
        commentSubmitButton.disabled = true;
    } else {
        commentSubmitButton.disabled = false;
    }
}

function checkReplyHasContent(parentCommentID) {

    let replyTextBox = document.getElementById(`reply-to-comment-${parentCommentID}-text-box`)
    let replySubmitButton = document.getElementById(`submit-reply-to-comment-${parentCommentID}-button`)
    if (replyTextBox.value == "") {
        replySubmitButton.disabled = true;
    } else {
        replySubmitButton.disabled = false;
    }
}


function deleteComment(commentID) {

    let deleteID = "delete-comment-" + commentID;
    let confirmMessageID = "confirm-message-" + commentID;
    let confirmDeleteID = "confirm-delete-" + commentID;

    if (document.getElementById(deleteID).innerText === "Delete Comment") {
        document.getElementById(confirmMessageID).innerText = "Are you sure you want to delete the comment?";
        document.getElementById(deleteID).innerText = "No, don't delete the comment";
        document.getElementById(confirmDeleteID).style.display = "inline-block";
    } else {
        document.getElementById(confirmDeleteID).style.display = "none";
        document.getElementById(deleteID).innerText = "Delete Comment";
        document.getElementById(confirmMessageID).innerText = "";
    }

}


function letReply(parentCommentID, articleID, commentAuthorID) {
    let replyID = "let-reply-" + parentCommentID;
    let replyFormID = "reply-form-" + parentCommentID;
    // If the button clicked was a "Reply" button
    if (document.getElementById(replyID).innerText === "Reply") {
        // Change button to be "cancel"
        document.getElementById(replyID).innerText = "Cancel Reply"
        // Make templated HTML for the reply form:
        makeReplyForm(parentCommentID, articleID, commentAuthorID);
        document.getElementById(replyFormID).style.display = "block"
    } else {
        document.getElementById(replyID).innerText = "Reply"
        document.getElementById(replyFormID).style.display = "none"
    }
}


// makeReplyForm builds a form to allow a reply, populated with appropraite comment/user data for the database:
function makeReplyForm(parentCommentID, articleID, commentAuthorID) {
    let replyFormContainer = document.getElementById(`reply-form-container-${parentCommentID}`)
    replyFormContainer.innerHTML = `
        <form class="comment-reply-form" id="reply-form-${parentCommentID}" action="./makeReply?articleID=${articleID}&parentID=${parentCommentID}&commentAuthorID=${commentAuthorID}" method="POST" style="display: none">
            <label for="reply">Enter Reply:</label>
            <textarea id="reply-to-comment-${parentCommentID}-text-box" onkeyup="checkReplyHasContent(${parentCommentID})" name="reply" rows="4" cols="50"></textarea>
            <button class="comment-reply-submit" id="submit-reply-to-comment-${parentCommentID}-button" type="submit">Post Reply</button>
            <iframe onload="checkReplyHasContent(${parentCommentID})" style="display: none"></iframe>
        </form>
    `
}
