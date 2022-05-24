/*
 * Upon submission, this file should contain the SQL script to initialize your database.
 * It should contain all DROP TABLE and CREATE TABLE statments, and any INSERT statements
 * required.
 */
drop table if exists notifications;
drop table if exists subscribes;
drop table if exists likes;
drop table if exists comments;
drop table if exists images;
drop table if exists articles;
drop table if exists user;

create table user
(
    userID         integer      not null primary key,
    userName       varchar(255) not null,
    password       varchar(255) not null,
    fName          varchar(255) not null,
    lName          varchar(255) not null,
    DOB            date         not null,
    description    text         not null,
    avatarFilePath varchar(255) not null,
    adminFlag      integer      not null

);

create table articles
(
    articleID        integer    not null primary key,
    authorID         integer    not null,
    title            text       not null,
    publishDate      timestamp  not null default CURRENT_TIMESTAMP,
    content          mediumtext not null,
    numberOfComments integer    not null default 0,
    numberOfLikes    integer    not null default 0,
    foreign key (authorID) references user (userID)

);

create table comments
(
    commentID   integer   not null primary key,
    articleID   integer   not null,
    authorID    integer   not null,
    parentID    integer,
    content     text      not null,
    publishDate timestamp not null default CURRENT_TIMESTAMP,
    foreign key (authorID) references user (userID),
    foreign key (articleID) references articles (articleID)

);

create table likes
(
    articleID   integer   not null,
    userID      integer   not null,
    publishDate timestamp not null default CURRENT_TIMESTAMP,
    foreign key (userID) references user (userID),
    foreign key (articleID) references articles (articleID)

);

create table images
(
    imageID       integer      not null primary key,
    fileName      varchar(255) not null,
    path          varchar(255) not null,
    articleID     integer      not null,
    thumbnailFlag integer      not null,
    foreign key (articleID) references articles (articleID)

);

create table subscribes
(
    userSubscriberID integer   not null,
    articleAuthorID  integer   not null,
    dateSubscribed   timestamp not null default CURRENT_TIMESTAMP,
    foreign key (UserSubscriberID) references user (userID),
    foreign key (ArticleAuthorID) references user (userID)

);


create table notifications
(
    notificationID     integer      not null primary key,
    typeOfNotification varchar(255) not null,
    content            varchar(255) not null,
    userToBeNotifiedID integer      not null,
    hasBeenViewed      varchar(255),
    foreign key (userToBeNotifiedID) references user (userID)

);
