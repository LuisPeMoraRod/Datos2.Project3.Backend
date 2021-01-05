const express = require('express');
const app = express();
//const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3050; // Process.env.PORT if app deployed to a hosting service or port 3050 for local use
const tracks = require('./tracks.route');
const Singleton = require('./singleton.js');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors()); // Necessary for cross-origin requests

let spotifyApiWppr = Singleton.getInstance(tracks.clientId, tracks.clientSecret); //First instance of SpotifyApiWrapper

// Routes for tracks management
app.use('/tracks', tracks.route);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
