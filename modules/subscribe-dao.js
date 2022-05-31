const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

async function getSubscribesBySubscriberId(subscriberId) {
    const db = await dbPromise;

    const subscribes = await db.all(SQL`
        select *
        from subscribes
        where userSubscriberID = ${subscriberId}
    `);
    return subscribes;
}


async function getSubscribesByAuthorId(authorId) {
    const db = await dbPromise;

    const subscribes = await db.all(SQL`
        select *
        from subscribes
        where articleAuthorID = ${authorId}
    `);
    return subscribes;
}

async function getSubscribesByAuthorIdAndSubscriberId(authorId, subscriberId) {
    const db = await dbPromise;

    const subscribe = await db.get(SQL`
        select *
        from subscribes
        where articleAuthorID = ${authorId} and userSubscriberID = ${subscriberId}
    `);
    return subscribe;
}

async function addFollow(followerId, authorId) {
    const db = await dbPromise;

    const follow = await db.run(SQL`
        insert into subscribes (userSubscriberID, articleAuthorID)
        values (${followerId}, ${authorId})`);
    return follow;
}

async function removeFollow(followerId, authorId) {
    const db = await dbPromise;

    const follow = await db.run(SQL`
        delete
        from subscribes
        where userSubscriberID = ${followerId}
          and articleAuthorID = ${authorId}
    `);
    return follow;
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

module.exports = {
    getSubscribesBySubscriberId,
    getSubscribesByAuthorId,
    getSubscribesByAuthorIdAndSubscriberId,
    addFollow,
    removeFollow,
    getCumulativeSubscribeCountByArticleAuthor
}

