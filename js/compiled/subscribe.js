"use strict";
const form = document.getElementById("formSubscribe");
const mail = document.getElementById("emailInput");
const emailError = document.getElementById("emailError");
const btn = document.getElementById("subscribeBtn");
const isvalid = false;
// 4. Email Validator
function validateEmail() {
    const val = mail.value.trim();
    if (!val) {
        emailError.innerText = "*Email address is required";
        return false;
    }
    if (val.length > 50) {
        emailError.innerText = "*Email cannot exceed 50 characters";
        return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        emailError.innerText = "*Please enter a valid email address";
        return false;
    }
    emailError.innerText = "";
    return true;
}
mail?.addEventListener("input", validateEmail);
form.addEventListener("submit", async function (event) {
    event.preventDefault();
    const isMailValid = validateEmail();
    btn.disabled = true;
    if (isMailValid) {
        try {
            const response = await fetch("http://travel-website-mkqj.onrender.com/subscribe", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: mail.value.trim()
                })
            });
            const data = await response.json();
            if (!response.ok) {
                alert("something went wrong!!");
                return;
            }
            console.log(data);
            alert("subscribe succesfully");
        }
        catch (error) {
            console.error("Error during susbcribe:", error);
            alert("Unable to reach the server. Please check your internet connection.");
        }
        finally {
            btn.disabled = false;
        }
    }
});
