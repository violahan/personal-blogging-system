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

async function getDateOrderTopLevelCommentsByArticleId(articleID) {
    const db = await dbPromise;

    const topLevelComments = await db.all(SQL`
        select *
        from comments
        where articleID = ${articleID} and parentID = null
        order by publishDate desc
    `);
    return topLevelComments;
}

async function getDateOrderNestedCommentsByArticleId(articleID) {
    const db = await dbPromise;

    const nestedComments = await db.all(SQL`
        select *
        from comments
        where articleID = ${articleID} and parentID != null
        order by publishDate desc
    `);
    return nestedComments;
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


module.exports = {
    getAllComments,
    getCommentsById,
    getCommentsByArticle,
    getCommentsByAuthor,
    getCommentsByParent,
    addComment,
    removeComment,
    getDateOrderTopLevelCommentsByArticleId,
    getDateOrderNestedCommentsByArticleId
};




