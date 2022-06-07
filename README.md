Final project &ndash; A personal blogging system &ndash; Starter project
==========
Group 5
==========

Set up / Requirements / Additional Modules:
==================================
Beyond running 'npm install' it is unlikely anything further is required for initial set up.

New packages/features added were:
- bcrypt - this is included within the node packages and set up and should be installed with npm install.

- TinyMCE - this is run from an API key and should not need further set up.
Details of TinyMCE are in:
- main.handlebars - line 5 - the API key is included within the url:
https://cdn.tiny.cloud/1/2r9rvl6jxb7kh0w72k2niob4t38vz0zopqp9enxil2n8yxi4/tinymce/5/tinymce.min.js
- TinyMCE set up is in C:\Comp Sci\Final Project\pgcert-group-5-22-s1\public\js\tinymce.js
At the bottom of this page you will find plugins/features manually removed from TinyMCE, in case further features were wanted to be put back in.



Database / Dummy Data / Test users:
========================
After running npm install, and initial npm start (this will create the database file), the SQL file can be run to set up the database.
The default SQL has dummy data created to populate the blog with some content, this includes:
- 25 articles
- 8 users (two have real passwords and can be logged in)
- Multiple comments, likes, and subscription relationships
-----------
Test users:
-----------
- UserID1 ("deletedcomments", password: password) and UserID2 ("admin", password: admin) are both actual accounts and can be used to login to the site.
It is suggested that "admin" is a good test user, as data has been set up to show articles, comments, subscribers over time and populate the analytics page with data that displays well on the charts.

