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

async function getCommentsByArticle(articleId) {
    const db = await dbPromise;

    const comments = await db.all(SQL`
        select *
        from comments
        where articleID = ${articleId}
    `);
    return comments;
}

async function getCommentsByCommentAuthor(authorId) {
    const db = await dbPromise;

    const comments = await db.all(SQL`
        select *
        from comments
        where commentAuthorID = ${authorId}
    `);
    return comments;
}

async function getCommentsByArticleAuthor(authorId) {
    const db = await dbPromise;

    const comments = await db.all(SQL`
        select *
        from comments join articles  
            on comments.articleID = articles.articleID
        where articles.authorID = ${authorId} 
        order by comments.publishDate desc 
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

async function addComment(articleId, commentAuthorID, parentId, content) {
    const db = await dbPromise;

    const comment = await db.run(SQL`
        insert into comments (articleID, commentAuthorID, parentID, content)
        values (${articleId}, ${commentAuthorID}), ${parentId}),${content})`);
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
    getCommentsByCommentAuthor,
    getCommentsByParent,
    addComment,
    removeComment,
    getCommentsByArticleAuthor
};




