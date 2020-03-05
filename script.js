let cityHistory = JSON.parse(localStorage.getItem("storedHistory"));

let clearCities = [];


$(document).ready(function() {
  //clear search history
  $("#history-list").empty();
  let searchHist = pastSearches(cityHistory,clearCities);
  let lastCity = searchHist.pop();


  // insert the lastCity as the value of the search text input and then simulate a click to search 
  if(lastCity !== undefined) {
    $("#city-input").val(lastCity);
    $("#search").click();
  } else {
    return  
  }
})


$("#search").on("click", function(event) {
  event.preventDefault();
  let cityInput = $("#city-input")
    .val()
    .trim()
    .toUpperCase()
  // getting an array to store the city 
  let searchHist = pastSearches(cityHistory,clearCities);
  
  const apiKey = "89de3065ee4e2d60005c12c3c47a2525";
  
  // Building the URLs needed for the ajax request
  let currentURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&units=imperial&appid=${apiKey}`;
  
  let forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityInput},&units=imperial&appid=${apiKey}`;
  
  //adding city to local storage
  searchHist.push(cityInput);
  saveCities(searchHist);
  $("#history-list").empty();
  displayCities(searchHist);


  // ajax call for current weather conditions
  $.ajax({
    url: currentURL,
    method: "GET"
  }).then(function(res) {
    // set lat and lon in local storage to use in the UV i URL and API call
    localStorage.setItem("lat", res.coord.lat);
    localStorage.setItem("lon", res.coord.lon);

    console.log(res);
    console.log(currentURL);
    console.log("lattitude: " + res.coord.lat);
    console.log("longitude: " + res.coord.lon);
    console.log("Wind Speed: " + res.wind.speed);
    console.log("Humidity: " + res.main.humidity);
    console.log("Temperature (F): " + res.main.temp);

    // Populate HTML with current conditions

    $("#current-info").html(
      `${res.name} on ${moment(res.dt, "X").format("ddd MMM D, h:mm a")}`
    );
   
    $("#icon").html(` 
    <figure>
    <img src="http://openweathermap.org/img/wn/${res.weather[0].icon}@2x.png" alt="weather icon">
    <figcaption>${res.weather[0].description}</figcaption>
    </figure>`);
    $("#wind").html(`Wind Speed: ${res.wind.speed}`);
    $("#humidity").html(`Humidity: ${res.main.humidity}%`);
    $("#temp").html(`Temperature (F): ${res.main.temp}°`);

    // ajax call for the UV index. The UV index API is only available to paid accounts so I'm using the sample
    $.ajax({
      url: `https://api.openweathermap.org/data/2.5/uvi?lat=${res.coord.lat}&lon=${res.coord.lon}&appid=89de3065ee4e2d60005c12c3c47a2525`,
      method: "GET"
    }).then(function(res) {
      $("#uv").html(`<h5>UV Index: ${res.value}`);
      $("#five-day-header").html("Five Day Forecast:")
    });
  });

  // ajax call for five day forecast weather conditions.
  $.ajax({
    url: forecastURL,
    method: "GET"
  }).then(function(res) {
    console.log(res);

    // emptying html from previous search
    $("#five-day").empty();

    const forecastDays = [];
    const fiveDayDetails = [];

    res.list.filter(function(hourly) {
      let forecastDate = moment(hourly.dt, "X").format("MM/DD/YYYY");
      if (
        forecastDays.includes(forecastDate) ||
        forecastDate === moment().format("MM/DD/YYYY")
      ) {
        return false;
      } else {
        forecastDays.push(moment(hourly.dt, "X").format("MM/DD/YYYY"));
        fiveDayDetails.push({
          date: moment(hourly.dt, "X").format("MM/DD/YYYY"),
          temp: hourly.main.temp,
          humidity: hourly.main.humidity,
          description: hourly.weather[0].description,
          inconUrl: `http://openweathermap.org/img/wn/${hourly.weather[0].icon}@2x.png`
        });
      }
      console.log(fiveDayDetails);
    });
    fiveDayDetails.forEach(day => {
      let icon = day.inconUrl;
      let date = day.date;
      let temp = day.temp;
      let humidity = day.humidity;
      let description = day.description;

      $("#five-day").append(`
      <h6 class="header"> ${date}</h6>
      <div class="card horizontal">
      <div class="card-image">
        <img src=${icon} alt="weather icon">
      </div>
      <div class="card-stacked">
        <div class="card-content">
        <h6>${description}</h6>
        <h6>Temp: ${temp}</h6>
      <h6>Humidity: ${humidity}</h6>
    </div>
   </div>
  <div/>`)
    });
  });
});

const pastSearches = (arr1, arr2) => {
  if(arr1 !== null) {
    return arr1
  } else {
    return arr2
  }
}

const saveCities = (array) => {
  localStorage.setItem("storedHistory", JSON.stringify(array));
}

const displayCities = (array) => {
  let historyList = $("#history-list");
  historyList.append(`<a href="#" class="collection-item active grey white-text">Previous Cities: <br> </a>`)
  array.forEach(city => {
    historyList.append(`<a href="#" class="collection-item grey-text" data-city="${city}">${city} <br> </a>`);
  });
  $(".collection-item").on("click", function() {
    $("#city-input").val($(this).attr("data-city"));
    $("#search").click();
  })
}





