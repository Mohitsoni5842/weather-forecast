async function getData(input) {
    const url = `http://api.weatherapi.com/v1/current.json?key=b1a92fcffe7d48ef804140403252807&q=${input}&aqi=yes`;
    let a = fetch(url);
    let response = await a;
    let data = await response.json();
    console.log(data);
}
document.querySelector("#searchbutton").addEventListener("click", function() {
    const input = document.getElementById('locationInput').value;
});