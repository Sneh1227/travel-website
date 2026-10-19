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
        console.log(data);
    }
    catch (error) {
        console.error("Error fetching photos:", error);
    }
}
export {};
