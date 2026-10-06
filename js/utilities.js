// hamburger for tablet and mobile
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobile-menu");

hamburger.addEventListener("click", function () {
    mobileMenu.classList.toggle("active");
});

// function to change navbar option
const login = document.getElementById("login");
const logout = document.getElementById("logout");

const loginm = document.getElementById("loginm");
const logoutm = document.getElementById("logoutm");
const signupm = document.getElementById("signupm");

const signup = document.querySelectorAll(".signup");
const signalt = document.querySelectorAll(".signalt");

function updateUI() {
    const isloggedIn = localStorage.getItem("isloggedin") === "true";
    if (isloggedIn) {
        login.classList.add("hidden");
        logout.classList.remove("hidden");

        loginm.classList.add("hidden");
        logoutm.classList.remove("hidden");

        const user = localStorage.getItem("user");
        const fetcheduser = JSON.parse(user);
        signup.forEach((signlist)=>{
            signlist.classList.add("hidden");
        });
        signalt.forEach((signalt)=>{
            signalt.classList.remove("hidden");
            signalt.textContent = fetcheduser.name;
        });
    } else {
        login.classList.remove("hidden");
        logout.classList.add("hidden");

        loginm.classList.remove("hidden");
        logoutm.classList.add("hidden");
        signup.forEach((signlist)=>{
            signlist.classList.remove("hidden");
        });
        signalt.forEach((signalt)=>{
            signalt.classList.add("hidden");
        });
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

// testimonials changer

const testimonials = document.querySelectorAll(".testimonial");
const dots = document.querySelectorAll(".dots button");

const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");

let current = 0;

function showTestimonials(index) {
    testimonials.forEach((testimonial) => {
        testimonial.classList.remove("active");
    });

    dots.forEach((dot) => {
        dot.classList.remove("active");
    });

    testimonials[index].classList.add("active");
    dots[index].classList.add("active");
    current = index;
}

dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
        showTestimonials(index);
    });
});

nextBtn.addEventListener("click", () => {
    current++;
    if (current >= testimonials.length) {
        current = 0;
    }
    showTestimonials(current);
});

prevBtn.addEventListener("click", () => {
    current--;
    if (current < 0) {
        current = testimonials.length - 1;
    }
    showTestimonials(current);
});

showTestimonials(0);