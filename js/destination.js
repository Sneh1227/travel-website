const searchForm = document.getElementById("search-form");
const destinationInput = document.getElementById("destination-input");
const btnSearch = document.getElementById("btnsearch");
const status = document.getElementById("status");
const results = document.getElementById("results");
searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const value = destinationInput.value;
    if (value) {
        getData(value);
    }
    else {
        status.textContent = "Please enter a valid destination";
    }
});
async function getData(value) {
    const api = `http://localhost:8000/api/destination?query=${encodeURIComponent(value)}`;
    try {
        const response = await fetch(api);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || "Request failed");
        }
        console.log("Destination:", data.destination);
        console.log("Photos:", data.photos);
        console.log("Wikipedia information:", data.information);
        // console.log("likes", data.likes);
        results.innerHTML = "";
        data.photos.forEach((photo) => {
            const img = document.createElement("img");
            img.src = photo.links.download;
            img.alt = "Image not found";
            results.appendChild(img);
            console.log(photo);
        });
        // Display Wikipedia information
        const wikiInfo = document.getElementById("wiki-info");
        wikiInfo.innerHTML = "";
        const title = document.createElement("h2");
        title.textContent = data.information.title;
        const description = document.createElement("p");
        description.textContent = data.information.description;
        wikiInfo.append(title, description);
        if (data.information.url) {
            const link = document.createElement("a");
            // link.href = data.information.url;
            link.textContent = "Read more on Wikipedia";
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            wikiInfo.appendChild(link);
        }
    }
    catch (error) {
        console.error("Error fetching photos:", error);
    }
}
const popularContainer = document.getElementById("popular-destinations");
const popularPlaces = [
    "Bali",
    "Paris",
    "Tokyo",
    "Dubai",
    "Goa",
    "Las vegas",
    "Mumbai",
    "Istanbul",
];
async function loadPopularDestinations() {
    popularContainer.textContent = "Loading destinations...";
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
        popularContainer.appendChild(card);
    });
    if (popularContainer.children.length === 0) {
        popularContainer.textContent =
            "Destinations could not be loaded. Please try again.";
    }
}
// Automatically load destinations when the page opens
loadPopularDestinations();

