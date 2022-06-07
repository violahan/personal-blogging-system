// const { blit } = require("jimp");

async function likeArticle(articleID, userID){

    const like = await fetch(`./likeArticle?articleID=${articleID}&userID=${userID}`) 
    const likeConfirmation = await like.json();
    if (likeConfirmation==="Like"){
        document.getElementById('like-button').innerHTML = "<i class=\"fa-solid fa-heart\"></i> Like"
    }
    else{
        document.getElementById('like-button').innerHTML = "<i class=\"fa-solid fa-heart-crack\"></i> Unlike"
    }

    const numberOfLikes = await fetch(`./getLikes?articleID=${articleID}`)
    const numberOfLikesConfirmation = await numberOfLikes.json();
    document.getElementById('total-likes-count').innerText = numberOfLikesConfirmation
}

async function subscribeAuthor(authorID, userID) {
    const subscribe = await fetch(`./subscribeToAuthor?authorID=${authorID}&userID=${userID}`) 
    const subscriptionConfirmation = await subscribe.json();
    document.getElementById('subscribe-button').innerText = subscriptionConfirmation;
}

async function subscribeUserFromList(authorID, userID) {
    const subscribe = await fetch(`./subscribeToAuthor?authorID=${authorID}&userID=${userID}`)
    const subscriptionConfirmation = await subscribe.json();
    document.querySelectorAll(`.subscribe-button-${authorID}`).forEach(b => {
        b.innerText = subscriptionConfirmation;
    })
}

// Function to forceably remove a subscriber from an author (by the author)
async function removeSubscriber(userID, authorID) {
    
    const removeSubscribe = await fetch(`./removeSubscriber?authorID=${authorID}&userID=${userID}`)
    const subscriptionConfirmation = await removeSubscribe.json();
    document.getElementById('remove-subscriber-button').innerText = subscriptionConfirmation;
    document.getElementById('remove-subscriber-button').disabled = true;

}
