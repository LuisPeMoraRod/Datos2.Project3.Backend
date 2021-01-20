const express = require('express');
const usersRoute = express.Router();

const mysql = require('mysql');

const OK = 200,
    BAD_REQUEST = 400,
    CONFLICT = 409;

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

usersRoute.route('/').get(function(req, res) {
    res.send('Users Index Page');
});

// http://localhost:3050/users/search?email=moni&admin_status=0

usersRoute.route('/login').get(function (req, res) {
    let email = req.query.email;
    let admin_status = req.query.admin_status;
    const sql = `SELECT * FROM USERS WHERE user_id = '${email}'`;
    connection.query(sql, (error, results) => {
        if (error) res.status(CONFLICT).send("Error while searching in Database");
        if (results.length > 0) { //If search was already made, search in DB
            res.send('User already in de DB. Successfully logged in!');
        } 
        else { // search in Spotify API
            var new_user = {
                user_id: email,
                admin: admin_status
            };
            addUser(new_user);
            res.send('User added, successfully logged in!')
        }
    });
    
});

function addUser(userObj) {
    const sql = 'INSERT INTO USERS SET ?';
    connection.query(sql, userObj, error => {
        if (error) {
            console.log('Error: duplicated track');
        }
        console.log(`Track ${userObj.user_id} added to DB.`)
    });
}

function searchDB(key, res){
    const sql = `SELECT * FROM USERS WHERE user_id = '${email}'`;
    connection.query(sql, (error, results) => {
        if (error){
            res.status(CONFLICT).send(error);
        }
        else {
            res.status(OK).json(results);
        }
    });
}

module.exports = {
    route: usersRoute
};