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
    adminFlag      integer      not null,
    authToken      varchar(128)

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
    commentAuthorID    integer   not null,
    parentID    integer default null,
    content     text      not null,
    publishDate timestamp not null default CURRENT_TIMESTAMP,
    foreign key (commentAuthorID) references user (userID),
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

-- user 1 and 2 were set up as actual users - deletecomment password is password, admin password is admin
insert into user (userID, userName, password, fName, lName, DOB, description, avatarFilePath, adminFlag) values
(1, 'deletedcomment', '$2b$10$c4K6C1nTe5VJrSKbhE74Z.hNZCqZpZM788NwhCBa/.p.njBgE29pa', 'deleted', 'comment', '01-01-1900', 'deleted comments', './avatars/1.png', 1),
(2, 'admin', '$2b$10$mzz3QNoe1Hpx/59S6YUZIub4FqsvGyXxYaFl87DiWAUu07ZgL6psa', 'admin', 'admin', '01-01-1900', 'admin user', './avatars/1.png', 1),
(3, 'etowns0', 'Z21w1Ae6lC0', 'Eunice', 'Towns', '06-09-1919', 'Suspendisse potenti. Cras in purus eu magna vulputate luctus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.', './avatars/1.png', 0),
(4, 'zhendriksen1', 'QnJuDbX56', 'Zared', 'Hendriksen', '07-03-1944', 'Duis aliquam convallis nunc. Proin at turpis a pede posuere nonummy.', './avatars/2.jpeg', 0),
(5, 'lbodycote2', 'KVpKkrKq5HAt', 'Lexie', 'Bodycote', '13-01-1900', 'In hac habitasse platea dictumst. Maecenas ut massa quis augue luctus tincidunt.', './avatars/3.jpeg', 0),
(6, 'sderobertis3', 'IJEHbOjvk', 'Stu', 'De Robertis', '16-10-1904', 'Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo. Maecenas pulvinar lobortis est.', './avatars/4.jpeg', 0),
(7, 'cfouracres4', '58iZB2aY4', 'Cozmo', 'Fouracres', '18-08-1954', 'Suspendisse accumsan tortor quis turpis.', './avatars/5.jpeg', 0),
(8, 'briglar5', '9M4EMoRIe8F', 'Boyd', 'Riglar', '23-09-1927', 'Nullam varius. Nulla facilisi.', './avatars/6.jpeg', 0);

