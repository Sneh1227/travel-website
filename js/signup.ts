import { eyepass } from "./utilities.js";

// DOM Elements
const signupForm = document.getElementById("formsignup") as HTMLFormElement;

const firstNameInput = document.getElementById("firstname") as HTMLInputElement;
const lastNameInput = document.getElementById("lastname") as HTMLInputElement;
const contactInput = document.getElementById("contact") as HTMLInputElement;
const emailInput = document.getElementById("email") as HTMLInputElement;
const passInput = document.getElementById("pass") as HTMLInputElement;
const confirmPassInput = document.getElementById("confirmpassword") as HTMLInputElement;

const nameError = document.getElementById("nameError") as HTMLElement;
const lastError = document.getElementById("lastError") as HTMLElement;
const contactError = document.getElementById("contactError") as HTMLElement;
const emailError = document.getElementById("emailError") as HTMLElement;
const passError = document.getElementById("passError") as HTMLElement;
const confPassError = document.getElementById("confPassError") as HTMLElement;

// Helper to set field validation state
function setFieldState(input: HTMLInputElement, errorSpan: HTMLElement, errorMsg: string): boolean {
    if (errorMsg) {
        errorSpan.innerText = errorMsg;
        input.classList.add("input-invalid");
        input.classList.remove("input-valid");
        return false;
    } else {
        errorSpan.innerText = "";
        input.classList.remove("input-invalid");
        input.classList.add("input-valid");
        return true;
    }
}

// 1. First Name Validator
function validateFirstName(): boolean {
    const val = firstNameInput.value.trim();
    if (!val) {
        return setFieldState(firstNameInput, nameError, "*First Name is required");
    }
    if (val.length < 2) {
        return setFieldState(firstNameInput, nameError, "*First Name must be at least 2 characters");
    }
    if (val.length > 20) {
        return setFieldState(firstNameInput, nameError, "*First Name cannot exceed 20 characters");
    }
    if (!/^[A-Za-z]+$/.test(val)) {
        return setFieldState(firstNameInput, nameError, "*First Name should contain alphabets only");
    }
    return setFieldState(firstNameInput, nameError, "");
}

// 2. Last Name Validator
function validateLastName(): boolean {
    const val = lastNameInput.value.trim();
    if (!val) {
        return setFieldState(lastNameInput, lastError, "*Last Name is required");
    }
    if (val.length < 2) {
        return setFieldState(lastNameInput, lastError, "*Last Name must be at least 2 characters");
    }
    if (val.length > 15) {
        return setFieldState(lastNameInput, lastError, "*Last Name cannot exceed 15 characters");
    }
    if (!/^[A-Za-z]+$/.test(val)) {
        return setFieldState(lastNameInput, lastError, "*Last Name should contain alphabets only");
    }
    return setFieldState(lastNameInput, lastError, "");
}

// 3. Contact Validator
function validateContact(): boolean {
    const val = contactInput.value.trim();
    if (!val) {
        return setFieldState(contactInput, contactError, "*Contact number is required");
    }
    if (!/^\d+$/.test(val)) {
        return setFieldState(contactInput, contactError, "*Contact should contain digits only");
    }
    if (!/^[6-9][0-9]{9}$/.test(val)) {
        return setFieldState(contactInput, contactError, "*Enter a valid 10-digit Indian contact number (starts with 6-9)");
    }
    return setFieldState(contactInput, contactError, "");
}

// 4. Email Validator
function validateEmail(): boolean {
    const val = emailInput.value.trim();
    if (!val) {
        return setFieldState(emailInput, emailError, "*Email address is required");
    }
    if (val.length > 50) {
        return setFieldState(emailInput, emailError, "*Email cannot exceed 50 characters");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        return setFieldState(emailInput, emailError, "*Please enter a valid email address");
    }
    return setFieldState(emailInput, emailError, "");
}

