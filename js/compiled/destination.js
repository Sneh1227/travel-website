const searchForm = document.getElementById("search-form");
const destinationInput = document.getElementById("destination-input");
const btnSearch = document.getElementById("btnsearch");
const status = document.getElementById("status");
const results = document.getElementById("results");
searchForm?.addEventListener("submit", function (event) {
    event.preventDefault();
    const value = destinationInput.value.trim();
    if (value) {
        if (!(/^[A-Za-z]+$/).test(value)) {
            status.textContent = "Please enter a valid destination";
        }
        else {
            getData(value);
        }
    }
    else {
        status.textContent = "Please enter a valid destination";
    }
});
// Trending tags click handler
document.querySelectorAll(".tag-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
        const place = btn.getAttribute("data-destination") || btn.textContent?.trim() || "";
        if (destinationInput) {
            destinationInput.value = place;
            getData(place);
        }
    });
});
function formatPrice(price) {
    if (!price && price !== 0)
        return "";
    const cleanStr = String(price).trim();
    if (cleanStr.startsWith("$"))
        return cleanStr;
    const num = Number(cleanStr.replace(/[^0-9.]/g, ""));
    if (!isNaN(num) && num > 0) {
        return `$${num.toLocaleString()}`;
    }
    return `$${cleanStr}`;
}
function formatDays(days) {
    if (!days && days !== 0)
        return "";
    const cleanStr = String(days).trim();
    if (/days?/i.test(cleanStr)) {
        return cleanStr.toLowerCase().includes("trip") ? cleanStr : `${cleanStr} Trip`;
    }
    return `${cleanStr} Days Trip`;
}
function parseNumericPrice(price) {
    if (!price && price !== 0)
        return 0;
    const clean = String(price).replace(/[^0-9.]/g, "");
    const num = parseFloat(clean);
    return isNaN(num) ? 0 : num;
}
// Booking Modal Elements
const bookingModal = document.getElementById("booking-modal");
const modalCloseBtn = document.getElementById("modal-close-btn");
const modalHeader = document.getElementById("modal-header");
const bookingForm = document.getElementById("booking-form");
const bookingSuccess = document.getElementById("booking-success");
const btnModalDone = document.getElementById("btn-modal-done");
const btnModalPrint = document.getElementById("btn-modal-print");
const btnModalExplore = document.getElementById("btn-modal-view-bookings");
const modalDestTitle = document.getElementById("modal-dest-title");
const modalDestPrice = document.getElementById("modal-dest-price");
const modalDestDays = document.getElementById("modal-dest-days");
const modalTotalPrice = document.getElementById("modal-total-price");
const bookTravelerName = document.getElementById("book-traveler-name");
const bookTravelerEmail = document.getElementById("book-traveler-email");
const bookTravelDate = document.getElementById("book-travel-date");
const bookTravelersCount = document.getElementById("book-travelers-count");
const bookingSuccessMsg = document.getElementById("booking-success-message");
const btnconfirmbooking = document.getElementById("btn-confirm-booking");
// Modal Inline Alert Elements
const bookingAlert = document.getElementById("booking-alert");
const bookingAlertText = document.getElementById("booking-alert-text");
const bookingAlertLink = document.getElementById("booking-alert-link");
// Receipt Card Elements
const receiptDestName = document.getElementById("receipt-dest-name");
const receiptTravelerName = document.getElementById("receipt-traveler-name");
const receiptTravelDate = document.getElementById("receipt-travel-date");
const receiptTravelersCount = document.getElementById("receipt-travelers-count");
const receiptBookingId = document.getElementById("receipt-booking-id");
const receiptTotalCost = document.getElementById("receipt-total-cost");
// Toast Elements
const bookingToast = document.getElementById("booking-toast");
const toastMessage = document.getElementById("toast-message");
const toastDismiss = document.getElementById("toast-dismiss");
let toastTimeout = null;
function showToast(message) {
    if (!bookingToast || !toastMessage)
        return;
    toastMessage.textContent = message;
    bookingToast.classList.remove("hidden", "toast-hiding");
    if (toastTimeout)
        clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        hideToast();
    }, 4500);
}
function hideToast() {
    if (!bookingToast || bookingToast.classList.contains("hidden"))
        return;
    bookingToast.classList.add("toast-hiding");
    setTimeout(() => {
        bookingToast.classList.add("hidden");
        bookingToast.classList.remove("toast-hiding");
    }, 300);
}
toastDismiss?.addEventListener("click", hideToast);
function showBookingAlert(message, isWarning = false, showLoginLink = false) {
    if (!bookingAlert || !bookingAlertText)
        return;
    bookingAlertText.textContent = message;
    if (isWarning) {
        bookingAlert.classList.add("warning");
    }
    else {
        bookingAlert.classList.remove("warning");
    }
    if (bookingAlertLink) {
        if (showLoginLink) {
            bookingAlertLink.classList.remove("hidden");
        }
        else {
            bookingAlertLink.classList.add("hidden");
        }
    }
    bookingAlert.classList.remove("hidden");
}
function hideBookingAlert() {
    if (!bookingAlert)
        return;
    bookingAlert.classList.add("hidden");
}
function formatDateForReceipt(dateStr) {
    if (!dateStr)
        return "-";
    try {
        const parts = dateStr.split("-");
        if (parts.length === 3) {
            const dateObj = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
            if (!isNaN(dateObj.getTime())) {
                return dateObj.toLocaleDateString("en-US", {
                    weekday: "short",
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
function showBookingSuccessUI(details) {
    hideBookingAlert();
    // Fill in receipt fields
    if (receiptDestName)
        receiptDestName.textContent = details.destination;
    if (receiptTravelerName)
        receiptTravelerName.textContent = details.traveler;
    if (receiptTravelDate)
        receiptTravelDate.textContent = formatDateForReceipt(details.date);
    if (receiptTravelersCount) {
        receiptTravelersCount.textContent = `${details.travelers} Traveler${details.travelers > 1 ? "s" : ""}`;
    }
    const cleanId = details.bookingId
        ? (details.bookingId.length > 8 ? details.bookingId.slice(0, 8).toUpperCase() : details.bookingId.toUpperCase())
        : `BK-${Math.floor(100000 + Math.random() * 900000)}`;
    if (receiptBookingId)
        receiptBookingId.textContent = `#${cleanId}`;
    if (receiptTotalCost)
        receiptTotalCost.textContent = `$${details.cost.toLocaleString()}`;
    // Switch view from form to success
    if (modalHeader)
        modalHeader.classList.add("hidden");
    if (bookingForm)
        bookingForm.classList.add("hidden");
    if (bookingSuccess)
        bookingSuccess.classList.remove("hidden");
    // Celebratory toast
    showToast(`Booking Done! Your trip to ${details.destination} is confirmed.`);
}
let currentUnitCost = 0;
let currentBookingDestination = "";
let currentBookingDestinationId = null;
let isBooking = false;
function updateModalTotal() {
    if (!modalTotalPrice)
        return;
    const count = parseInt(bookTravelersCount?.value || "1", 10) || 1;
    if (currentUnitCost > 0) {
        modalTotalPrice.textContent = `$${(currentUnitCost * count).toLocaleString()}`;
    }
    else {
        modalTotalPrice.textContent = "Custom Quote";
    }
}
bookTravelersCount?.addEventListener("input", updateModalTotal);
function openBookingModal(id, destName, price, days) {
    if (!bookingModal)
        return;
    currentBookingDestinationId = id;
    currentBookingDestination = destName || "Destination";
    currentUnitCost = parseNumericPrice(price);
    hideBookingAlert();
    // Reset view to form
    if (modalHeader)
        modalHeader.classList.remove("hidden");
    if (bookingForm)
        bookingForm.classList.remove("hidden");
    if (bookingSuccess)
        bookingSuccess.classList.add("hidden");
    if (modalDestTitle)
        modalDestTitle.textContent = `Book Trip to ${currentBookingDestination}`;
    if (modalDestPrice)
        modalDestPrice.textContent = formatPrice(price) || "Special Rate";
    if (modalDestDays)
        modalDestDays.innerHTML = `<i class="fa-solid fa-location-arrow"></i> ${formatDays(days) || "Flexible Duration"}`;
    if (bookTravelDate) {
        const today = new Date().toISOString().split("T")[0];
        bookTravelDate.min = today;
        if (!bookTravelDate.value)
            bookTravelDate.value = today;
    }
    if (bookTravelersCount)
        bookTravelersCount.value = "1";
    updateModalTotal();
    // Auto-fill traveler details from localStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
        try {
            const parsed = JSON.parse(savedUser);
            if (bookTravelerName && !bookTravelerName.value) {
                const fullName = `${parsed.firstname || ""} ${parsed.lastname || ""}`.trim();
                if (fullName)
                    bookTravelerName.value = fullName;
            }
            if (bookTravelerEmail && !bookTravelerEmail.value && parsed.email) {
                bookTravelerEmail.value = parsed.email;
            }
        }
        catch { }
    }
    const token = localStorage.getItem("token");
    if (!token) {
        showBookingAlert("You need to be logged in to confirm a booking.", true, true);
    }
    bookingModal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
}
bookingForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    // Prevent duplicate submissions while a booking is processing.
    if (isBooking)
        return;
    hideBookingAlert();
    const token = localStorage.getItem("token");
    if (!token) {
        showBookingAlert("Please log in before confirming your booking.", true, true);
        return;
    }
    const destiID = currentBookingDestinationId;
    const travelerName = bookTravelerName?.value.trim();
    const travelDate = bookTravelDate?.value;
    const travelPerson = Number(bookTravelersCount?.value);
    const travelCost = parseNumericPrice(modalTotalPrice?.textContent);
    if (!destiID ||
        !travelerName ||
        !travelDate ||
        !travelPerson ||
        !travelCost) {
        showBookingAlert("Please fill in all booking fields before submitting.", true);
        return;
    }
    isBooking = true;
    if (btnconfirmbooking) {
        btnconfirmbooking.disabled = true;
        btnconfirmbooking.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>Confirming...</span>`;
    }
    try {
        const result = await bookTrip(destiID, travelerName, travelDate, travelPerson, travelCost);
        if (result && result.success) {
            showBookingSuccessUI({
                destination: currentBookingDestination,
                traveler: travelerName,
                date: travelDate,
                travelers: travelPerson,
                cost: travelCost,
                bookingId: result.bookingId
            });
        }
    }
    finally {
        isBooking = false;
        if (btnconfirmbooking) {
            btnconfirmbooking.disabled = false;
            btnconfirmbooking.innerHTML = `<span>Confirm Booking</span> <i class="fa-solid fa-check"></i>`;
        }
    }
});
function closeBookingModal() {
    if (!bookingModal)
        return;
    bookingModal.classList.add("hidden");
    document.body.style.overflow = "";
    // Reset views and fields for subsequent bookings
    if (modalHeader)
        modalHeader.classList.remove("hidden");
    if (bookingForm) {
        bookingForm.reset();
        bookingForm.classList.remove("hidden");
    }
    if (bookingSuccess)
        bookingSuccess.classList.add("hidden");
    hideBookingAlert();
}
modalCloseBtn?.addEventListener("click", closeBookingModal);
btnModalDone?.addEventListener("click", closeBookingModal);
btnModalExplore?.addEventListener("click", () => {
    closeBookingModal();
});
btnModalPrint?.addEventListener("click", () => {
    window.print();
});
bookingModal?.addEventListener("click", (e) => {
    if (e.target === bookingModal) {
        closeBookingModal();
    }
});
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && bookingModal && !bookingModal.classList.contains("hidden")) {
        closeBookingModal();
    }
});
async function getData(value) {
    status.textContent = `Searching for "${value}"...`;
    const api = `https://travel-website-mkqj.onrender.com/api/destination?query=${encodeURIComponent(value)}`;
    try {
        const response = await fetch(api);
        if (!response.ok) {
            status.textContent = "Please enter a valid destination";
            results.innerHTML = "";
            const wikiInfo = document.getElementById("wiki-info");
            wikiInfo.innerHTML = "";
            return;
        }
        const data = await response.json();
        status.textContent = "";
        console.log(data.id);
        results.innerHTML = "";
        if (data.photos && data.photos.length > 0) {
            data.photos.forEach((photo) => {
                const img = document.createElement("img");
                img.src = photo.urls?.regular || photo.links?.download || "";
                img.alt = photo.alt_description || `${data.destination} photo`;
                img.loading = "lazy";
                results.appendChild(img);
            });
        }
        // Display Wikipedia information
        const wikiInfo = document.getElementById("wiki-info");
        wikiInfo.innerHTML = "";
        if (data.information && (data.information.title || data.information.description)) {
            const title = document.createElement("h2");
            title.textContent = data.information.title || data.destination;
            wikiInfo.appendChild(title);
            // Display Days and Price meta pills if available
            if (data.price || data.days) {
                const metaBar = document.createElement("div");
                metaBar.className = "wiki-meta-bar";
                if (data.price) {
                    const priceBadge = document.createElement("div");
                    priceBadge.className = "wiki-meta-item wiki-meta-price";
                    priceBadge.innerHTML = `<i class="fa-solid fa-tag" aria-hidden="true"></i><span>From <strong>${formatPrice(data.price)}</strong> / person</span>`;
                    metaBar.appendChild(priceBadge);
                }
                if (data.days) {
                    const daysBadge = document.createElement("div");
                    daysBadge.className = "wiki-meta-item wiki-meta-days";
                    daysBadge.innerHTML = `<i class="fa-solid fa-location-arrow" aria-hidden="true"></i><span><strong>${formatDays(data.days)}</strong></span>`;
                    metaBar.appendChild(daysBadge);
                }
                wikiInfo.appendChild(metaBar);
            }
            const description = document.createElement("p");
            description.textContent = data.information.description || "No description available.";
            wikiInfo.appendChild(description);
            const actionsWrap = document.createElement("div");
            actionsWrap.className = "wiki-actions";
            if (data.information.url) {
                const link = document.createElement("a");
                link.href = data.information.url;
                link.className = "btn-wiki-read";
                link.innerHTML = `<i class="fa-brands fa-wikipedia-w"></i> <span>Read more on Wikipedia</span>`;
                link.target = "_blank";
                link.rel = "noopener noreferrer";
                actionsWrap.appendChild(link);
            }
            const bookBtn = document.createElement("button");
            bookBtn.type = "button";
            bookBtn.className = "btn-wiki-book";
            bookBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> <span>Book This Trip</span>`;
            bookBtn.addEventListener("click", () => {
                openBookingModal(data.id, data.information?.title || data.destination, data.price, data.days);
            });
            actionsWrap.appendChild(bookBtn);
            wikiInfo.appendChild(actionsWrap);
        }
    }
    catch (error) {
        console.error("Error fetching photos:", error);
        status.textContent = `Could not load details for "${value}". Check your connection or backend server.`;
    }
}
const popularContainer = document.getElementById("popular-destinations");
const popularPlaces = [
    "Bali",
    "Paris",
    "Tokyo",
    "Goa",
    "Maldives"
];
async function loadPopularDestinations() {
    if (!popularContainer)
        return;
    popularContainer.textContent = "Loading destinations...";
    const requests = popularPlaces.map(async (place) => {
        const response = await fetch(`https://travel-website-mkqj.onrender.com/api/destination?query=${encodeURIComponent(place)}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${place}`);
        }
        return response.json();
    });
    const outcomes = await Promise.allSettled(requests);
    popularContainer.innerHTML = "";
    outcomes.forEach((outcome) => {
        if (outcome.status === "rejected") {
            console.error("Could not load a destination:", outcome.reason);
            return;
        }
        const data = outcome.value;
        const card = document.createElement("article");
        card.className = "destination-card";
        card.setAttribute("title", `Click to explore ${data.destination}`);
        // Media container with image and floating days badge
        const mediaWrap = document.createElement("div");
        mediaWrap.className = "destination-card-media";
        const image = document.createElement("img");
        image.src = data.photos?.[0]?.urls?.regular || "";
        image.alt = data.destination;
        image.loading = "lazy";
        mediaWrap.appendChild(image);
        if (data.days) {
            const daysBadge = document.createElement("span");
            daysBadge.className = "destination-card-badge";
            daysBadge.innerHTML = `<i class="fa-solid fa-location-arrow" aria-hidden="true"></i> ${formatDays(data.days)}`;
            mediaWrap.appendChild(daysBadge);
        }
        // Card body container
        const body = document.createElement("div");
        body.className = "destination-card-body";
        // Header: Title and Price
        const header = document.createElement("div");
        header.className = "destination-card-header";
        const title = document.createElement("h3");
        title.className = "destination-card-title";
        title.textContent = data.information?.title || data.destination;
        header.appendChild(title);
        if (data.price) {
            const price = document.createElement("span");
            price.className = "destination-card-price";
            price.textContent = formatPrice(data.price);
            header.appendChild(price);
        }
        body.appendChild(header);
        // Trip duration row
        if (data.days) {
            const tripRow = document.createElement("div");
            tripRow.className = "destination-card-trip";
            tripRow.innerHTML = `<i class="fa-solid fa-location-arrow" aria-hidden="true"></i><span>${formatDays(data.days)}</span>`;
            body.appendChild(tripRow);
        }
        const description = document.createElement("p");
        description.className = "destination-card-desc";
        description.textContent =
            data.information?.description || "Discover this breathtaking destination.";
        body.appendChild(description);
        // Card footer with Book Now button
        const footer = document.createElement("div");
        footer.className = "destination-card-footer";
        const bookBtn = document.createElement("button");
        bookBtn.type = "button";
        bookBtn.className = "btn-book-destination";
        bookBtn.innerHTML = `<span>Book Now</span><i class="fa-solid fa-arrow-right" aria-hidden="true"></i>`;
        bookBtn.setAttribute("aria-label", `Book trip to ${data.destination}`);
        bookBtn.addEventListener("click", (e) => {
            e.stopPropagation(); // prevent triggering card search click
            openBookingModal(data.id, data.information?.title || data.destination, data.price, data.days);
        });
        footer.appendChild(bookBtn);
        body.appendChild(footer);
        card.append(mediaWrap, body);
        // Interactive click on destination card to search
        card.addEventListener("click", () => {
            if (destinationInput) {
                destinationInput.value = data.destination;
                window.scrollTo({ top: 120, behavior: "smooth" });
                getData(data.destination);
            }
        });
        popularContainer.appendChild(card);
    });
    if (popularContainer.children.length === 0) {
        popularContainer.textContent =
            "Popular destinations could not be loaded. Please ensure the server is running.";
    }
}
// booking function to book a trip
async function bookTrip(id, name, date, totalPerson, totalCost) {
    const bookingDetails = {
        destinationid: id,
        name: name,
        date: date,
        totalPerson: totalPerson,
        totalCost: totalCost
    };
    const token = localStorage.getItem("token");
    if (!token) {
        showBookingAlert("Please log in before completing your booking.", true, true);
        return { success: false, message: "Please log in first" };
    }
    try {
        const response = await fetch("https://travel-website-mkqj.onrender.com/bookatrip", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(bookingDetails)
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            const errMsg = data.message || "Booking failed. Please try again.";
            showBookingAlert(errMsg, false);
            return { success: false, message: errMsg };
        }
        return {
            success: true,
            bookingId: data.bookingId || data.id,
            message: data.message || "Booking successful"
        };
    }
    catch (error) {
        console.error("Error during booking:", error);
        const errMsg = "Unable to connect to the booking server. Please verify the server is running.";
        showBookingAlert(errMsg, false);
        return { success: false, message: errMsg };
    }
}
// Automatically load destinations when the page opens
loadPopularDestinations();
export {};
