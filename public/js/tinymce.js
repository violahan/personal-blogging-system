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
  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }'
});

// deleted plugins: [
//   'link', 'table', 'image', 'media', 'anchor', 'insertdatetime', 'charmap', 'help', 
// ],