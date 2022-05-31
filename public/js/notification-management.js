// Function called from nav bar, shows number of notifications,
// refreshed on page load
async function getNumberOfNotifications(userID){

    let response = await fetch(`./getNumberOfNotifications?userID=${userID}`)
    let notificationDetails = await response.json();
    let numberOfNotifications = notificationDetails.length

    document.getElementById('number-of-notifications').innerText = numberOfNotifications;

    let notificationWindow = document.createElement('div');
    notificationWindow.setAttribute("id", "notification-window")
    
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

function makeNotificationCard(notificationDetails){

    let notificationLinkURL;
    if(notificationDetails.typeOfNotification == "newSubscriber"){
        notificationLinkURL = `./profile?id=${notificationDetails.idForLink}`
    } else {
        notificationLinkURL = `./getArticle?articleID=${notificationDetails.idForLink}`
    }

    let notificationCard = document.createElement('div')
        notificationCard.innerHTML = `
            <a href="${notificationLinkURL}" onclick="notificationViewed(${notificationDetails.notificationID})"><i class="fa fa-caret-right"></i> ${notificationDetails.content}</a> 
        `

    // let clearNotificationButton = document.createElement('button');
    // clearNotificationButton.setAttribute("onclick", `notificationViewed(${notificationDetails.notificationID})`);
    // clearNotificationButton.setAttribute("style", "display: inline");
    // clearNotificationButton.innerText = "Clear";

    // notificationCard.appendChild(clearNotificationButton)

    return notificationCard
}

function notificationViewed(notificationID){
    console.log("Notification viewed for notificationID: "+notificationID)
}

function clearAllNotifications(userID){
    console.log("All notification button clicked")
}

// async function showNotifications(){
//     if (document.getElementById('show-notification-details').innerText == "Show notifications"){
//         document.getElementById('notification-details').style.display = "block"
//         document.getElementById('show-notification-details').innerText = "Hide notifications"
//     } else {
//         document.getElementById('notification-details').style.display = "none"
//         document.getElementById('show-notification-details').innerText = "Show notifications"    
//     }
// }


