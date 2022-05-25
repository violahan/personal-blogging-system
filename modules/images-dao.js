const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

async function getImageByArticleID(articleID){
    const db = await dbPromise;

    const imagesByArticle = await db.all(SQL`
        select *
        from images
        where articleID = ${articleID}
        `);

    return imagesByArticle;
};

async function getThumbnailImageByArticleID(articleID){
    const db = await dbPromise;

    const thumbnailByArticleID = await db.all(SQL`
        select *
        from images
        where articleID = ${articleID}
        and thumbnailFlag = 1
        `);

    return thumbnailByArticleID;
};

// Export functions.
module.exports = {
    getImageByArticleID,
    getThumbnailImageByArticleID
};