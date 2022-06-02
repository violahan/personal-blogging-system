tinymce.init({
  selector: 'textarea#articleContentTinyMCETextArea',
  height: 500,
  plugins: [
    'advlist', 'autolink', 'lists', 'preview',
    'searchreplace', 'visualblocks', 'fullscreen',
     'wordcount', 'code',
  ],
  toolbar: 'undo redo | blocks | ' +
  'bold italic backcolor | alignleft aligncenter ' +
  'alignright alignjustify | bullist numlist outdent indent | ' +
  'removeformat',
  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }',

  init_instance_callback: function (editor) {
    editor.on('keyup', function (e) {
      
      let articleTitleContent = document.getElementById('article-title').value
      let articleContent = tinymce.get('articleContentTinyMCETextArea').getContent();
      let submitButton = document.getElementById('article-submit-button')

      if (articleTitleContent == "" || articleContent == ""){
        submitButton.disabled = true;
      } else {
        submitButton.disabled = false;
      }

    });
  }

});

// deleted plugins: [
//   'link', 'table', 'image', 'media', 'anchor', 'insertdatetime', 'charmap', 'help', 
// ],

