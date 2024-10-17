const realTimeDate = document.getElementById("realTimeDate");
const searchInputLocation = document.getElementById("search-location");
const clearInputBtn = document.getElementById("clearSearchLocationButton")

function getCurrentDate(date) {
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    if (date !== "") {
        const dates = new Date(date);

        const dayName = dates.toLocaleDateString('en-US', { weekday: 'long' });

        return dayName;   
    }
    const dates = new Date();
    const formatEn = dates.toLocaleDateString('en-US', options);
    return formatEn;
}

realTimeDate.innerText = getCurrentDate("")

function showClearButton() {
    if (searchInputLocation.value.length !== 0) {
        clearInputBtn.style.display = "flex";
    } else {
        clearInputBtn.style.display = "none";
    }
}

searchInputLocation.addEventListener('input', showClearButton);

function clearInputValue () {
    searchInputLocation.value = '';
    showClearButton();
}
clearInputBtn.addEventListener('click', clearInputValue);

const baseUrl = "https://geocoding-api.open-meteo.com/v1";
const baseUrlTwo = "https://api.open-meteo.com/v1"

const fetchWeather = async (location) => {
    try {
        const weather = await fetch(`${baseUrl}/search?name=${location}&count=10&language=en&format=json`);
        const dataJson = await weather.json();
        console.log(dataJson)
        if (dataJson.results && dataJson.results.length > 0) {
            const { latitude, longitude } = dataJson.results[0];
            return { latitude, longitude };
        } else {
            console.log("Location not found");
        }
    } catch (error) {
        console.log(error);
    }
}

document.getElementById("form-submit").addEventListener("submit", async function (e) {
    e.preventDefault()
    const location =  searchInputLocation.value
    // to new page and display all the data
})

const fetchingHomePage = async () => {
    fetchWeather(location)
    const weather = await fetchWeather("Semarang");
    if (weather) fetchForecast(weather?.latitude, weather?.longitude);
}

fetchingHomePage()

const fetchForecast = async (latitude, longitude) => {

    const weatherCodeIcons = {
        0: "./images/icons/clear-day.svg",
        1: "./images/icons/cloudy.svg",
        2: "./images/icons/partly-cloudy-day.svg",
        3: "./images/icons/cloudy.svg",
        45: "./images/icons/fog.svg",
        48: "./images/icons/fog.svg",
        51: "./images/icons/drizzle.svg",
        53: "./images/icons/drizzle.svg",
        55: "./images/icons/drizzle.svg",
        80: "./images/icons/rain.svg",
        81: "./images/icons/partly-cloudy-day-rain.svg",
        82: "./images/icons/partly-cloudy-day-rain.svg",
        85: "./images/icons/snow.svg",
        85: "./images/icons/snow.svg",
        86: "./images/icons/sleet.svg",
        95: "./images/icons/thunderstorms.svg", 
        96: "./images/icons/thunderstorms.svg", 
        97: "./images/icons/thunderstorms.svg", 
        98: "./images/icons/thunderstorms.svg", 
        99: "./images/icons/rain.svg" 
    };
    
    try {
        const weather = await fetch(`${baseUrlTwo}/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,rain_sum,wind_speed_10m_max`);
        const dataJson = await weather.json();
        console.log(dataJson);

        const dates = dataJson.daily.time
        dates.forEach((date, index) => {
            if (index > 0) {
                const weatherCode = dataJson.daily.weather_code[index];
                const weatherIcon = weatherCodeIcons[weatherCode] || "./images/icons/clear-day.svg";

                document.getElementById("card-container").innerHTML += `
                    <div class="bg-white/20 rounded-lg p-2 gap-3 h-[240px] w-[200px] shadow-lg items-center flex flex-col daily-weather">
                        <img src="${weatherIcon}" width="50" height="50" alt="Clear day">
                        <p class="text-lg font-semibold font-montserrat">${getCurrentDate(date)}</p>
                      
                    </div>
                `;
            }
        })
    } catch (error) {
        console.log(error);
    }
}

fetchForecast()


// <div class="flex gap-2 items-center justify-center flex-wrap">
// <div class="w-[170px] relative bg-white/20 flex items-center gap-1 p-2 rounded-lg">
//     <img src="./images/icons/umbrella.svg" alt="humidity icon" width="40" height="40" class="absolute top-[-2px] left-[-2px]">
//     <p class="font-montserrat pl-7">${dataJson.daily.precipitation_sum[index]}%</p>
// </div>  
// <div class="w-[80px] bg-white/20 p-2 rounded-lg">
// ${dataJson.daily.precipitation_sum[index]}
// </div>
// <div class="w-[80px] bg-white/20 p-2 rounded-lg">
// ${dataJson.daily.wind_speed_10m_max[index]}
// </div>
// </div>