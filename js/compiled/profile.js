import { eyepass } from "./utilities.js";
function escapeHtml(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
// User Summary Elements
const userAvatar = document.getElementById("userAvatar");
const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
// Tab Navigation Elements
const tabBookings = document.getElementById("tabBookings");
const tabPassword = document.getElementById("tabPassword");
const btnLogout = document.getElementById("btnLogout");
const sectionBookings = document.getElementById("sectionBookings");
const sectionPassword = document.getElementById("sectionPassword");
const bookingsList = document.getElementById("bookingsList");
const btnRefreshBookings = document.getElementById("btnRefreshBookings");
// Password Change Elements
const changePasswordForm = document.getElementById("changePasswordForm");
const currentPasswordInput = document.getElementById("currentPassword");
const newPasswordInput = document.getElementById("newPassword");
const confirmNewPasswordInput = document.getElementById("confirmNewPassword");
const passwordAlert = document.getElementById("passwordAlert");
const btnChangePassword = document.getElementById("btnChangePassword");
const toggleCurrentPassword = document.getElementById("toggleCurrentPassword");
const toggleNewPassword = document.getElementById("toggleNewPassword");
const toggleConfirmNewPassword = document.getElementById("toggleConfirmNewPassword");
// Testimonial Modal Elements
const testimonialModal = document.getElementById("testimonialModal");
const btnCloseTestimonialModal = document.getElementById("btnCloseTestimonialModal");
const btnCancelTestimonial = document.getElementById("btnCancelTestimonial");
const testimonialForm = document.getElementById("testimonialForm");
const testimonialDestName = document.getElementById("testimonialDestName");
const testimonialDestId = document.getElementById("testimonialDestId");
const testimonialRatingValue = document.getElementById("testimonialRatingValue");
const starRatingGroup = document.getElementById("starRatingGroup");
const ratingDescriptor = document.getElementById("ratingDescriptor");
const testimonialComment = document.getElementById("testimonialComment");
const testimonialCharCount = document.getElementById("testimonialCharCount");
const testimonialAlert = document.getElementById("testimonialAlert");
const btnSubmitTestimonial = document.getElementById("btnSubmitTestimonial");
// Cancel Modal Elements
const cancelBookingModal = document.getElementById("cancelBookingModal");
const btnCloseCancelModal = document.getElementById("btnCloseCancelModal");
const btnDismissCancelModal = document.getElementById("btnDismissCancelModal");
const btnConfirmCancelAction = document.getElementById("btnConfirmCancelAction");
const cancelModalAlert = document.getElementById("cancelModalAlert");
const cancelSummaryDest = document.getElementById("cancelSummaryDest");
const cancelSummaryDate = document.getElementById("cancelSummaryDate");
const cancelSummaryRef = document.getElementById("cancelSummaryRef");
// Toast Notification Elements
const profileToast = document.getElementById("profileToast");
const toastIcon = document.getElementById("toastIcon");
const toastMessage = document.getElementById("toastMessage");
let toastTimeout = null;
// State
let userTestimonialsMap = new Map();
let activeCancelBookingId = null;
let activeCancelDestName = "";
let activeTestimonialBookingId = null;
let activeTestimonialIsEdit = false;
let selectedRating = 5;
const RATING_DESCRIPTIONS = {
    1: "Poor (1/5)",
    2: "Fair (2/5)",
    3: "Good (3/5)",
    4: "Very Good (4/5)",
    5: "Exceptional (5/5)"
};
// Password eye button
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
const token = localStorage.getItem("token");
if (!token) {
    alert("Please log in to access your profile.");
    window.location.href = "/pages/login.html";
}
// Toast Helper
function showToast(message, isError = false) {
    if (!profileToast || !toastMessage || !toastIcon)
        return;
    toastMessage.textContent = message;
    if (isError) {
        profileToast.classList.add("error");
        toastIcon.className = "fa-solid fa-circle-exclamation toast-icon";
    }
    else {
        profileToast.classList.remove("error");
        toastIcon.className = "fa-solid fa-circle-check toast-icon";
    }
    profileToast.classList.remove("hidden");
    if (toastTimeout) {
        clearTimeout(toastTimeout);
    }
    toastTimeout = setTimeout(() => {
        profileToast?.classList.add("hidden");
    }, 4000);
}
// Format date utility
function formatDate(dateStr) {
    if (!dateStr)
        return "-";
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
    }
    catch (_) { }
    return dateStr;
}
// Populate user basic details from localStorage
function loadLocalUserData() {
    const savedUser = localStorage.getItem("user");
    if (!savedUser)
        return;
    try {
        const user = JSON.parse(savedUser);
        const first = (user.firstname || "").trim();
        const last = (user.lastname || "").trim();
        const full = `${first} ${last}`.trim() || "Traveler";
        if (userName)
            userName.textContent = full;
        let initials = "U";
        if (first && last) {
            initials = (first[0] + last[0]).toUpperCase();
        }
        else if (first) {
            initials = first.slice(0, 2).toUpperCase();
        }
        if (userAvatar)
            userAvatar.textContent = initials;
        if (user.email && userEmail)
            userEmail.textContent = user.email;
    }
    catch (e) {
        console.error("Error parsing user data:", e);
    }
}
// Fetch user profile from backend
async function fetchUserProfile() {
    if (!token)
        return;
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
                if (userName)
                    userName.textContent = full;
                if (userEmail && u.email)
                    userEmail.textContent = u.email;
                let initials = "U";
                if (u.first_name && u.last_name) {
                    initials = (u.first_name[0] + u.last_name[0]).toUpperCase();
                }
                else if (u.first_name) {
                    initials = u.first_name.slice(0, 2).toUpperCase();
                }
                if (userAvatar)
                    userAvatar.textContent = initials;
            }
        }
    }
    catch (err) {
        console.warn("Could not fetch profile details from server:", err);
    }
}
// Fetch user's existing testimonials
async function fetchUserTestimonials() {
    if (!token)
        return;
    try {
        const response = await fetch("http://localhost:3000/my-testimonials", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        if (response.ok) {
            const data = await response.json();
            const testimonials = data.testimonials || [];
            userTestimonialsMap.clear();
            testimonials.forEach((t) => {
                if (t.booking_id) {
                    userTestimonialsMap.set(t.booking_id, t);
                }
            });
        }
    }
    catch (err) {
        console.warn("Could not fetch testimonials:", err);
    }
}
// Fetch user bookings from backend and render with Cancel & Testimonial buttons
async function fetchMyBookings() {
    if (!bookingsList || !token)
        return;
    bookingsList.innerHTML = `<p class="status-msg"><i class="fa-solid fa-spinner fa-spin"></i> Loading your bookings...</p>`;
    try {
        // Fetch testimonials and bookings in parallel
        await fetchUserTestimonials();
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
        bookings.forEach((b) => {
            const item = document.createElement("div");
            item.className = "booking-item";
            item.setAttribute("data-booking-id", b.id);
            const destName = b.destination_name || "Custom Destination";
            const travelDate = formatDate(b.travel_date);
            const persons = Number(b.total_person) || 1;
            const cost = Number(b.total_cost || 0).toLocaleString();
            const ref = b.id ? (b.id.length > 8 ? b.id.slice(0, 8).toUpperCase() : b.id.toUpperCase()) : "N/A";
            const destId = b.destination_id || "";
            // Retrieve testimonial strictly associated with this specific booking_id
            const bookingId = b.id;
            const existingReview = bookingId ? userTestimonialsMap.get(bookingId) : undefined;
            const hasReviewed = !!existingReview;
            const reviewRating = existingReview ? Number(existingReview.ratings) : 0;
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
                <div class="booking-item-actions">
                    ${hasReviewed ? `
                        <span class="reviewed-tag" title="You rated this booking ${reviewRating} out of 5 stars">
                            <i class="fa-solid fa-star"></i> Testimonial Given (${reviewRating}★)
                        </span>
                    ` : ""}
                    <button type="button" class="btn-booking-action btn-booking-cancel" 
                        data-booking-id="${b.id}"
                        data-dest-name="${destName}"
                        data-date="${travelDate}"
                        data-ref="#${ref}"
                        title="Cancel this booking">
                        <i class="fa-solid fa-ban"></i>
                        <span>Cancel Booking</span>
                    </button>
                    <button type="button" class="btn-booking-action btn-booking-testimonial ${hasReviewed ? "has-reviewed" : ""}" 
                        data-booking-id="${b.id}"
                        data-dest-id="${destId}"
                        data-dest-name="${destName}"
                        title="${hasReviewed ? "Update your testimonial" : "Share a testimonial for this booking"}">
                        <i class="fa-solid ${hasReviewed ? "fa-pen-to-square" : "fa-star"}"></i>
                        <span>${hasReviewed ? "Edit Testimonial" : "Testimonial"}</span>
                    </button>
                </div>
            `;
            // Attach Cancel Click Handler
            const cancelBtn = item.querySelector(".btn-booking-cancel");
            cancelBtn?.addEventListener("click", () => {
                openCancelModal(b.id, destName, travelDate, `#${ref}`);
            });
            // Attach Testimonial Click Handler
            const testimonialBtn = item.querySelector(".btn-booking-testimonial");
            testimonialBtn?.addEventListener("click", () => {
                openTestimonialModal(b.id, destId, destName, existingReview);
            });
            bookingsList.appendChild(item);
        });
    }
    catch (error) {
        console.error("Error loading bookings:", error);
        bookingsList.innerHTML = `
            <div class="status-msg" style="color: #991b1b;">
                <p>Could not load bookings. Please make sure the server is running.</p>
                <p style="margin-top: 8px;">
                    <button type="button" class="tab-btn" id="btnRetryBookings" style="display:inline-flex; width:auto; border:1px solid #fecaca; margin:0 auto;">
                        <i class="fa-solid fa-rotate-right"></i> Retry
                    </button>
                </p>
            </div>
        `;
        document.getElementById("btnRetryBookings")?.addEventListener("click", () => {
            fetchMyBookings();
        });
    }
}
// Cancel Booking Modal Logic
function openCancelModal(bookingId, destName, travelDate, ref) {
    activeCancelBookingId = bookingId;
    activeCancelDestName = destName;
    if (cancelSummaryDest)
        cancelSummaryDest.textContent = destName;
    if (cancelSummaryDate)
        cancelSummaryDate.textContent = travelDate;
    if (cancelSummaryRef)
        cancelSummaryRef.textContent = ref;
    hideCancelAlert();
    if (btnConfirmCancelAction) {
        btnConfirmCancelAction.disabled = false;
        btnConfirmCancelAction.innerHTML = `<i class="fa-solid fa-ban"></i> <span>Yes, Cancel Booking</span>`;
    }
    cancelBookingModal?.classList.remove("hidden");
}
function closeCancelModal() {
    cancelBookingModal?.classList.add("hidden");
    activeCancelBookingId = null;
    hideCancelAlert();
}
function showCancelAlert(msg) {
    if (!cancelModalAlert)
        return;
    cancelModalAlert.textContent = msg;
    cancelModalAlert.className = "form-alert error";
    cancelModalAlert.classList.remove("hidden");
}
function hideCancelAlert() {
    if (!cancelModalAlert)
        return;
    cancelModalAlert.classList.add("hidden");
}
btnCloseCancelModal?.addEventListener("click", closeCancelModal);
btnDismissCancelModal?.addEventListener("click", closeCancelModal);
// Confirm Cancellation Request
btnConfirmCancelAction?.addEventListener("click", async () => {
    if (!activeCancelBookingId || !token)
        return;
    hideCancelAlert();
    btnConfirmCancelAction.disabled = true;
    btnConfirmCancelAction.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Cancelling...`;
    try {
        const response = await fetch(`http://localhost:3000/cancel-booking/${activeCancelBookingId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            showCancelAlert(data.message || "Failed to cancel booking. Please try again.");
            btnConfirmCancelAction.disabled = false;
            btnConfirmCancelAction.innerHTML = `<i class="fa-solid fa-ban"></i> <span>Yes, Cancel Booking</span>`;
            return;
        }
        closeCancelModal();
        showToast(`Booking for ${activeCancelDestName} was successfully cancelled.`);
        fetchMyBookings();
    }
    catch (err) {
        console.error("Cancel booking error:", err);
        showCancelAlert("Could not reach the server. Please verify your connection.");
        btnConfirmCancelAction.disabled = false;
        btnConfirmCancelAction.innerHTML = `<i class="fa-solid fa-ban"></i> <span>Yes, Cancel Booking</span>`;
    }
});
// Testimonial Modal Logic
function updateStarsDisplay(rating) {
    const starButtons = starRatingGroup?.querySelectorAll(".star-btn");
    starButtons?.forEach((btn) => {
        const val = Number(btn.getAttribute("data-rating")) || 0;
        if (val <= rating) {
            btn.classList.add("active");
            btn.innerHTML = `<i class="fa-solid fa-star"></i>`;
        }
        else {
            btn.classList.remove("active");
            btn.innerHTML = `<i class="fa-regular fa-star"></i>`;
        }
    });
    if (testimonialRatingValue) {
        testimonialRatingValue.value = String(rating);
    }
    if (ratingDescriptor) {
        ratingDescriptor.textContent = RATING_DESCRIPTIONS[rating] || `${rating}/5 Stars`;
    }
}
// Highlight stars up to hovered rating
function highlightStarsOnHover(hoverRating) {
    const starButtons = starRatingGroup?.querySelectorAll(".star-btn");
    starButtons?.forEach((btn) => {
        const val = Number(btn.getAttribute("data-rating")) || 0;
        if (val <= hoverRating) {
            btn.classList.add("hover");
            btn.innerHTML = `<i class="fa-solid fa-star"></i>`;
        }
        else {
            btn.classList.remove("hover");
            if (!btn.classList.contains("active")) {
                btn.innerHTML = `<i class="fa-regular fa-star"></i>`;
            }
        }
    });
}
function clearStarsHover() {
    const starButtons = starRatingGroup?.querySelectorAll(".star-btn");
    starButtons?.forEach((btn) => {
        btn.classList.remove("hover");
    });
    updateStarsDisplay(selectedRating);
}
// Star buttons event listeners
starRatingGroup?.querySelectorAll(".star-btn").forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
        const r = Number(btn.getAttribute("data-rating")) || 5;
        highlightStarsOnHover(r);
    });
    btn.addEventListener("click", () => {
        selectedRating = Number(btn.getAttribute("data-rating")) || 5;
        updateStarsDisplay(selectedRating);
    });
});
starRatingGroup?.addEventListener("mouseleave", () => {
    clearStarsHover();
});
// Live character counter for comment
testimonialComment?.addEventListener("input", () => {
    const length = testimonialComment.value.length;
    if (testimonialCharCount) {
        testimonialCharCount.textContent = `${length} / 500`;
    }
});
function showTestimonialAlert(msg, isSuccess = false) {
    if (!testimonialAlert)
        return;
    testimonialAlert.textContent = msg;
    testimonialAlert.className = `form-alert ${isSuccess ? "success" : "error"}`;
    testimonialAlert.classList.remove("hidden");
}
function hideTestimonialAlert() {
    if (!testimonialAlert)
        return;
    testimonialAlert.classList.add("hidden");
}
function openTestimonialModal(bookingId, destId, destName, existingReview) {
    activeTestimonialBookingId = bookingId;
    activeTestimonialIsEdit = !!existingReview;
    if (testimonialDestId)
        testimonialDestId.value = destId;
    if (testimonialDestName)
        testimonialDestName.textContent = destName;
    const modalTitle = document.getElementById("testimonialModalTitle");
    hideTestimonialAlert();
    if (existingReview) {
        if (modalTitle)
            modalTitle.textContent = "Edit Your Testimonial";
        selectedRating = Number(existingReview.ratings) || 5;
        if (testimonialComment)
            testimonialComment.value = existingReview.comment || "";
        if (btnSubmitTestimonial) {
            btnSubmitTestimonial.innerHTML = `<i class="fa-solid fa-check"></i> <span>Update Testimonial</span>`;
        }
    }
    else {
        if (modalTitle)
            modalTitle.textContent = "Share Your Experience";
        selectedRating = 5;
        if (testimonialComment)
            testimonialComment.value = "";
        if (btnSubmitTestimonial) {
            btnSubmitTestimonial.innerHTML = `<i class="fa-solid fa-paper-plane"></i> <span>Submit Testimonial</span>`;
        }
    }
    updateStarsDisplay(selectedRating);
    const length = testimonialComment?.value.length || 0;
    if (testimonialCharCount) {
        testimonialCharCount.textContent = `${length} / 500`;
    }
    if (btnSubmitTestimonial)
        btnSubmitTestimonial.disabled = false;
    testimonialModal?.classList.remove("hidden");
    testimonialComment?.focus();
}
function closeTestimonialModal() {
    activeTestimonialBookingId = null;
    activeTestimonialIsEdit = false;
    testimonialModal?.classList.add("hidden");
    hideTestimonialAlert();
}
btnCloseTestimonialModal?.addEventListener("click", closeTestimonialModal);
btnCancelTestimonial?.addEventListener("click", closeTestimonialModal);
// Testimonial Form Submit Handler
testimonialForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideTestimonialAlert();
    if (!activeTestimonialBookingId) {
        showTestimonialAlert("Booking reference is missing. Please select a booking.");
        return;
    }
    const comment = testimonialComment?.value.trim() || "";
    if (selectedRating < 1 || selectedRating > 5) {
        showTestimonialAlert("Please select a star rating between 1 and 5.");
        return;
    }
    if (!comment || comment.length < 5) {
        showTestimonialAlert("Please enter at least 5 characters for your testimonial.");
        return;
    }
    if (btnSubmitTestimonial) {
        btnSubmitTestimonial.disabled = true;
        btnSubmitTestimonial.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Submitting...`;
    }
    try {
        const response = await fetch("http://localhost:3000/testimonial", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                booking_id: activeTestimonialBookingId,
                ratings: selectedRating,
                comment: comment,
                is_edit: activeTestimonialIsEdit
            })
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            showTestimonialAlert(data.message || "Failed to submit testimonial. Please try again.");
            if (btnSubmitTestimonial) {
                btnSubmitTestimonial.disabled = false;
                btnSubmitTestimonial.innerHTML = activeTestimonialIsEdit
                    ? `<i class="fa-solid fa-check"></i> <span>Update Testimonial</span>`
                    : `<i class="fa-solid fa-paper-plane"></i> <span>Submit Testimonial</span>`;
            }
            return;
        }
        closeTestimonialModal();
        showToast(data.message || "Thank you! Your testimonial has been saved successfully.");
        await fetchMyBookings();
    }
    catch (err) {
        console.error("Testimonial submit error:", err);
        showTestimonialAlert("Unable to reach the server. Please try again.");
        if (btnSubmitTestimonial) {
            btnSubmitTestimonial.disabled = false;
            btnSubmitTestimonial.innerHTML = activeTestimonialIsEdit
                ? `<i class="fa-solid fa-check"></i> <span>Update Testimonial</span>`
                : `<i class="fa-solid fa-paper-plane"></i> <span>Submit Testimonial</span>`;
        }
    }
});
// Backdrop click and Escape key listeners for modals
window.addEventListener("click", (e) => {
    if (e.target === testimonialModal) {
        closeTestimonialModal();
    }
    if (e.target === cancelBookingModal) {
        closeCancelModal();
    }
});
window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        if (testimonialModal && !testimonialModal.classList.contains("hidden")) {
            closeTestimonialModal();
        }
        if (cancelBookingModal && !cancelBookingModal.classList.contains("hidden")) {
            closeCancelModal();
        }
    }
});
// ============================================================
// Password Change Handlers
// ============================================================
function showPasswordAlert(msg, isSuccess) {
    if (!passwordAlert)
        return;
    passwordAlert.textContent = msg;
    passwordAlert.className = `form-alert ${isSuccess ? "success" : "error"}`;
    passwordAlert.classList.remove("hidden");
}
function hidePasswordAlert() {
    if (!passwordAlert)
        return;
    passwordAlert.classList.add("hidden");
}
changePasswordForm?.addEventListener("submit", async (e) => {
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
    if ((newPassword.length < 8) || (!/[A-Z]/.test(newPassword)) || (!/[a-z]/.test(newPassword)) ||
        (!/[0-9]/.test(newPassword)) || (!/[!@#$%^&*]/.test(newPassword))) {
        showPasswordAlert("Password must contain 8+ characters, including uppercase, lowercase, a number, and a special character.", false);
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
        showToast("Password updated successfully!");
        changePasswordForm.reset();
    }
    catch (err) {
        console.error("Change password request error:", err);
        showPasswordAlert("Unable to reach the server. Please verify the server is running.", false);
    }
    finally {
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
