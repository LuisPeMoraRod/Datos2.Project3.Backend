var SpotifyWebApi = require('spotify-web-api-node'); // Spotify web api wrapper

class SpotifyApiWrapper {

    constructor(clientId, clientSecret) {
        this.clientId = clientId,
        this.clientSecret = clientSecret;

        var spotifyApi = new SpotifyWebApi({
            clientId: this.clientId,
            clientSecret: this.clientSecret
        });

        
        this.spotifyApi = spotifyApi;

        spotifyApi.clientCredentialsGrant().then(
            function (data) {
                console.log('The Spotify API access token is ' + data.body['access_token'] + ' and it expires in ' + data.body['expires_in']);

                // Save the access token so that it's used in future calls
                spotifyApi.setAccessToken(data.body['access_token']);
            },
            function (err) {
                console.log('Something went wrong when retrieving an access token', err);
            }
        );

    }

}

module.exports = SpotifyApiWrapper;
