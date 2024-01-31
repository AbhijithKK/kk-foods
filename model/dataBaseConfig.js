
var mongoClient = require("mongodb").MongoClient
const state = {
    db: null
}
module.exports.connect = ((done) => {
    var url = process.env.DB
    const dbName = "foods"
    mongoClient.connect(url, (err, data) => {
        if (err) {
            return done(err)
        }
        state.db = data.db(dbName)
        done()
    });
})

module.exports.get = function () {
    return state.db
}