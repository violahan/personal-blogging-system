// Function called from nav bar, shows number of notifications,
// refreshed on page load
async function getNumberOfNotifications(userID){

    let response = await fetch(`./getNumberOfNotifications?userID=${userID}`)
    let notificationDetails = await response.json();
    let numberOfNotifications = notificationDetails.length

    document.getElementById('number-of-notifications').innerText = numberOfNotifications;

    

    let notificationWindow = document.createElement('div');
    
    for (let i = 0; i < notificationDetails.length; i++) {
        
        let notificationCard = document.createElement('div')
        notificationCard.innerHTML = `
            ${notificationDetails[i].typeOfNotification}: ${notificationDetails[i].content}
        `
        notificationWindow.appendChild(notificationCard)
    }

    document.getElementById('notification-details').appendChild(notificationWindow)

}

async function showNotifications(){
    if (document.getElementById('show-notification-details').innerText == "Show notifications"){
        document.getElementById('notification-details').style.display = "block"
        document.getElementById('show-notification-details').innerText = "Hide notifications"
    } else {
        document.getElementById('notification-details').style.display = "none"
        document.getElementById('show-notification-details').innerText = "Show notifications"    
    }

}


