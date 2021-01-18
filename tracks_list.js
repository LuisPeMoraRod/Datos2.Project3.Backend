class TracksList{
    constructor(){
        var tracks = [];
        this.tracks = tracks;
    }

    addTracks(new_tracks){
        if (this.tracks.length > 0){
            this.tracks.push(new_tracks);
            
        }else{
            this.tracks = new_tracks;
        }
    }

    getTracks(){
        return this.tracks;
    }

    reset(){
        this.tracks.splice(0, this.tracks.length);
    }
}

module.exports = TracksList;