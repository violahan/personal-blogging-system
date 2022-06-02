// const { default: tinymce } = require("tinymce")

function checkArticleContentAndTitle(){
    let articleTitleContent = document.getElementById('article-title').value
    let articleContent = tinymce.get('articleContentTinyMCETextArea').getContent();
   
    let submitButton = document.getElementById('create-article-button');

    if (articleTitleContent == "" || articleContent == ""){
        
        if(articleTitleContent == ""){
          document.getElementById('article-title-error').removeAttribute("hidden");
        } else {
          document.getElementById('article-title-error').setAttribute("hidden", true);
        }

        if(articleContent == ""){
          document.getElementById('article-content-error').removeAttribute("hidden");
        } else {
          document.getElementById('article-content-error').setAttribute("hidden", true);
        }

        submitButton.disabled = true;
      } else {
        submitButton.disabled = false;
        document.getElementById('article-title-error').setAttribute("hidden", true);
        document.getElementById('article-content-error').setAttribute("hidden", true);
      }



}

