const realTimeDate = document.getElementById("realTimeDate");

function getCurrentDate() {
    const date = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };

    return date.toLocaleDateString('id-ID', options);
}

realTimeDate.innerText = getCurrentDate();