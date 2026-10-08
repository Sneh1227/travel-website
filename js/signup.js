// validation
const signupForm = document.getElementById("formsignup")

signupForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const firstname = document.getElementById("firstname").value;
    const lastname = document.getElementById("lastname").value;
    const email = document.getElementById("email").value;
    const pass = document.getElementById("pass").value;
    const confirmpassword = document.getElementById("confirmpassword").value;

    const nameError = document.getElementById("nameError");
    const lastError = document.getElementById("lastError");
    const emailError = document.getElementById("emailError");
    const passError = document.getElementById("passError");
    const confPassError = document.getElementById("confPassError");

    let isvalid = true;
    nameError.innerText = "";
    lastError.innerText = "";
    emailError.innerText = "";
    passError.innerText = "";
    confPassError.innerText = "";

    if (!firstname) {
        nameError.innerText = "Firstname is required *";
        isvalid = false;
    }
    if (!lastname) {
        lastError.innerText = "Last name is required";
        isvalid = false;
    }
    if (!email) {
        emailError.innerText = "Email is required";
        isvalid = false;
    }
    if (!pass || !confirmpassword) {
        passError.innerText = "Password is required";
        isvalid = false;
    }
    if (pass != confirmpassword) {
        passError.innerText = "";
        confPassError.innerText = "password is mismatched";
        isvalid = false;
    } else {
        if ((pass.length < 8) || (!/[A-Z]/.test(pass)) || (!/[a-z]/.test(pass)) ||
            (!/[0-9]/.test(pass)) || (!/[!@#$%^&*]/.test(pass))) {
            passError.innerText = "Password must contain 8+ characters, including uppercase, lowercase, a number, and a special character.";
            isvalid = false;
        }
        if ((!(/^[A-Za-z]+$/).test(firstname))) {
            nameError.innerText = "*Name should contain alphabates only";
            isvalid = false;
        }
        if ((!(/^[A-Za-z]+$/).test(lastname))) {
            lastError.innerText = "*Last Name should contain alphabates only";
            isvalid = false;
        }
        if ((!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
            emailError.innerHTML = "*Please enter a valid email address";
            isvalid = false;
        }
    }
    if (isvalid) {
        const user = {
            firstname: firstname,
            lastname: lastname,
            email: email,
            pass: pass
        };

        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("isloggedin", "true");
        alert("WOHOO Registered Successfully");
        window.location.href = "/index.html";
        updateUI();
    }
});

// password eye button
function eyepass(input, button) {
    if (input.type === "password") {
        input.type = "text";
        button.innerHTML = '<i class="fa-regular fa-eye" style="color: rgb(247, 247, 245);"></i>';
    } else {
        input.type = "password";
        button.innerHTML = '<i class="fa-regular fa-eye-slash" style="color: rgb(251, 251, 250);"></i>';
    }
}
const togglepass = document.getElementById("togglepass")
const toggleconfirmpass = document.getElementById("toggleconfirmpass");

togglepass.addEventListener("click", function () {
    eyepass(pass, togglepass);
});


toggleconfirmpass.addEventListener("click", function () {
    eyepass(confirmpassword, toggleconfirmpass);
});
