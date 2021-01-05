class Track {
    constructor(id, track_name, artist, album, duration_ms, release_date, lyrics, youtubeLink){
        this.id = id;
        this.track_name = track_name;
        this.artist = artist;
        this.album = album;
        this.duration_ms = duration_ms;
        this.release_date = release_date;
        this.lyrics = lyrics;
        this.youtubeLink = youtubeLink;
    }
    getTrack(){
        var track = {
            id: this.id,
            track_name: this.track_name,
            artist: this.artist,
            album: this.album,
            duration_ms: this.duration_ms,
            release_date: this.release_date,
            lyrics: this.lyrics,
            youtubeLink: this.youtubeLink
        }
        return track;
    }
}

module.exports = Track;