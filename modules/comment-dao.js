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
        where C.articleID = ${articleID} and U.userID = C.commentAuthorID
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


async function getCommentsCountPerDayByArticleAuthor(authorId, dayNumber) {
    const db = await dbPromise;

    const commentStatistics = await db.all(SQL`
        with commentByDay as (
            select strftime('%Y-%m-%d', comments.publishDate) as date,
                   count(*) as count
            from
                comments join articles on comments.articleID = articles.articleID
            where
                articles.authorID = ${authorId}
            group by
                strftime('%Y-%m-%d', comments.publishDate)
            order by strftime('%Y-%m-%d', comments.publishDate) desc
            limit ${dayNumber}
        )
        select *
        from commentByDay
        order by date;
    `);
    return commentStatistics;
}


async function addComment(articleId, authorId, content) {
    const db = await dbPromise;

    const comment = await db.run(SQL`
        insert into comments (articleID, commentAuthorID, content)
        values (${articleId}, ${authorId}, ${content})`);
    return comment.lastID;
}

async function addReplyComment(articleId, authorId, parentID, content) {
    const db = await dbPromise;

    const comment = await db.run(SQL`
        insert into comments (articleID, commentAuthorID, parentID, content)
        values (${articleId}, ${authorId}, ${parentID}, ${content})`);
  return comment.lastID;
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

async function deleteCommentByOverWriting(commentId) {
    const db = await dbPromise;

    const comment = await db.run(SQL`
        update comments
        set commentAuthorID = 1, content = 'Deleted comment' 
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
        where c.commentAuthorID = ${authorId}
    `);

    return results;
}

async function deleteAllArticleComments(articleID){
    const db = await dbPromise;

    const results = await db.run(SQL`
        delete
        from comments
        where articleID = ${articleID};
    `);
}

async function deleteCommentsByUserID(userId) {
    const db = await dbPromise;

    //Just update comments if they have children comments 
    await db.run(SQL`
        update comments
        set commentAuthorID = 1, content = 'Deleted comment' 
        where commentID in (
            select DISTINCT c1.commentID 
            from comments as c1 
            join comments as c2 on c1.commentID = c2.parentID
            where c1.commentAuthorID = ${userId}
        )
    `);

    await db.run(SQL`
        delete
        from comments
        where commentAuthorID = ${userId};
    `);
}



module.exports = {
    getAllComments,
    getCommentsById,
    getCommentsByArticle,
    getCommentsByCommentAuthor,
    getCommentsByParent,
    addComment,
    getCommentsByArticleAuthor,
    getCommentsCountPerDayByArticleAuthor,
    removeComment,
    getCommentsAndArticleTitleByAuthorId,
    getAllCommentsByArticleIDOrdered,
    addReplyComment,
    deleteCommentByOverWriting,
    deleteAllArticleComments,
    deleteCommentsByUserID
};
