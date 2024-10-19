const searchInputLocation = document.getElementById("search-location");
const clearInputBtn = document.getElementById("clearSearchLocationButton")
const loading = document.getElementById("loading")
const home = document.getElementById("homepage")
const searchDetail = document.getElementById("search-weather-detail")
const btnBackHomepage = document.getElementById("btn-back-homepage")
const containerSearchDetail = document.getElementById("container-search-detail")

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
        return `${day} <br />${month} ${dayNumber}, ${year}`
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
        if (dataJson.results && dataJson.results.length > 0) {
            console.log(dataJson)
            const { latitude, longitude, name } = dataJson.results[0];
            return { latitude, longitude, name };
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
    const weather = await fetchWeather(location);
    loading.classList.add("flex")
    loading.classList.remove("hidden");
    home.classList.remove('flex');
    home.classList.add('hidden');
    searchInputLocation.value = '';
    
    if (weather) fetchSearchDetailByCity(weather?.latitude, weather?.longitude, weather?.name);
    // to new page and display all the data
})

function showPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    fetchForecast(latitude, longitude);
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
}
getLocation();


const fetchSearchDetailByCity = async (latitude, longitude, cityName) => {
    try {
        const weather = await fetch(`${baseUrlTwo}/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,rain,weather_code,visibility,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,daylight_duration,sunshine_duration,uv_index_max,precipitation_sum,rain_sum,wind_speed_10m_max&forecast_days=14`);
        const dataJson = await weather.json(); 
        const dates = dataJson.daily.time
        console.log(dataJson);
        
        loading.classList.add("hidden");
        loading.classList.remove("flex")
        searchDetail.classList.add("flex")
        searchDetail.classList.remove("hidden")
        btnBackHomepage.classList.add("flex")
        btnBackHomepage.classList.remove("hidden")
        
        document.getElementById("dashboard-container").innerHTML = '';

        dates.forEach((date, i) => {
            const weatherCode = dataJson.daily.weather_code[index];
            const weatherIcon = weatherCodeIcons[weatherCode];
            containerSearchDetail.innerHTML += ``
        })
    } catch (error) {   
        console.log("Testing")
    }
}

const fetchForecast = async (latitude, longitude) => {
    loading.classList.remove("hidden");
    loading.classList.add("flex")
    home.classList.remove("flex")
    home.classList.add("hidden")

    try {
        const weather = await fetch(`${baseUrlTwo}/forecast?latitude=${latitude}&longitude=${longitude}&forecast_days=11&hourly=weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,rain_sum,wind_speed_10m_max&current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,rain,weather_code,wind_speed_10m`);
        const dataJson = await weather.json(); 

        loading.classList.add("hidden");
        loading.classList.remove("flex")
        home.classList.add("flex")
        home.classList.remove("hidden")
        
        const dates = dataJson.daily.time
        
        dates.forEach((date, index) => {
            if(index > 0) {
                const weatherCode = dataJson.daily.weather_code[index];
                const weatherIcon = weatherCodeIcons[weatherCode];
            
                document.getElementById("card-container").innerHTML += `
        <div class="bg-gradient-to-tl from-[#4169e1] to-[#5BBCE4] rounded-xl p-3 gap-2 h-[300px] w-[265px] shadow-lg items-center flex flex-col daily-weather transition-all hover:shadow-xl justify-between hover:scale-[1.05] relative">

        <p class="text-base font-[500] font-montserrat text-center">${getCurrentDate(date)}</p>

        <img src="${weatherIcon.image}" width="90" height="90" alt="Weather Icon" class="mt-[-35px]">
        <p class="absolute top-[148px] text-sm">${weatherIcon.name}</p>        
            <div class="flex flex-col items-center gap-2 w-full">
                <div class="flex items-center">
                    <p class="font-montserrat">Min: ${dataJson.daily.temperature_2m_min[index] + "&deg;"} |</p>
                    <p class="font-montserrat ml-1">Max: ${dataJson.daily.temperature_2m_max[index] + "&deg;"}</p>           
                </div>  
            <div class="flex gap-4 flex-row w-full">
                <div class="flex items-center w-1/2  justify-between bg-white/5 px-2 py-1 rounded-lg shadow-sm">
                    <div class="flex justify-center items-center gap-1 w-full flex-col">
                        <img src="./images/icons/umbrella.svg" alt="Precipitation icon" width="45" height="45">
                        <p class="font-semibold font-montserrat text-sm">${dataJson.daily.precipitation_sum[index]}%</p>
                    </div>
                </div>
                <div class="flex items-center w-1/2 justify-between bg-white/5 px-2 py-1 rounded-lg shadow-sm">
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
            const weatherIcon = weatherCodeIcons[weatherCode];
            document.getElementById("big-card").innerHTML += `
            <div class="w-full h-full">
            <img src="${weatherIcon.image}" alt="partly-cloudy-day" class="absolute -top-24 -right-[70px] drop-shadow-md" height="250" width="250">  
            <p class="font-montserrat text-white text-base mb-2">${getCurrentDate("")}</p>
            
            <div class="flex flex-col">
                <div class="flex items-center">
                    <img class="ml-[-28px]" src="./images/icons/thermometer-celsius.svg" width="100" height="100" alt="Thermometer icon">
                    <h1 class="font-montserrat text-6xl font-bold">${Math.floor(dataJson.current.apparent_temperature) + "&deg;"}</h1>
                </div>
            </div>
            <div class="flex items-center">
                <h2 class="text-2xl">${weatherIcon.name}</h2>
            </div>
            <div class="flex items-center">
                <p class="font-montserrat">Feels like ${Math.floor(dataJson.current.temperature_2m
                    ) + "&deg;"} |</p>
                <p class="font-montserrat ml-1">Min: ${dataJson.daily.temperature_2m_min[index] + "&deg;"} |</p>
                <p class="font-montserrat ml-1">Max: ${dataJson.daily.temperature_2m_max[index] + "&deg;"}</p>           
            </div>
        
            <div class="flex items-center min-w-[350px] mt-2 justify-between gap-4 w-full">
            <div class="flex flex-col w-[33%] bg-white/5 text-white/90 p-2 items-center rounded-lg">
              <img src="./images/icons/umbrella.svg" alt="humidity icon" width="50" height="50">
              <p class="font-montserrat">${dataJson.current.precipitation}%</p>
              <h2 class="text-sm">Precipitation</h2>
            </div>
            <div class="flex flex-col w-[33%] bg-white/5 text-white/90 p-2 items-center rounded-lg">
              <img src="./images/icons/humidity.svg" alt="humidity icon" width="50" height="50">
              <p class="font-montserrat">${dataJson.current.relative_humidity_2m}%</p>
              <h2 class="text-sm">Humidity</h2>
            </div>
            <div class="flex flex-col w-[33%] bg-white/5 text-white/90 p-2 items-center rounded-lg">
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

function backToHomepage() {
    home.classList.add('flex');
    home.classList.remove('hidden');
    searchDetail.classList.remove("flex")
    searchDetail.classList.add("hidden")
}


