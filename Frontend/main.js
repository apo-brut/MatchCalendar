import { Calendar } from "./Calendar.js";

$(() => {
    new Calendar().setup();
});

//reg-----------------------------------------------------------

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("addUserButton");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

var LoginForm = document.getElementById ("LoginForm");
var RegForm = document.getElementById ("RegForm");
var Indicator = document.getElementById("Indicator");

function register(){
   RegForm.style.transform = "translateX(0px)";
   LoginForm.style.transform = "translateX(0px)";
   Indicator.style.transform = "translateX(100px)";
}
function login(){
   RegForm.style.transform = "translateX(300px)";
   LoginForm.style.transform = "translateX(300px)";
   Indicator.style.transform = "translateX(0px)";
}
//js für form

     
         



     
   

