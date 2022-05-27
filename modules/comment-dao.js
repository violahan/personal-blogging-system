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

async function getCumulativeSubscribeCountByArticleAuthor(authorId) {
    const db = await dbPromise;

    const subscribeStatistics = await db.all(SQL`
        with SubscribeByDay as (
            select
                strftime('%Y-%m-%d', dateSubscribed) as date,
                count(*) as count
            from
                subscribes
            where
                articleAuthorID = ${authorId}
            group by
                strftime('%Y-%m-%d', dateSubscribed)
        )
        select
            date,
            sum(count) over (order by date rows between unbounded preceding and current row) as cumulativeCount
        from SubscribeByDay
    `);
    return subscribeStatistics
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

module.exports = {
    getAllComments,
    getCommentsById,
    getCommentsByArticle,
    getCommentsByCommentAuthor,
    getCommentsByParent,
    addComment,
    getCommentsByArticleAuthor,
    getCommentsCountPerDayByArticleAuthor,
    getCumulativeSubscribeCountByArticleAuthor,
    removeComment,
    getCommentsAndArticleTitleByAuthorId
};




