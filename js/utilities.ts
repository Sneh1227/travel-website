// hamburger for tablet and mobile
const hamburger = document.getElementById("hamburger") as HTMLButtonElement | null;
const mobileMenu = document.getElementById("mobile-menu") as HTMLElement | null;

if (hamburger && mobileMenu) {
    const setMenuState = (isOpen: boolean): void => {
        if (isOpen) {
            mobileMenu.classList.add("active");
            hamburger.classList.add("active");
            hamburger.setAttribute("aria-expanded", "true");
        } else {
            mobileMenu.classList.remove("active");
            hamburger.classList.remove("active");
            hamburger.setAttribute("aria-expanded", "false");
        }
    };

    hamburger.addEventListener("click", function () {
        const isOpen = mobileMenu.classList.contains("active");
        setMenuState(!isOpen);
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", function (e: MouseEvent) {
        if (!hamburger.contains(e.target as Node) && !mobileMenu.contains(e.target as Node)) {
            setMenuState(false);
        }
    });

    // Close mobile menu when clicking any link
    mobileMenu.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
            setMenuState(false);
        });
    });
}

// function to change navbar option
const login = document.getElementById("login") as HTMLAnchorElement;
const logout = document.getElementById("logout") as HTMLAnchorElement;

const loginm = document.getElementById("loginm") as HTMLAnchorElement;
const logoutm = document.getElementById("logoutm") as HTMLAnchorElement;

const signup = document.querySelectorAll<HTMLElement>(".signup");
const signalt = document.querySelectorAll<HTMLElement>(".signalt");
const userLoggedInOnly = document.querySelectorAll<HTMLElement>(".user-logged-in-only");
const userNameDisplays = document.querySelectorAll<HTMLElement>(".user-name-display");
const userFullNameDisplays = document.querySelectorAll<HTMLElement>(".user-fullname-display");

function updateUI(): void {
    const isloggedIn: boolean = localStorage.getItem("isloggedin") === "true";
    if (isloggedIn) {
        if (login) login.classList.add("hidden");
        if (logout) logout.classList.remove("hidden");

        if (loginm) loginm.classList.add("hidden");
        if (logoutm) logoutm.classList.remove("hidden");

        const user: string | null = localStorage.getItem("user");
        let disvalue = "U";
        let firstname = "User";
        let fullname = "Traveler";

        if (user) {
            try {
                const fetcheduser = JSON.parse(user);
                const first = (fetcheduser.firstname || "").trim();
                const last = (fetcheduser.lastname || "").trim();

                if (first && last) {
                    disvalue = (first[0] + last[0]).toUpperCase();
                } else if (first) {
                    disvalue = first.slice(0, 2).toUpperCase();
                } else if (fetcheduser.email) {
                    disvalue = fetcheduser.email.slice(0, 2).toUpperCase();
                }

                if (first) {
                    firstname = first;
                    fullname = last ? `${first} ${last}` : first;
                } else if (fetcheduser.email) {
                    firstname = fetcheduser.email.split("@")[0];
                    fullname = firstname;
                }
            } catch (e) {
                console.error("Error parsing user data:", e);
            }
        }

        signup.forEach((signlist) => {
            signlist.classList.add("hidden");
        });

        signalt.forEach((s) => {
            s.classList.remove("hidden");
            s.textContent = disvalue;
            s.setAttribute("title", `Logged in as ${fullname}`);
        });

        userLoggedInOnly.forEach((el) => {
            el.classList.remove("hidden");
        });

        userNameDisplays.forEach((el) => {
            el.textContent = firstname;
        });

        userFullNameDisplays.forEach((el) => {
            el.textContent = fullname;
        });
    } else {
        if (login) login.classList.remove("hidden");
        if (logout) logout.classList.add("hidden");

        if (loginm) loginm.classList.remove("hidden");
        if (logoutm) logoutm.classList.add("hidden");

        signup.forEach((signlist) => {
            signlist.classList.remove("hidden");
        });

        signalt.forEach((s) => {
            s.classList.add("hidden");
        });

        userLoggedInOnly.forEach((el) => {
            el.classList.add("hidden");
        });
    }
}
document.addEventListener("DOMContentLoaded", updateUI);

// logout

const logoutt = document.querySelectorAll(".logout");

logoutt.forEach(btn => {
    btn.addEventListener("click", function () {
        localStorage.removeItem("isloggedin");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        alert("Log out successfully");
        updateUI();
    });
})


// testimonials changer

const testimonials = document.querySelectorAll<HTMLElement>(".testimonial");
const dots = document.querySelectorAll<HTMLElement>(".dots button");

const prevBtn = document.querySelector(".prev") as HTMLButtonElement;
const nextBtn = document.querySelector(".next") as HTMLButtonElement;

let current = 0;

function showTestimonials(index: number): void {
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

// Password eye button
function eyepass(input: HTMLInputElement, button: HTMLButtonElement): void {
    if (input.type === "password") {
        input.type = "text";
        button.innerHTML = '<i class="fa-regular fa-eye"></i>';
    } else {
        input.type = "password";
        button.innerHTML = '<i class="fa-regular fa-eye-slash"></i>';
    }
}

export { };