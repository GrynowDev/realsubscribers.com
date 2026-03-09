
/* not working in firebox */

// if ("import" in document.createElement("link")) {
//     var doc = document.querySelector('link[href="components/footer.html"]').import;
//     var text = doc.querySelector('.rs-footer');
//     document.body.appendChild(text.cloneNode(true));
// }

$(function(){
    $("#footer-wrapper").load("../components/footer.html"); 
  });
