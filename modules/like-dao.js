const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

async function getAllLikes() {
    const db = await dbPromise;

    const allLikes = await db.all(SQL`
        select *
        from likes
    `);
    return allLikes;
}

async function getLikesByUser(userId) {
    const db = await dbPromise;

    const likes = await db.all(SQL`
        select *
        from likes
        where userID = ${userId}
    `);
    return likes;
}

async function getLikesByArticle(articleId) {
    const db = await dbPromise;

    const likes = await db.all(SQL`
        select *
        from likes
        where articleID = ${articleId}
    `);
    return likes;
}

async function addLike(articleId, userId) {
    const db = await dbPromise;

    const like = await db.run(SQL`
        insert into likes (articleID, userID)
        values (${articleId}, ${userId})`);
    return like;
}

async function removeLike(articleId, userId) {
    const db = await dbPromise;

    const like = await db.run(SQL`
        delete
        from likes
        where articleID = ${articleId}
          and userID = ${userId}
    `);
    return like;
}

module.exports = {
    getAllLikes,
    getLikesByUser,
    getLikesByArticle,
    addLike,
    removeLike
};




