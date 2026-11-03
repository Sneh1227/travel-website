const form = document.getElementById("formSubscribe");
const mail = document.getElementById("emailInput");
const emailError = document.getElementById("emailError");
const btn = document.getElementById("subscribeBtn");
function setError(message) {
    if (emailError) {
        emailError.innerText = message;
    }
    if (mail) {
        if (message) {
            mail.classList.add("input-invalid");
        }
        else {
            mail.classList.remove("input-invalid");
        }
    }
}
function clearError() {
    setError("");
}
// Email Validator (invoked strictly on button click / form submission)
function validateEmail() {
    if (!mail)
        return false;
    const val = mail.value.trim();
    if (!val) {
        setError("*Email address is required");
        return false;
    }
    if (val.length > 50) {
        setError("*Email cannot exceed 50 characters");
        return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        setError("*Please enter a valid email address");
        return false;
    }
    clearError();
    return true;
}
// Helper to determine appropriate backend endpoint (local server vs Render)
function getSubscribeEndpoint() {
    const hostname = window.location.hostname;
    // When running locally (Live Server on port 5500, localhost, or 127.0.0.1)
    if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "") {
        return "http://localhost:3000/subscribe";
    }
    // Remote / Deployed environment
    return "https://travel-website-mkqj.onrender.com/subscribe"
}
// Validation runs strictly when the user clicks Subscribe.
form?.addEventListener("submit", async function (event) {
    event.preventDefault();
    const isMailValid = validateEmail();
    if (!isMailValid) {
        mail?.focus();
        return;
    }
    if (!btn || !mail)
        return;
    const originalBtnText = btn.innerText;
    btn.disabled = true;
    btn.innerText = "Subscribing...";
    const apiUrl = getSubscribeEndpoint();
    try {
        const response = await fetch(apiUrl, {
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
            const errorMsg = data.message || "Something went wrong!";
            setError(`*${errorMsg}`);
            alert(errorMsg);
            return;
        }
        alert(data.message || "Subscribed successfully! Please check your inbox.");
        mail.value = "";
        clearError();
    }
    catch (error) {
        console.error("Error during subscribe:", error);
        alert("Unable to reach the server. Please check your internet connection.");
    }
    finally {
        btn.disabled = false;
        btn.innerText = originalBtnText;
    }
});
export {};
