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

module.exports = {
    getSubscribesBySubscriberId,
    getSubscribesByAuthorId,
    getSubscribesByAuthorIdAndSubscriberId
}