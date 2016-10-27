var cms = (function() {
  populatePage();
})

var populatePage = (function() {
  var content_description = document.getElementById("content_description");
  content_description.innerText = content.description;
})
