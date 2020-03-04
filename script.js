

let cityHistory = JSON.parse(localStorage.getItem("savedCities"));
    
let cityList= [];

$("#sumbitCity").on("click", function(event) {
    event.preventDefault();
    var search = $("#city").val();
    console.log(search);


});

    function displayWeather(search) {
        var queryURL ="https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + "&APPID=89de3065ee4e2d60005c12c3c47a2525";
        var forecastURL ="";
        var uvURL="";

        $ajax({
            url: queryURL,
            method: "GET",
        }).then(function(res) {
            var city = $(".city");
            var temp = $(".temp");
            var humidity = $(".humidity");
            var wind = $(".wind");

            city.html("<h3>" + response.name + moment().format('L') + "</h3>");
            temp.text("Temperature:" + response.main.temp + "°F");
            humidity.text("Humidity:" + response.main.humidity + "%");
            wind.text("Wind Speed" + response.wind.speed + "MPH");
        })
        $.ajax({
            url: uvURL,
            method: "GET"
        }).then(function(response) {
            console.log(response);
            var uv = $(".uv-index");

            uv.text("UV Index:" + response[0].value);
        })

        $.ajax({
            url: forecastURL,
            method: "GET"
        }).then(function(response) {
            console.log(response);
            var oneDate = $(".date-1");
            var oneIcon = $(".icon-1");
            var oneTemp = $(".temp-1");
            var oneHumid = $(".humidity-1");
        })




};

   
    


function populate(data) {
    return "<h3>" + data.name + moment().format( '(MM/DD/YYYY') + "</h2>" + "<p> Temp:</p>" + $(data.main.temp) + "°F";
}

