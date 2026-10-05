
// validation
const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const pass = document.getElementById("pass").value;

    const emailError = document.getElementById("emailError");
    const passError = document.getElementById("passError");

    let isvalid = true;

    emailError.innerHTML = "";
    passError.innerHTML = "";

    if (!email) {
        emailError.innerText = "Email is required";
        isvalid = false;
    }
    if (!pass) {
        passError.innerText = "Password is required";
        isvalid = false;
    } else {
        if (pass.length < 8) {
            passError.innerText = "minimum 8 character";
            isvalid = false;
        }
    }

    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
        alert("No account found! Please sign up first");
    } else {
        const fetcheduser = JSON.parse(storedUser);

        if (email == fetcheduser.email && pass == fetcheduser.pass) {
            alert("Let's gooooo");
            localStorage.setItem("isloggedin", "true");
            window.location.href = "/index.html";
        } else {
            alert("Invalid pass or mail");
        }
    }
});


// password eye button
const togglepass = document.getElementById("togglepass");
togglepass.addEventListener("click", function () {
    if (pass.type === "password") {
        pass.type = "text";
        togglepass.innerHTML = '<i class="fa-regular fa-eye" style="color: rgb(255, 212, 59);"></i>';
    } else {
        pass.type = "password";
        togglepass.innerHTML = '<i class="fa-regular fa-eye-slash" style="color: rgb(255, 212, 59);"></i>'
    }
});