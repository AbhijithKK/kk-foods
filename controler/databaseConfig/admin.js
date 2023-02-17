const db = require('./connection')
const collectionname = require('./collectionName')
const bcript = require('bcrypt')
const objectid = require('mongodb').ObjectId
module.exports = {
    adminLogin: (data) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collectionname.ADMIN_COLLECTION).findOne({ name: data.name }).then((result) => {
                console.log(result);
                if (result) {
                    var rs = false;
                    if (data.password === result.password) {
                        resolve(rs = true)
                    } else {
                        resolve(rs)
                    }
                } else {

                    reject(result)
                }
            })
        })
    },
    userData: () => {
        return new Promise((resolve, reject) => {
            db.get().collection(collectionname.USER_COLLECTION).find().toArray().then((result) => {
                resolve(result)
            }).catch((err) => {
                reject(err)
            })
        })
    },
    blockUser: (id) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collectionname.USER_COLLECTION).updateOne({ _id: objectid(id) }, { $set: { block: "Blocked" } }).then((res) => {
                console.log(res);
                resolve()
            }).catch((err) => {
                reject(err)
            })
        })
    },
    unblockUser: (id) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collectionname.USER_COLLECTION).updateOne({ _id: objectid(id) }, { $set: { block: "unBlock" } }).then((res) => {

                resolve()
            }).catch((err) => {
                reject(err)
            })
        })
    },
    addProduct: (data, imgid) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collectionname.ADMIN_PRODUCTS_ADD).insertOne({ ...data, ...imgid,del:"unflage" }).then((rs) => {

                resolve(rs.insertedId)
            }).catch((err) => {
                reject(err)
            })
        })
    },
    showProducts: () => {
        try {
            return new Promise(async (resolve, reject) => {

                var res = await db.get().collection(collectionname.ADMIN_PRODUCTS_ADD).find().toArray()
                resolve(res)
            })
        } catch (e) {
            reject(e)
        }
    },
    deleteProduct: (id, flage) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collectionname.ADMIN_PRODUCTS_ADD).updateOne({ _id: objectid(id) }, {
                $set: {

                    del: flage
                }
            }).then((res) => {

                resolve(res.acknowledged)
            }).then((err) => {
                reject(err)
            })
        })
    },
    editProduct: (id) => {
        try {
            return new Promise(async (resolve, reject) => {

                let data = await db.get().collection(collectionname.ADMIN_PRODUCTS_ADD).findOne({ _id: objectid(id) })
                resolve(data)

            })
        } catch (e) {
            resolve(e)
        }
    },
    updateProduct: (id, datas, imgid) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collectionname.ADMIN_PRODUCTS_ADD).updateOne({ _id: objectid(id) }, {
                $set: {
                    productName: datas.productName,
                    productCatogary: datas.productCatogary,
                    productDiscription: datas.productDiscription,
                    productPrize: datas.productPrize,
                    ...imgid
                }
            }).then((result) => {
                resolve(result)
            }).catch((err) => {
                reject(err)
            })
        })
    },
    catogatyAdd: (catogary) => {
        return new Promise((resolve, reject) => {
            db.get().collection('catogary').insertOne({ catogary, block: "unBlock" }).then((resp) => {
                resolve(resp)
            }).catch((err) => {
                reject(err)
            })
        })
    },
    showCatogary: () => {
        try {
            return new Promise(async (resolve, reject) => {

                let cat = await db.get().collection('catogary').find().toArray()
                resolve(cat)

            })
        } catch (e) {
            reject(e)
        }
    },
    blockCatogary: (id, data) => {
        try {
            return new Promise(async (resolve, reject) => {

                let a = await db.get().collection('catogary').updateOne({ _id: objectid(id) }, { $set: { block: data } })
                resolve(a)

            })
        } catch (e) {
            reject(e)
        }
    },
    updateCatogary: (id, data) => {
        return new Promise((resolve, reject) => {
            db.get().collection('catogary').updateOne({ _id: objectid(id) }, {
                $set: {
                    catogary: data
                }
            }).then((resp) => {
                resolve(resp)
            }).catch((err) => {
                reject(err)
            })
        })
    },
    findCatogary: (id) => {
        return new Promise((resolve, reject) => {
            db.get().collection('catogary').findOne({ _id: objectid(id) }).then((data) => {
                resolve(data)
            }).catch((err) => {
                reject(err)
            })
        })
    },
    deleteCatogary: (id) => {
        return new Promise((resolve, reject) => {
            db.get().collection('catogary').deleteOne({ _id: objectid(id) }).then((data) => {
                resolve(data)
            }).catch((err) => {
                reject(err)
            })
        })
    },
    coopenAdd:(data)=>{
        return new Promise(async(resolve,reject)=>{
            try{
            db.get().collection('coopen').insertOne({...data,cpList:"Unlist"})
            let res=await db.get().collection('coopen').find().toArray()
            
            resolve(res)
            }catch(e){
                reject(e)
            }
            
        })
    },
    coopenFind:()=>{
       
        return new Promise(async(resolve,reject)=>{
            try{
            let res=await db.get().collection('coopen').find().toArray()
            
                resolve(res)
            }catch(e){
                reject(e)
            }
        })
    },
    cpList:(id,data)=>{
        return new Promise(async(resolve,reject)=>{
            try{
                let val=''
                if(data=='Unlist'){
                    val='List';
                }else{
                    val='Unlist';
                }
            await db.get().collection('coopen').updateOne({_id:objectid(id)},{$set:{
                cpList:val
            }})
            let res=await db.get().collection('coopen').findOne({_id:objectid(id)})
                resolve(res.cpList)
            }catch(e){
                reject(e)
            }
        })
    }
}
