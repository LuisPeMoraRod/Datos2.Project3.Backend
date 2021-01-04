class Track {
    constructor(name, artist, album, length, year, genre, youtubeLink){
        this.name = name;
        this.artist = artist;
        this.album = album;
        this.length = length;
        this.year = year;
        this.genre = genre;
        this.youtubeLink = youtubeLink;
    }
    getTrack(){
        var track = {
            track_name: this.name,
            artist: this.artist,
            album: this.album,
            length: this.length,
            year: this.year,
            genre: this.genre,
            youtubeLink: this.youtubeLink
        }
        return track;
    }
}