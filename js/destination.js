const searchForm = document.getElementById("search-form");
const destinationInput = document.getElementById("destination-input");
const btnSearch = document.getElementById("btnsearch");
const status = document.getElementById("status");
const results = document.getElementById("results");
searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const value = destinationInput.value;
    if (value) {
        console.log(value);
    }
    else {
        status.textContent = "Please enter a valid destination";
    }
});
