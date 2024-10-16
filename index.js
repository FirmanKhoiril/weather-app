const realTimeDate = document.getElementById("realTimeDate");
const searchInputLocation = document.getElementById("search-location");
const clearInputBtn = document.getElementById("clearSearchLocationButton")

function getCurrentDate() {
    const date = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };

    return date.toLocaleDateString('en-US', options);
}

realTimeDate.innerText = getCurrentDate();

function toggleClearButton() {
    if (searchInputLocation.value.length !== 0) {
        clearInputBtn.style.display = "flex";
    } else {
        clearInputBtn.style.display = "none";
    }
}

searchInputLocation.addEventListener('input', toggleClearButton);

toggleClearButton();

clearInputBtn.addEventListener('click', function() {
    searchInputLocation.value = '';
    toggleClearButton();
});