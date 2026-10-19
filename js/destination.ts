const searchForm = document.getElementById("search-form") as HTMLFormElement;

const destinationInput = document.getElementById("destination-input") as HTMLInputElement;
const btnSearch = document.getElementById("btnsearch") as HTMLButtonElement;

const status = document.getElementById("status") as HTMLElement;
const results = document.getElementById("results") as HTMLElement;


searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const value = destinationInput.value;
    if (value) {
        getData(value);
    } else {
        status.textContent = "Please enter a valid destination";
    }
});

async function getData(value: string) {
    const api =
        `http://localhost:8000/api/destination?query=${encodeURIComponent(value)}`;

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
        data.photos.forEach((photo: any) => {
            const img = document.createElement("img");
            img.src = photo.links.download;
            img.alt = "Image not found"
            results.appendChild(img);
            console.log(photo);
        });

        // Display Wikipedia information
        const wikiInfo = document.getElementById("wiki-info")!;
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

    } catch (error) {
        console.error("Error fetching photos:", error);
    }
}


export { };