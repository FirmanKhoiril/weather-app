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

const baseUrl = "https://geocoding-api.open-meteo.com/v1";
const baseUrlTwo = "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m&daily=weather_code"

const fetchWeather = async () => {
    try {
        const weather = await fetch(`${baseUrl}/search?name=Semarang&count=10&language=en&format=json`);
        const datas = await weather.json();
        const mappedResults = datas.results?.map(({ name, id, timezone,admin1, country_id, country, latitude, longitude, }) => {
            console.log(name, id, timezone,admin1, country_id, country, latitude, longitude);
            return { name, id, timezone,admin1, country_id, country, latitude, longitude };
        });
        // console.log(data)
        // return data;
    } catch (error) {
        console.log(error);
    }
}

fetchWeather();
