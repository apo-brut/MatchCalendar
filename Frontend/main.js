import { Calendar } from "./Calendar.js";

/* var calendar = $(() => {
    new Calendar().setup();
}); */
var calendar = new Calendar();
 
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
btn.onclick = function () {
    modal.style.display = "block";
}


// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

var LoginForm = document.getElementById("LoginForm");
var RegForm = document.getElementById("RegForm");
var Indicator = document.getElementById("Indicator");

registerTabBtn.onclick = function () {
    RegForm.style.transform = "translateX(0px)";
    LoginForm.style.transform = "translateX(0px)";
    Indicator.style.transform = "translateX(100px)";
}

loginTabBtn.onclick = function () {
    RegForm.style.transform = "translateX(300px)";
    LoginForm.style.transform = "translateX(300px)";
    Indicator.style.transform = "translateX(0px)";
}

document.getElementById("email").value = "a@a.de";
document.getElementById("password").value = "Qwertz1!";


LogInBtn.onclick = function () {
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    $.get("https://h2970110.stratoserver.net:3000/api/login?email=" + email + "&password=" + password, function (response) {
        console.log("Login-Get-Response:")
        console.log(response);
        if (response.status === "false") {
            window.alert("Login failed: " + response.response);
        }
        else {
            document.getElementById("email").value = "";
            document.getElementById("password").value = "";

/*             calendar.currentUserId = response.userID;
            calendar.token = response.token;;
            calendar.identifier = response.identifier; */
            
            document.getElementById("myModal").style.display="none";
            calendar.loginSuccess(response.userID,response.token,response.identifier);
            return
        }
    });
}

RegistierenBtn.onclick = function () {
    var registeruser = document.getElementById("newuser").value
    var registerpassword = document.getElementById("newpassword").value
    var registeremail = document.getElementById("newemail").value

    if (registerpassword.length < 8) {
        alert("Das Passwort muss mindestens 8 ziffern haben")
        return
    }

    $.post("https://h2970110.stratoserver.net:3000/api/signup?email=" + registeremail + "&password=" + registerpassword + "&username=" + registeruser, function (response) {
        console.log(response)
        if (response.status === "false") {
            window.alert("Registry failed: " + response.response);
        }
        else {
            document.getElementById("newuser").value = "";
            document.getElementById("newpassword").value = "";
            document.getElementById("newemail").value = "";

            /* setTimeout(function () {
                document.getElementById("email").value = registeremail
                document.getElementById("password").value = registerpassword
                LogInBtn.onclick();
            }, 1000); */
        }
    });
}
//js für form

var abfrage = window.confirm("Schön das du da bist! Um diese Anwendung benuzen zu können musst du dich regestrieren in dem du auf (OK) klickst. Wenn du bereits einen Account bei uns hast, kannst du dich ganz einfach anmelden");

if (abfrage == true) {
    document.getElementById("myModal").style.display = "block";
}