// Profile Section Logic

const userAvatar = document.getElementById("userAvatar") as HTMLElement | null;
const userName = document.getElementById("userName") as HTMLElement | null;
const userEmail = document.getElementById("userEmail") as HTMLElement | null;

const tabBookings = document.getElementById("tabBookings") as HTMLButtonElement | null;
const tabPassword = document.getElementById("tabPassword") as HTMLButtonElement | null;
const btnLogout = document.getElementById("btnLogout") as HTMLButtonElement | null;

const sectionBookings = document.getElementById("sectionBookings") as HTMLElement | null;
const sectionPassword = document.getElementById("sectionPassword") as HTMLElement | null;

const bookingsList = document.getElementById("bookingsList") as HTMLElement | null;
const btnRefreshBookings = document.getElementById("btnRefreshBookings") as HTMLButtonElement | null;

const changePasswordForm = document.getElementById("changePasswordForm") as HTMLFormElement | null;
const currentPasswordInput = document.getElementById("currentPassword") as HTMLInputElement | null;
const newPasswordInput = document.getElementById("newPassword") as HTMLInputElement | null;
const confirmNewPasswordInput = document.getElementById("confirmNewPassword") as HTMLInputElement | null;
const passwordAlert = document.getElementById("passwordAlert") as HTMLElement | null;
const btnChangePassword = document.getElementById("btnChangePassword") as HTMLButtonElement | null;

const toggleCurrentPassword = document.getElementById("toggleCurrentPassword") as HTMLButtonElement | null;
const toggleNewPassword = document.getElementById("toggleNewPassword") as HTMLButtonElement | null;
const toggleConfirmNewPassword = document.getElementById("toggleConfirmNewPassword") as HTMLButtonElement | null;

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

toggleCurrentPassword?.addEventListener("click", () => {
    if (currentPasswordInput && toggleCurrentPassword) {
        eyepass(currentPasswordInput, toggleCurrentPassword);
    }
});

toggleNewPassword?.addEventListener("click", () => {
    if (newPasswordInput && toggleNewPassword) {
        eyepass(newPasswordInput, toggleNewPassword);
    }
});

toggleConfirmNewPassword?.addEventListener("click", () => {
    if (confirmNewPasswordInput && toggleConfirmNewPassword) {
        eyepass(confirmNewPasswordInput, toggleConfirmNewPassword);
    }
});

// Auth check: verify logged in status
const token: string | null = localStorage.getItem("token");

if (!token) {
    alert("Please log in to access your profile.");
    window.location.href = "/pages/login.html";
}

// Format date utility
function formatDate(dateStr: string): string {
    if (!dateStr) return "-";
    try {
        const parts = dateStr.split("T")[0].split("-");
        if (parts.length === 3) {
            const dateObj = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
            if (!isNaN(dateObj.getTime())) {
                return dateObj.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric"
                });
            }
        }
    } catch (_) { }
    return dateStr;
}

// Populate user basic details from localStorage
function loadLocalUserData(): void {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) return;

    try {
        const user = JSON.parse(savedUser);
        const first = (user.firstname || "").trim();
        const last = (user.lastname || "").trim();
        const full = `${first} ${last}`.trim() || "Traveler";

        if (userName) userName.textContent = full;

        let initials = "U";
        if (first && last) {
            initials = (first[0] + last[0]).toUpperCase();
        } else if (first) {
            initials = first.slice(0, 2).toUpperCase();
        }
        if (userAvatar) userAvatar.textContent = initials;
        if (user.email && userEmail) userEmail.textContent = user.email;
    } catch (e) {
        console.error("Error parsing user data:", e);
    }
}

// Fetch user profile from backend
async function fetchUserProfile(): Promise<void> {
    if (!token) return;

    try {
        const response = await fetch("http://localhost:3000/profile", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            const u = data.user;
            if (u) {
                const full = `${u.first_name || ""} ${u.last_name || ""}`.trim() || "Traveler";
                if (userName) userName.textContent = full;
                if (userEmail && u.email) userEmail.textContent = u.email;

                let initials = "U";
                if (u.first_name && u.last_name) {
                    initials = (u.first_name[0] + u.last_name[0]).toUpperCase();
                } else if (u.first_name) {
                    initials = u.first_name.slice(0, 2).toUpperCase();
                }
                if (userAvatar) userAvatar.textContent = initials;
            }
        }
    } catch (err) {
        console.warn("Could not fetch profile details from server:", err);
    }
}

