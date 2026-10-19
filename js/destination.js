const searchForm = document.getElementById("search-form");
const destinationInput = document.getElementById("destination-input");
const btnSearch = document.getElementById("btnsearch");
const status = document.getElementById("status");
const results = document.getElementById("results");

searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const value = destinationInput.value.trim();
    if (value) {
        getData(value);
    }
    else {
        status.textContent = "Please enter a valid destination";
    }
});

// Trending Quick Tags Listener
document.querySelectorAll(".tag-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
        const place = btn.getAttribute("data-place");
        if (place) {
            destinationInput.value = place;
            getData(place);
        }
    });
});

async function getData(value) {
    status.textContent = `Searching for "${value}"...`;
    const api = `http://localhost:8000/api/destination?query=${encodeURIComponent(value)}`;
    try {
        const response = await fetch(api);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || "Destination not found or request failed");
        }
        
        status.textContent = "";
        console.log("Destination:", data.destination);
        console.log("Photos:", data.photos);
        console.log("Wikipedia information:", data.information);
        
        results.innerHTML = "";
        if (data.photos && data.photos.length > 0) {
            data.photos.forEach((photo) => {
                const img = document.createElement("img");
                img.src = photo.urls?.regular || photo.links?.download;
                img.alt = photo.alt_description || data.destination || "Destination photo";
                img.loading = "lazy";
                results.appendChild(img);
            });
        }

        // Display Wikipedia information
        const wikiInfo = document.getElementById("wiki-info");
        wikiInfo.innerHTML = "";
        
        if (data.information) {
            const title = document.createElement("h2");
            title.textContent = data.information.title || data.destination;
            
            const description = document.createElement("p");
            description.textContent = data.information.description || "No detailed summary available.";
            
            wikiInfo.append(title, description);
            
            if (data.information.url) {
                const link = document.createElement("a");
                link.href = data.information.url;
                link.textContent = "Read more on Wikipedia";
                link.target = "_blank";
                link.rel = "noopener noreferrer";
                wikiInfo.appendChild(link);
            }
        }

        // Smoothly scroll to results section
        results.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
    catch (error) {
        console.error("Error fetching destination data:", error);
        status.textContent = error.message || "Failed to fetch destination data. Please try again.";
    }
}

const popularContainer = document.getElementById("popular-destinations");
const popularPlaces = [
    "Bali",
    "Paris",
    "Tokyo",
    "Dubai",
    "Goa"
];

async function loadPopularDestinations() {
    popularContainer.textContent = "Loading popular destinations...";
    const requests = popularPlaces.map(async (place) => {
        const response = await fetch(`http://localhost:8000/api/destination?query=${encodeURIComponent(place)}`);
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
        card.setAttribute("title", `Click to view more about ${data.destination}`);
        
        const image = document.createElement("img");
        image.src = data.photos?.[0]?.urls?.regular || "";
        image.alt = data.destination;
        image.loading = "lazy";
        
        const title = document.createElement("h3");
        title.textContent = data.information?.title || data.destination;
        
        const description = document.createElement("p");
        description.textContent =
            data.information?.description || "Discover this destination.";
            
        card.append(image, title, description);
        
        // Clicking card auto-searches this destination
        card.addEventListener("click", () => {
            destinationInput.value = data.destination;
            getData(data.destination);
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
