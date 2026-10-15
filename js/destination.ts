const searchForm = document.getElementById("search-form") as HTMLFormElement;

const destinationInput = document.getElementById("destination-input") as HTMLInputElement;
const btnSearch = document.getElementById("btnsearch") as HTMLButtonElement;

const status = document.getElementById("status") as HTMLElement;
const results = document.getElementById("results") as HTMLElement;


searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const value = destinationInput.value;
    if (value) {
        console.log(value);
    } else {
        status.textContent = "Please enter a valid destination";
    }
});


export { };