const express = require('express');
const bodyParser = require("body-parser");
const https = require("https");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var apiURL = "";
var posts = [];
const cities = ["Chennai", "Paris", "London"];
var weatherPost;

console.log("Initialising posts");

for(let i = 0; i < cities.length; i++)
{
    apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cities[i] + "&appid=296079397582aa152131923c3b944490&units=metric";
    https.get(apiURL, function(getResponse)
    {
        getResponse.on("data", function(data)
        {
            var weatherData = JSON.parse(data);
            var weatherTemp = weatherData.main.temp;
            var weatherDescription = weatherData.weather[0].description;
            console.log("Weather found");
            weatherPost = {city: cities[i], temp: weatherTemp, description: weatherDescription, lon:weatherData.coord.lon, lat:weatherData.coord.lat, humidity: weatherData.main.humidity};
            console.log(weatherData.main.humidity, weatherData.main.humidity);
            posts.push(weatherPost);
        });
    });
}

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

app.use("/api/posts", function(request, response, next)
{
    console.log("My first middleware");
    console.log("sending post");
    return response.status(200).json({posts: posts});

});

module.exports = app;