insert into articles (articleID, authorID, title, publishDate, content, numberOfComments, numberOfLikes) values (1, 3, 'Sed accumsan felis.', '2020-02-06 16:38:41', 'Etiam vel augue. Vestibulum rutrum rutrum neque. Aenean auctor gravida sem. Praesent id massa id nisl venenatis lacinia. Aenean sit amet justo. Morbi ut odio. Cras mi pede, malesuada in, imperdiet et, commodo vulputate, justo. In blandit ultrices enim. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue. Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl. Aenean lectus. Pellentesque eget nunc. Donec quis orci eget orci vehicula condimentum. Curabitur in libero ut massa volutpat convallis. Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo. Maecenas pulvinar lobortis est. Phasellus sit amet erat. Nulla tempus. Vivamus in felis eu sapien cursus vestibulum. Proin eu mi. Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem. Duis aliquam convallis nunc. Proin at turpis a pede posuere nonummy. Integer non velit. Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi. Integer ac neque. Duis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus. In sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus. Suspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst. Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat. Curabitur gravida nisi at nibh.', '0', '0');
insert into articles (articleID, authorID, title, publishDate, content, numberOfComments, numberOfLikes) values (2, 4, 'Praesent blandit.', '2021-03-30 08:40:21', 'Nulla tellus. In sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus. Suspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst. Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat. Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem. Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat.', '0', '0');
insert into articles (articleID, authorID, title, publishDate, content, numberOfComments, numberOfLikes) values (3, 5, 'Duis consequat dui nec nisi volutpat eleifend.', '2019-12-09 13:14:22', 'Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem. Fusce consequat. Nulla nisl. Nunc nisl. Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa. Donec dapibus. Duis at velit eu est congue elementum. In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo. Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis. Sed ante. Vivamus tortor. Duis mattis egestas metus. Aenean fermentum. Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh. Quisque id justo sit amet sapien dignissim vestibulum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla dapibus dolor vel est. Donec odio justo, sollicitudin ut, suscipit a, feugiat et, eros. Vestibulum ac est lacinia nisi venenatis tristique. Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat. In congue. Etiam justo. Etiam pretium iaculis justo. In hac habitasse platea dictumst. Etiam faucibus cursus urna. Ut tellus. Nulla ut erat id mauris vulputate elementum. Nullam varius. Nulla facilisi. Cras non velit nec nisi vulputate nonummy. Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque. Quisque porta volutpat erat. Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla. Nunc purus. Phasellus in felis. Donec semper sapien a libero. Nam dui. Proin leo odio, porttitor id, consequat in, consequat ut, nulla. Sed accumsan felis. Ut at dolor quis odio consequat varius. Integer ac leo. Pellentesque ultrices mattis odio.', '0', '0');
insert into articles (articleID, authorID, title, publishDate, content, numberOfComments, numberOfLikes) values (4, 3, 'Sed accumsan felis.', '2020-07-12 12:48:14', 'Proin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue. Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl. Aenean lectus. Pellentesque eget nunc. Donec quis orci eget orci vehicula condimentum. Curabitur in libero ut massa volutpat convallis. Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo. Maecenas pulvinar lobortis est. Phasellus sit amet erat. Nulla tempus. Vivamus in felis eu sapien cursus vestibulum. Proin eu mi. Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem. Duis aliquam convallis nunc. Proin at turpis a pede posuere nonummy. Integer non velit. Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi. Integer ac neque. Duis bibendum.', '0', '0');
insert into articles (articleID, authorID, title, publishDate, content, numberOfComments, numberOfLikes) values (5, 4, 'Aliquam quis turpis eget elit sodales scelerisque.', '2022-05-16 05:49:09', 'Cras in purus eu magna vulputate luctus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus vestibulum sagittis sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Etiam vel augue. Vestibulum rutrum rutrum neque. Aenean auctor gravida sem. Praesent id massa id nisl venenatis lacinia. Aenean sit amet justo. Morbi ut odio. Cras mi pede, malesuada in, imperdiet et, commodo vulputate, justo. In blandit ultrices enim. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue. Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl. Aenean lectus. Pellentesque eget nunc. Donec quis orci eget orci vehicula condimentum. Curabitur in libero ut massa volutpat convallis. Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo. Maecenas pulvinar lobortis est. Phasellus sit amet erat. Nulla tempus. Vivamus in felis eu sapien cursus vestibulum. Proin eu mi. Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem. Duis aliquam convallis nunc. Proin at turpis a pede posuere nonummy. Integer non velit. Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi. Integer ac neque.', '0', '0');
insert into articles (articleID, authorID, title, publishDate, content, numberOfComments, numberOfLikes) values (6, 5, 'Proin risus.', '2019-10-26 07:47:44', 'Proin eu mi. Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem. Duis aliquam convallis nunc. Proin at turpis a pede posuere nonummy. Integer non velit. Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi. Integer ac neque. Duis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus. In sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus. Suspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst. Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat. Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem. Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat. Praesent blandit. Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede. Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem. Fusce consequat. Nulla nisl. Nunc nisl. Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa. Donec dapibus. Duis at velit eu est congue elementum. In hac habitasse platea dictumst.', '0', '0');
insert into articles (articleID, authorID, title, publishDate, content, numberOfComments, numberOfLikes) values (7, 4, 'Vivamus vestibulum sagittis sapien.', '2021-12-22 08:58:03', 'Aenean lectus. Pellentesque eget nunc. Donec quis orci eget orci vehicula condimentum. Curabitur in libero ut massa volutpat convallis. Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo. Maecenas pulvinar lobortis est. Phasellus sit amet erat. Nulla tempus. Vivamus in felis eu sapien cursus vestibulum. Proin eu mi. Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem. Duis aliquam convallis nunc. Proin at turpis a pede posuere nonummy. Integer non velit. Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi.', '0', '0');
insert into articles (articleID, authorID, title, publishDate, content, numberOfComments, numberOfLikes) values (8, 5, 'Duis at velit eu est congue elementum.', '2019-11-10 12:08:44', 'Nulla tellus. In sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus. Suspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst. Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat. Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem. Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat. Praesent blandit. Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede. Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem. Fusce consequat. Nulla nisl. Nunc nisl. Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa. Donec dapibus. Duis at velit eu est congue elementum. In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo. Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros.', '0', '0');
insert into articles (articleID, authorID, title, publishDate, content, numberOfComments, numberOfLikes) values (9, 3, 'Donec ut mauris eget massa tempor convallis.', '2021-03-16 14:08:56', 'Cras in purus eu magna vulputate luctus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus vestibulum sagittis sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Etiam vel augue. Vestibulum rutrum rutrum neque.', '0', '0');
insert into articles (articleID, authorID, title, publishDate, content, numberOfComments, numberOfLikes) values (10, 3, 'Nulla tempus.', '2020-12-28 02:17:08', 'Nulla ut erat id mauris vulputate elementum. Nullam varius. Nulla facilisi. Cras non velit nec nisi vulputate nonummy. Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque. Quisque porta volutpat erat. Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla. Nunc purus. Phasellus in felis. Donec semper sapien a libero. Nam dui. Proin leo odio, porttitor id, consequat in, consequat ut, nulla.', '0', '0');
insert into articles (articleID, authorID, title, publishDate, content, numberOfComments, numberOfLikes) values (11, 3, 'Duis bibendum.', '2020-03-16 05:52:30', 'Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede. Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem. Fusce consequat. Nulla nisl. Nunc nisl. Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa. Donec dapibus. Duis at velit eu est congue elementum. In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo. Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis. Sed ante. Vivamus tortor. Duis mattis egestas metus. Aenean fermentum. Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh. Quisque id justo sit amet sapien dignissim vestibulum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla dapibus dolor vel est.', '0', '0');
insert into articles (articleID, authorID, title, publishDate, content, numberOfComments, numberOfLikes) values (12, 3, 'Morbi ut odio.', '2022-01-10 03:06:05', 'Nulla mollis molestie lorem. Quisque ut erat. Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem. Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat. Praesent blandit. Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede. Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem. Fusce consequat. Nulla nisl.', '0', '0');
insert into articles (articleID, authorID, title, publishDate, content, numberOfComments, numberOfLikes) values (13, 4, 'Suspendisse accumsan tortor quis turpis.', '2019-08-23 04:54:51', 'Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh. Quisque id justo sit amet sapien dignissim vestibulum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla dapibus dolor vel est. Donec odio justo, sollicitudin ut, suscipit a, feugiat et, eros. Vestibulum ac est lacinia nisi venenatis tristique. Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat. In congue. Etiam justo. Etiam pretium iaculis justo. In hac habitasse platea dictumst. Etiam faucibus cursus urna. Ut tellus. Nulla ut erat id mauris vulputate elementum. Nullam varius. Nulla facilisi. Cras non velit nec nisi vulputate nonummy. Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque.', '0', '0');
insert into articles (articleID, authorID, title, publishDate, content, numberOfComments, numberOfLikes) values (14, 5, 'Nulla tellus.', '2021-10-23 05:00:18', 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti. Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris. Morbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis. Fusce posuere felis sed lacus. Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl. Nunc rhoncus dui vel sem. Sed sagittis. Nam congue, risus semper porta volutpat, quam pede lobortis ligula, sit amet eleifend pede libero quis orci. Nullam molestie nibh in lectus. Pellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus vestibulum sagittis sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Etiam vel augue. Vestibulum rutrum rutrum neque. Aenean auctor gravida sem. Praesent id massa id nisl venenatis lacinia. Aenean sit amet justo. Morbi ut odio. Cras mi pede, malesuada in, imperdiet et, commodo vulputate, justo. In blandit ultrices enim. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue. Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl. Aenean lectus. Pellentesque eget nunc. Donec quis orci eget orci vehicula condimentum. Curabitur in libero ut massa volutpat convallis. Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo. Maecenas pulvinar lobortis est. Phasellus sit amet erat. Nulla tempus. Vivamus in felis eu sapien cursus vestibulum. Proin eu mi. Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem.', '0', '0');
insert into articles (articleID, authorID, title, publishDate, content, numberOfComments, numberOfLikes) values (15, 3, 'Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.', '2022-04-12 20:10:42', 'Etiam vel augue. Vestibulum rutrum rutrum neque. Aenean auctor gravida sem. Praesent id massa id nisl venenatis lacinia. Aenean sit amet justo. Morbi ut odio. Cras mi pede, malesuada in, imperdiet et, commodo vulputate, justo. In blandit ultrices enim. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue. Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl. Aenean lectus. Pellentesque eget nunc. Donec quis orci eget orci vehicula condimentum. Curabitur in libero ut massa volutpat convallis. Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo. Maecenas pulvinar lobortis est.', '0', '0');
insert into articles (articleID, authorID, title, publishDate, content, numberOfComments, numberOfLikes) values (16, 4, 'In sagittis dui vel nisl.', '2020-05-24 10:13:46', 'Sed sagittis. Nam congue, risus semper porta volutpat, quam pede lobortis ligula, sit amet eleifend pede libero quis orci. Nullam molestie nibh in lectus. Pellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus vestibulum sagittis sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Etiam vel augue. Vestibulum rutrum rutrum neque. Aenean auctor gravida sem. Praesent id massa id nisl venenatis lacinia. Aenean sit amet justo. Morbi ut odio. Cras mi pede, malesuada in, imperdiet et, commodo vulputate, justo. In blandit ultrices enim. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue. Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl. Aenean lectus. Pellentesque eget nunc. Donec quis orci eget orci vehicula condimentum. Curabitur in libero ut massa volutpat convallis. Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo. Maecenas pulvinar lobortis est. Phasellus sit amet erat. Nulla tempus. Vivamus in felis eu sapien cursus vestibulum. Proin eu mi. Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem. Duis aliquam convallis nunc. Proin at turpis a pede posuere nonummy. Integer non velit. Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi. Integer ac neque. Duis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus.', '0', '0');
insert into articles (articleID, authorID, title, publishDate, content, numberOfComments, numberOfLikes) values (17, 5, 'Cras pellentesque volutpat dui.', '2020-05-30 03:47:35', 'Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat. In congue. Etiam justo. Etiam pretium iaculis justo. In hac habitasse platea dictumst. Etiam faucibus cursus urna. Ut tellus. Nulla ut erat id mauris vulputate elementum. Nullam varius. Nulla facilisi. Cras non velit nec nisi vulputate nonummy. Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque. Quisque porta volutpat erat. Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla. Nunc purus. Phasellus in felis. Donec semper sapien a libero. Nam dui. Proin leo odio, porttitor id, consequat in, consequat ut, nulla. Sed accumsan felis. Ut at dolor quis odio consequat varius. Integer ac leo. Pellentesque ultrices mattis odio. Donec vitae nisi. Nam ultrices, libero non mattis pulvinar, nulla pede ullamcorper augue, a suscipit nulla elit ac nulla. Sed vel enim sit amet nunc viverra dapibus. Nulla suscipit ligula in lacus.', '0', '0');
insert into articles (articleID, authorID, title, publishDate, content, numberOfComments, numberOfLikes) values (18, 3, 'Morbi ut odio.', '2020-12-04 00:06:46', 'Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus. Suspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst. Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat. Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem. Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat. Praesent blandit. Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede. Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem. Fusce consequat. Nulla nisl. Nunc nisl. Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa. Donec dapibus. Duis at velit eu est congue elementum. In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo. Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis. Sed ante. Vivamus tortor. Duis mattis egestas metus. Aenean fermentum. Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh. Quisque id justo sit amet sapien dignissim vestibulum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla dapibus dolor vel est. Donec odio justo, sollicitudin ut, suscipit a, feugiat et, eros. Vestibulum ac est lacinia nisi venenatis tristique. Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat. In congue. Etiam justo. Etiam pretium iaculis justo. In hac habitasse platea dictumst. Etiam faucibus cursus urna. Ut tellus.', '0', '0');
insert into articles (articleID, authorID, title, publishDate, content, numberOfComments, numberOfLikes) values (19, 4, 'Morbi a ipsum.', '2022-01-17 03:22:09', 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue. Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl. Aenean lectus. Pellentesque eget nunc. Donec quis orci eget orci vehicula condimentum. Curabitur in libero ut massa volutpat convallis. Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo. Maecenas pulvinar lobortis est. Phasellus sit amet erat. Nulla tempus. Vivamus in felis eu sapien cursus vestibulum. Proin eu mi. Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem. Duis aliquam convallis nunc. Proin at turpis a pede posuere nonummy.', '0', '0');
insert into articles (articleID, authorID, title, publishDate, content, numberOfComments, numberOfLikes) values (20, 5, 'Vivamus in felis eu sapien cursus vestibulum.', '2022-03-13 19:52:16', 'Nunc nisl. Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa. Donec dapibus. Duis at velit eu est congue elementum. In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo. Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis. Sed ante. Vivamus tortor. Duis mattis egestas metus. Aenean fermentum. Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh.', '0', '0');
insert into articles (articleID, authorID, title, publishDate, content, numberOfComments, numberOfLikes) values (21, 3, 'Nullam sit amet turpis elementum ligula vehicula consequat.', '2019-12-07 22:49:12', 'Duis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus. In sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus. Suspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst. Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat. Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem. Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat. Praesent blandit. Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede. Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem. Fusce consequat. Nulla nisl. Nunc nisl. Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa. Donec dapibus. Duis at velit eu est congue elementum. In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo. Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis. Sed ante. Vivamus tortor. Duis mattis egestas metus.', '0', '0');
insert into articles (articleID, authorID, title, publishDate, content, numberOfComments, numberOfLikes) values (22, 4, 'Aliquam non mauris.', '2019-10-23 23:14:23', 'Vivamus vel nulla eget eros elementum pellentesque. Quisque porta volutpat erat. Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla. Nunc purus. Phasellus in felis.', '0', '0');
insert into articles (articleID, authorID, title, publishDate, content, numberOfComments, numberOfLikes) values (23, 5, 'Fusce posuere felis sed lacus.', '2019-12-05 19:56:10', 'Phasellus id sapien in sapien iaculis congue. Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl. Aenean lectus. Pellentesque eget nunc. Donec quis orci eget orci vehicula condimentum. Curabitur in libero ut massa volutpat convallis. Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo. Maecenas pulvinar lobortis est. Phasellus sit amet erat. Nulla tempus. Vivamus in felis eu sapien cursus vestibulum. Proin eu mi. Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem. Duis aliquam convallis nunc. Proin at turpis a pede posuere nonummy. Integer non velit. Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi. Integer ac neque. Duis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus. In sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus. Suspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst. Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat. Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem.', '0', '0');
insert into articles (articleID, authorID, title, publishDate, content, numberOfComments, numberOfLikes) values (24, 3, 'Duis at velit eu est congue elementum.', '2021-02-05 05:15:50', 'Duis consequat dui nec nisi volutpat eleifend. Donec ut dolor. Morbi vel lectus in quam fringilla rhoncus. Mauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis. Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero. Nullam sit amet turpis elementum ligula vehicula consequat. Morbi a ipsum. Integer a nibh. In quis justo. Maecenas rhoncus aliquam lacus. Morbi quis tortor id nulla ultrices aliquet. Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui. Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti. Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris. Morbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis. Fusce posuere felis sed lacus. Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl. Nunc rhoncus dui vel sem. Sed sagittis. Nam congue, risus semper porta volutpat, quam pede lobortis ligula, sit amet eleifend pede libero quis orci. Nullam molestie nibh in lectus. Pellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus vestibulum sagittis sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Etiam vel augue. Vestibulum rutrum rutrum neque. Aenean auctor gravida sem. Praesent id massa id nisl venenatis lacinia. Aenean sit amet justo. Morbi ut odio. Cras mi pede, malesuada in, imperdiet et, commodo vulputate, justo. In blandit ultrices enim. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue.', '0', '0');
insert into articles (articleID, authorID, title, publishDate, content, numberOfComments, numberOfLikes) values (25, 4, 'Aenean lectus.', '2020-10-10 18:12:52', 'Duis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus. In sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus. Suspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst. Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat. Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem. Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat. Praesent blandit. Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede. Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem. Fusce consequat. Nulla nisl. Nunc nisl. Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa. Donec dapibus. Duis at velit eu est congue elementum. In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo. Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis. Sed ante. Vivamus tortor. Duis mattis egestas metus. Aenean fermentum. Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh. Quisque id justo sit amet sapien dignissim vestibulum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla dapibus dolor vel est. Donec odio justo, sollicitudin ut, suscipit a, feugiat et, eros. Vestibulum ac est lacinia nisi venenatis tristique. Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue.', '0', '0');

insert into images (imageID, fileName, path, articleID, thumbnailFlag) values
(1, 'test_image_article1', './article-images/test_image_article1.jpg', 1, 0),
(2, 'test_thumbnail_article1', './article-images/article-thumbnails/test_thumbnail_article1.jpg', 1, 1),
(3, 'test_image_article2', './article-images/test_image_article2.jpg', 2, 0),
(4, 'test_thumbnail_article2', './article-images/article-thumbnails/test_thumbnail_article1.jpg', 2, 1),
(5, 'test_image_article3', './article-images/test_image_article3.jpg', 3, 0),
(6, 'test_thumbnail_article3', './article-images/article-thumbnails/test_thumbnail_article3.jpg', 3, 1),
(7, 'test_image_article4', './article-images/test_image_article4.jpg', 4, 0),
(8, 'test_thumbnail_article4', './article-images/article-thumbnails/test_thumbnail_article4.jpg', 4, 1),
(9, 'test_image_article5', './article-images/test_image_article5.jpg', 5, 0),
(10, 'test_thumbnail_article5', './article-images/article-thumbnails/test_thumbnail_article5.jpg', 5, 1),
(11, 'test_image_article6', './article-images/test_image_article6.jpg', 6, 0),
(12, 'test_thumbnail_article6', './article-images/article-thumbnails/test_thumbnail_article6.jpg', 6, 1),
(13, 'test_image_article7', './article-images/test_image_article7.jpg', 7, 0),
(14, 'test_thumbnail_article7', './article-images/article-thumbnails/test_thumbnail_article7.jpg', 7, 1),
(15, 'test_image_article8', './article-images/test_image_article8.jpg', 8, 0),
(16, 'test_thumbnail_article8', './article-images/article-thumbnails/test_thumbnail_article8.jpg', 8, 1),
(17, 'test_image_article9', './article-images/test_image_article9.jpg', 9, 0),
(18, 'test_thumbnail_article9', './article-images/article-thumbnails/test_thumbnail_article9.jpg', 9, 1),
(19, 'test_image_article10', './article-images/test_image_article10.jpg', 10, 0),
(20, 'test_thumbnail_article10', './article-images/article-thumbnails/test_thumbnail_article10.jpg', 10, 1),
(21, 'test_image_article1', './article-images/test_image_article1.jpg', 11, 0),
(22, 'test_thumbnail_article1', './article-images/article-thumbnails/test_thumbnail_article1.jpg', 11, 1),
(23, 'test_image_article2', './article-images/test_image_article2.jpg', 12, 0),
(24, 'test_thumbnail_article2', './article-images/article-thumbnails/test_thumbnail_article2.jpg', 12, 1),
(25, 'test_image_article3', './article-images/test_image_article3.jpg', 13, 0),
(26, 'test_thumbnail_article3', './article-images/article-thumbnails/test_thumbnail_article3.jpg', 13, 1),
(27, 'test_image_article4', './article-images/test_image_article4.jpg', 14, 0),
(28, 'test_thumbnail_article4', './article-images/article-thumbnails/test_thumbnail_article4.jpg', 14, 1),
(29, 'test_image_article5', './article-images/test_image_article5.jpg', 15, 0),
(30, 'test_thumbnail_article5', './article-images/article-thumbnails/test_thumbnail_article5.jpg', 15, 1),
(31, 'test_image_article6', './article-images/test_image_article6.jpg', 16, 0),
(32, 'test_thumbnail_article6', './article-images/article-thumbnails/test_thumbnail_article6.jpg', 16, 1),
(33, 'test_image_article7', './article-images/test_image_article7.jpg', 17, 0),
(34, 'test_thumbnail_article7', './article-images/article-thumbnails/test_thumbnail_article7.jpg', 17, 1),
(35, 'test_image_article8', './article-images/test_image_article8.jpg', 18, 0),
(36, 'test_thumbnail_article8', './article-images/article-thumbnails/test_thumbnail_article8.jpg', 18, 1),
(37, 'test_image_article9', './article-images/test_image_article9.jpg', 19, 0),
(38, 'test_thumbnail_article9', './article-images/article-thumbnails/test_thumbnail_article9.jpg', 19, 1),
(39, 'test_image_article10', './article-images/test_image_article10.jpg', 20, 0),
(40, 'test_thumbnail_article10', './article-images/article-thumbnails/test_thumbnail_article10.jpg', 20, 1),
(41, 'test_image_article1', './article-images/test_image_article1.jpg', 21, 0),
(42, 'test_thumbnail_article1', './article-images/article-thumbnails/test_thumbnail_article1.jpg', 21, 1),
(43, 'test_image_article2', './article-images/test_image_article2.jpg', 22, 0),
(44, 'test_thumbnail_article2', './article-images/article-thumbnails/test_thumbnail_article1.jpg', 22, 1),
(45, 'test_image_article3', './article-images/test_image_article3.jpg', 23, 0),
(46, 'test_thumbnail_article3', './article-images/article-thumbnails/test_thumbnail_article3.jpg', 23, 1),
(47, 'test_image_article4', './article-images/test_image_article4.jpg', 24, 0),
(48, 'test_thumbnail_article4', './article-images/article-thumbnails/test_thumbnail_article4.jpg', 24, 1),
(49, 'test_image_article5', './article-images/test_image_article5.jpg', 25, 0),
(50, 'test_thumbnail_article5', './article-images/article-thumbnails/test_thumbnail_article5.jpg', 5, 1);

insert into comments (commentID, articleID, commentAuthorID, parentID, content, publishDate) values
(1, 1, 6, null, 'Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo. Aliquam quis turpis eget elit sodales scelerisque.', '1955-01-18 01:28:12'),
(2, 2, 3, null, 'Vestibulum sed magna at nunc commodo placerat. Praesent blandit.', '1977-05-06 15:07:42'),
(3, 3, 6, null, 'Nulla facilisi.', '1965-01-29 09:57:40'),
(4, 4, 7, null, 'Curabitur at ipsum ac tellus semper interdum. Mauris ullamcorper purus sit amet nulla. Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam.', '1964-12-23 17:39:01'),
(5, 5, 6, null, 'Praesent lectus. Vestibulum quam sapien, varius ut, blandit non, interdum in, ante.', '1975-01-27 18:14:10'),
(6, 6, 7, null, 'Vivamus vel nulla eget eros elementum pellentesque.', '1993-11-10 21:54:46'),
(7, 7, 6, null, 'Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo. Aliquam quis turpis eget elit sodales scelerisque.', '1955-01-18 01:28:12'),
(8, 8, 3, null, 'Vestibulum sed magna at nunc commodo placerat. Praesent blandit.', '1977-05-06 15:07:42'),
(9, 9, 6, null, 'Nulla facilisi.', '1965-01-29 09:57:40'),
(10, 10, 7, null, 'Curabitur at ipsum ac tellus semper interdum. Mauris ullamcorper purus sit amet nulla. Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam.', '1964-12-23 17:39:01'),
(11, 11, 6, null, 'Praesent lectus. Vestibulum quam sapien, varius ut, blandit non, interdum in, ante.', '1975-01-27 18:14:10'),
(12, 12, 7, null, 'Vivamus vel nulla eget eros elementum pellentesque.', '1993-11-10 21:54:46'),
(13, 13, 6, null, 'Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo. Aliquam quis turpis eget elit sodales scelerisque.', '1955-01-18 01:28:12'),
(14, 14, 3, null, 'Vestibulum sed magna at nunc commodo placerat. Praesent blandit.', '1977-05-06 15:07:42'),
(15, 15, 6, null, 'Nulla facilisi.', '1965-01-29 09:57:40'),
(16, 16, 7, null, 'Curabitur at ipsum ac tellus semper interdum. Mauris ullamcorper purus sit amet nulla. Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam.', '1964-12-23 17:39:01'),
(17, 17, 6, null, 'Praesent lectus. Vestibulum quam sapien, varius ut, blandit non, interdum in, ante.', '1975-01-27 18:14:10'),
(18, 18, 7, null, 'Vivamus vel nulla eget eros elementum pellentesque.', '1993-11-10 21:54:46'),
(19, 19, 6, null, 'Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo. Aliquam quis turpis eget elit sodales scelerisque.', '1955-01-18 01:28:12'),
(20, 20, 3, null, 'Vestibulum sed magna at nunc commodo placerat. Praesent blandit.', '1977-05-06 15:07:42'),
(21, 21, 6, null, 'Nulla facilisi.', '1965-01-29 09:57:40'),
(22, 22, 7, null, 'Curabitur at ipsum ac tellus semper interdum. Mauris ullamcorper purus sit amet nulla. Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam.', '1964-12-23 17:39:01'),
(23, 23, 6, null, 'Praesent lectus. Vestibulum quam sapien, varius ut, blandit non, interdum in, ante.', '1975-01-27 18:14:10'),
(24, 24, 7, null, 'Vivamus vel nulla eget eros elementum pellentesque.', '1993-11-10 21:54:46'),
(25, 25, 6, null, 'Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo. Aliquam quis turpis eget elit sodales scelerisque.', '1955-01-18 01:28:12'),
(26, 1, 3, null, 'Vestibulum sed magna at nunc commodo placerat. Praesent blandit.', '1977-05-06 15:07:42'),
(27, 1, 6, 26, 'Nulla facilisi.', '1965-01-29 09:57:40'),
(28, 1, 7, 27, 'Curabitur at ipsum ac tellus semper interdum. Mauris ullamcorper purus sit amet nulla. Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam.', '1964-12-23 17:39:01'),
(29, 1, 6, 26, 'Praesent lectus. Vestibulum quam sapien, varius ut, blandit non, interdum in, ante.', '1975-01-27 18:14:10'),
(30, 2, 7, 2, 'Vivamus vel nulla eget eros elementum pellentesque.', '1993-11-10 21:54:46'),
(31, 3, 6, null, 'Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo. Aliquam quis turpis eget elit sodales scelerisque.', '1955-01-18 01:28:12'),
(32, 4, 3, 4, 'Vestibulum sed magna at nunc commodo placerat. Praesent blandit.', '1977-05-06 15:07:42'),
(33, 4, 3, 32, 'Vestibulum sed magna at nunc commodo placerat. Praesent blandit.', '1977-05-06 15:07:42'),
(34, 5, 6, null, 'Nulla facilisi.', '1965-01-29 09:57:40'),
(35, 6, 7, null, 'Curabitur at ipsum ac tellus semper interdum. Mauris ullamcorper purus sit amet nulla. Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam.', '1964-12-23 17:39:01'),
(36, 7, 6, null, 'Praesent lectus. Vestibulum quam sapien, varius ut, blandit non, interdum in, ante.', '1975-01-27 18:14:10'),
(37, 8, 7, 8, 'Vivamus vel nulla eget eros elementum pellentesque.', '1993-11-10 21:54:46');

insert into likes (articleID, userID) values
(1,3),
(1,4),
(2,3),
(1,4),
(3,6),
(4,4),
(5,5),
(6,4),
(7,7),
(1,4),
(15,8),
(16,8),
(17,8),
(18,6),
(19,7),
(19,8),
(21,5),
(22,4),
(23,3);


insert into subscribes (userSubscriberID, articleAuthorID, dateSubscribed) values
(3, 4, '1935-02-08 19:11:27'),
(8, 6, '2015-05-05 01:51:39'),
(5, 3, '1922-06-21 03:38:47'),
(4, 5, '1998-06-20 19:21:34'),
(5, 6, '1902-03-28 12:14:02'),
(8, 7, '1952-11-19 21:36:21');



