const searchForm = document.getElementById("search-form") as HTMLFormElement;
const destinationInput = document.getElementById("destination-input") as HTMLInputElement;
const btnSearch = document.getElementById("btnsearch") as HTMLButtonElement;
const status = document.getElementById("status") as HTMLElement;
const results = document.getElementById("results") as HTMLElement;

searchForm?.addEventListener("submit", function (event: Event) {
    event.preventDefault();
    const value = destinationInput.value.trim();

    if (value) {
        if (!(/^[A-Za-z]+$/).test(value)) {
            status.textContent = "Please enter a valid destination";
        } else {
            getData(value);
        }
    }
    else {
        status.textContent = "Please enter a valid destination";
    }

});

// Trending tags click handler
document.querySelectorAll<HTMLButtonElement>(".tag-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
        const place = btn.getAttribute("data-destination") || btn.textContent?.trim() || "";
        if (destinationInput) {
            destinationInput.value = place;
            getData(place);
        }
    });
});

function formatPrice(price: string | number | undefined | null): string {
    if (!price && price !== 0) return "";
    const cleanStr = String(price).trim();
    if (cleanStr.startsWith("$")) return cleanStr;
    const num = Number(cleanStr.replace(/[^0-9.]/g, ""));
    if (!isNaN(num) && num > 0) {
        return `$${num.toLocaleString()}`;
    }
    return `$${cleanStr}`;
}

function formatDays(days: string | number | undefined | null): string {
    if (!days && days !== 0) return "";
    const cleanStr = String(days).trim();
    if (/days?/i.test(cleanStr)) {
        return cleanStr.toLowerCase().includes("trip") ? cleanStr : `${cleanStr} Trip`;
    }
    return `${cleanStr} Days Trip`;
}

function parseNumericPrice(price: string | number | undefined | null): number {
    if (!price && price !== 0) return 0;
    const clean = String(price).replace(/[^0-9.]/g, "");
    const num = parseFloat(clean);
    return isNaN(num) ? 0 : num;
}

// Booking Modal Elements
const bookingModal = document.getElementById("booking-modal") as HTMLElement | null;
const modalCloseBtn = document.getElementById("modal-close-btn") as HTMLButtonElement | null;
const bookingForm = document.getElementById("booking-form") as HTMLFormElement | null;
const bookingSuccess = document.getElementById("booking-success") as HTMLElement | null;
const btnModalDone = document.getElementById("btn-modal-done") as HTMLButtonElement | null;
const modalDestTitle = document.getElementById("modal-dest-title") as HTMLElement | null;
const modalDestPrice = document.getElementById("modal-dest-price") as HTMLElement | null;
const modalDestDays = document.getElementById("modal-dest-days") as HTMLElement | null;
const modalTotalPrice = document.getElementById("modal-total-price") as HTMLElement | null;
const bookTravelerName = document.getElementById("book-traveler-name") as HTMLInputElement | null;
const bookTravelerEmail = document.getElementById("book-traveler-email") as HTMLInputElement | null;
const bookTravelDate = document.getElementById("book-travel-date") as HTMLInputElement | null;
const bookTravelersCount = document.getElementById("book-travelers-count") as HTMLInputElement | null;
const bookingSuccessMsg = document.getElementById("booking-success-message") as HTMLElement | null;
const btnconfirmbooking = document.getElementById("btn-confirm-booking") as HTMLButtonElement | null;

let currentUnitCost = 0;
let currentBookingDestination = "";
let currentBookingDestinationId: string | null = null;
let isBooking = false;

function updateModalTotal(): void {
    if (!modalTotalPrice) return;
    const count = parseInt(bookTravelersCount?.value || "1", 10) || 1;
    if (currentUnitCost > 0) {
        modalTotalPrice.textContent = `$${(currentUnitCost * count).toLocaleString()}`;
    } else {
        modalTotalPrice.textContent = "Custom Quote";
    }
}

bookTravelersCount?.addEventListener("input", updateModalTotal);

function openBookingModal(id: any, destName: string, price: any, days: any): void {
    if (!bookingModal) return;
    currentBookingDestinationId = id;
    currentBookingDestination = destName || "Destination";
    currentUnitCost = parseNumericPrice(price);

    if (modalDestTitle) modalDestTitle.textContent = `Book Trip to ${currentBookingDestination}`;
    if (modalDestPrice) modalDestPrice.textContent = formatPrice(price) || "Special Rate";
    if (modalDestDays) modalDestDays.innerHTML = `<i class="fa-solid fa-location-arrow"></i> ${formatDays(days) || "Flexible Duration"}`;

    if (bookTravelDate) {
        const today = new Date().toISOString().split("T")[0];
        bookTravelDate.min = today;
        if (!bookTravelDate.value) bookTravelDate.value = today;
    }

    if (bookTravelersCount) bookTravelersCount.value = "1";
    updateModalTotal();

    // Auto-fill traveler details from localStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
        try {
            const parsed = JSON.parse(savedUser);
            if (bookTravelerName && !bookTravelerName.value) {
                const fullName = `${parsed.firstname || ""} ${parsed.lastname || ""}`.trim();
                if (fullName) bookTravelerName.value = fullName;
            }
            if (bookTravelerEmail && !bookTravelerEmail.value && parsed.email) {
                bookTravelerEmail.value = parsed.email;
            }
        } catch { }
    }
    
    if (bookingForm) bookingForm.classList.remove("hidden");
    if (bookingSuccess) bookingSuccess.classList.add("hidden");
    bookingModal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
}

