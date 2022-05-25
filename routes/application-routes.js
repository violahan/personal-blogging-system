const express = require("express");
const router = express.Router();

const articleDAO = require();
const userDAO = require();

// const testDao = require("../modules/test-dao.js");

// Display the home page with list of articles
router.get("/", async function(req, res) {

    // Get default article view - articles in descending order from latest:
    const articlesByDateDes = await articleDAO. ...

    // Call display articles function to get article cards


    res.render("home");
});

module.exports = router;