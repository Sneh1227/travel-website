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
        passError.innerText = "Password is required";
        isvalid = false;
    }
    if(pass!=confirmpassword){
        passError.innerText="";
        confPassError.innerText="password is mismatched";
        isvalid = false;
    }else{
        if(pass.length<8){
            passError.innerText="minimum 8 character required";
            isvalid = false;
        }
        if(!/[A-Z]/.test(pass)){
            passError.innerText="must contain atleat 1 uppercase";
            isvalid = false;
        }
        if(!/[a-z]/.test(pass)){
            passError.innerText="must contain atleat 1 lowercase";
            isvalid = false;
        }
        if(!/[0-9]/.test(pass)){
            passError.innerText="must contain atleast 1 number";
            isvalid = false;
        }
        if(!/[!@#$%^&*]/.test(pass)){
            passError.innerText="must contain atleast 1 special charcter";
            isvalid = false;
        }
    }
    

    if(isvalid){
        console.log("Congratulations "+firstname+" "+lastname+" you have my permission to travel")
    }
});

function eyepass(input, button){
    if(input.type==="password"){
        input.type="text";
        button.innerHTML='<i class="fa-regular fa-eye" style="color: rgb(255, 212, 59);"></i>';
    }else{
        input.type="password";
        button.innerHTML='<i class="fa-regular fa-eye-slash" style="color: rgb(255, 212, 59);"></i>';
    }
}
const togglepass = document.getElementById("togglepass")
const toggleconfirmpass = document.getElementById("toggleconfirmpass");

togglepass.addEventListener("click",function(){
    eyepass(pass, togglepass);
});


toggleconfirmpass.addEventListener("click",function(){
    eyepass(confirmpassword,toggleconfirmpass);
});
