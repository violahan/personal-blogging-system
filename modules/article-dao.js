const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

async function getAllArticles(){
    const db = await dbPromise;

    const allArticles = await db.all(SQL`
        select *
        from articles
        `);

    return allArticles;

};

async function getAllArticlesOrderedBy(orderColumn, orderDirection){

    const db = await dbPromise;

    // Removed SQL template string protection to allow the user of order by
    // These variables are not editable from the user
    const allArticlesOrderedBy = await db.all(`
        select *
        from articles
        order by ${orderColumn} ${orderDirection}
        `);

    return allArticlesOrderedBy;

};

async function getArticleCardInformationOrderedBy(orderColumn, orderDirection){

    const db = await dbPromise;

    // Removed SQL template string protection to allow the user of order by
    // These variables are not editable from the user
    const allArticlesOrderedBy = await db.all(`
        select A.articleID, A.authorID, A.title, A.publishDate, A.numberOfComments,
                A.numberOfLikes, U.userID, U.userName, U.fName, U.lName, U.avatarFilePath 
        from articles as A, user as U
        where A.authorID = U.userID
        order by ${orderColumn} ${orderDirection}
        `);

    return allArticlesOrderedBy;

};

async function getArticlesCardInformationByUserOrderedBy(userID, orderColumn, orderDirection){

    const db = await dbPromise;

    // Removed SQL template string protection to allow the user of order by
    // These variables are not editable from the user
    const allUserArticlesOrderedBy = await db.all(`
        select A.articleID, A.authorID, A.title, A.publishDate, A.numberOfComments,
                A.numberOfLikes, U.userID, U.userName, U.fName, U.lName, U.avatarFilePath 
        from articles as A, user as U
        where A.authorID = U.userID and U.userID = ${userID}
        order by ${orderColumn} ${orderDirection}
        `);

    return allUserArticlesOrderedBy;

};




// This function will likely be deleted - use "getAllArticlesOrderedBy" instead after testing
async function getAllArticlesByDateDescending(){
    const db = await dbPromise;

    const allArticlesByDateDescending = await db.all(SQL`
        select *
        from articles
        order by publishDate desc
        `);

    return allArticlesByDateDescending;

};

// This function will likely be deleted - use order by condition instead after testing
async function getAllArticlesByDateAscending(){
    const db = await dbPromise;

    const allArticlesByDateDescending = await db.all(SQL`
        select *
        from articles
        order by publishDate asc
        `);

    return allArticlesByDateDescending;

};

async function getArticlesByAuthorId(authorId) {
    const db = await dbPromise;
    const articles = await db.all(SQL`
        select * from articles where authorID = ${authorId}
    `);
    return articles;
}

// Export functions.
module.exports = {
    getAllArticles,
    getAllArticlesOrderedBy,
    getAllArticlesByDateAscending,
    getAllArticlesByDateDescending,
    getArticleCardInformationOrderedBy,
    getArticlesByAuthorId,
    getArticlesCardInformationByUserOrderedBy
};
