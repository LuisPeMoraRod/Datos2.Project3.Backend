const express = require('express');
const usersRoute = express.Router();

usersRoute.get('/', (req, res)=> {
    res.send('Users Index Page');
});

module.exports = {
    route: usersRoute
}