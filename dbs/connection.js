
var mongoClient=require("mongodb").MongoClient
const state={
    db:null
}
module.exports.connect=((done)=>{
    var url='mongodb://127.0.0.1:27017'
    const dbName="foods"
    mongoClient.connect(url,(err,data)=>{
        if(err){
            return done(err)
        }
        state.db=data.db(dbName)
        done()
    });
})
  
module.exports.get=function(){
    return state.db
}