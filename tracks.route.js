const express = require('express');
const tracksRoute = express.Router();
const Track = require('./tracks')
const mysql = require('mysql');
const lyricsParse = require('findthelyrics');
const SpotifyApiWrapper = require('./spotify_api_wrapper.js');

const OK = 200,
    BAD_REQUEST = 400,
    CONFLICT = 409;

// Spotify api credentials
var clientId = '014d418b4a6643979dda60d7448e4621',
    clientSecret = 'ce4f18746d1d4b499c65d089176de6c3';

let spotifyApiWppr = new SpotifyApiWrapper(clientId, clientSecret);

//Connection with MySql server
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Fibonacci112358',
    database: 'ODYSSEY_DB',
    multipleStatements: true
});

//Check connection to MySql server
connection.connect(error => {
    if (error) throw error;
    console.log('Database server running...')
});


//Routes
tracksRoute.route('/').get(function (req, res) {
    res.send('Welcome to Odyssey Music API');
});

/**
 * Service for searching tracks by name of song, artist or album. E.g.: http://localhost:3050/tracks/search?key=By the way&user_id=0
 */
tracksRoute.route('/search').get(function (req, res) {
    let key = req.query.key;
    let user_id = req.query.user_id;
    const sql = `SELECT * FROM SEARCH_HISTORY WHERE searching_key = '${key}'`;
    connection.query(sql, (error, results) => {
        if (error) res.status(CONFLICT).send("Error while searching in Database");
        if (results.length >= 0) { //If search was already made, search in DB
            searchDB(key, res);
        } else { // search in Spotify API
            var searched = {
                searching_key: key,
                user_id: user_id
            };
            addRequestToHistory(searched);
            searchSpotify(key, res);
        }
    });

});

tracksRoute.route('/search/lyrics').get(function (req, res) {
    let key = req.query.key;
    const sql = `SELECT * FROM TRACKS WHERE lyrics LIKE '%${key}%' LIMIT 0,10`
    connection.query(sql, (error, results) => {
        if (error) {
            res.status(CONFLICT).send(error);
        }
        else {
            res.status(OK).json(results);
        }
    });
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

/**
 * Search tracks whose name, album or artist contains searchingWord using Spotify API
 * @param {*} searchingWord 
 * @param {*} res 
 */
function searchSpotify(searchingWord, res) {
    spotifyApiWppr.spotifyApi.searchTracks(searchingWord) //uses Promises
        .then(function (data) {
            var items = data.body.tracks.items;
            var results = parseTracks(items);
            res.status(OK).json(results);

        }, function (err) {
            res.status(BAD_REQUEST).send('No search query');
            console.error(err);
        });
}

/**
 * Adds track to database
 * @param {*} trackObj 
 * @param {*} res 
 */
function addTrack(trackObj) {
    const sql = 'INSERT INTO TRACKS SET ?';
    connection.query(sql, trackObj, error => {
        if (error) {
            console.log('Error: duplicated track');
        }
        console.log(`Track ${trackObj.track_name} added to DB.`)
    });
}

/**
 * Adds a new value to SEARCH_HISTORY table in DB
 * @param {*} requestObj 
 */
function addRequestToHistory(requestObj) {
    const sql = 'INSERT INTO SEARCH_HISTORY SET ?';
    connection.query(sql, requestObj, error => {
        if (error) {
            console.log('Error: duplicated value');
        }
        console.log(`Registered  "${requestObj.searching_key}" to SEARCH_HISTORY.`)
    });
}

/**
 * Parse results from Sptify API to simplified json
 * @param {*} items 
 */
function parseTracks(items) {
    var tracks = [];
    for (i = 0; i < items.length / 2; i++) {
        var id = items[i].id;
        var track_name = items[i].name;
        var artist = items[i].artists[0].name;
        var album = items[i].album.name;
        var duration_ms = items[i].duration_ms;
        var release_date = items[i].album.release_date;

        var track = new Track(id, track_name, artist, album, duration_ms, release_date, null, null).getTrack();
        tracks.push(track);

        addTrack(track); //Add track to DB
        addLyrics(track_name, artist, id); //Add lyrics to track
    }
    return tracks;
}

/**
 * Search tracks whose name, album or artist contains searchingWord in the data-base
 * @param {*} key 
 * @param {*} res 
 */
function searchDB(key, res) {
    var keys = key.split(/\W+/);
    const sql = `SELECT * FROM TRACKS WHERE track_name LIKE '%${key}%' OR artist LIKE '%${key}%' OR album LIKE '%${key}%' OR lyrics LIKE '%${key}%' LIMIT 0,10;`;
    connection.query(sql, (error, results) => {
        if (error) {
            console.log(error);
        }
        else if (results.length > 0){
            res.status(OK).json(results);
        }else{
            searchSingleWord(keys, res);
        }
    });
    //res.status(OK).json('testing...');
}

/**
 * Searches in database using mulitple statements: one per word
 * @param {*} keys 
 */
function searchSingleWord(keys, res) {
    var sql = '';
    for (i = 0; i < keys.length; i++) {
        sql += `SELECT * FROM TRACKS WHERE track_name LIKE '%${keys[i]}%' OR artist LIKE '%${keys[i]}%' OR album LIKE '%${keys[i]}%' OR lyrics LIKE '%${keys[i]}%' LIMIT 0,10;`;
    }
    connection.query(sql, (error, results) => {
        if (error) {
            res.status(CONFLICT).send("Error while searching in Database");
            console.log(error);
        }
        else {
            tracks = concatenateResults(results);
            res.status(OK).json(tracks);
        }
    });
}

function concatenateResults(results){
    var tracks = results[0];
    for (i = 1; i < results.length; i++){
        tracks.concat(results[i])
    }
    return tracks;
}

/**
 * Add lyrics to specific song in DB
 * @param {*} track_name 
 * @param {*} artist 
 * @param {*} id 
 */
function addLyrics(track_name, artist, id) {
    lyricsParse.find(track_name, artist, function (err, resp) {
        if (!err) {
            var lyrics = resp.replace(/'/g, "`");
            const sql = `UPDATE TRACKS SET lyrics = '${lyrics}' WHERE id = '${id}'`;
            connection.query(sql, error => {
                if (!error) console.log('Lyrics added');
                else throw error;
            });
        } else {
            console.log(err)
        }
    });
    /*
    (async () => {
        const lyrics = await lyricsParse(track_name, artist); // Will return false if no lyrics found.

        const sql = `UPDATE TRACKS SET lyrics = '${lyrics}' WHERE id = '${id}'`;
        connection.query(sql, error => {
            //if (error) console.log(error);
            //else console.log('Lyrics added');
            if (!error) console.log('Lyrics added');
        });
      })();*/
}

//Exports module's variables
module.exports = {
    route: tracksRoute,
    clientId: clientId,
    clientSecret: clientSecret
};