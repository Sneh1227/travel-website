// hamburger for tablet and mobile
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobile-menu");

hamburger.addEventListener("click", function () {
    mobileMenu.classList.toggle("active");
});

// function to change navbar option
const login = document.getElementById("login");
const logout = document.getElementById("logout");
const signup = document.getElementById("signup");

const loginm = document.getElementById("loginm");
const logoutm = document.getElementById("logoutm");
const signupm = document.getElementById("signupm");

function updateUI() {
    const isloggedIn = localStorage.getItem("isloggedin") === "true";
    if (isloggedIn) {
        login.classList.add("hidden");
        logout.classList.remove("hidden");

        loginm.classList.add("hidden");
        logoutm.classList.remove("hidden");
        // signup.textContent = "Hello";
    } else {
        login.classList.remove("hidden");
        logout.classList.add("hidden");

        loginm.classList.remove("hidden");
        logoutm.classList.add("hidden");
    }
}
document.addEventListener("DOMContentLoaded", updateUI);

// logout

const logoutt = document.querySelectorAll(".logout");

logoutt.forEach(btn => {
    btn.addEventListener("click", function () {
        localStorage.removeItem("isloggedin");
        alert("Log out successfully");
        updateUI();
    });
})
