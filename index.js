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
        const day = dates.toLocaleDateString("en-US", { weekday: "long" });
        const month = dates.toLocaleDateString("en-US", { month: "long" });
        const dayNumber = dates.toLocaleDateString("en-US", { day: "numeric" });
        const year = dates.toLocaleDateString("en-US", { year: "numeric" });  
        return `${day} <br />${month}, ${dayNumber}, ${year}`
    }
    const dates = new Date();
    const formatEn = dates.toLocaleDateString('en-US', options);
    return formatEn;
}

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
    // const location =  searchInputLocation.value
    // fetchWeather(location)
    // const weather = await fetchWeather("Semarang");
    // if (weather) fetchForecast(weather?.latitude, weather?.longitude);
    // to new page and display all the data
})

const fetchingHomePage = async () => {
    fetchWeather(location)
    const weather = await fetchWeather("Semarang");
    if (weather) fetchForecast(weather?.latitude, weather?.longitude);
}

fetchingHomePage()

const fetchForecast = async (latitude, longitude) => {
    let loadingBigCard = false
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
    loadingBigCard = true
    loading.classList.add("flex")
    try {
        const weather = await fetch(`${baseUrlTwo}/forecast?latitude=${latitude}&longitude=${longitude}&forecast_days=11&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,rain_sum,wind_speed_10m_max&current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,rain,weather_code,wind_speed_10m&`);
        const dataJson = await weather.json(); 

        loading.classList.add("hidden");
        loading.classList.remove("flex")
        loadingBigCard = false
        
        const dates = dataJson.daily.time
        dates.forEach((date, index) => {
            if(index > 0) {
                const weatherCode = dataJson.daily.weather_code[index];
                const weatherIcon = weatherCodeIcons[weatherCode] || "./images/icons/clear-day.svg";

                document.getElementById("card-container").innerHTML += `
        <div class="bg-gradient-to-tl from-[#4169e1] to-[#5BBCE4] rounded-xl p-4 gap-2 h-[300px] w-[265px] shadow-lg items-center flex flex-col daily-weather transition-all hover:shadow-xl justify-between hover:backdrop-brightness-105 relative">

        
        <p class="text-base font-[500] font-montserrat text-center">${getCurrentDate(date)}</p>

        <img src="${weatherIcon}" width="90" height="90" alt="Weather Icon" class="">

            <div class="flex flex-col items-center gap-2 w-full">
                <div class="flex items-center">
                    <p class="font-montserrat">Min: ${dataJson.daily.temperature_2m_min[index] + "&deg;"} |</p>
                    <p class="font-montserrat ml-1">Max: ${dataJson.daily.temperature_2m_max[index] + "&deg;"}</p>           
                </div>
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
            </div>
        </div>`
        } else {
            const weatherCode = dataJson.daily.weather_code[index];
            const weatherIcon = weatherCodeIcons[weatherCode] || "./images/icons/clear-day.svg";
            document.getElementById("big-card").innerHTML += `
            <div class="w-full h-full">
            <img src="${weatherIcon}" alt="partly-cloudy-day" class="absolute -top-24 -right-[70px] drop-shadow-md" height="250" width="250">
            <div class="flex items-center gap-2">
                <img src="./images/icons/location.svg" width="30" height="30" alt="location icons" />
                <p class="text-3xl mb-1">Semarang</p>
            </div>
            <div class="flex flex-col">
                <div class="flex items-center">
                    <img class="ml-[-28px]" src="./images/icons/thermometer-celsius.svg" width="100" height="100" alt="Thermometer icon">
                    <h1 class="font-montserrat text-7xl font-bold">${Math.floor(dataJson.current.apparent_temperature) + "&deg;"}</h1>
                </div>
            </div>
            <p class="font-montserrat text-white text-lg mb-2">${getCurrentDate("")}</p>
            <div class="flex items-center my-1">
                <p class="font-montserrat">Feels like ${Math.floor(dataJson.current.temperature_2m
                    ) + "&deg;"} |</p>
                <p class="font-montserrat ml-1">Min: ${dataJson.daily.temperature_2m_min[index] + "&deg;"} |</p>
                <p class="font-montserrat ml-1">Max: ${dataJson.daily.temperature_2m_max[index] + "&deg;"}</p>           
            </div>

          
        
            <div class="flex items-center min-w-[350px] mt-2 justify-between gap-4 w-full">
            <div class="flex flex-col w-[33%] bg-white/20 text-white/90 p-2.5 items-center rounded-lg">
              <img src="./images/icons/umbrella.svg" alt="humidity icon" width="50" height="50">
              <p class="font-montserrat">${dataJson.current.precipitation}%</p>
              <h2 class="text-sm">Precipitation</h2>
            </div>
            <div class="flex flex-col w-[33%] bg-white/20 text-white/90 p-2.5 items-center rounded-lg">
              <img src="./images/icons/humidity.svg" alt="humidity icon" width="50" height="50">
              <p class="font-montserrat">${dataJson.current.relative_humidity_2m}%</p>
              <h2 class="text-sm">Humidity</h2>
            </div>
            <div class="flex flex-col w-[33%] bg-white/20 text-white/90 p-2.5 items-center rounded-lg">
              <img src="./images/icons/wind.svg" alt="wind speed icon" width="50" height="50">
              <p class="font-montserrat">${dataJson.current.wind_speed_10m}km/h</p>
              <h2 class="text-sm">Wind Speed</h2>
            </div>
          </div>
          </div>
            `
        }  
    ;}
)
    } catch (error) {
        console.log(error);
    } finally {
        loading.classList.add("hidden");
        loading.classList.remove("flex")
    }
}

fetchForecast()


