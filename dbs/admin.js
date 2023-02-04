const db=require('./connection')
const collectionname=require('./collectionName')
const bcript=require('bcrypt')
const objectid=require('mongodb').ObjectId
module.exports={
    adminLogin:(data)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collectionname.ADMIN_COLLECTION).findOne({name:data.name}).then((result)=>{
                console.log(result);
                if(result){
                    var rs=false;
                    if(data.password===result.password){
                            resolve(rs=true)
                    }else{
                        resolve(rs)
                    }
                }else{
                    
                    reject(result)
                }
            })
        })
    },
    userData:()=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collectionname.USER_COLLECTION).find().toArray().then((result)=>{
                resolve(result)
            })
        })
    },
    blockUser:(id)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collectionname.USER_COLLECTION).updateOne({_id:objectid(id)},{$set:{block:"Blocked"}}).then((res)=>{
                console.log(res);
                resolve()
            })
        })
    },
    unblockUser:(id)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collectionname.USER_COLLECTION).updateOne({_id:objectid(id)},{$set:{block:"unBlock"}}).then((res)=>{

                resolve()
            })
        })
    },
    addProduct:(data,imgid)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collectionname.ADMIN_PRODUCTS_ADD).insertOne({...data,...imgid}).then((rs)=>{
               
                resolve(rs.insertedId)
            })
        })
    },
    showProducts:()=>{
        return new Promise(async(resolve,reject)=>{
            var res=await db.get().collection(collectionname.ADMIN_PRODUCTS_ADD).find().toArray()
            resolve(res)
        })
    },
    deleteProduct:(id,flage)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collectionname.ADMIN_PRODUCTS_ADD).updateOne({_id:objectid(id)},{$set:{
                
                del:flage
            }}).then((res)=>{
               
                resolve(res.acknowledged)})
        })
    },
    editProduct:(id)=>{
        return new Promise(async(resolve,reject)=>{
          let data=await db.get().collection(collectionname.ADMIN_PRODUCTS_ADD).findOne({_id:objectid(id)})
          resolve(data)
         
        })
    },
    updateProduct:(id,datas,imgid)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collectionname.ADMIN_PRODUCTS_ADD).updateOne({_id:objectid(id)},{$set:{
                productName:datas.productName,
                productCatogary:datas.productCatogary,
                productDiscription:datas.productDiscription,
                productPrize:datas.productPrize,
                ...imgid
            }}).then((result)=>{
                resolve(result)
            })
        })
    },
    catogatyAdd:(catogary)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection('catogary').insertOne({catogary,block:"unBlock"}).then((resp)=>{
                resolve(resp)
            })
        })
    },
    showCatogary:()=>{
        return new Promise(async(resolve,reject)=>{
           let cat=await db.get().collection('catogary').find().toArray()
          
          
           resolve(cat)
        })
    },
    blockCatogary:(id,data)=>{
        return new Promise(async(resolve,reject)=>{
         let a=await db.get().collection('catogary').updateOne({_id:objectid(id)},{$set:{block:data}})
           resolve(a)
        })
    },
    updateCatogary:(id,data)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection('catogary').updateOne({_id:objectid(id)},{$set:{
                catogary:data
            }}).then((resp)=>{
                resolve(resp)
            })
        })
    },
    findCatogary:(id)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection('catogary').findOne({_id:objectid(id)}).then((data)=>{
                resolve(data)
            })
        })
    },
    deleteCatogary:(id)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection('catogary').deleteOne({_id:objectid(id)}).then((data)=>{
                resolve(data)
            })
        })
    }
}
