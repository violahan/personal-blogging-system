// Function called from nav bar, shows number of notifications,
// refreshed on page load
async function getNumberOfNotifications(userID){

    let response = await fetch(`./getNumberOfNotifications?userID=${userID}`)
    let notificationDetails = await response.json();
    let numberOfNotifications = notificationDetails.length

    document.getElementById('number-of-notifications').innerText = numberOfNotifications;

    // Clear out previous notifcaiton load if any
    document.getElementById('notification-details').innerHTML = ""

    let notificationWindow = document.createElement('div');
    notificationWindow.setAttribute("id", "notification-window")

    if(notificationDetails.length > 0){
        
        for (let i = 0; i < notificationDetails.length; i++) {
            
            let notificationCard = makeNotificationCard(notificationDetails[i])

            notificationWindow.appendChild(notificationCard)
        }

        let clearAllNotificationButton = document.createElement('a')
        clearAllNotificationButton.innerText = "Clear All Notifications"
        clearAllNotificationButton.setAttribute("id", "clear-all-notifications")
        clearAllNotificationButton.setAttribute("style", "font-weight: bold")
        clearAllNotificationButton.setAttribute("onclick", `clearAllNotifications(${userID})`)
        

        notificationWindow.appendChild(clearAllNotificationButton)

        document.getElementById('notification-details').appendChild(notificationWindow)
    }    

}

function makeNotificationCard(notificationDetails){

    let notificationLinkURL;
    if(notificationDetails.typeOfNotification == "newSubscriber"){
        notificationLinkURL = `./profile?id=${notificationDetails.idForLink}`
    } else if(notificationDetails.typeOfNotification == "newComment"){
        notificationLinkURL = `./getArticle?articleID=${notificationDetails.articleIDForLink}#comment-card-${notificationDetails.idForLink}`
    } else {
        notificationLinkURL = `./getArticle?articleID=${notificationDetails.idForLink}`
    }

    let notificationCard = document.createElement('div')
    notificationCard.setAttribute("id", `notification-${notificationDetails.notificationID}-display-card`)
        notificationCard.innerHTML = `
            <a href="${notificationLinkURL}" onclick="notificationViewed(${notificationDetails.notificationID}, ${notificationDetails.userToBeNotifiedID})"><i class="fa fa-caret-right"></i> ${notificationDetails.content}</a> 
        `


    return notificationCard
}

async function notificationViewed(notificationID, userToBeNotifiedID){

    // When a notificaiton link is cleared, delete the notificaiton from the database
    let response = await fetch(`./removeNotification?userID=${userToBeNotifiedID}&notificationID=${notificationID}`)
    let json = await response.json();

}

async function clearAllNotifications(userID){
     // When clear all button is clicked remove all notifications
     let response = await fetch(`./removeAllNotifications?userID=${userID}`)
     let json = await response.json();

   document.getElementById('notification-details').innerHTML = "" 

   getNumberOfNotifications(userID);
}




