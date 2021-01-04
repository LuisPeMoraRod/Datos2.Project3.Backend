const SpotifyApiWrapper = require('./spotify_api_wrapper.js');

var singleton = (function(){
    var instance;

    function createInstance(clientId, clientSecret){
        var wrapper = new SpotifyApiWrapper(clientId, clientSecret);
        return wrapper;
    }

    return {
        getInstance: function(clientId, clientSecret){
            if (!instance) {
                instance = createInstance(clientId, clientSecret);
            }
            return instance;
        }
    };
})();

module.exports = singleton;