import $ from 'jquery';
import './style.css'

let env = import.meta.env;
let apiKey = env.VITE_API_KEY;

$(document).ready(function () {


  showHistory();

  $("#myLocation").click(function () {
    navigator.geolocation.getCurrentPosition(function (position) {
      let lat = position.coords.latitude;
      let lon = position.coords.longitude;
      let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=en&appid=${apiKey}`;
      getWeather(url);
    }, function () {
      alert("Could not get  location");
    });
  });

  $("#city").keydown(function (event) {
    if (event.key === 'Enter') {
      let city = $("#city").val();
      if (city != "") {
        let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=en&appid=${apiKey}`;
        getWeather(url);
      }
    }
  });

});


function getWeather(url) {
  $.ajax({
    url: url,
    method: "GET",
    success: function (data) {
      let weather = {
        name: data.name,
        icon: data.weather[0].icon,
        temp: data.main.temp,
        wind: data.wind.speed
      };

      $("#result").html(makeRow(weather));
      saveSearch(weather);
      showHistory();
    },
    error: function () {
      alert("City not found");
    }
  });
}

function makeRow(weather) {
  return `
    <div class="card shadow-sm border-0 mb-3">
      <div class="card-body row align-items-center g-0">
        <div class="col-3"><img class="weather-icon" src="https://openweathermap.org/img/wn/${weather.icon}@2x.png" alt="weather icon"></div>
        <div class="col-3 fw-bold">${weather.name}</div>
        <div class="col-3">${weather.temp} °C</div>
        <div class="col-3">${weather.wind} m/s</div>
      </div>
    </div>
  `;
}

function saveSearch(weather) {
  let searches = JSON.parse(localStorage.getItem("searches"));

  if (searches == null) {
    searches = [];
  }

  searches.unshift(weather);

  if (searches.length > 5) {
    searches.pop();
  }

  localStorage.setItem("searches", JSON.stringify(searches));
}

// Shows the latest searches
function showHistory() {
  let searches = JSON.parse(localStorage.getItem("searches"));
  $("#history").html("");

  if (searches == null) {
    return;
  }

  for (let i = 0; i < searches.length; i++) {
    $("#history").append(makeRow(searches[i]));
  }
}