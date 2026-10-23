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
        console.log(data.price);
        console.log(data.days);
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

            if (data.information.url) {
                const link = document.createElement("a");
                link.href = data.information.url;
                link.textContent = "Read more on Wikipedia";
                link.target = "_blank";
                link.rel = "noopener noreferrer";
                wikiInfo.appendChild(link);
            }
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
        console.log(data.price);
        console.log(data.days);
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

// Automatically load destinations when the page opens
loadPopularDestinations();


// pagination


export { };