class Track {
    constructor(id, name, artist, album, duration_ms, release_date, youtubeLink){
        this.id = id;
        this.name = name;
        this.artist = artist;
        this.album = album;
        this.duration_ms = duration_ms;
        this.release_date = release_date;
        this.youtubeLink = youtubeLink;
    }
    getTrack(){
        var track = {
            id: this.id,
            track_name: this.name,
            artist: this.artist,
            album: this.album,
            duration_ms: this.duration_ms,
            release_date: this.release_date,
            youtubeLink: this.youtubeLink
        }
        return track;
    }
}

module.exports = Track;