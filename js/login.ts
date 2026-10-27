import { json } from "express";
import { error } from "node:console";

const loginForm = document.getElementById("loginForm") as HTMLFormElement;


loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const email: string = (document.getElementById("email") as HTMLInputElement).value;
    const pass: any = (document.getElementById("pass") as HTMLInputElement).value;

    const emailError = document.getElementById("emailError") as HTMLElement;
    const passError = document.getElementById("passError") as HTMLElement;

    let isvalid: boolean = true;

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
        }

        async function login(values: object): Promise<void> {
            try {
                const response = await fetch(
                    'http://localhost:3000/login',
                    {
                        method: "POST",
                        headers: {
                            "Content-type": "application/json"
                        },
                        body: JSON.stringify(values)
                    }
                );

                const data = await response.json();

                // console.log(data);
                if (!response.ok) {
                    alert("Invalid email or password");
                } else {
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
            } catch (error) {
                console.error("Error during login:", error);
            }
        }
        login(loginDetails);
    }
});

// password toggle eye
const togglepass = document.getElementById("togglepass") as HTMLButtonElement;
const pass: any = document.getElementById("pass") as HTMLInputElement;
togglepass.addEventListener("click", function () {
    if (pass.type === "password") {
        pass.type = "text";
        togglepass.innerHTML = '<i class="fa-regular fa-eye" style="color: rgb(251, 251, 251);"></i>';
    } else {
        pass.type = "password";
        togglepass.innerHTML = '<i class="fa-regular fa-eye-slash" style="color: rgb(253, 252, 249);"></i>'
    }
});

export { };