bookingForm?.addEventListener("submit", async (e: SubmitEvent) => {
    e.preventDefault();

    // Prevent duplicate submissions while a booking is processing.
    if (isBooking) return;

    const destiID = currentBookingDestinationId;
    const travelerName = bookTravelerName?.value.trim();
    const travelDate = bookTravelDate?.value;
    const travelPerson = Number(bookTravelersCount?.value);
    const travelCost = parseNumericPrice(
        modalTotalPrice?.textContent
    );

    if (
        !destiID ||
        !travelerName ||
        !travelDate ||
        !travelPerson ||
        !travelCost
    ) {
        return;
    }

    isBooking = true;

    if (btnconfirmbooking) {
        btnconfirmbooking.disabled = true;
    }

    try {
        await bookTrip(
            destiID,
            travelerName,
            travelDate,
            travelPerson,
            travelCost
        );
    } finally {
        isBooking = false;

        if (btnconfirmbooking) {
            btnconfirmbooking.disabled = false;
        }
    }
});

function closeBookingModal(): void {
    if (!bookingModal) return;
    bookingModal.classList.add("hidden");
    document.body.style.overflow = "";
}

modalCloseBtn?.addEventListener("click", closeBookingModal);
btnModalDone?.addEventListener("click", closeBookingModal);

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


async function getData(value: string): Promise<void> {
    status.textContent = `Searching for "${value}"...`;
    const api =
        `http://localhost:3000/api/destination?query=${encodeURIComponent(value)}`;

    try {
        const response = await fetch(api);

        if (!response.ok) {
            status.textContent = "Please enter a valid destination";
            results.innerHTML = "";

            const wikiInfo = document.getElementById("wiki-info") as HTMLElement;
            wikiInfo.innerHTML = "";

            return;
        }
        const data = await response.json();
        status.textContent = "";
        console.log(data.id);
        results.innerHTML = "";
        if (data.photos && data.photos.length > 0) {
            data.photos.forEach((photo: any) => {
                const img = document.createElement("img");
                img.src = photo.urls?.regular || photo.links?.download || "";
                img.alt = photo.alt_description || `${data.destination} photo`;
                img.loading = "lazy";
                results.appendChild(img);
            });
        }

        // Display Wikipedia information
        const wikiInfo = document.getElementById("wiki-info") as HTMLElement;
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
                openBookingModal(
                    data.id,
                    data.information?.title || data.destination,
                    data.price,
                    data.days
                );
            });
            actionsWrap.appendChild(bookBtn);

            wikiInfo.appendChild(actionsWrap);
        }

    } catch (error) {
        console.error("Error fetching photos:", error);
        status.textContent = `Could not load details for "${value}". Check your connection or backend server.`;
    }
}

const popularContainer = document.getElementById(
    "popular-destinations"
) as HTMLElement;

const popularPlaces = [
    "Bali",
    "Paris",
    "Tokyo",
    "Goa",
    "Maldives"
];

async function loadPopularDestinations(): Promise<void> {
    if (!popularContainer) return;
    popularContainer.textContent = "Loading destinations...";

    const requests = popularPlaces.map(async (place) => {
        const response = await fetch(
            `http://localhost:3000/api/destination?query=${encodeURIComponent(place)}`
        );

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
        bookBtn.addEventListener("click", (e: MouseEvent) => {
            e.stopPropagation(); // prevent triggering card search click
            openBookingModal(
                data.id,
                data.information?.title || data.destination,
                data.price,
                data.days
            );
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
async function bookTrip(id: any, name: string, date: string, totalPerson: number, totalCost: number): Promise<void> {
    const bookingDetails = {
        destinationid: id,
        name: name,
        date: date,
        totalPerson: totalPerson,
        totalCost: totalCost
    }

    const token = localStorage.getItem("token");

    if (!token) {
        console.error("Please log in before booking.");
        return;
    }
    try {
        const response = await fetch("http://localhost:3000/bookatrip", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(bookingDetails)
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "booking failed");
        }
    }
    catch (error) {
        console.error("Error during booking:", error);
    }
}

// Automatically load destinations when the page opens
loadPopularDestinations();


// pagination


export { };