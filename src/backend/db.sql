--
-- PostgreSQL database dump
-- Currently just copy-pasting to pgAdmin query tool, but it should work.
-- Will populate more of it tomorrow... :(

-- Use this if you want to make a new database:
-- DROP DATABASE IF EXISTS dog-db;
-- CREATE DATABASE dog-db

---
--- drop tables
---

DROP TABLE IF EXISTS taggedin CASCADE;
DROP TABLE IF EXISTS photo CASCADE;
DROP TABLE IF EXISTS video CASCADE;
DROP TABLE IF EXISTS post_media_date CASCADE;
DROP TABLE IF EXISTS post_media CASCADE;
DROP TABLE IF EXISTS schedules CASCADE;
DROP TABLE IF EXISTS on_meetup CASCADE;
DROP TABLE IF EXISTS post_walk_tag CASCADE;
DROP TABLE IF EXISTS post_walk_content CASCADE;
DROP TABLE IF EXISTS post_walk_owner CASCADE;
DROP TABLE IF EXISTS post_walk CASCADE;
DROP TABLE IF EXISTS wentfor CASCADE;
DROP TABLE IF EXISTS walk_dist CASCADE;
DROP TABLE IF EXISTS walk_date CASCADE;
DROP TABLE IF EXISTS walk CASCADE;
DROP TABLE IF EXISTS owns_dog_birthday CASCADE;
DROP TABLE IF EXISTS owns_dog CASCADE;
DROP TABLE IF EXISTS logs CASCADE;
DROP TABLE IF EXISTS organizes_walktask CASCADE;
DROP TABLE IF EXISTS walkalert CASCADE;
DROP TABLE IF EXISTS friendpost CASCADE;
DROP TABLE IF EXISTS receives_notifications CASCADE;
DROP TABLE IF EXISTS friendship CASCADE;
DROP TABLE IF EXISTS owner_name CASCADE;
DROP TABLE IF EXISTS owner_contact CASCADE;
DROP TABLE IF EXISTS owner CASCADE;


--
-- drop enum types
--

DROP TYPE IF EXISTS event_type;
DROP TYPE IF EXISTS rate_score;

--
-- create enum types
--
CREATE TYPE event_type AS ENUM('walk', 'run', 'hike', 'dog park');
CREATE TYPE rate_score AS ENUM('1', '2', '3', '4', '5');

--
-- create tables
--

-- owner tables
CREATE TABLE IF NOT EXISTS owner (
    ownerid SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS owner_name (
    ownerid INTEGER PRIMARY KEY,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    FOREIGN KEY (ownerid) REFERENCES owner (ownerid) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS owner_contact (
    email VARCHAR(255) PRIMARY KEY,
    phonenumber VARCHAR(255) UNIQUE,
    FOREIGN KEY (email) REFERENCES owner (email) ON DELETE CASCADE ON UPDATE CASCADE
);

-- friendship table
CREATE TABLE IF NOT EXISTS friendship (
    ownerid1 INTEGER,
    ownerid2 INTEGER,
    dateoffriendship DATE NOT NULL,
    PRIMARY KEY(ownerid1, ownerid2),
    FOREIGN KEY (ownerid1) REFERENCES owner (ownerid) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (ownerid2) REFERENCES owner (ownerid) ON DELETE CASCADE ON UPDATE CASCADE
);

-- notification table
CREATE TABLE IF NOT EXISTS receives_notifications (
    notificationid SERIAL PRIMARY KEY,
    ownerid INTEGER NOT NULL,
    notifcontent VARCHAR(255),
    FOREIGN KEY (ownerid) REFERENCES owner (ownerid) ON DELETE CASCADE ON UPDATE CASCADE
);

-- friend post tables
CREATE TABLE IF NOT EXISTS friendpost ( 
    notificationid INTEGER PRIMARY KEY,
    postlink VARCHAR(255) NOT NULL,
    friendname VARCHAR(255) NOT NULL,
    UNIQUE (notificationid, postlink),
    FOREIGN KEY (notificationid) REFERENCES receives_notifications (notificationid) ON DELETE CASCADE
);

-- walk alert tables
CREATE TABLE IF NOT EXISTS walkalert (
    notificationid INTEGER PRIMARY KEY,
    dogname VARCHAR(255) NOT NULL,
    FOREIGN KEY (notificationid) REFERENCES receives_notifications (notificationid) ON DELETE CASCADE
);

-- organizes walk task tables
CREATE TABLE IF NOT EXISTS organizes_walktask (
    taskid SERIAL PRIMARY KEY,
    ownerid INTEGER NOT NULL,
    date DATE,
    walkeventtype event_type,
    FOREIGN KEY (ownerid) REFERENCES owner (ownerid) ON DELETE NO ACTION ON UPDATE CASCADE
);

-- log table
CREATE TABLE IF NOT EXISTS logs (
    notificationid INTEGER,
    taskid INTEGER,
    PRIMARY KEY (notificationid, taskid),
    FOREIGN KEY (notificationid) REFERENCES receives_notifications (notificationid) ON DELETE CASCADE,
    FOREIGN KEY (taskid) REFERENCES organizes_walktask (taskid) ON DELETE CASCADE
);

-- dog tables
CREATE TABLE IF NOT EXISTS owns_dog (
    dogid SERIAL PRIMARY KEY,
    ownerid INTEGER NOT NULL,
    name VARCHAR(255),
    breed VARCHAR(255),
    UNIQUE (name, ownerid, breed),
    FOREIGN KEY (ownerid) REFERENCES owner (ownerid) ON DELETE NO ACTION ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS owns_dog_birthday (
    dogid INTEGER PRIMARY KEY,
    ownerid INTEGER NOT NULL,
    name VARCHAR(255),
    birthday DATE,
    UNIQUE (name, ownerid, birthday),
    FOREIGN KEY (dogid) REFERENCES owns_dog (dogid) ON DELETE CASCADE,
    FOREIGN KEY (ownerid) REFERENCES owner (ownerid) ON DELETE NO ACTION ON UPDATE CASCADE
);

-- walk tables
CREATE TABLE IF NOT EXISTS walk (
    walkid SERIAL PRIMARY KEY,
    location VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS walk_date (
    walkid INTEGER PRIMARY KEY,
    date DATE,
    FOREIGN KEY (walkid) REFERENCES walk (walkid) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS walk_dist (
    walkid INTEGER PRIMARY KEY,
    distance FLOAT,
    FOREIGN KEY (walkid) REFERENCES walk (walkid) ON DELETE CASCADE
);

-- went for table (dog-walk relationship)
CREATE TABLE IF NOT EXISTS wentfor (
    dogid INTEGER,
    walkid INTEGER,
    rating rate_score,
    PRIMARY KEY (dogid, walkid),
    FOREIGN KEY (dogid) REFERENCES owns_dog (dogid) ON DELETE CASCADE,
    FOREIGN KEY (walkid) REFERENCES walk (walkid) ON DELETE CASCADE
);

-- post walk tables
CREATE TABLE IF NOT EXISTS post_walk (
    postid SERIAL PRIMARY KEY,
    walkid INTEGER UNIQUE NOT NULL,
    FOREIGN KEY (walkid) REFERENCES walk (walkid) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS post_walk_owner (
    postid SERIAL PRIMARY KEY,
    ownerid INTEGER NOT NULL,
    FOREIGN KEY (ownerid) REFERENCES owner (ownerid) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS post_walk_content (
    postid INTEGER PRIMARY KEY,
    content VARCHAR(255),
    FOREIGN KEY (postid) REFERENCES post_walk (postid) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS post_walk_tag (
    postid INTEGER,
    tag VARCHAR(255),
    PRIMARY KEY (postid, tag),
    FOREIGN KEY (postid) REFERENCES post_walk (postid) ON DELETE CASCADE
);

-- meet up table
CREATE TABLE IF NOT EXISTS on_meetup (
    meetupid SERIAL PRIMARY KEY,
    walkid INTEGER NOT NULL,
    time TIME,
    location VARCHAR(255),
    date DATE,
    FOREIGN KEY (walkid) REFERENCES walk (walkid) ON DELETE CASCADE ON UPDATE CASCADE
);

-- schedule table
CREATE TABLE IF NOT EXISTS schedules (
    meetupid INTEGER,
    ownerid INTEGER,
    PRIMARY KEY (meetupid, ownerid),
    FOREIGN KEY (meetupid) REFERENCES on_meetup (meetupid) ON DELETE CASCADE,
    FOREIGN KEY (ownerid) REFERENCES owner (ownerid) ON DELETE NO ACTION ON UPDATE CASCADE
);

-- post media tables
CREATE TABLE IF NOT EXISTS post_media (
    postid INTEGER,
    mediaid SERIAL UNIQUE,
    url VARCHAR(255) UNIQUE NOT NULL,
    PRIMARY KEY (postid, mediaid),
    FOREIGN KEY (postid) REFERENCES post_walk (postid) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS post_media_date (
    url VARCHAR(255) PRIMARY KEY,
    datecreated DATE,
    FOREIGN KEY (url) REFERENCES post_media (url) ON DELETE CASCADE
);

-- video table
CREATE TABLE IF NOT EXISTS video (
    mediaid INTEGER PRIMARY KEY,
    duration TIME,
    FOREIGN KEY (mediaid) REFERENCES post_media (mediaid) ON DELETE CASCADE
);

-- photo table
CREATE TABLE IF NOT EXISTS photo (
    mediaid INTEGER PRIMARY KEY,
    filter VARCHAR(255),
    FOREIGN KEY (mediaid) REFERENCES post_media (mediaid) ON DELETE CASCADE
);

-- tagged in table
CREATE TABLE IF NOT EXISTS taggedin (
    dogid INTEGER,
    postid INTEGER,
    PRIMARY KEY (dogid, postid),
    FOREIGN KEY (dogid) REFERENCES owns_dog (dogid) ON DELETE CASCADE,
    FOREIGN KEY (postid) REFERENCES post_walk (postid) ON DELETE CASCADE
);


--
-- insertions :(
--

-- owner tables
INSERT INTO owner (email) VALUES ('john@example.com');
INSERT INTO owner_name (ownerid, firstname, lastname) VALUES (1, 'John', 'Doe');
INSERT INTO owner_contact (email, phonenumber) VALUES ('john@example.com', '1234567890');

INSERT INTO owner (email) VALUES ('beanstalk@example.com');
INSERT INTO owner_name (ownerid, firstname, lastname) VALUES (2, 'Jack', 'Bean');
INSERT INTO owner_contact (email, phonenumber) VALUES ('beanstalk@example.com', '0987654321');

INSERT INTO owner (email) VALUES ('one@example.com');
INSERT INTO owner_name (ownerid, firstname, lastname) VALUES (3, 'One', 'Three');
INSERT INTO owner_contact (email, phonenumber) VALUES ('one@example.com', '131313131');

INSERT INTO owner (email) VALUES ('null@example.com');
INSERT INTO owner_name (ownerid, firstname, lastname) VALUES (4, 'Null', 'Ly');
INSERT INTO owner_contact (email, phonenumber) VALUES ('null@example.com', null);

INSERT INTO owner (email) VALUES ('popolice@example.com');
INSERT INTO owner_name (ownerid, firstname, lastname) VALUES (5, 'Popo', 'Lice');
INSERT INTO owner_contact (email, phonenumber) VALUES ('popolice@example.com', '911');

-- friendship table (all (a,b) should have (b,a)). Might edit this one.
INSERT INTO friendship (ownerid1, ownerid2, dateoffriendship) VALUES (1, 2, '2024-03-21');
INSERT INTO friendship (ownerid1, ownerid2, dateoffriendship) VALUES (2, 1, '2024-03-21');

INSERT INTO friendship (ownerid1, ownerid2, dateoffriendship) VALUES (1, 3, '2024-03-22');
INSERT INTO friendship (ownerid1, ownerid2, dateoffriendship) VALUES (3, 1, '2024-03-22');

INSERT INTO friendship (ownerid1, ownerid2, dateoffriendship) VALUES (2, 3, '2024-02-13');
INSERT INTO friendship (ownerid1, ownerid2, dateoffriendship) VALUES (3, 2, '2024-02-13');

INSERT INTO friendship (ownerid1, ownerid2, dateoffriendship) VALUES (3, 4, '2023-01-01');
INSERT INTO friendship (ownerid1, ownerid2, dateoffriendship) VALUES (4, 3, '2023-01-01');


-- notification table
-- John Doe has 2 friends: Jack Bean and One Three
INSERT INTO receives_notifications (ownerid, notifcontent) VALUES (1, 'New Post from Jack Bean');
INSERT INTO receives_notifications (ownerid, notifcontent) VALUES (1, 'New Post from One Three');

-- Jack Bean has 2 friends: John Doe, One Three
INSERT INTO receives_notifications (ownerid, notifcontent) VALUES (2, 'New Post from John Doe');
INSERT INTO receives_notifications (ownerid, notifcontent) VALUES (2, 'New Post from One Three');

-- One Three has 3 friends: John Doe, Jack Bean, and Nul Ly
INSERT INTO receives_notifications (ownerid, notifcontent) VALUES (3, 'New Post from John Doe');
INSERT INTO receives_notifications (ownerid, notifcontent) VALUES (3, 'New Post from Jack Bean');
INSERT INTO receives_notifications (ownerid, notifcontent) VALUES (3, 'New Post from Nul Ly');

-- Nul Ly has 1 friend: One Three
INSERT INTO receives_notifications (ownerid, notifcontent) VALUES (4, 'New Post from One Three');

-- Popo Lice has no friends.

-- other walk notifications
INSERT INTO receives_notifications (ownerid, notifcontent) VALUES (1, 'Time to walk Doggers!');
INSERT INTO receives_notifications (ownerid, notifcontent) VALUES (2, 'Time to walk Arfy!');
INSERT INTO receives_notifications (ownerid, notifcontent) VALUES (3, 'Time to walk Blanky!');
INSERT INTO receives_notifications (ownerid, notifcontent) VALUES (4, 'Time to walk Tory!');
INSERT INTO receives_notifications (ownerid, notifcontent) VALUES (5, 'Time to walk K91!');
INSERT INTO receives_notifications (ownerid, notifcontent) VALUES (5, 'Time to walk K92!');

-- friend post tables
INSERT INTO friendpost (notificationid, postlink, friendname) VALUES (1, 'post/2/2', 'Jack Bean');
INSERT INTO friendpost (notificationid, postlink, friendname) VALUES (2, 'post/3/3', 'One Three');
INSERT INTO friendpost (notificationid, postlink, friendname) VALUES (3, 'post/1/1', 'John Doe');
INSERT INTO friendpost (notificationid, postlink, friendname) VALUES (4, 'post/3/3', 'One Three');
INSERT INTO friendpost (notificationid, postlink, friendname) VALUES (5, 'post/1/1', 'John Doe');
INSERT INTO friendpost (notificationid, postlink, friendname) VALUES (6, 'post/2/2', 'Jack Bean');
INSERT INTO friendpost (notificationid, postlink, friendname) VALUES (7, 'post/4/4', 'Nul Ly');
INSERT INTO friendpost (notificationid, postlink, friendname) VALUES (8, 'post/3/3', 'One Three');

-- walk alert tables
INSERT INTO walkalert (notificationid, dogname) VALUES (9, 'Doggers');
INSERT INTO walkalert (notificationid, dogname) VALUES (10, 'Arfy');
INSERT INTO walkalert (notificationid, dogname) VALUES (11, 'Blanky');
INSERT INTO walkalert (notificationid, dogname) VALUES (12, 'Tory');
INSERT INTO walkalert (notificationid, dogname) VALUES (13, 'K91');
INSERT INTO walkalert (notificationid, dogname) VALUES (14, 'K92');

-- organizes walk task tables
INSERT INTO organizes_walktask (ownerid, date, walkeventtype) VALUES (1, '2024-03-23', 'walk');
INSERT INTO organizes_walktask (ownerid, date, walkeventtype) VALUES (2, '2024-04-05', 'hike');
INSERT INTO organizes_walktask (ownerid, date, walkeventtype) VALUES (3, '2024-03-28', 'dog park');
INSERT INTO organizes_walktask (ownerid, date, walkeventtype) VALUES (4, '2024-04-01', 'run');
INSERT INTO organizes_walktask (ownerid, date, walkeventtype) VALUES (5, '2024-03-15', 'walk'); -- K91 and K92 will both be here.

-- log table
INSERT INTO logs (notificationid, taskid) VALUES (9, 1);
INSERT INTO logs (notificationid, taskid) VALUES (10, 2);
INSERT INTO logs (notificationid, taskid) VALUES (11, 3);
INSERT INTO logs (notificationid, taskid) VALUES (12, 4);
INSERT INTO logs (notificationid, taskid) VALUES (13, 5); -- K1 is in walk task 5
INSERT INTO logs (notificationid, taskid) VALUES (14, 5); -- K2 is in walk task 5

-- dog tables
INSERT INTO owns_dog (ownerid, name, breed) VALUES (1, 'Doggers', 'Labrador');
INSERT INTO owns_dog_birthday (dogid, ownerid, name, birthday) VALUES (1, 1, 'Doggers', '2018-01-01');

INSERT INTO owns_dog (ownerid, name, breed) VALUES (2, 'Arfy', 'Bull Terrier');
INSERT INTO owns_dog_birthday (dogid, ownerid, name, birthday) VALUES (2, 2, 'Arfy', '2020-02-20');

INSERT INTO owns_dog (ownerid, name, breed) VALUES (3, 'Blanky', null);
INSERT INTO owns_dog_birthday (dogid, ownerid, name, birthday) VALUES (3, 3, 'Blanky', '2021-03-12');

INSERT INTO owns_dog (ownerid, name, breed) VALUES (4, 'Tory', null);
INSERT INTO owns_dog_birthday (dogid, ownerid, name, birthday) VALUES (4, 4, 'Tory', null);

INSERT INTO owns_dog (ownerid, name, breed) VALUES (5, 'K91', 'German Sheperd');
INSERT INTO owns_dog_birthday (dogid, ownerid, name, birthday) VALUES (5, 5, 'K91', null);

INSERT INTO owns_dog (ownerid, name, breed) VALUES (5, 'K92', 'German Sheperd');
INSERT INTO owns_dog_birthday (dogid, ownerid, name, birthday) VALUES (6, 5, 'K92', null);

-- walk tables
-- posted walks
INSERT INTO walk (location) VALUES ('Central Pond');
INSERT INTO walk_date (walkid, date) VALUES (1, '2024-03-23');
INSERT INTO walk_dist (walkid, distance) VALUES (1, 2.5);

INSERT INTO walk (location) VALUES ('Beyond the sea');
INSERT INTO walk_date (walkid, date) VALUES (2, '2024-02-20');
INSERT INTO walk_dist (walkid, distance) VALUES (2, null);

INSERT INTO walk (location) VALUES ('Vancouver Downtown');
INSERT INTO walk_date (walkid, date) VALUES (3, '2024-02-28');
INSERT INTO walk_dist (walkid, distance) VALUES (3, null);

INSERT INTO walk (location) VALUES ('Long Lane Park');
INSERT INTO walk_date (walkid, date) VALUES (4, '2024-01-14');
INSERT INTO walk_dist (walkid, distance) VALUES (4, 60.0);

INSERT INTO walk (location) VALUES ('Police Station Park');
INSERT INTO walk_date (walkid, date) VALUES (5, '2024-01-19');
INSERT INTO walk_dist (walkid, distance) VALUES (5, null);

INSERT INTO walk (location) VALUES ('Long Lane Park');
INSERT INTO walk_date (walkid, date) VALUES (6, '2024-01-14');
INSERT INTO walk_dist (walkid, distance) VALUES (6, null);

-- non posted meetups
INSERT INTO walk (location) VALUES ('Central Pond');
INSERT INTO walk_date (walkid, date) VALUES (7, '2024-02-28');
INSERT INTO walk_dist (walkid, distance) VALUES (7, null);

INSERT INTO walk (location) VALUES ('Metrotown');
INSERT INTO walk_date (walkid, date) VALUES (8, '2024-02-20');
INSERT INTO walk_dist (walkid, distance) VALUES (8, null);

INSERT INTO walk (location) VALUES ('UBC');
INSERT INTO walk_date (walkid, date) VALUES (9, null);
INSERT INTO walk_dist (walkid, distance) VALUES (9, null);

INSERT INTO walk (location) VALUES ('Police Station');
INSERT INTO walk_date (walkid, date) VALUES (10, '2024-05-28');
INSERT INTO walk_dist (walkid, distance) VALUES (10, null);

-- non posted walks
INSERT INTO walk (location) VALUES ('Long Lane Park');
INSERT INTO walk_date (walkid, date) VALUES (11, '2024-01-01');
INSERT INTO walk_dist (walkid, distance) VALUES (11, 50.0);

INSERT INTO walk (location) VALUES ('Central Pond');
INSERT INTO walk_date (walkid, date) VALUES (12, '2024-02-14');
INSERT INTO walk_dist (walkid, distance) VALUES (12, null);

-- went for table (dog-walk relationship)
INSERT INTO wentfor (dogid, walkid, rating) VALUES (1, 1, '4');
INSERT INTO wentfor (dogid, walkid, rating) VALUES (2, 2, '5');
INSERT INTO wentfor (dogid, walkid, rating) VALUES (1, 3, '3'); -- doggers joined the walk/meetup
INSERT INTO wentfor (dogid, walkid, rating) VALUES (2, 3, '3'); -- arfy joined the walk/meetup
INSERT INTO wentfor (dogid, walkid, rating) VALUES (3, 3, '3'); -- blanky joined the walk/meetup
INSERT INTO wentfor (dogid, walkid, rating) VALUES (4, 4, null);
INSERT INTO wentfor (dogid, walkid, rating) VALUES (5, 5, '1'); -- K91 joined the walk
INSERT INTO wentfor (dogid, walkid, rating) VALUES (6, 5, '1'); -- K92 joined the walk
INSERT INTO wentfor (dogid, walkid, rating) VALUES (6, 6, null);

-- non posted
INSERT INTO wentfor (dogid, walkid, rating) VALUES (1, 7, '3'); -- doggers joined the walk/meetup
INSERT INTO wentfor (dogid, walkid, rating) VALUES (2, 7, '3'); -- arfy joined the walk/meetup

INSERT INTO wentfor (dogid, walkid, rating) VALUES (2, 8, null); -- arfy joined the walk/meetup
INSERT INTO wentfor (dogid, walkid, rating) VALUES (3, 8, null); -- blanky joined the walk/meetup

INSERT INTO wentfor (dogid, walkid, rating) VALUES (1, 9, '5'); -- doggers joined the walk/meetup
INSERT INTO wentfor (dogid, walkid, rating) VALUES (3, 9, '5'); -- blanky joined the walk/meetup

INSERT INTO wentfor (dogid, walkid, rating) VALUES (5, 10, null); -- K91 joined walk
INSERT INTO wentfor (dogid, walkid, rating) VALUES (6, 10, null); -- K92 joined walk

INSERT INTO wentfor (dogid, walkid, rating) VALUES (4, 11, '1');

INSERT INTO wentfor (dogid, walkid, rating) VALUES (1, 12, '5');


-- post walk tables
-- John Doe post
INSERT INTO post_walk (walkid) VALUES (1);
INSERT INTO post_walk_owner (ownerid) VALUES (1);
INSERT INTO post_walk_content (postid, content) VALUES (1, 'Me and my doggers walking along.');
INSERT INTO post_walk_tag (postid, tag) VALUES (1, 'doggers');
INSERT INTO post_walk_tag (postid, tag) VALUES (1, 'pond');

-- Jack Bean post
INSERT INTO post_walk (walkid) VALUES (2);
INSERT INTO post_walk_owner (ownerid) VALUES (2);
INSERT INTO post_walk_content (postid, content) VALUES (2, 'GGRRR BARK BARK WOOF GGGGRRR GRR BARKNFKFLH FMSMANBARK WOOF WOOF GR TNGFMR BARK BARL BARK BARK WOOF WOOF WOOF GGRRRR BARRKKFNBFB GRR WOMGMHMBOF GRR BARKNFKFLH BARK BARK BARK WOOF GGGGRRR GRR WOMGMHMBOF GRRR BARK BARK WOOF ARF GRRR GXNXHSJSH BRRR BARK BARK');
INSERT INTO post_walk_tag (postid, tag) VALUES (2, 'inspirational');

-- One Three post - this is a meetup
INSERT INTO post_walk (walkid) VALUES (3);
INSERT INTO post_walk_owner (ownerid) VALUES (3);
INSERT INTO post_walk_content (postid, content) VALUES (3, 'Met up with the gang today.');
INSERT INTO post_walk_tag (postid, tag) VALUES (3, 'jackAndJohn');
INSERT INTO post_walk_tag (postid, tag) VALUES (3, 'doggers');

-- Nul Ly post
INSERT INTO post_walk (walkid) VALUES (4);
INSERT INTO post_walk_owner (ownerid) VALUES (4);
INSERT INTO post_walk_content (postid, content) VALUES (4, 'I ran 60 kilometers. My Tory is not surviving this.');
INSERT INTO post_walk_tag (postid, tag) VALUES (4, 'runToryRun');

-- Popo Lice post
INSERT INTO post_walk (walkid) VALUES (5);
INSERT INTO post_walk_owner (ownerid) VALUES (5);
INSERT INTO post_walk_content (postid, content) VALUES (5, 'Walking our K9s today.');
INSERT INTO post_walk_tag (postid, tag) VALUES (5, 'K9');
INSERT INTO post_walk_tag (postid, tag) VALUES (5, '911');

INSERT INTO post_walk (walkid) VALUES (6);
INSERT INTO post_walk_owner (ownerid) VALUES (5);
INSERT INTO post_walk_content (postid, content) VALUES (6, 'Spotted this chihuahua doing a marathon.');
INSERT INTO post_walk_tag (postid, tag) VALUES (6, 'spotted');
INSERT INTO post_walk_tag (postid, tag) VALUES (6, 'runToryRun');

-- meet up table
INSERT INTO on_meetup (walkid, time, location, date) VALUES (3, '10:00:00', 'Vancouver Downtown', '2024-02-28'); -- posted meetup
INSERT INTO on_meetup (walkid, time, location, date) VALUES (7, '08:00:00', 'Central Pong', '2024-02-28'); -- past/nonposted
INSERT INTO on_meetup (walkid, time, location, date) VALUES (8, '09:00:00', 'Metrotown', '2024-02-20'); -- past/nonposted
INSERT INTO on_meetup (walkid, time, location, date) VALUES (9, '17:00:00', 'UBC', null); -- past/nonposted

-- schedule table
INSERT INTO schedules (meetupid, ownerid) VALUES (1, 1);
INSERT INTO schedules (meetupid, ownerid) VALUES (1, 2);
INSERT INTO schedules (meetupid, ownerid) VALUES (1, 3);

INSERT INTO schedules (meetupid, ownerid) VALUES (2, 1);
INSERT INTO schedules (meetupid, ownerid) VALUES (2, 2);

INSERT INTO schedules (meetupid, ownerid) VALUES (3, 2);
INSERT INTO schedules (meetupid, ownerid) VALUES (3, 3);

INSERT INTO schedules (meetupid, ownerid) VALUES (4, 1);
INSERT INTO schedules (meetupid, ownerid) VALUES (4, 3);

-- post media tables
-- post 1
INSERT INTO post_media (postid, url) VALUES (1, 'photo (1).jpg');
INSERT INTO post_media_date (url, datecreated) VALUES ('photo (1).jpg', '2024-03-21');

INSERT INTO post_media (postid, url) VALUES (1, 'photo (1).webp');
INSERT INTO post_media_date (url, datecreated) VALUES ('photo (1).webp', '2024-03-21');

INSERT INTO post_media (postid, url) VALUES (1, 'video (1).mp4');
INSERT INTO post_media_date (url, datecreated) VALUES ('video (1).mp4', '2024-03-21');

-- post 2
INSERT INTO post_media (postid, url) VALUES (2, 'photo (10).jpg');
INSERT INTO post_media_date (url, datecreated) VALUES ('photo (10).jpg', '2024-03-22');

INSERT INTO post_media (postid, url) VALUES (2, 'video (6).mp4');
INSERT INTO post_media_date (url, datecreated) VALUES ('video (6).mp4', '2024-03-24');

-- post 3
INSERT INTO post_media (postid, url) VALUES (3, 'photo (3).jpg');
INSERT INTO post_media_date (url, datecreated) VALUES ('photo (3).jpg', '2024-03-23');

INSERT INTO post_media (postid, url) VALUES (3, 'photo (9).jpg');
INSERT INTO post_media_date (url, datecreated) VALUES ('photo (9).jpg', '2024-03-23');

INSERT INTO post_media (postid, url) VALUES (3, 'video (2).mp4');
INSERT INTO post_media_date (url, datecreated) VALUES ('video (2).mp4', '2024-03-23');

-- post 4 no media for place holder purposes

-- post 5
INSERT INTO post_media (postid, url) VALUES (5, 'video (4).mp4');
INSERT INTO post_media_date (url, datecreated) VALUES ('video (4).mp4', '2024-03-24');

-- post 6
INSERT INTO post_media (postid, url) VALUES (6, 'video (5).mp4');
INSERT INTO post_media_date (url, datecreated) VALUES ('video (5).mp4', '2024-03-24');

-- photo table
INSERT INTO photo (mediaid, filter) VALUES (1, 'Vintage');
INSERT INTO photo (mediaid, filter) VALUES (2, 'Normal');
INSERT INTO photo (mediaid, filter) VALUES (4, 'Sepia');
INSERT INTO photo (mediaid, filter) VALUES (6, null);
INSERT INTO photo (mediaid, filter) VALUES (7, null);

-- video table
INSERT INTO video (mediaid, duration) VALUES (3, '00:00:15');
INSERT INTO video (mediaid, duration) VALUES (5, '00:00:10');
INSERT INTO video (mediaid, duration) VALUES (8, null);
INSERT INTO video (mediaid, duration) VALUES (9, '00:00:11');
INSERT INTO video (mediaid, duration) VALUES (10, null);

-- tagged in table
INSERT INTO taggedin (dogid, postid) VALUES (1, 3);
INSERT INTO taggedin (dogid, postid) VALUES (4, 6);
