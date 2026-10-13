const loginForm = document.getElementById("loginForm") as HTMLInputElement;


loginForm.addEventListener("submit",function(event){
    event.preventDefault();

    const email : string = (document.getElementById("email") as HTMLInputElement).value;    
    const pass : any = (document.getElementById("pass") as HTMLInputElement).value;

    const emailError = document.getElementById("emailError") as HTMLElement;
    const passError = document.getElementById("passError") as HTMLElement;

    let isvalid : boolean = true;

    emailError.textContent = "";
    passError.textContent = "";

    if (!email) {
        emailError.innerText = "Email is required";
        isvalid = false;
    }
    if (!pass) {
        passError.innerText = "Password is required";
        isvalid = false;
    } else {
        if((!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))){
            emailError.innerText = "*Please enter a valid email address";
            isvalid = false;
        }
        if (pass.length < 8) {
            passError.innerText = "minimum 8 character";
            isvalid = false;
        }
    }

    if (isvalid) {
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
    }
});

// password toggle eye
const togglepass = document.getElementById("togglepass") as HTMLInputElement;
const pass : any = document.getElementById("pass") as HTMLInputElement;
togglepass.addEventListener("click", function () {
    if (pass.type === "password") {
        pass.type = "text";
        togglepass.innerHTML = '<i class="fa-regular fa-eye" style="color: rgb(251, 251, 251);"></i>';
    } else {
        pass.type = "password";
        togglepass.innerHTML = '<i class="fa-regular fa-eye-slash" style="color: rgb(253, 252, 249);"></i>'
    }
});

export{};