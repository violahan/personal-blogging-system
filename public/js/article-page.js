function hideComments(){
    document.getElementById('hide-comments-button').style.display = "none"
    document.getElementById('comments-message').innerText = "Comments are hidden"
    document.getElementById('comments-container').style.display = "none"

    document.getElementById('show-comments-button').style.display = "inline-block"
}

function showComments(){
    document.getElementById('show-comments-button').style.display = "none"
    document.getElementById('comments-message').innerText = ""
    document.getElementById('comments-container').style.display = "block"

    document.getElementById('hide-comments-button').style.display = "inline-block"
}

async function likeArticle(articleID, userID){

    const like = await fetch(`./likeArticle?articleID=${articleID}&userID=${userID}`) 
    const likeConfirmation = await like.json();
    document.getElementById('like-button').innerText = likeConfirmation

}

async function subscribeAuthor(authorID, userID){
   

    const subscribe = await fetch(`./subscribeToAuthor?authorID=${authorID}&userID=${userID}`) 
    const subscriptionConfirmation = await subscribe.json();
    document.getElementById('subscribe-button').innerText = subscriptionConfirmation
     
}
