const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3050; // Process.env.PORT if app deployed to a hosting service or port 3050 for local use
const tracksRoute = require('./tracks.route');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors()); // Necessary for cross-origin requests

var SpotifyWebApi = require('spotify-web-api-node'); // Spotify web api wrapper

// Spotify api credentials
var clientId = '014d418b4a6643979dda60d7448e4621',
    clientSecret = 'ce4f18746d1d4b499c65d089176de6c3';

// Create the api object with the credentials
var spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant().then(
    function (data) {
        console.log('The access token expires in ' + data.body['expires_in']);
        console.log('The access token is ' + data.body['access_token']);

        // Save the access token so that it's used in future calls
        spotifyApi.setAccessToken(data.body['access_token']);
    },
    function (err) {
        console.log('Something went wrong when retrieving an access token', err);
    }
);

//Connection with MySql server
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Fibonacci112358',
    database: 'ODYSSEY_DB'
});

// Routes for tracks management
app.use('/tracks', tracksRoute);

//Check connection
connection.connect(error => {
    if (error) throw error;
    console.log('Database server running...')
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
