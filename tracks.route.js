const express = require('express');
const tracksRoute = express.Router();
const Track = require('./tracks')
const mysql = require('mysql');

const OK = 200,
    BAD_REQUEST = 400,
    CONFLICT = 409;

    // Instance for Spotify API Wrapper
const Singleton = require('./singleton.js');

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

//Check connection to MySql server
connection.connect(error => {
    if (error) throw error;
    console.log('Database server running...')
});


//Routes
tracksRoute.route('/').get( function (req, res) {
    res.send('Welcome to Odyssey Music API');
});

/**
 * Get route for searching tracks by name of song, artist or album. E.g.: http://localhost:3050/tracks/search?key=Dosed
 */
tracksRoute.route('/search').get( function (req, res) {
    let key = req.query.key;
    searchSpotify(key, res);
});

/*
//Get all tracks
tracksRoute.route('/all').get(function (req, res) {
    const sql = 'SELECT * FROM TRACKS'
    connection.query(sql, (error, results) => {
        if (error) throw error;
        if (results.length > 0) {
            res.json(results);
        } else {
            res.send('No results found')
        }
    });
});

tracksRoute.route('/:id').get( function (req, res) {
    const { id } = req.params;
    const sql = `SELECT * FROM TRACKS WHERE ID = ${id}`;
    connection.query(sql, (error, results) => {
        if (error) throw error;
        if (results.length > 0) {
            res.json(results);
        } else {
            res.send('No results found')
        }
    });
});

tracksRoute.route('/add').post(function (req, res) {
    const sql = 'INSERT INTO TRACKS SET ?';

    const trackObj = {
        track_name: req.body.track_name,
        artist: req.body.artist
    }

    connection.query(sql, trackObj, error => {
        if (error) {
            res.send("Error: couldn't add track")
            throw error;
        }
        res.send('Track added');
    });
});

tracksRoute.route('/update/:id').put( function (req, res) {
    const { id } = req.params;
    const { track_name, artist } = req.body;
    const sql = `UPDATE TRACKS SET name = '${track_name}', artist = '${artist}' WHERTE id = ${id}`;
    connection.query(sql, trackObj, error => {
        if (error) throw error;
        res.send('Track updated');
    });
});

tracksRoute.route('/delete/:id').delete(function (req, res) {
    const { id } = req.params;
    const sql = `DELETE FROM TRACKS WHERE id = ${id}`;
    connection.query(sql, trackObj, error => {
        if (error) throw error;
        res.send('Track deleted');
    });
});
*/

function searchSpotify(searchingWord, res) {
    // Search tracks whose name, album or artist contains searchingWord (returns first one)
    spotifyApiWppr.spotifyApi.searchTracks(searchingWord)
        .then(function (data) {
            
            var id = data.body.tracks.items[0].id;
            var track_name = data.body.tracks.items[0].name;
            var artist = data.body.tracks.items[0].artists[0].name;
            var album = data.body.tracks.items[0].album.name;
            var duration_ms = data.body.tracks.items[0].duration_ms;
            var release_date = data.body.tracks.items[0].release_date;
            var track = new Track(id, track_name, artist, album, duration_ms, release_date, null);

            res.status(OK).json(track);

        }, function (err) {
            res.status(BAD_REQUEST).send('No search query');
            console.error(err);
        });
}

function addTrack(trackObj, res){
    const sql = 'INSERT INTO TRACKS SET ?';
    connection.query(sql, trackObj, error => {
        if (error) {
            res.status(CONFLICT).send("Error: couldn't add track")
            throw error;
        }
        res.status(OK).send('Track added');
    });
}

//Exports module's variables
module.exports = {
    route: tracksRoute,
    clientId: clientId,
    clientSecret: clientSecret
};