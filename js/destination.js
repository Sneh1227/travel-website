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
