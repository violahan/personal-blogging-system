const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

async function getAllComments() {
    const db = await dbPromise;

    const allComments = await db.all(SQL`
        select *
        from comments
    `);
    return allComments;
}

async function getCommentsById(commentId) {
    const db = await dbPromise;

    const comment = await db.get(SQL`
        select *
        from comments
        where commentID = ${commentId}
    `);
    return comment;
}





async function getAllCommentsByArticleIDOrdered(articleID) {
    const db = await dbPromise;

    const allOrderedComments = await db.all(SQL`
        select C.*, U.userID, U.userName, U.avatarFilePath
        from comments as C, user as U
        where C.articleID = ${articleID} and U.userID = C.authorID
        order by publishDate desc
    `);
    return allOrderedComments;
}

async function getCommentsByArticle(articleId) {
    const db = await dbPromise;

    const comments = await db.all(SQL`
        select *
        from comments
        where articleID = ${articleId}
    `);
    return comments;
}

async function getCommentsByAuthor(authorId) {
    const db = await dbPromise;

    const comments = await db.all(SQL`
        select *
        from comments
        where authorID = ${authorId}
    `);
    return comments;
}

async function getCommentsByParent(parentId) {
    const db = await dbPromise;

    const comments = await db.all(SQL`
        select *
        from comments
        where parentID = ${parentId}
    `);
    return comments;
}

async function addComment(articleId, authorId, parentId, content) {
    const db = await dbPromise;

    const comment = await db.run(SQL`
        insert into comments (articleID, authorID, parentID, content)
        values (${articleId}, ${authorId}), ${parentId}),${content})`);
    return comment;
}

async function removeComment(commentId) {
    const db = await dbPromise;

    const comment = await db.run(SQL`
        delete
        from comments
        where commentID = ${commentId}
    `);
    return comment;
}

async function getCommentsAndArticleTitleByAuthorId(authorId) {
    const db = await dbPromise;

    const results = await db.all(SQL`
        select c.commentID, c.content, c.publishDate, a.title
        from comments as c
        join articles as a on c.articleID = a.articleID
        where c.authorID = ${authorId}
    `);

    return results;
}

module.exports = {
    getAllComments,
    getCommentsById,
    getCommentsByArticle,
    getCommentsByAuthor,
    getCommentsByParent,
    addComment,
    removeComment,
    getCommentsAndArticleTitleByAuthorId,
    getAllCommentsByArticleIDOrdered
};




