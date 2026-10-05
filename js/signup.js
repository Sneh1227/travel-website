const signupForm = document.getElementById("formsignup")

signupForm.addEventListener("submit",function(event){
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
    nameError.innerText="";
    lastError.innerText="";
    emailError.innerText="";
    passError.innerText="";
    confPassError.innerText="";

    if(!firstname){
        nameError.innerText = "Firstname is required *";
        isvalid = false;
    }
    if(!lastname){
        lastError.innerText = "Last name is required";
        isvalid = false;
    }
    if(!email){
        emailError.innerText = "Email is required";
        isvalid = false;
    }
    if(!pass || !confirmpassword){
        passError.innerText = "Password is required in both the fields";
        isvalid = false;
    }

    if(isvalid){
        console.log("Congratulations "+firstname+" "+lastname+" you have my permission to travel")
    }
});
