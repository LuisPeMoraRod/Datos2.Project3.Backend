const express = require('express');
const tracksRoute = express.Router();
const Track = require('./tracks')
const OK = 200;

//var searchSpotify = require('./app');
//Routes
tracksRoute.route('/').get( function (req, res) {
    res.send('Welcome to API');
});

//Test Spotify API
tracksRoute.route('/search/:key').get( function (req, res) {
    const { word } = req.params.key;
    searchSpotify(word, res);
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

module.exports = tracksRoute;