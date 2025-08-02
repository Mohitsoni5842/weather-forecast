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
        const url = `https://api.weatherapi.com/v1/forecast.json?key=b1a92fcffe7d48ef804140403252807&q=${encodeURIComponent(input)}&days=7&aqi=yes&alerts=yes`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        if (!data.current) throw new Error('Invalid data from API');

        let temp = data.current.temp_c;
        let humidity = data.current.humidity;
        let wind = data.current.wind_kph;
        let description = data.current.condition.text;

        document.getElementById("temperature").textContent = `Temperature: ${temp} °C`;
        document.getElementById("humidity").textContent = `Humidity: ${humidity} %`;
        document.getElementById("wind").textContent = `Wind: ${wind} Km/h`;
        document.getElementById("description").textContent = `Description: ${description}`;

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
            elem.style.display = "block";
        });

        let iconUrl = data.current.condition.icon;
        if (iconUrl.startsWith('//')) iconUrl = 'https:' + iconUrl;
        document.getElementById('weatherIconImg').src = iconUrl;

        document.querySelectorAll('.forecast-day').forEach((dayElem, index) => {
            const dateStr = data.forecast.forecastday[index].date;
            const options = { day: '2-digit', month: 'short', year: 'numeric' };
            const displayDate = new Date(dateStr).toLocaleDateString('en-GB', options);
            dayElem.querySelector('.forecast-full-date').textContent = displayDate;
        });

        function getAqiDescription(index) {
            switch (index) {
                case 1: return { text: "Good", color: "#4caf50" };
                case 2: return { text: "Moderate", color: "#ffeb3b" };
                case 3: return { text: "Unhealthy for Sensitive Groups", color: "#ff9800" };
                case 4: return { text: "Unhealthy", color: "#f44336" };
                case 5: return { text: "Very Unhealthy", color: "#9c27b0" };
                case 6: return { text: "Hazardous", color: "#7b1fa2" };
                default: return { text: "Unknown", color: "#999999" };
            }
        }

        if (data.current.air_quality) {
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
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Failed to fetch weather data. Please try again.');
    }
}

document.querySelector("#searchButton").addEventListener("click", function() {
    const input = document.getElementById('locationInput').value;
    console.log(input);
    getData(input);
    // Corrected class name
    document.querySelectorAll(".weather-day-icon-img").forEach(elem => {
        elem.style.display = "block";
    });
});
