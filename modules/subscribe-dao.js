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

module.exports = {
    getSubscribesBySubscriberId,
    getSubscribesByAuthorId,
    getSubscribesByAuthorIdAndSubscriberId,
    addFollow,
    removeFollow
}

