const form = document.getElementById("formSubscribe") as HTMLFormElement | null;
const mail = document.getElementById("emailInput") as HTMLInputElement | null;
const emailError = document.getElementById("emailError") as HTMLElement | null;
const btn = document.getElementById("subscribeBtn") as HTMLButtonElement | null;

function setError(message: string): void {
    if (emailError) {
        emailError.innerText = message;
    }
    if (mail) {
        if (message) {
            mail.classList.add("input-invalid");
        } else {
            mail.classList.remove("input-invalid");
        }
    }
}

function clearError(): void {
    setError("");
}

// Email Validator (invoked strictly on button click / form submission)
function validateEmail(): boolean {
    if (!mail) return false;
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

// NOTE: Real-time validation on input is intentionally removed.
// Validation runs strictly when the user clicks Subscribe.

form?.addEventListener("submit", async function (event: Event) {
    event.preventDefault();

    const isMailValid = validateEmail();
    if (!isMailValid) {
        mail?.focus();
        return;
    }

    if (!btn || !mail) return;

    const originalBtnText = btn.innerText;
    btn.disabled = true;
    btn.innerText = "Subscribing...";

    const API_URL = (window.location.hostname === "localhost" && window.location.port === "3000")
        ? "/subscribe"
        : "https://travel-website-mkqj.onrender.com/subscribe";

    try {
        const response = await fetch(
            API_URL,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: mail.value.trim()
                })
            }
        );
        const data = await response.json();
        if (!response.ok) {
            const errorMsg = data.message || "Something went wrong!";
            setError(`*${errorMsg}`);
            alert(errorMsg);
            return;
        }
        alert(data.message || "Subscribed successfully!");
        mail.value = "";
        clearError();
    } catch (error) {
        console.error("Error during subscribe:", error);
        alert("Unable to reach the server. Please check your internet connection.");
    } finally {
        btn.disabled = false;
        btn.innerText = originalBtnText;
    }
});

export { };
