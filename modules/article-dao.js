const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");


async function getAllSortedArticles(orderColumn, orderDirection, contentDisplayLength= 250){

    const db = await dbPromise;
    const articles = await db.all(`
        with commentCount as (
            select a.articleID as articleID, count(c.commentID) as commentCount
            from articles a left join comments c on a.articleID = c.articleID
            group by a.articleID
        )
           ,likeCount as (
            select a.articleID as articleID, count(l.userID) as likeCount
            from articles a left join likes l on a.articleID = l.articleID
            group by a.articleID
        )
           ,thumbnailImage as (
            select i.articleID as articleID, i.path as thumbnailImagePath
            from images i
            where i.thumbnailFlag = 1
        )
        select
            a.articleID,
            a.authorID,
            a.title,
            strftime('%Y/%m/%d', a.publishDate) as publishDate,
            u.userID,
            u.userName,
            u.fName,
            u.lName,
            u.avatarFilePath,
            substring(a.content, 0, ${contentDisplayLength}) || '......' as content,
            c.commentCount,
            l.likeCount,
            ifnull(t.thumbnailImagePath, './article-images/article-thumbnails/default_thumbnail.png') as thumbnailImagePath
        from
            articles a
                join user u on a.authorID = u.userID
                join commentCount c on a.articleID = c.articleID
                join likeCount l on a.articleID = l.articleID
                left join thumbnailImage t on a.articleID = t.articleID
        order by
            ${orderColumn} ${orderDirection}
    `);
    return articles
}

async function getAllSortedArticlesByUser(userID, orderColumn, orderDirection){
    const allArticles = await getAllSortedArticles(orderColumn, orderDirection);
    const articlesByUser = allArticles.filter(function (article){
        return article.authorID.toString() === userID;
    })
    return articlesByUser;
};

async function getArticlesByAuthorId(authorId) {
    const db = await dbPromise;
    const articles = await db.all(SQL`
        select * from articles where authorID = ${authorId}
    `);
    return articles;
}

async function getArticleByID(articleID){
    const db = await dbPromise;

    const articleInfoByID = await db.get(SQL`
        select A.*, U.userID, U.userName, U.fName, U.lName, U.avatarFilePath
        from articles as A, user as U
        where A.articleID = ${articleID} and A.authorID = U.userID
        `);

    return articleInfoByID;

};

async function getArticleSortedByPopularity(authorId, articleNumber){
    const db = await dbPromise;

    const articles = await db.all(SQL`
        with commentCount as (
            select a.articleID as articleID, count(c.commentID) as commentCount
            from articles a left join comments c on a.articleID = c.articleID
            where a.authorID = ${authorId}
            group by a.articleID
        )
        ,likeCount as (
            select a.articleID as articleID, count(l.userID) as likeCount
            from articles a left join likes l on a.articleID = l.articleID
            where a.authorID = ${authorId}
            group by a.articleID
        )
        select
            a.articleID as articleID,
            a.title as title,
            a.publishDate as publishDate,
            substring(a.content, 0, 250) || '......' as content,
            2 * c.commentCount + l.likeCount as popularity
        from commentCount c
                 join likeCount l on c.articleID = l.articleID
                 join articles a on l.articleID = a.articleID
        order by popularity desc
        limit ${articleNumber};
    `);
    return articles;
}

async function createNewArticle(authorId, articleTitle, articleContent){
    const db = await dbPromise;

    const newArticle = await db.run(SQL`
            insert into articles (authorID, title, content)
            values (${authorId}, ${articleTitle}, ${articleContent})
        `);
    return newArticle.lastID;
}

async function deleteArticle(articleID){
    const db = await dbPromise;

    const results = await db.run(SQL`
        delete
        from articles
        where articleID = ${articleID};
    `);
}

async function getAuthorByArticleID(articleID){
    const db = await dbPromise;
   
    const authorID = await db.get(SQL`
        select authorID
        from articles
        where articleID = ${articleID};
    `);
    return authorID;

}


async function updateArticle(articleID, title, content) {
    const db = await dbPromise;

    await db.run(SQL`
        update articles
            set title = ${title},
            content = ${content}
            where articleID = ${articleID}
        `);
}

module.exports = {
    getAllSortedArticles,
    getArticlesByAuthorId,
    getArticleByID,
    getAllSortedArticlesByUser,
    getArticleSortedByPopularity,
    createNewArticle,
    deleteArticle,
    getAuthorByArticleID,
    updateArticle
};
