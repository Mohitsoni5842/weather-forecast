const themeSwitch = document.getElementById('themeSwitch');
const themeLabel = document.getElementById('themeLabel');


const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    themeSwitch.checked = true;
    themeLabel.textContent = 'Dark Theme';
} else {
    themeLabel.textContent = 'Light Theme';
}

themeSwitch.addEventListener('change', () => {
    if (themeSwitch.checked) {
        document.body.classList.add('dark-theme');
        themeLabel.textContent = 'Dark Theme';
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.remove('dark-theme');
        themeLabel.textContent = 'Light Theme';
        localStorage.setItem('theme', 'light');
    }
});

async function getData(input) {
    try {
        const url = `http://api.weatherapi.com/v1/forecast.json?key=b1a92fcffe7d48ef804140403252807&q=${encodeURIComponent(input)}&days=7&aqi=yes&alerts=yes`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();

        if (!data.current) throw new Error('Invalid data from API');


    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Failed to fetch weather data. Please try again.');
    }
    const url = `http://api.weatherapi.com/v1/forecast.json?key=b1a92fcffe7d48ef804140403252807&q=${input}&days=7&aqi=yes&alerts=yes`;
    let a = fetch(url);
    let response = await a;
    let data = await response.json();
    console.log(data);
    let temp = data.current.temp_c;
    const tempValue = temp;
    let humidity = data.current.humidity;
    const humidityValue = humidity;
    let wind = data.current.wind_kph;
    const windvalue = wind;
    let description = data.current.condition.text;
    const descvalue = description;
    document.getElementById("temperature").textContent = `Temperature: ${tempValue} °C`;
    document.getElementById("humidity").textContent = `Humidity ${humidityValue} %`;
    document.getElementById("wind").textContent = `Wind ${windvalue} Km/h`;
    document.getElementById("description").textContent = `Description: ${descvalue}`;
    document.querySelectorAll(".forecast-temp").forEach((elem, index) => {
        elem.textContent = `Temp: ${data.forecast.forecastday[index].day.avgtemp_c}°C`;
    });

    document.querySelectorAll(".forecast-min").forEach((elem, index) => {
        elem.textContent = `Min temp: ${data.forecast.forecastday[index].day.mintemp_c}°C`;
    });


    document.querySelectorAll(".forecast-max").forEach((elem, index) => {
        elem.textContent = `Max temp: ${data.forecast.forecastday[index].day.maxtemp_c}°C`;
    });


    document.querySelectorAll(".weather-day-icon-img").forEach((elem, index) => {

        let img = data.forecast.forecastday[index].day.condition.icon.replace(/^\/\//, 'https://');
        elem.src = img;
    });

    let iconUrl = data.current.condition.icon;
    if (iconUrl.startsWith('//')) iconUrl = 'https:' + iconUrl;
    document.getElementById('weatherIconImg').src = iconUrl;
    document.querySelectorAll('.forecast-day').forEach((dayElem, index) => {
        // Example: get date from API
        const dateStr = data.forecast.forecastday[index].date; // format "2025-07-29"
        // Format to e.g., "29 Jul 2025"
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        const displayDate = new Date(dateStr).toLocaleDateString('en-GB', options);
        dayElem.querySelector('.forecast-full-date').textContent = displayDate;
    });

    function getAqiDescription(index) {
        switch (index) {
            case 1:
                return { text: "Good", color: "#4caf50" };
            case 2:
                return { text: "Moderate", color: "#ffeb3b" };
            case 3:
                return { text: "Unhealthy for Sensitive Groups", color: "#ff9800" };
            case 4:
                return { text: "Unhealthy", color: "#f44336" };
            case 5:
                return { text: "Very Unhealthy", color: "#9c27b0" };
            case 6:
                return { text: "Hazardous", color: "#7b1fa2" };
            default:
                return { text: "Unknown", color: "#999999" };
        }
    }
    if (data && data.current && data.current.air_quality) {
        const aqiIndex = data.current.air_quality["us-epa-index"];
        const pm25 = data.current.air_quality.pm2_5;

        const { text, color } = getAqiDescription(aqiIndex);

        const statusElem = document.getElementById("aqiStatus");
        const aqiElem = document.getElementById("aqi");

        statusElem.textContent = `AQI Status: ${text}`;
        statusElem.style.color = color;

        aqiElem.textContent = `Air Quality Index (PM2.5): ${pm25.toFixed(2)} µg/m³`;
        aqiElem.style.color = color;
    } else {

        document.getElementById("aqiStatus").textContent = "AQI Status: Data not available";
        document.getElementById("aqi").textContent = "Air Quality Index: --";
    }
}
document.querySelector("#searchButton").addEventListener("click", function() {
    const input = document.getElementById('locationInput').value;
    console.log(input);
    getData(input);
    document.querySelector(".weather-day-icon-img").style.display = "block";
});
