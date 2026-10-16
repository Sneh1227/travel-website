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

        console.log(data);
    } catch (error) {
        console.error("Error fetching photos:", error);
    }
}


export { };