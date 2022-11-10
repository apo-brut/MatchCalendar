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

var loginTabBtn = document.getElementById("loginTabBtn");
var registerTabBtn = document.getElementById("registerTabBtn");

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

registerTabBtn.onclick = function (){
   RegForm.style.transform = "translateX(0px)";
   LoginForm.style.transform = "translateX(0px)";
   Indicator.style.transform = "translateX(100px)";
}

loginTabBtn.onclick = function (){
   RegForm.style.transform = "translateX(300px)";
   LoginForm.style.transform = "translateX(300px)";
   Indicator.style.transform = "translateX(0px)";
}
/* todo!!! */
/* 
var objpeople = [];
        
        console.log(objpeople);
        LogInBtn.onclick = function() {
            var username = document.getElementById("username").value;
            var password = document.getElementById("password").value;
            objpeople = JSON.parse(localStorage.getItem("user"));
            for(i = 0; i < objpeople.length; i++) {
                if (username == objpeople [i].username && password == objpeople[i].password) {
                    sessionStorage.setItem("currentlooedin",username)
                    alert(username+" is logged in!!")
                    document.getElementById("myModal").style.display="none";
                    return
                }
            }
            for(i = 0; i < objpeople.length; i++) {
                if (username == objpeople [i].username && password == objpeople[i].password) {
                    alert(" falscher Username oder falsches Passwort")
                    return
                }
            }
            
        }
        RegistierenBtn.onclick = function() { 
            var registeruser = document.getElementById("newuser").value
            var registerpassword = document.getElementById("newpassword").value
            var registeremail    = document.getElementById("newemail").value

            var newuser = {
                username: registeruser,
                email: registeremail,
                password: registerpassword,

            }
            for(i = 0; i < objpeople.length; i++) {

                if(registeruser == objpeople [i].username){
                    alert("Dieser Name ist schon vorhanden, bitte wähle einen anderen Namen")
                    return


                }
                    if(registeremail == objpeople[i].email){
                        alert("Diese Email-Adresse ist bereits vorhanden, bitte wählen Sie einen anderen Namen")
                        return
                    }

                 if (registerpassword.length < 8){
                    alert("Das Passwort muss mindestens 8 ziffern haben")
                    return
                }
                

            }
            if(localStorage.getItem("user")==null){
                objpeople.push(newuser);
                localStorage.setItem("user",JSON.stringify(objpeople));
             }
             else
             {
                objpeople = JSON.parse(localStorage.getItem("user"));
                objpeople.push(newuser);
                localStorage.setItem("user",JSON.stringify(objpeople));
             }
            console.log(objpeople)

            document.getElementById("newuser").value="";
            document.getElementById("newpassword").value="";
            document.getElementById("newemail").value="";
        } */
//js für form

     
         



     
   

