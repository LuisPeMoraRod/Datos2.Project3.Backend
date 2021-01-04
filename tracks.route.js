const express = require('express');
const tracksRoute = express.Router();
const Track = require('./tracks')
const OK = 200;
const Singleton = require('./singleton.js');

// Spotify api credentials
var clientId = '014d418b4a6643979dda60d7448e4621',
    clientSecret = 'ce4f18746d1d4b499c65d089176de6c3';

let spotifyApiWppr = Singleton.getInstance(clientId, clientSecret);

//var searchSpotify = require('./app');
//Routes
tracksRoute.route('/').get( function (req, res) {
    res.send('Welcome to API');
});

//Test Spotify API
tracksRoute.route('/search/:key').get( function (req, res) {
    const { key } = req.params;
    searchSpotify(key, res);
    //res.status(OK).json(result);
});

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

function searchSpotify(searchingWord, res) {
    // Search tracks whose name, album or artist contains searchingWord
    spotifyApiWppr.spotifyApi.searchTracks(searchingWord)
        .then(function (data) {
            //console.log('Search by "Love"', data.body.tracks.items[0]);
            res.status(200).json(data.body.tracks.items[0]);
        }, function (err) {
            res.status(400).send('No search query');
            console.error(err);
        });
}

module.exports = tracksRoute;