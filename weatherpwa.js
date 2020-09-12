const navSlide = ()=> {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li')

    burger.addEventListener('click', () => {
        nav.classList.toggle('nav-active');
    });
}

navSlide();



const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const notificationElement = document.querySelector(".notification");


const weather = {};

weather.temperature = {
    unit : "celsius"
}


const KELVIN = 273;

const key = "d7914b799cc8bdf469b4c6b14888a81a";


if('geolocation' in navigator){
    navigator.geolocation.getCurrentPosition(setPosition, showError);
}else{
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p>Browser doesn't Support Geolocation</p>";
}


function setPosition(position){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    
    getWeather(latitude, longitude);
}


function showError(error){
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p> ${error.message} </p>`;
}


function getWeather(latitude, longitude){
    let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
    
    fetch(api)
        .then(function(response){
            let data = response.json();
            return data;
        })
        .then(function(data){
            weather.temperature.value = Math.floor(data.main.temp - KELVIN);
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
        })
        .then(function(){
          displayWeather ();
        });
}


function displayWeather(){
    iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    descElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;
}


function celsiusToFahrenheit(temperature){
    return (temperature * 9/5) + 32;
}


tempElement.addEventListener("click", function(){
    if(weather.temperature.value === undefined) return;
    
    if(weather.temperature.unit == "celsius"){
        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);
        
        tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
        weather.temperature.unit = "fahrenheit";
    }else{
        tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
        weather.temperature.unit = "celsius"
    }
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            const registration = await navigator.serviceWorker.register('weatherpwa.sw.js');
            console.log('Service worker registration successful');
            console.log(`Registered with scope: ${registration.scope}`);
        }catch (e) {
            debugger;
            console.log('Service worker registration failed');
            console.log(e);
        }
    });
}

const input = document.querySelector('.input_text');
const main = document.querySelector('#name');
const desc = document.querySelector('.desc');
const button= document.querySelector('.submit');
const iconElement2 = document.querySelector(".weather-icon2");
const tempElement2 = document.querySelector(".temperature-value2 p");

button.addEventListener('click', function(name){
fetch('https://api.openweathermap.org/data/2.5/weather?q='+input.value+'&appid=d7914b799cc8bdf469b4c6b14888a81a')
.then(response => response.json())
.then(data => {
  const nameValue = data['name'];
  const descValue = data['weather'][0]['description'];
    weather.iconId = data.weather[0].icon;
    weather.temperature.value = Math.floor(data.main.temp - KELVIN);

  
  iconElement2.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
  tempElement2.innerHTML = `${weather.temperature.value}°<span>C</span>`;
  main.innerHTML = nameValue;
  desc.innerHTML = "Description - "+descValue;
  input.value ="";

  window.localStorage.setItem(JSON.stringify(data));

})

.catch(err => alert("Thanks for the search!"));


})

