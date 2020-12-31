const express = require('express');
const mysql = require('mysql');

const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3050; //process.env.PORT if app deployed to a hosting service or port 3050 for local use

const app = express();

app.use(bodyParser.json());

//MySql
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Fibonacci112358',
    database: 'ODYSSEY_DB'
});

//Check connection
connection.connect(error => {
    if (error) throw error;
    console.log('Database server running...')
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

//Routes
app.get('/', (req, res) => {
    res.send('Welcome to API');
});

//all tracks
app.get('/tracks', (req, res) => {
    const sql = 'SELECT * FROM TRACKS'
    connection.query(sql, (error, results) => {
        if (error) throw error;
        if (results.length > 0){
            res.json(results);
        } else {
            res.send('No results found')
        }
    });
});

app.get('/tracks/:id', (req, res) => {
    const {id} = req.params;
    const sql = `SELECT * FROM TRACKS WHERE ID = ${id}`;
    connection.query(sql, (error, results) => {
        if (error) throw error;
        if (results.length > 0){
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
    const {id} = req.params;
    const{track_name, artist} = req.body;
    const sql = `UPDATE TRACKS SET name = '${track_name}', artist = '${artist}' WHERTE id = ${id}`;
    connection.query(sql, trackObj, error => {
        if (error) throw error;
        res.send('Track updated');
    });
});

app.delete('/delete/:id', (req, res) => {
    const {id} = req.params;
    const sql = `DELETE FROM TRACKS WHERE id = ${id}`;
    connection.query(sql, trackObj, error => {
        if (error) throw error;
        res.send('Track deleted');
    });
});