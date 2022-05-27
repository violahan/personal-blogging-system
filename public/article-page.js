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