// 5. Password Validator
function validatePassword(): boolean {
    const val = passInput.value;
    if (!val) {
        return setFieldState(passInput, passError, "*Password is required");
    }
    if (val.length < 8 || !/[A-Z]/.test(val) ||
        !/[a-z]/.test(val) || !/[0-9]/.test(val) || !/[!@#$%^&*]/.test(val)
    ) {
        return setFieldState(passInput, passError, "*Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.");
    }
    const isValid = setFieldState(passInput, passError, "");

    // If confirm password has value, revalidate to keep them in sync
    if (confirmPassInput.value.length > 0) {
        validateConfirmPassword();
    }
    return isValid;
}

// 6. Confirm Password Validator
function validateConfirmPassword(): boolean {
    const passVal = passInput.value;
    const confirmVal = confirmPassInput.value;
    if (!confirmVal) {
        return setFieldState(confirmPassInput, confPassError, "*Please confirm your password");
    }
    if (confirmVal !== passVal) {
        return setFieldState(confirmPassInput, confPassError, "*Passwords do not match");
    }
    return setFieldState(confirmPassInput, confPassError, "");
}

// Real-Time Event Listeners
firstNameInput?.addEventListener("input", validateFirstName);
firstNameInput?.addEventListener("blur", validateFirstName);

lastNameInput?.addEventListener("input", validateLastName);
lastNameInput?.addEventListener("blur", validateLastName);

contactInput?.addEventListener("input", validateContact);
contactInput?.addEventListener("blur", validateContact);

emailInput?.addEventListener("input", validateEmail);
emailInput?.addEventListener("blur", validateEmail);

passInput?.addEventListener("input", validatePassword);
passInput?.addEventListener("blur", validatePassword);

confirmPassInput?.addEventListener("input", validateConfirmPassword);
confirmPassInput?.addEventListener("blur", validateConfirmPassword);

// Form Submission
signupForm?.addEventListener("submit", async function (event) {
    event.preventDefault();

    const isFirstValid = validateFirstName();
    const isLastValid = validateLastName();
    const isContactValid = validateContact();
    const isEmailValid = validateEmail();
    const isPassValid = validatePassword();
    const isConfirmValid = validateConfirmPassword();

    const isFormValid = isFirstValid && isLastValid && isContactValid && isEmailValid && isPassValid && isConfirmValid;

    if (!isFormValid) {
        // Focus first invalid element
        if (!isFirstValid) firstNameInput?.focus();
        else if (!isLastValid) lastNameInput?.focus();
        else if (!isContactValid) contactInput?.focus();
        else if (!isEmailValid) emailInput?.focus();
        else if (!isPassValid) passInput?.focus();
        else if (!isConfirmValid) confirmPassInput?.focus();
        return;
    }

    const user = {
        firstname: firstNameInput.value.trim(),
        lastname: lastNameInput.value.trim(),
        contact: contactInput.value.trim(),
        email: emailInput.value.trim(),
        pass: passInput.value
    };

    const submitBtn = document.getElementById("btnsignup") as HTMLButtonElement | null;
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = "SIGNING UP...";
    }

    try {
        const response = await fetch(
            "https://travel-website-mkqj.onrender.com/signup",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user)
            }
        );
        const data = await response.json();

        if (!response.ok) {
            if (response.status === 409) {
                setFieldState(emailInput, emailError, data.message || "Email already registered. Please login.");
                emailInput?.focus();
                alert("Email already registered! Please login");
            } else {
                alert(data.message || data.error || "Signup failed");
            }
            return;
        }
        alert(data.message || "Signup successful! Please login.");
        window.location.href = "./login.html";

    } catch (error) {
        console.error("Error during signup:", error);
        alert("Unable to reach the server. Please check your internet connection.");
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerText = "SIGN UP";
        }
    }
});

// Password visibility eye buttons
const togglepass = document.getElementById("togglepass") as HTMLButtonElement;
const toggleconfirmpass = document.getElementById("toggleconfirmpass") as HTMLButtonElement;

togglepass?.addEventListener("click", function () {
    eyepass(passInput, togglepass);
});

toggleconfirmpass?.addEventListener("click", function () {
    eyepass(confirmPassInput, toggleconfirmpass);
});

export { };
