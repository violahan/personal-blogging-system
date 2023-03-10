const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

async function getMainImageByArticleID(articleID){
    const db = await dbPromise;

    const imagesByArticle = await db.all(SQL`
        select *
        from images
        where articleID = ${articleID}
        and thumbnailFlag = 0
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

async function createArticleImage(articleID, fileName, filePath){
    const db = await dbPromise;

    const articleImage = await db.run(SQL`
        insert into images (fileName, path, articleID, thumbnailFlag)
        values (${fileName}, ${filePath}, ${articleID}, "0")  
    `
    );

    return articleImage

}

async function createArticleThumbnail(articleID, fileName, filePath){
    const db = await dbPromise;

    const thumbnailImage = await db.run(SQL`
        insert into images (fileName, path, articleID, thumbnailFlag)
        values (${fileName}, ${filePath}, ${articleID}, "1")  
    `
    );

    return thumbnailImage



}

async function deleteAllArticleImages(articleID){
    const db = await dbPromise;

    const results = await db.run(SQL`
        delete
        from images
        where articleID = ${articleID};
    `);
}

async function getAllImageByArticleID(articleID){
    const db = await dbPromise;

    const imagesByArticle = await db.all(SQL`
        select *
        from images
        where articleID = ${articleID}
        `);

    return imagesByArticle;
};

async function getAllImagesByAuthorID(authorId) {
    const db = await dbPromise;

    const images = await db.all(SQL`
        select * from images
        where articleID in (
            select articleID from articles 
            where authorID = ${authorId}
        )
    `);

    return images;
}

// Export functions.
module.exports = {
    getMainImageByArticleID,
    getThumbnailImageByArticleID,
    createArticleImage,
    createArticleThumbnail,
    deleteAllArticleImages,
    getAllImageByArticleID,
    getAllImagesByAuthorID
};