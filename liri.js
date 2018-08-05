require("dotenv").config();
// all requirements to run 
var keys = require("./keys.js");
var request = require("request");
var twitter = require("twitter");
var Spotify = require("node-spotify-api");
var fs = require("fs");
var client = new twitter(keys.twitter);
var spotify = new Spotify(keys.spotify);


var command = process.argv[2];
var searchCommand = process.argv;

var x = "";
//attaches multiple word arguments
for (var i = 3; i < searchCommand.length; i++) {
    if (i > 3 && i < searchCommand.length) {
        x = x + "+" + searchCommand[i];
    } else {
        x = x + searchCommand[i];
    }
}

//SWITCHHHHHH!!! 
switch (command) {
    case "my-tweets":
        myTweets();
        break;

    case "movie-this":
        if (x) {
            movieData(x)
        } else {
            movieData("Mr. Nobody")
        }
        break;

    case "spotify-this-song":
        if (x) {
            spotifySearch(x);
        } else {
            spotifySearch("The Sign");
        }
        break;

    case "do-what-it-says":
        doThingy();
        break;
}

//first function -- grab tweets from Twitter page 
function myTweets() {
    var screenName = {screen_name: 'cr8tvlyCHI'};
    client.get('statuses/user_timeline', screenName, function (error, tweets, response) {
        if (!error) {
            for (var i = 0; i < tweets.length; i++) {
                console.log("@cr8tvlyCHI: " + tweets[i].text);
                console.log("------------------------");
                //adds text to log.txt
                fs.appendFile("log.txt", "@cr8tvlyCHI: " + tweets[i].text, (error) => { /* handle error */ });
                fs.appendFile("log.txt", "-----------", (error) => { /* handle error */ });
            }
        } else {
            console.log("Error!");

        }
    });
}

// second function -- grab movie data from OMDB
function movieData(movie) {
    var omdbURL = 'http://www.omdbapi.com/?apikey=trilogy&t=' + movie;

    request(omdbURL, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var body = JSON.parse(body);

            console.log("Title: " + body.Title);
            console.log("Release Year: " + body.Year);
            console.log("IMdB Rating: " + body.imdbRating);
            console.log("Country: " + body.Country);
            console.log("Language: " + body.Language);
            console.log("Plot: " + body.Plot);
            console.log("Actors: " + body.Actors);
            console.log("Rotten Tomatoes Rating: " + body.tomatoRating);
            console.log("Rotten Tomatoes URL: " + body.tomatoURL);

            //adds text to log.txt
            fs.appendFile('log.txt', "Title: " + body.Title, (error) => { /* handle error */ });
            fs.appendFile('log.txt', "Release Year: " + body.Year, (error) => { /* handle error */ });
            fs.appendFile('log.txt', "IMdB Rating: " + body.imdbRating, (error) => { /* handle error */ });
            fs.appendFile('log.txt', "Country: " + body.Country, (error) => { /* handle error */ });
            fs.appendFile('log.txt', "Language: " + body.Language, (error) => { /* handle error */ });
            fs.appendFile('log.txt', "Plot: " + body.Plot, (error) => { /* handle error */ });
            fs.appendFile('log.txt', "Actors: " + body.Actors, (error) => { /* handle error */ });
            fs.appendFile('log.txt', "Rotten Tomatoes Rating: " + body.tomatoRating, (error) => { /* handle error */ });
            fs.appendFile('log.txt', "Rotten Tomatoes URL: " + body.tomatoURL, (error) => { /* handle error */ });

        } else {
            console.log('Error occurred.')
        }
        if (movie === "Mr. Nobody") {
            console.log("-----------------------");
            console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
            console.log("It's on Netflix!");

            //adds text to log.txt
            fs.appendFile('log.txt', "-----------------------", (error) => { /* handle error */ });
            fs.appendFile('log.txt', "If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/", (error) => { /* handle error */ });
            fs.appendFile('log.txt', "It's on Netflix!", (error) => { /* handle error */ });
        }
    });

}

// third function -- search song through spotify 
function spotifySearch(song) {
    spotify.search({ type: 'track', query: song }, function (error, data) {
        if (!error) {
            for (var i = 0; i < data.tracks.items.length; i++) {
                var songInfo = data.tracks.items[i];
                //artist
                console.log("Artist: " + songInfo.artists[0].name);
                //song name
                console.log("Song: " + songInfo.name);
                //spotify preview link
                console.log("Preview URL: " + songInfo.preview_url);
                //album name
                console.log("Album: " + songInfo.album.name);
                console.log("-----------------------");

                //adds text to log.txt
                fs.appendFile('log.txt', songInfo.artists[0].name, (error) => { /* handle error */ });
                fs.appendFile('log.txt', songInfo.name, (error) => { /* handle error */ });
                fs.appendFile('log.txt', songInfo.preview_url, (error) => { /* handle error */ });
                fs.appendFile('log.txt', songInfo.album.name, (error) => { /* handle error */ });
                fs.appendFile('log.txt', "-----------------------", (error) => { /* handle error */ });
            }
        } else {
            console.log('Error!');
        }
    });
};

// last function -- grab text from random.txt file and search through spotify 
function doThingy() {
    fs.readFile('random.txt', "utf8", function (error, data) {
        var txt = data.split(',');

        spotifySearch(txt[1]);
    });
}