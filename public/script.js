const searchElement = document.querySelector('[data-city-search]');
const searchBox = new google.maps.places.SearchBox(searchElement);
const dataTemp = document.querySelector('[data-temp]');
const dataWind = document.querySelector('[data-wind]');
const dataDescription = document.querySelector('[data-description]');
const dataLocation = document.querySelector('[data-location]') ;

const tempUnit = document.querySelector('.detail.bordered span');
const iconElement = document.querySelector('.icon');
let longitude;
let latitude;
let fetchedTempInC;
let fetchedTempInF;

const skyCons = new Skycons({ color: 'black' });
skyCons.set(iconElement, 'clear-day');
skyCons.play();

window.addEventListener('load', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((currentPos) => {
      const { longitude, latitude } = currentPos.coords;
      fetchWeather(longitude, latitude);
    });
  }
});

dataTemp.addEventListener('click', () => {
  switchTemp(fetchedTempInF, fetchedTempInC, tempUnit);
});

searchBox.addListener('places_changed', () => {
  const place = searchBox.getPlaces()[0];
  if (place == null) return null;
  latitude = place.geometry.location.lat() || null;
  longitude = place.geometry.location.lng() || null;

  fetchWeather(longitude, latitude);
});

function fetchWeather(longitude, latitude) {
  fetch('/weather', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      latitude,
      longitude,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      setWeatherData(data);
      console.log(data);
      fetchedTempInC = (((data.main.temp - 32) * 5) / 9).toFixed();
      fetchedTempInF = data.main.temp.toFixed();
    });
}

function switchTemp(fetchTempInF, fetchedTempInC, tempUnit) {
  if (tempUnit.textContent === 'F') {
    dataTemp.textContent = fetchedTempInC;
    tempUnit.textContent = 'C';
  } else {
    dataTemp.textContent = fetchedTempInF;
    tempUnit.textContent = 'F';
  }
}

function setWeatherData(data) {
  const { description, main } = data.weather[0];
  dataLocation.textContent = data.name;
  dataTemp.textContent = data.main.temp.toFixed();
  dataWind.textContent = data.wind.speed + ' mph';
  dataDescription.textContent = description;
  tempUnit.textContent = 'F';

  const dataIcon = setIconData(main);
  skyCons.set(iconElement, dataIcon);
}

function setIconData(main) {
  switch (true) {
    case main.split(' ').includes('Clouds'):
      return 'partly-cloudy-day';
      break;
    case main.split(' ').includes('Cloudy'):
      return 'cloudy';
      break;
    case main.split(' ').includes('Rain'):
      return 'rain';
      break;
    case main.split(' ').includes('Fog'):
      return 'fog';
      break;
    case main.split(' ').includes('Snow'):
      return 'snow';
      break;
    case main.split(' ').includes('SUNNY'):
      return 'sunny';
      break;
    case main.split(' ').includes('Clear'):
      return 'clear-day';
      break;
    default:
      return 'clear-day';
  }
}
