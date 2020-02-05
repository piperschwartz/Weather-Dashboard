const apiKey= "89de3065ee4e2d60005c12c3c47a2525";


// const moment = moment();
    
$("#sumbitCity").on("click", function(event) {
    console.log(search);

    event.preventDefault();
    var search = $("#submitCity").val();
    listofCities.push(city);
    displayWeather(search);
    displayList(search);
});

    function displayWeather(search) {
        $ajax({
            url: "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + "&APPID=89de3065ee4e2d60005c12c3c47a2525",
            method: "GET",
            success: function(data) {
                var display = populate(data);
                $('#populate').html(display);
            }
        });

        $.ajax({
            url: "api.openweathermap.org/data/2.5/forecast?zip={zip code},{country code}" + city + apiKey,
            method: "GET",
        success: function(data) {
            var forecastFive = popForecast(data);
        }
        });

        $.ajax({
            url: "http://api.openweathermap.org/data/2.5/uvi?appid=" + "&APPID=89de3065ee4e2d60005c12c3c47a2525" + "&lat=" + lat + "&lon=" + lon,
            method: "GET"  
        })
        .then(function(response) {
            uvIndex = $("<p>" + "UV Index:" + response.value + "</p>");
            $(weatherBox).text(uvIndex);
        })
    
};

function populate(data) {
    return "<h3>" + data.name + moment().format( '(MM/DD/YYYY') + "</h2>" + "<p> Temp:</p>" + $(data.main.temp) + "°F";
}

