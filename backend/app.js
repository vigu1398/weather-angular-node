const express = require('express');
const bodyParser = require("body-parser");
const https = require("https");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var apiURL = "";
var posts = [];
const cities = ["Chennai", "Paris", "London", "Tokyo", "Austin", "Delhi"];
var weatherPost;

//console.log("Initialising posts");

//Fetching API results(weatherData) for all the three cities
for(let i = 0; i < cities.length; i++)
{
    apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cities[i] + "&appid=296079397582aa152131923c3b944490&units=metric";
    https.get(apiURL, function(getResponse)
    {
        getResponse.on("data", function(data)
        {
            var weatherData = JSON.parse(data);
            var weatherTemp = weatherData.main.temp;
            var main = weatherData.weather[0].main;
            var weatherDescription = weatherData.weather[0].description;
            console.log("Weather found");
            weatherPost = {city: cities[i], temp: weatherTemp, description: weatherDescription, lon:weatherData.coord.lon, lat:weatherData.coord.lat, humidity: weatherData.main.humidity, main: main};
            console.log(weatherPost);
            posts.push(weatherPost);

        });
    });
}


// Adding headers for the CORS browser error.
app.use((req, res, next) =>
{
    console.log("Headers");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods","GET, POST, PATCH, DELETE, OPTIONS");
    next();
});


app.post("/api/posts", (req, res, next) =>
{
    const post = req.body;
    console.log(post);
    res.status(201).json
    ({
        message: 'Post added successfully'
    });
});

// Returning the fetched API results to the Angular App.
app.use("/api/posts", function(request, response, next)
{
    console.log("My first middleware");
    console.log("sending post");
    return response.status(200).json({posts: posts});

});

module.exports = app;
