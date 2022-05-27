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

async function getLikesByArticleAuthor(authorId) {
    const db = await dbPromise;

    const likes = await db.all(SQL`
        select *
        from likes join articles  
            on likes.articleID = articles.articleID
        where articles.authorID = ${authorId} 
        order by likes.publishDate desc 
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

async function getLikesAndArticleTitleByUserId(userId) {
    const db = await dbPromise;

    const results = await db.all(SQL`
        select l.articleID, l.publishDate, a.title
        from likes as l
        join articles as a on l.articleID = a.articleID
        where l.userID = ${userId}
    `);

    return results;
}

module.exports = {
    getAllLikes,
    getLikesByUser,
    getLikesByArticle,
    addLike,
    removeLike,
    getLikesAndArticleTitleByUserId
    getLikesByArticleAuthor
};




