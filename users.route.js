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

const auth_operation = 0;

//Check connection to MySql server
connection.connect(error => {
    if (error) throw error;
    console.log('Database server running...')
});

usersRoute.route('/').get(function(req, res) {
    res.send('Users Index Page');
});

// Service to log in an user and if the user is not in the DB it adds him/her http://localhost:3050/users/login?email=moni

usersRoute.route('/login').post(function (req, res) {
    let email = req.query.email;
    const sql = `SELECT * FROM USERS WHERE user_id = '${email}'`;
    connection.query(sql, (error, results) => {
        if (error) res.status(CONFLICT).send("Error while searching in Database");
        if (results.length > 0) { //If search was already made, search in DB
            res.send('User already in de DB. Successfully logged in!');
        } 
        else { // search in Spotify API
            var new_user = {
                user_id: email,
                admin: 0
            };
            addUser(new_user);
            res.send('User added, successfully logged in!')
        }
    });
    
});

// Service that returns a list of all the users that have used the Odissey extension http://localhost:3050/users/list?key=moni
usersRoute.route('/list').get(function (req, res) {
    let key = req.query.key;
    let operation = 1;
    let email = "";
    searchDB(key, res, operation, email);
    
});

// Service that looks for a specific user using its id http://localhost:3050/users/search?key=mariana&email=moni
usersRoute.route('/search').get(function (req, res) {
    let email = req.query.email;
    let key = req.query.key;
    let operation = 2;
    searchDB(key, res, operation, email);  
});

usersRoute.route('/delete').delete(function (req, res) {
    let email = req.query.email;
    let key = req.query.key;
    const sql = `DELETE FROM USERS WHERE user_id = '${key}'`;
    connection.query(sql, (error, results) => {
        if (error){
            res.status(CONFLICT).send(error);
        }
        else {
            res.status(OK).json(results);
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

function searchDB(key, res, operation, email){
    const sql = `SELECT * FROM USERS WHERE user_id = '${key}'`;
    connection.query(sql, (error, results) => {
        if (error){
            res.status(CONFLICT).send(error);
        }
        if (results.length > 0) { 
            if(operation == 1){
                getUsersList(res);
            }
            else if(operation == 2){
                searchUser(email, res);
            }   
        } 
        else { 
            res.send('The user is not logged in!')
        }
    
    });
}

function getUsersList(res){
    const sql = `SELECT user_id FROM USERS`;
    connection.query(sql, (error, results) => {
        if (error){
            res.status(CONFLICT).send(error);
        }
        else {
            res.status(OK).json(results);
        }
    });   
}

function searchUser(email, res){
    const sql = `SELECT * FROM USERS WHERE user_id = '${email}'`;
    connection.query(sql, (error, results) => {
        if (error){
            res.status(CONFLICT).send(error);
        }
        if (results.length > 0) { 
            res.status(OK).json(results);
   
        } 
        else { 
            res.send('The user doesn´t exists!')
        }
    
    });
}


module.exports = {
    route: usersRoute
};