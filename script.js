//moment().format('L');    //moment.js
var lsearch = JSON.parse(localStorage.getItem("cityName")) || [];
moment().format('L');    //moment.js

// search function

function searchCity(cityname) {

    // var queryURl1 = "https://api.openweathermap.org/data/2.5/forecast?q=austin&APPID=6bbd53d46de3755aee4c32c7e592cb12";// this working
    var queryURL1 = "https://api.openweathermap.org/data/2.5/weather?q=" + cityname + "&appid=6bbd53d46de3755aee4c32c7e592cb12";
    console.log(queryURL1);

    //forecast url
    var queryURL2 = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityname + "&appid=6bbd53d46de3755aee4c32c7e592cb12";

    // ajax call

    $.ajax({
        url: queryURL1,
        method: 'GET'
    }).then(function (response) {
        console.log(response);
        console.log(queryURL1);

        //empt div ,we can put info in

        $("#current").empty();
        var date = moment().format('L');



        //city info
        var cityName = $("<h2>").text(response.name);
        var maindate = cityName.append("" + date);
        var temp = $("<p>").text("Temperature:" + response.main.temp);
        var humidity = $("<p>").text("Humidity:" + response.main.humidity);
        var wind = $("<p>").text("Wind speed:" + response.wind.speed);
        var presentweather = response.weather[0].main;


        if (presentweather === "Clouds") {

            var weathericon = $("<img>").attr("src", "http://openweathermap.org/img/wn/03d.png");
            weathericon.attr("style", "height:40px; width:40px");
        }
        else if (presentweather === "Clear") {
            var weathericon = $("<img>").attr("src", "http://openweathermap.org/img/wn/01d.png");
            weathericon.attr("style", "height:40px; width:40px");
        }
        else if (presentweather === "Rain") {
            var weathericon = $("<img>").attr("src", "http://openweathermap.org/img/wn/09d.png");
            weathericon.attr("style", "height:40px; width:40px");

        }



        //div to append
        var ndiv = $("<div>");
        ndiv.append(maindate, weathericon, temp, humidity, wind);
        $("#current").html(ndiv);




        ///       uv call


        var lat = response.coord.lat;
        var lon = response.coord.lon;
        var queryURLuvindex = "https://api.openweathermap.org/data/2.5/uvi?q=&appid=6bbd53d46de3755aee4c32c7e592cb12&lat=" + lat + "&lon=" + lon;

        $.ajax({
            url: queryURLuvindex,
            method: "GET"
        }).then(function (response) {
            $("#uv-show").empty();
            var result = response.value;
            //new div //button thing for display
            var uvone = $("<button class='btn bg-success'>").text("UV INDEX:" + response.value);

            $("#uv-show").html(uvone);

        });

    });


    // 5 day forecast

    $.ajax({
        url: queryURL2,
        method: "GET"


    }).then(function (response) {
        //array 
        var results = response.list;


        //5-forecast div

        $("#5-forecast").empty();
        //info for div

        for (var i = 0; i < results.length; i += 8) {
            
            //making div




            var forecastdiv = $("<div class='card     text-white  bg-primary mb-5' style ='width:136px; height:176px;'>");



            //storing the response



            var date1 = results[i].dt_txt;
            var date2 = date1.substr(0, 10);
            var temp = results[i].main.temp;
            var humidity = results[i].main.humidity;




            // creating tags with results

            var h5d = $("<h5 class='card-heading'>").text(date2);
            var temp1 = $("<p class='card-text'>").text("Temp:" + temp);
            var humidity1 = $("<p class='card-text'>").text("Humidity:" + humidity);
            var weth = results[i].weather[0].main;





            if (weth === "Clouds") {

                var wethicon = $("<img>").attr("src", "http://openweathermap.org/img/wn/03d.png");
                wethicon.attr("style", "height:40px; width:40px");
            }
            else if (weth === "Clear") {
                var wethicon = $("<img>").attr("src", "http://openweathermap.org/img/wn/01d.png");
                wethicon.attr("style", "height:40px; width:40px");
            }
            else if (weth === "Rain") {
                var wethicon = $("<img>").attr("src", "http://openweathermap.org/img/wn/09d.png");
                wethicon.attr("style", "height:40px; width:40px");

            }
            //append
            forecastdiv.append(h5d);
            forecastdiv.append(temp1);
            forecastdiv.append(humidity1);
            forecastdiv.append(wethicon);
            $("#5-forecast").append(forecastdiv);


        }
    });

}




// main handler


$("#select-btn").on("click", function (e) {
    e.preventDefault();
    var usercityinput = $("#user-city-input").val().trim();

    // Normalize all city name by converting it to lowercase
    var text = String($(this).siblings("input").val().trim()).toLowerCase(); // children of input

    // Push city to lsearch array only if the city is not included in the array
    if (!lsearch.includes(text)) {
        lsearch.push(text);
    } else {               // city is included in array so let's move it to the end of array
        var indexOfCity = lsearch.indexOf(text);     // get index where city is located
        lsearch.splice(indexOfCity, 1);    // remove city from array at desired index
        lsearch.push(text);       // append to end of array
    }

    localStorage.setItem("cityName", JSON.stringify(lsearch));
    searchCity(usercityinput);


    //edit value of #search-history to reflect what is now in local storage or in lsearch
    var currentCities = JSON.parse(localStorage.getItem('cityName'))
    console.log(currentCities)

    //forEach --> run functionality on each item in the array
    $('#search-history').empty()
    currentCities.forEach(function (currentValue) {
        // var newButton = document.createElement('button')

        var newthing = $("<div class='d1'>").text(currentValue)
        //newthing.append(div)
        newthing.prepend = $("<div>");
        //newthing.html = currentValue
        $('#search-history').append(newthing)
    })

});




function pageshow() {


    if (lsearch.length > 0) {
        searchCity(lsearch[lsearch.length - 1]);



    }
}
$("#search-history").on('click', '.btn', function (e) {
    e.preventDefault();
    //console.log($(this).text());
    searchCity($("#user-city-input").val().trim())
});

pageshow();