// Fetch user bookings from backend
async function fetchMyBookings(): Promise<void> {
    if (!bookingsList || !token) return;

    bookingsList.innerHTML = `<p class="status-msg"><i class="fa-solid fa-spinner fa-spin"></i> Loading your bookings...</p>`;

    try {
        const response = await fetch("http://localhost:3000/mybookings", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.message || "Failed to load bookings");
        }

        const data = await response.json();
        const bookings = data.bookings || [];

        if (bookings.length === 0) {
            bookingsList.innerHTML = `
                <div class="status-msg">
                    <p>You have no bookings yet.</p>
                    <p style="margin-top: 8px;"><a href="/pages/destinations.html">Explore destinations and book your first trip!</a></p>
                </div>
            `;
            return;
        }

        bookingsList.innerHTML = "";

        bookings.forEach((b: any) => {
            const item = document.createElement("div");
            item.className = "booking-item";

            const destName = b.destination_name || "Custom Destination";
            const travelDate = formatDate(b.travel_date);
            const persons = b.total_person || 1;
            const cost = Number(b.total_cost || 0).toLocaleString();
            const ref = b.id ? (b.id.length > 8 ? b.id.slice(0, 8).toUpperCase() : b.id.toUpperCase()) : "N/A";

            item.innerHTML = `
                <div class="booking-item-header">
                    <span class="booking-item-dest"><i class="fa-solid fa-location-dot" style="color: var(--primary); margin-right: 6px;"></i>${destName}</span>
                    <span class="booking-item-badge"><i class="fa-solid fa-circle-check"></i> Confirmed</span>
                </div>
                <div class="booking-item-grid">
                    <div class="booking-item-cell">
                        <span class="cell-label">Date</span>
                        <span class="cell-val">${travelDate}</span>
                    </div>
                    <div class="booking-item-cell">
                        <span class="cell-label">Guests</span>
                        <span class="cell-val">${persons} Traveler${persons > 1 ? "s" : ""}</span>
                    </div>
                    <div class="booking-item-cell">
                        <span class="cell-label">Total</span>
                        <span class="cell-val price">$${cost}</span>
                    </div>
                    <div class="booking-item-cell">
                        <span class="cell-label">Ref ID</span>
                        <span class="cell-val ref">#${ref}</span>
                    </div>
                </div>
            `;
            bookingsList.appendChild(item);
        });
    } catch (error) {
        console.error("Error loading bookings:", error);
        bookingsList.innerHTML = `
            <div class="status-msg" style="color: #991b1b;">
                <p>Could not load bookings. Please make sure the server is running.</p>
                <p style="margin-top: 8px;"><button type="button" class="tab-btn" onclick="fetchMyBookings()" style="display:inline-flex; width:auto; border:1px solid #fecaca; margin:0 auto;">Retry</button></p>
            </div>
        `;
    }
}

// Password Alert helper
function showPasswordAlert(msg: string, isSuccess: boolean): void {
    if (!passwordAlert) return;
    passwordAlert.textContent = msg;
    passwordAlert.className = `form-alert ${isSuccess ? "success" : "error"}`;
    passwordAlert.classList.remove("hidden");
}

function hidePasswordAlert(): void {
    if (!passwordAlert) return;
    passwordAlert.classList.add("hidden");
}

// Change password submit handler
changePasswordForm?.addEventListener("submit", async (e: SubmitEvent) => {
    e.preventDefault();
    hidePasswordAlert();

    const currentPassword = currentPasswordInput?.value.trim() || "";
    const newPassword = newPasswordInput?.value.trim() || "";
    const confirmNewPassword = confirmNewPasswordInput?.value.trim() || "";

    if (!currentPassword || !newPassword || !confirmNewPassword) {
        showPasswordAlert("Please fill in all password fields.", false);
        return;
    }

    if (newPassword.length < 6) {
        showPasswordAlert("New password must be at least 6 characters long.", false);
        return;
    }

    if (newPassword !== confirmNewPassword) {
        showPasswordAlert("New password and confirmation do not match.", false);
        return;
    }

    if (btnChangePassword) {
        btnChangePassword.disabled = true;
        btnChangePassword.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Updating...`;
    }

    try {
        const response = await fetch("http://localhost:3000/change-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                currentPassword,
                newPassword
            })
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            showPasswordAlert(data.message || "Failed to change password. Please check your current password.", false);
            return;
        }

        showPasswordAlert("Password updated successfully!", true);
        changePasswordForm.reset();
    } catch (err) {
        console.error("Change password request error:", err);
        showPasswordAlert("Unable to reach the server. Please verify the server is running.", false);
    } finally {
        if (btnChangePassword) {
            btnChangePassword.disabled = false;
            btnChangePassword.innerHTML = `<span>Update Password</span>`;
        }
    }
});

// Tab switching logic
tabBookings?.addEventListener("click", () => {
    tabBookings.classList.add("active");
    tabBookings.setAttribute("aria-selected", "true");
    tabPassword?.classList.remove("active");
    tabPassword?.setAttribute("aria-selected", "false");

    sectionBookings?.classList.remove("hidden");
    sectionBookings?.classList.add("active");
    sectionPassword?.classList.add("hidden");
    sectionPassword?.classList.remove("active");
});

tabPassword?.addEventListener("click", () => {
    tabPassword.classList.add("active");
    tabPassword.setAttribute("aria-selected", "true");
    tabBookings?.classList.remove("active");
    tabBookings?.setAttribute("aria-selected", "false");

    sectionPassword?.classList.remove("hidden");
    sectionPassword?.classList.add("active");
    sectionBookings?.classList.add("hidden");
    sectionBookings?.classList.remove("active");
    hidePasswordAlert();
});

btnRefreshBookings?.addEventListener("click", () => {
    fetchMyBookings();
});

// Logout logic
btnLogout?.addEventListener("click", () => {
    if (confirm("Are you sure you want to log out?")) {
        localStorage.removeItem("isloggedin");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        alert("Logged out successfully.");
        window.location.href = "/index.html";
    }
});

// Initialization
loadLocalUserData();
fetchUserProfile();
fetchMyBookings();

export { };
