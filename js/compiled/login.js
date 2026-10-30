import { eyepass } from "./utilities.js";
const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const pass = document.getElementById("pass").value;
    const emailError = document.getElementById("emailError");
    const passError = document.getElementById("passError");
    let isvalid = true;
    emailError.textContent = "";
    passError.textContent = "";
    if (!email) {
        emailError.innerText = "Email is required";
        isvalid = false;
    }
    if (!pass) {
        passError.innerText = "Password is required";
        isvalid = false;
    }
    else {
        if ((!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
            emailError.innerText = "*Please enter a valid email address";
            isvalid = false;
        }
        if (pass.length < 8) {
            passError.innerText = "minimum 8 character";
            isvalid = false;
        }
    }
    if (isvalid) {
        const loginDetails = {
            email: email,
            pass: pass
        };
        async function login(values) {
            try {
                const response = await fetch('https://travel-website-mkqj.onrender.com/login', {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify(values)
                });
                const data = await response.json();
                // console.log(data);
                if (!response.ok) {
                    alert("Invalid email or password");
                }
                else {
                    localStorage.setItem("token", data.token);
                    const name = {
                        firstname: data.user.firstname,
                        lastname: data.user.lastname
                    };
                    alert("Let's gooooo");
                    localStorage.setItem("isloggedin", "true");
                    localStorage.setItem("user", JSON.stringify(name));
                    window.location.href = "/index.html";
                }
            }
            catch (error) {
                console.error("Error during login:", error);
            }
        }
        login(loginDetails);
    }
});
// password toggle eye
const togglepass = document.getElementById("togglepass");
const pass = document.getElementById("pass");
togglepass.addEventListener("click", function () {
    eyepass(pass, togglepass);
});
