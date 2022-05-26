const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");


async function getFollowerByAuthor(userId) {
    const db = await dbPromise;

    const allFollow = await db.all(SQL`
        select *
        from subscribes
        where articleAuthorID = ${userId}
    `);
    return allFollow;
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
    getFollowerByAuthor,
    addFollow,
    removeFollow
};




