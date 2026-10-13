// validation
const signupForm = document.getElementById("formsignup") as HTMLInputElement;

signupForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const firstname = (document.getElementById("firstname") as HTMLInputElement).value;
    const lastname = (document.getElementById("lastname") as HTMLInputElement).value;
    const email = (document.getElementById("email") as HTMLInputElement).value;
    const pass = (document.getElementById("pass") as HTMLInputElement).value;
    const confirmpassword = (document.getElementById("confirmpassword") as HTMLInputElement).value;

    const nameError = document.getElementById("nameError") as HTMLElement;
    const lastError = document.getElementById("lastError") as HTMLElement;
    const emailError = document.getElementById("emailError") as HTMLElement;
    const passError = document.getElementById("passError") as HTMLElement;
    const confPassError = document.getElementById("confPassError") as HTMLElement;

    let isvalid = true;
    nameError.innerText = "";
    lastError.innerText = "";
    emailError.innerText = "";
    passError.innerText = "";
    confPassError.innerText = "";

    if (pass != confirmpassword) {
        passError.innerText = "";
        confPassError.innerText = "password is mismatched";
        isvalid = false;
    }
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
    }
});

// password eye button
function eyepass(input:any, button:any) {
    if (input.type === "password") {
        input.type = "text";
        button.innerHTML = '<i class="fa-regular fa-eye" style="color: rgb(247, 247, 245);"></i>';
    } else {
        input.type = "password";
        button.innerHTML = '<i class="fa-regular fa-eye-slash" style="color: rgb(251, 251, 250);"></i>';
    }
}
const togglepass = document.getElementById("togglepass") as HTMLInputElement;
const toggleconfirmpass = document.getElementById("toggleconfirmpass") as HTMLInputElement;
const pass: any = document.getElementById("pass") as HTMLInputElement;
const confirmpassword : any = document.getElementById("confirmpassword") as HTMLInputElement;

togglepass.addEventListener("click", function () {
    eyepass(pass, togglepass);
});

toggleconfirmpass.addEventListener("click", function () {
    eyepass(confirmpassword, toggleconfirmpass);
});

export{};