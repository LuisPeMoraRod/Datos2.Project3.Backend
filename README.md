The API uses a [Spotify API Wrapper](https://github.com/JMPerez/spotify-web-api-js.git) to get the metadata of each track which is then added to owned database. To add the lyrics of each song, it uses [findthelyrics](https://github.com/normanlol/findthelyrics) NPM package.

To run this API as a Node.js server you must install the following dependencies:

### `npm install express mysql cors nodemon spotify-web-api findthelyrics --save`

Run the server by hitting:

### `nodemon`

MySql server should be running in the localhost and accessed with root user.
