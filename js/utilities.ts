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



// Dynamic Testimonials from Database
interface PublicTestimonial {
    id: string;
    ratings: number | string;
    comment: string;
    created_at: string;
    updated_at?: string;
    destination_id?: string;
    booking_id?: string;
    first_name?: string;
    last_name?: string;
    destination_name?: string;
}

function escapeHtml(str: string): string {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

async function initDynamicTestimonials(): Promise<void> {
    const container = document.getElementById("testimonialsContainer");
    const dotsContainer = document.getElementById("testimonialDots");
    const arrowsContainer = document.getElementById("testimonialArrows");
    const prevBtn = document.querySelector(".testimonials .arrows .prev") as HTMLButtonElement | null;
    const nextBtn = document.querySelector(".testimonials .arrows .next") as HTMLButtonElement | null;

    if (!container) return;

    try {
        const response = await fetch("http://localhost:3000/api/testimonials");
        if (!response.ok) {
            throw new Error(`Failed to load testimonials: ${response.statusText}`);
        }

        const data = await response.json();
        const list: PublicTestimonial[] = data.testimonials || [];

        // No testimonials in database
        if (list.length === 0) {
            container.innerHTML = `
                <div class="testimonial active">
                    <div class="testimonial-avatar">J</div>
                    <div class="info">
                        <p class="para">“No traveler testimonials are available in the database yet. Book a trip and be the first to share your experience!”</p>
                        <h4>Jadoo Travel</h4>
                        <p>Explore the World with Us</p>
                    </div>
                </div>
            `;
            if (dotsContainer) dotsContainer.innerHTML = "";
            if (arrowsContainer) arrowsContainer.style.display = "none";
            return;
        }

        // Render testimonials from database
        container.innerHTML = "";
        if (dotsContainer) dotsContainer.innerHTML = "";

        const avatarColors = ["#DF6951", "#14183E", "#2C336B", "#F59E0B", "#10B981", "#6366F1"];

        list.forEach((t, index) => {
            const first = (t.first_name || "").trim();
            const last = (t.last_name || "").trim();
            const rawName = `${first} ${last}`.trim() || "Verified Traveler";
            const fullName = rawName
                .split(" ")
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
                .join(" ");

            let initials = "T";
            if (first && last) {
                initials = (first[0] + last[0]).toUpperCase();
            } else if (first) {
                initials = first.slice(0, 2).toUpperCase();
            } else if (fullName) {
                initials = fullName.slice(0, 2).toUpperCase();
            }

            const destName = t.destination_name ? `Trip to ${t.destination_name}` : "Verified Traveler";
            const ratingNum = Math.max(1, Math.min(5, Math.round(Number(t.ratings) || 5)));
            const color = avatarColors[index % avatarColors.length];
            const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=${color.replace("#", "")}&color=fff&size=136&font-size=0.4&bold=true`;

            // Stars HTML
            const starsHtml = Array.from({ length: 5 }, (_, i) =>
                `<i class="fa-${i < ratingNum ? "solid" : "regular"} fa-star"></i>`
            ).join("");

            // Testimonial Card
            const card = document.createElement("div");
            card.className = `testimonial ${index === 0 ? "active" : ""}`;
            card.innerHTML = `
                <img src="${avatarUrl}" alt="${fullName}" class="testimonial-img" onerror="this.style.display='none'; if (this.nextElementSibling) this.nextElementSibling.style.display='flex';" />
                <div class="testimonial-avatar" style="display:none; background:${color};">${initials}</div>
                <div class="info">
                    <div class="testimonial-stars" title="Rated ${ratingNum} out of 5 stars">
                        ${starsHtml}
                    </div>
                    <p class="para">“${escapeHtml(t.comment || "")}”</p>
                    <h4>${fullName}</h4>
                    <p>${destName}</p>
                </div>
            `;
            container.appendChild(card);

            // Dot
            if (dotsContainer && list.length > 1) {
                const dot = document.createElement("button");
                dot.type = "button";
                dot.className = `bt ${index === 0 ? "active" : ""}`;
                dot.setAttribute("aria-label", `Testimonial ${index + 1} of ${list.length}`);
                dotsContainer.appendChild(dot);
            }
        });

        // Setup slider interactions
        const cardElements = container.querySelectorAll<HTMLElement>(".testimonial");
        const dotElements = dotsContainer ? dotsContainer.querySelectorAll<HTMLButtonElement>(".bt") : [];
        let currentIndex = 0;
        let autoSlideTimer: any = null;

        function showCard(idx: number): void {
            cardElements.forEach((c) => c.classList.remove("active"));
            dotElements.forEach((d) => d.classList.remove("active"));

            if (cardElements[idx]) {
                cardElements[idx].classList.add("active");
            }
            if (dotElements[idx]) {
                dotElements[idx].classList.add("active");
            }
            currentIndex = idx;
        }

        

        // Attach dot click listeners
        dotElements.forEach((dot, idx) => {
            dot.addEventListener("click", () => {
                showCard(idx);
            });
        });

        // Manage arrows visibility
        if (list.length <= 1) {
            if (arrowsContainer) arrowsContainer.style.display = "none";
        } else {
            if (arrowsContainer) arrowsContainer.style.display = "flex";

            nextBtn?.addEventListener("click", () => {
                const nextIdx = (currentIndex + 1) % cardElements.length;
                showCard(nextIdx);
            });

            prevBtn?.addEventListener("click", () => {
                const prevIdx = (currentIndex - 1 + cardElements.length) % cardElements.length;
                showCard(prevIdx);
            });


        }
    } catch (err) {
        console.error("Error loading testimonials from database:", err);
        container.innerHTML = `
            <div class="testimonial active">
                <div class="info">
                    <p class="para" style="color: #991b1b;">Could not load testimonials. Please make sure the backend server is running.</p>
                    <h4>System Notice</h4>
                    <p>Database Connection</p>
                </div>
            </div>
        `;
    }
}

// Call on load if testimonial section exists
if (document.getElementById("testimonialsContainer")) {
    initDynamicTestimonials();
}

// Password eye button
export function eyepass(input: HTMLInputElement, button: HTMLButtonElement): void {
    if (input.type === "password") {
        input.type = "text";
        button.innerHTML = '<i class="fa-regular fa-eye"></i>';
    } else {
        input.type = "password";
        button.innerHTML = '<i class="fa-regular fa-eye-slash"></i>';
    }
}

export { };