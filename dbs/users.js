const db = require('./connection')
const collectionname = require('./collectionName')
const bcript = require('bcrypt')
module.exports = {
    emailverify: (mail) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collectionname.USER_COLLECTION).findOne({ email: mail }).then((result) => {
                resolve(result)
            })
        })
    },
    userAdd: (data) => {
        return new Promise(async (resolve, reject) => {
            data.password = await bcript.hash(data.password, 10)
            db.get().collection(collectionname.USER_COLLECTION).insertOne({...data,block:"unBlock"}).then((result) => {
                resolve(result)
            })
        })
    },
    doLogin: (data) => {
        return new Promise(async (resolve, reject) => {

            console.log(data);
            var err;
            let res = await db.get().collection(collectionname.USER_COLLECTION).findOne({ email: data.email })
            if (res == null) {
                err = "email not matched"
                reject(err)
            } else {
                if (res.block == "unBlock" || !res.block) {
                    
                    if (res) {
                        bcript.compare(data.password, res.password).then((result) => {

                            if (result == true) {
                                res.a=result
                               
                                resolve(res)
                            } else {
                                resolve(result = false)
                            }
                        })
                    } else {
                        err = "email not matched"
                        reject(err)
                    } 
                } else {
                    err = "Account blocked"
                    reject(err)
                }
            }

        })
    },
    getProducts:()=>{
        return new Promise(async(resolve,reject)=>{
        let data=await db.get().collection(collectionname.ADMIN_PRODUCTS_ADD).find().toArray()
        let val=[]
       for(i=0;i<data.length;i++){
        if(data[i].del=='unflage' ||!data[i].del){
        val.push(data[i])
       }
       }
         resolve(val)
        })
    },
    doblock:(mail)=>{
        console.log(mail);
        return new Promise(async (resolve, reject) => {
        let res = await db.get().collection(collectionname.USER_COLLECTION).findOne({ email:mail })
        let flag=false;
        console.log(res);
        if(res.block!='unBlock' || !res.block){ 
            flag=true
        }
        resolve(flag)
        })
    }
}