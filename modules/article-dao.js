const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

async function getAllArticles(){
    const db = await dbPromise;

    const allArticles = await db.get(SQL`
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




// This function will likely be deleted - use "getAllArticlesOrderedBy" instead after testing
async function getAllArticlesByDateDescending(){
    const db = await dbPromise;

    const allArticlesByDateDescending = await db.get(SQL`
        select *
        from articles
        order by publishDate desc
        `);

    return allArticlesByDateDescending;

};

// This function will likely be deleted - use order by condition instead after testing
async function getAllArticlesByDateAscending(){
    const db = await dbPromise;

    const allArticlesByDateDescending = await db.get(SQL`
        select *
        from articles
        order by publishDate asc
        `);

    return allArticlesByDateDescending;

};

// Export functions.
module.exports = {
    getAllArticles,
    getAllArticlesOrderedBy,
    getAllArticlesByDateAscending,
    getAllArticlesByDateDescending
};
