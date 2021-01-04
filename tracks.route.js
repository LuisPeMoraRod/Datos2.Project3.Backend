const express = require('express');
const tracksRoute = express.Router();
const Track = require('./tracks')

//Routes
tracksRoute.route('/').get( function (req, res) {
    res.send('Welcome to API');
});

/*
//Test Spotify API
app.get('/search/:word', (req, res) => {
    const { word } = req.params;
    const result = searchSpotify(word);
    //const result = search2();
    res.send(result);
});

//all tracks
app.get('/tracks', (req, res) => {
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

app.get('/tracks/:id', (req, res) => {
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

app.post('/add', (req, res) => {
    const sql = 'INSERT INTO TRACKS SET ?';

    const trackObj = {
        track_name: req.body.track_name,
        artist: req.body.artist
    }

    connection.query(sql, trackObj, error => {
        if (error) throw error;
        res.send('Track added');
    });
});

app.put('/update/:id', (req, res) => {
    const { id } = req.params;
    const { track_name, artist } = req.body;
    const sql = `UPDATE TRACKS SET name = '${track_name}', artist = '${artist}' WHERTE id = ${id}`;
    connection.query(sql, trackObj, error => {
        if (error) throw error;
        res.send('Track updated');
    });
});

app.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM TRACKS WHERE id = ${id}`;
    connection.query(sql, trackObj, error => {
        if (error) throw error;
        res.send('Track deleted');
    });
});

function searchSpotify(searchingWord) {
    // Search tracks whose name, album or artist contains 'Love'
    spotifyApi.searchTracks(searchingWord)
        .then(function (data) {
            console.log('Search by "Love"', data.body.tracks.items[1].type);
            return data.body.tracks;
        }, function (err) {
            console.error(err);
            return err;
        });
}

function search2() {
    // Get album
    spotifyApi.getAlbum('5U4W9E5WsYb2jUQWePT8Xm')
        .then(function (data) {
            console.log('Album information', data.body);
        }, function (err) {
            console.error(err);
        });
    return true;
}*/
module.exports = tracksRoute;