

async function allSortOptions(){

    // Obtain the selected option from the drop down menu - returns the value
    let allSortOption = document.getElementById('allSortOption');
    let allSortOptionValue = allSortOption.options[allSortOption.selectedIndex].value;
    
    // Obtain the sort order from the radio boxes - defauls to descending
    let allSortOrder = document.getElementsByName('allSortOrder');
    let allSortOrderOption = "desc"

    // set the sort order based on which radio box is checked:
    if(allSortOrder[0].checked == false){
        allSortOrderOption = "asc"
    } else if (allSortOrder[0].checked == true){
        allSortOrderOption = "desc"
    }

    // Make get request to the server, providing the sort option and sort order
    // returns ordered article array
    const response = await fetch(`./sortedArticles?value=${allSortOptionValue}&order=${allSortOrderOption}`)
    const orderedArticleArray = await response.json();
    
    let cardsToDisplay = createArticleCards(orderedArticleArray)

    // Call function to update the visible articles
    updateArticles(cardsToDisplay);

}

async function userSortOptions(){

    // Obtain the selected option from the drop down menu - returns the value
    let userSortOption = document.getElementById('userSortOption');
    let userSortOptionValue = userSortOption.options[userSortOption.selectedIndex].value;
    
    // Obtain the sort order from the radio boxes - defauls to descending
    let userSortOrder = document.getElementsByName('userSortOrder');
    let userSortOrderOption = "desc"

    // set the sort order based on which radio box is checked:
    if(userSortOrder[0].checked == false){
        userSortOrderOption = "asc"
    } else if (userSortOrder[0].checked == true){
        userSortOrderOption = "desc"
    }


    const userResponse = await fetch(`./sortedUserArticles?value=${userSortOptionValue}&order=${userSortOrderOption}`)
    const orderedUserArticleArray = await userResponse.json();
    if(orderedUserArticleArray == null){
        // Do nothing

    } else {
        let userCardsToDisplay = createArticleCards(orderedUserArticleArray)
        // Call function to update the visible articles
        updateUserArticles(userCardsToDisplay);
    }

}

function createArticleCards(orderedArticleArray){

    // Loop to take the ordered array, extract the key information only,
    // format as HTML article cards to be displayed.

    let cardsToDisplay = "";

    for (let i = 0; i < orderedArticleArray.length; i++) {
        let articleID = orderedArticleArray[i].articleID;
        let title = orderedArticleArray[i].title;
        let authorID = orderedArticleArray[i].authorID;
        let userName = orderedArticleArray[i].userName;
        let publishDate = orderedArticleArray[i].publishDate;
        let thumbnailImagePath = orderedArticleArray[i].thumbnailImagePath;
      
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
                        <a href="./profile?id=${authorID}">
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

function updateArticles(cardsToDisplay){
    document.getElementById('all-card-container').innerHTML = cardsToDisplay;
}

function updateUserArticles(userCardsToDisplay){
    document.getElementById('user-card-container').innerHTML = userCardsToDisplay;
}

function switchDisplayedArticles(){

    if(document.getElementById('switch-article-button').innerText == "Show User Articles"){
        document.getElementById('all-articles-home').style.display = "none"
        document.getElementById('user-articles-home').style.display = "block"
        document.getElementById('switch-article-button').innerText = "Show All Articles"
    } else {
        document.getElementById('all-articles-home').style.display = "block"
        document.getElementById('user-articles-home').style.display = "none"
        document.getElementById('switch-article-button').innerText = "Show User Articles"
    }
   
}

function letReply(parentCommentID){
    
    let replyID = "let-reply-"+parentCommentID;
    let replyFormID = "reply-form-"+parentCommentID;

    if (document.getElementById(replyID).innerText == "Reply"){
        document.getElementById(replyID).innerText = "Cancel Reply"
        document.getElementById(replyFormID).style.display = "block"
    } else {
        document.getElementById(replyID).innerText = "Reply"
        document.getElementById(replyFormID).style.display = "none"
    }
}


function deleteComment(commentID){
    
    let deleteID = "delete-comment-"+commentID;
    let confirmMessageID = "confirm-message-"+commentID;
    let confirmDeleteID = "confirm-delete-"+commentID;

    if (document.getElementById(deleteID).innerText == "Delete Comment"){
        document.getElementById(confirmMessageID).innerText = "Are you sure you want to delete the comment?";        
        document.getElementById(deleteID).innerText = "No, don't delete the comment";
        document.getElementById(confirmDeleteID).style.display = "inline-block";
    } else {
        document.getElementById(confirmDeleteID).style.display = "none";
        document.getElementById(deleteID).innerText = "Delete Comment";
        document.getElementById(confirmMessageID).innerText = "";
    }

}

function confirmDeleteComment(commentID){
    
    alert("Comment Deleted")
}