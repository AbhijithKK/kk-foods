const db = require('./connection')
const collectionname = require('./collectionName')
const bcript = require('bcrypt')
const objectid = require('mongodb').ObjectId
module.exports = {
    emailverify: (mail) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collectionname.USER_COLLECTION).findOne({ email: mail }).then((result) => {
                resolve(result)
            }).catch((err) => {
                resolve(err)
            })
        })
    },
    userAdd: (data) => {
        return new Promise(async (resolve, reject) => {
            data.password = await bcript.hash(data.password, 10)
            db.get().collection(collectionname.USER_COLLECTION).insertOne({ ...data, block: "unBlock", productId: [], address: [] }).then((result) => {
                resolve(result)
            }).catch((err) => {
                reject(err)
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
                                res.a = result

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
    getProducts: () => {
        try {
            return new Promise(async (resolve, reject) => {

                let data = await db.get().collection(collectionname.ADMIN_PRODUCTS_ADD).find().toArray()
                let val = []
                for (i = 0; i < data.length; i++) {
                    if (data[i].del == 'unflage' || !data[i].del) {
                        val.push(data[i])
                    }
                }
                resolve(val)
            })
        } catch (e) {
            reject(e)
        }
    },
    doblock: (mail) => {
        try {
            return new Promise(async (resolve, reject) => {
                let res = await db.get().collection(collectionname.USER_COLLECTION).findOne({ email: mail })

                resolve(res)
            })
        } catch (e) {
            reject(e)
        }
    },
    getCatogaryProducts: (catogary) => {
        try {

            return new Promise(async (resolve, reject) => {
                let data = await db.get().collection(collectionname.ADMIN_PRODUCTS_ADD).find().toArray()
                let val = []
                for (i = 0; i < data.length; i++) {
                    if (data[i].productCatogary == catogary) {
                        val.push(data[i])
                    }
                }
                console.log(val);
                resolve(val)
            })
        } catch (e) {
            reject(e)
        }
    },
    cartProductAdd: (productId, userId) => {
        try {
            return new Promise(async (resolve, reject) => {
                console.log(productId + 'hg' + userId);
                if (productId != null && userId != null) {

                    await db.get().collection(collectionname.USER_COLLECTION).updateOne({ _id: objectid(userId) }, { $addToSet: { productId } })
                    let arr
                    reject(arr)
                } else {
                    let data = await db.get().collection(collectionname.USER_COLLECTION).findOne({ _id: objectid(userId) })
                    if (data.productId != undefined || data.productId != null) {
                        let arr = [];
                        for (let i = 0; i < data.productId.length; i++) {
                            arr.push(await db.get().collection(collectionname.ADMIN_PRODUCTS_ADD).findOne({ _id: objectid(data.productId[i]) }))
                        }
                        resolve(arr)
                    } else {
                        resolve()

                    }
                }
            })
        } catch (e) {
            reject(e)
        }
    },
    delCartitem: async (id, cartid) => {
        try {
            return await new Promise((resolve, reject) => {
                db.get().collection(collectionname.USER_COLLECTION).updateOne({ _id: objectid(id) }, { $pull: { productId: cartid } }).then((ree) => {
                    resolve(ree)
                })

            })
        } catch (err) {
            reject(err)
        }
    },
    profile: (id) => {
        try {
            return new Promise(async (resolve, reject) => {
                let res = await db.get().collection(collectionname.USER_COLLECTION).findOne({ _id: objectid(id) })
                resolve(res)

            })
        } catch (e) {
            reject(e)
        }
    },
    profileUpdate: (id, data, image) => {
        try {

            return new Promise(async (resolve, reject) => {
                let mailcheck = await db.get().collection(collectionname.USER_COLLECTION).findOne({ _id: objectid(id) })

                if (data.proEmail == null || data.proEmail == '') {
                    data.proEmail = mailcheck.email;
                }
                if (data.proPassword == null || data.proPassword == "" || data.proPassword.value < 5) {
                    data.proPassword = mailcheck.password;
                } else {
                    data.proPassword = await bcript.hash(data.proPassword, 10)
                }
                if (image.proImage == null || image.proImage == '') {
                    image.proImage = mailcheck.image.proImage;
                }


                db.get().collection(collectionname.USER_COLLECTION).updateOne({ _id: objectid(id) }, {
                    $set: {
                        name1: data.proName,
                        email: data.proEmail,
                        mob: data.proNumber,
                        image,
                        password: data.proPassword

                    }
                }).then((ress) => {
                    resolve(ress)
                })
            })
        } catch (e) {
            reject(e)
        }
    },
    address: (id, address) => {
        try {
            return new Promise(async (resolve, reject) => {
                if (address != null || address != undefined || address != '') {
                    await db.get().collection(collectionname.USER_COLLECTION).updateOne({ _id: objectid(id) }, { $addToSet: { address } })
                }
                let data = await db.get().collection(collectionname.USER_COLLECTION).findOne({ _id: objectid(id) })
                resolve(data.address)
            })
        } catch (e) {
            reject(e)
        }
    },
    searchproduct: (data) => {

        return new Promise((resolve, reject) => {
            try {
                db.get().collection(collectionname.ADMIN_PRODUCTS_ADD).find({ $or: [{ productName: new RegExp(data, 'i') }, 
                { productCatogary: new RegExp(data) }] })
                    .toArray().then((data) => {
                        resolve(data)
                        

                    })
            } catch (e) {
                reject(e)
            }
        })

    }
}            