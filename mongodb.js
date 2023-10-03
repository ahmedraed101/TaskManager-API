const { MongoClient, ObjectId } = require('mongodb')

const connectionsURI = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'
const client = new MongoClient(connectionsURI)

const run = async () => {
    try {
        // await client.connect()
        const db = client.db(databaseName)
        const users = db.collection('users')
        const last_users = await users
            .find(
                {
                    _id: {
                        $in: [
                            new ObjectId('64f093f70fbe5ff11ab81849'),
                            new ObjectId('64f093f70fbe5ff11ab8184a'),
                            new ObjectId('64f094aa20fe756b775e51f3'),
                            new ObjectId('64f093f70fbe5ff11ab8184b'),
                        ],
                    },
                },
                { name: true, age: true, _id: true }
            )
            .sort({ age: 1 })
            .toArray()
        console.log(last_users)
        // for await (const user of last_users) {
        //     console.log(user)
        // }
        // console.log(
        //     new Date(
        //         new ObjectId('64f093f70fbe5ff11ab81849').getTimestamp()
        //     ).getTime()
        // )
        // console.log(new ObjectId('64f093f70fbe5ff11ab81849').id)
    } finally {
        await client.close()
    }
}

run().catch(console.dir)
