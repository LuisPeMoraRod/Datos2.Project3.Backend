CREATE DATABASE ODYSSEY_DB;

USE ODYSSEY_DB;
SELECT * FROM USERS;
INSERT INTO USERS(user_id, admin) VALUES ('isaac', TRUE);
DELETE FROM USERS WHERE user_id='mariana';

CREATE TABLE TRACKS (
    id VARCHAR(100) PRIMARY KEY ,
    track_name VARCHAR(100),
    artist VARCHAR(100),
    album VARCHAR(100),
    duration_ms INT,
    release_date VARCHAR(100),
    lyrics TEXT,
    youtubeLink VARCHAR(100)
);

CREATE TABLE SEARCH_HISTORY(
    searching_key VARCHAR(100) PRIMARY KEY ,
    user_id SMALLINT
);

CREATE TABLE USERS(
    user_id VARCHAR(100) PRIMARY KEY,
    admin BOOLEAN
);