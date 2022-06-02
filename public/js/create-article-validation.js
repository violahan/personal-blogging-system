// const { default: tinymce } = require("tinymce")

function checkArticleContentAndTitle(){
    let articleTitleContent = document.getElementById('article-title').value
    let articleContent = tinymce.get('articleContentTinyMCETextArea').getContent();
   
    let submitButton = document.getElementById('create-article-button');

    if (articleTitleContent == "" || articleContent == ""){
        submitButton.disabled = true;
    } else {
        submitButton.disabled = false;
    }
}

