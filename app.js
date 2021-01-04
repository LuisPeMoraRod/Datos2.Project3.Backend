const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3050; // Process.env.PORT if app deployed to a hosting service or port 3050 for local use
const tracksRoute = require('./tracks.route');
const Singleton = require('./singleton.js');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors()); // Necessary for cross-origin requests

// Spotify api credentials
var clientId = '014d418b4a6643979dda60d7448e4621',
    clientSecret = 'ce4f18746d1d4b499c65d089176de6c3';

let spotifyApiWppr = Singleton.getInstance(clientId, clientSecret);

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

app.get('/search/:key', (req, res) => {
    const { key } = req.params;
    searchSpotify(key, res);
});

function searchSpotify(searchingWord, res) {
    // Search tracks whose name, album or artist contains searchingWord
    spotifyApiWppr.spotifyApi.searchTracks(searchingWord)
        .then(function (data) {
            //console.log('Search by "Love"', data.body.tracks.items[0]);
            res.status(200).json(data.body.tracks.items[0]);
        }, function (err) {
            console.error(err);
        });
}
