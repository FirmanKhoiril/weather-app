const realTimeDate = document.getElementById("realTimeDate");
const searchInputLocation = document.getElementById("search-location");
const clearInputBtn = document.getElementById("clearSearchLocationButton")
const loading = document.getElementById("loading")

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
    fetchWeather(location)
    const weather = await fetchWeather("Semarang");
    if (weather) fetchForecast(weather?.latitude, weather?.longitude);
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
        1: "./images/icons/clear-day.svg",             
        2: "./images/icons/partly-cloudy-day.svg", 
        3: "./images/icons/partly-cloudy-day.svg",        
        45: "./images/icons/fog.svg",                
        48: "./images/icons/fog.svg",          
        51: "./images/icons/drizzle.svg",           
        53: "./images/icons/drizzle.svg",               
        55: "./images/icons/drizzle.svg",          
        80: "./images/icons/rain.svg",                
        81: "./images/icons/partly-cloudy-day-rain.svg",
        82: "./images/icons/partly-cloudy-day-rain.svg",
        85: "./images/icons/snow.svg",                  
        86: "./images/icons/sleet.svg",
        95: "./images/icons/thunderstorms.svg",        
        96: "./images/icons/thunderstorms.svg",       
        97: "./images/icons/thunderstorms.svg",       
        99: "./images/icons/rain.svg"   
    };
    
    loading.classList.remove("hidden");
    loading.classList.add("flex")
    try {
        const weather = await fetch(`${baseUrlTwo}/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,rain_sum,wind_speed_10m_max`);
        const dataJson = await weather.json();
        console.log(dataJson);  

        loading.classList.add("hidden");
        loading.classList.remove("flex")
        const dates = dataJson.daily.time
        dates.forEach((date, index) => {
            if (index > 0) {
                const weatherCode = dataJson.daily.weather_code[index];
                const weatherIcon = weatherCodeIcons[weatherCode] || "./images/icons/clear-day.svg";

                document.getElementById("card-container").innerHTML += `
    <div class="bg-white/20 rounded-xl p-4 gap-2 h-[300px] w-[225px] shadow-lg items-center flex flex-col daily-weather transition-all hover:shadow-xl justify-between hover:bg-white/30 relative">

        <img src="${weatherIcon}" width="115" height="115" alt="Weather Icon" class="absolute top-[-50px] right-[-40px]">

        <p class="text-lg font-semibold font-montserrat text-center">${getCurrentDate(date)}</p>

        <div class="flex gap-4 flex-row w-full">
            <div class="flex items-center w-1/2  justify-between bg-white/20 px-2 py-2 rounded-lg shadow-sm">
                <div class="flex justify-center items-center gap-1 w-full flex-col">
                    <img src="./images/icons/umbrella.svg" alt="Precipitation icon" width="45" height="45">
                    <p class="font-semibold font-montserrat text-sm">${dataJson.daily.precipitation_sum[index]}%</p>
                </div>
            </div>
            <div class="flex items-center w-1/2 justify-between bg-white/20 px-2 py-2 rounded-lg shadow-sm">
                <div class="flex justify-center items-center w-full gap-1 flex-col">
                    <img src="./images/icons/wind.svg" alt="Wind speed icon" width="45" height="45">
                    <p class="font-semibold font-montserrat text-sm">${Math.floor(dataJson.daily.wind_speed_10m_max[index])} km/h</p>
                </div>
            </div>
        </div>
    </div>`
    ;}
})
    } catch (error) {
        console.log(error);
        loading.classList.add("hidden");
        loading.classList.remove("flex")
    } finally {
        loading.classList.add("hidden");
        loading.classList.remove("flex")
    }
}

fetchForecast()


