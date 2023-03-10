const db = require('./connection')
const collectionname = require('./collectionName')
const bcript = require('bcrypt')
const { login } = require('../userControl')
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
            db.get().collection(collectionname.ADMIN_PRODUCTS_ADD).insertOne({ ...data, ...imgid, del: "unflage" }).then((rs) => {

                resolve(rs.insertedId)
            }).catch((err) => {
                reject(err)
            })
        })
    },
    showProducts: () => {
        return new Promise(async (resolve, reject) => {
            try {
                var res = await db.get().collection(collectionname.ADMIN_PRODUCTS_ADD).find().toArray()
                resolve(res)
            } catch (e) {
                reject(e)
            }
        })
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
        return new Promise(async (resolve, reject) => {
            try {
                let data = await db.get().collection(collectionname.ADMIN_PRODUCTS_ADD).findOne({ _id: objectid(id) })
                resolve(data)
            } catch (e) {
                reject(e)
            }

        })
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
        return new Promise(async (resolve, reject) => {
            let cat = await db.get().collection('catogary').find({ catogary: RegExp("^" + catogary, 'i') }).toArray()
            console.log(cat);
            let resp = false

            if (cat.length > 0) {
                resp = true
            }
            console.log(resp);
            if (resp != true) {
                db.get().collection('catogary').insertOne({ catogary, block: "unBlock" }).then(() => {
                    resolve(resp = true)
                }).catch((err) => {
                    reject(err)
                })
            }
            resolve(resp)
        })
    },
    showCatogary: () => {
        return new Promise(async (resolve, reject) => {
            try {
                let cat = await db.get().collection('catogary').find().toArray()
                resolve(cat)
            } catch (e) {
                reject(e)
            }
        })
    },
    blockCatogary: (id, data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let a = await db.get().collection('catogary').updateOne({ _id: objectid(id) }, { $set: { block: data } })
                resolve(a)
            } catch (e) {
                reject(e)
            }

        })
    },
    updateCatogary: (id, data) => {
        console.log(data);
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
    coopenAdd: (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                db.get().collection('coopen').insertOne({ ...data, cpList: "Unlist" })
                let res = await db.get().collection('coopen').find().toArray()
                resolve(res)
            } catch (e) {
                reject(e)
            }
        })
    },
    coopenFind: () => {
        return new Promise(async (resolve, reject) => {
            try {
                let res = await db.get().collection('coopen').find().toArray()
                resolve(res)
            } catch (e) {
                reject(e)
            }
        })
    },
    cpList: (id, data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let val = ''
                if (data == 'Unlist') {
                    val = 'List';
                } else {
                    val = 'Unlist';
                }
                await db.get().collection('coopen').updateOne({ _id: objectid(id) }, {
                    $set: {
                        cpList: val
                    }
                })
                let res = await db.get().collection('coopen').findOne({ _id: objectid(id) })
                resolve(res.cpList)
            } catch (e) {
                reject(e)
            }
        })
    },
    userOrderHistory: () => {
        return new Promise(async (resolve, reject) => {
            try {
                let users = await db.get().collection(collectionname.USER_COLLECTION).find().toArray()
                resolve(users)
            } catch (e) {
                reject(e)
            }
        })
    },
    cancelOrder: (userid, orderId, productId, currentStatus) => {
        console.log('juy',typeof(productId));
        
        return new Promise((resolve, reject) => {
            db.get().collection(collectionname.USER_COLLECTION).findOne({ _id: objectid(userid) }).then((data) => {
                
                for (let i = 0; i < data.orderhistory.length; i++) {
                    for (let j = 0; j < data.orderhistory[i].productDetails.length; j++) {
                        if (data.orderhistory[i].productDetails[j].proOrderId == orderId) {
                            proidss = { [data.orderhistory[i].productDetails[j].proOrderId]: parseInt(orderId) }
                            let ordrsts = data.orderhistory[i].productDetails[j].orderStatus
                            // wallet
                            if (data.orderhistory[i].payMethod != "cod" && ordrsts == 'Orderd'&&currentStatus!='Delivered') {
                                console.log(parseInt(data.wallet));
                                let walletAmount = 0
                                walletAmount += data.wallet + data.orderhistory[i].productDetails[j].proTotal
                                db.get().collection(collectionname.USER_COLLECTION).updateOne({ _id: objectid(userid) },
                                    { $set: { wallet: walletAmount } })
                                console.log(walletAmount);
                                db.get().collection(collectionname.USER_COLLECTION).updateOne({ _id: objectid(userid) }, {
                                    $push: {
                                        walletHistory: {
                                            Action: "Refund",
                                            amount: walletAmount,
                                            date: new Date(),
                                            proName: data.orderhistory[i].productDetails[j].productName,
                                            quantity: data.orderhistory[i].productDetails[j].count
                                        }
                                    }
                                })
                            }
                            // end wallet
                            db.get().collection(collectionname.USER_COLLECTION).updateOne(

                                {
                                    _id: objectid(userid), "orderhistory.productDetails._id": productId
                                },
                                {
                                    $set: { "orderhistory.$[].productDetails.$[elem].orderStatus":currentStatus }
                                },
                                {
                                    arrayFilters: [
                                        {
                                            "elem._id": productId,
                                            "elem.proOrderId": parseInt(orderId)
                                        }
                                    ]
                                }
                            ).then((resp) => {
                                resolve(resp)
                                console.log(resp);
                            }).catch((err) => {
                                
                                reject(err)
                            })
                        }
                    }
                }
            })
        })
    },
    monthlyRevanue: () => {
        return new Promise(async (resolve, reject) => {
            const allUsers = await db.get().collection(collectionname.USER_COLLECTION).find().toArray();
            // console.log(product);
            const orders = allUsers.flatMap(user => user.orderhistory);
            let revanue = []
            for (let i = 0; i < 12; i++) {
                // Filter orders for the desired month
                const filterMonth = i; // replace with the desired month (0-based)
                const filteredOrders = orders.filter((order) => {
                    // if (order.productDetails[i].orderStatus == 'Delivered') {
                    const orderDate = new Date(order.OrderDate);

                    return orderDate.getMonth() === filterMonth;
                    // }
                });
                console.log(filteredOrders);
                // Calculate the total revenue for the month
                const totalRevenue = filteredOrders.reduce((total, order) => {
                    total = total + order.productDetails[0].proTotal * order.productDetails[0].count

                    return total
                }, 0);
                revanue.push(totalRevenue)
            }
            resolve(revanue);
        });
    },
    addOffer: (data) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collectionname.ADMIN_PRODUCTS_ADD).findOne({ _id: objectid(data.productId) }).then((responce) => {
                responce.oldRate = responce.productPrize
                responce.ofpesantage = data.ofpesantage
                responce.ofstartDateTime = data.ofstartDateTime
                responce.ofexpDate = data.ofexpDate
                responce.ofId = Date.now() + Math.floor(Math.random() * 1000)
                responce.productPrize = parseInt(responce.productPrize) - (parseInt(responce.productPrize) * parseInt(data.ofpesantage) / 100);
                db.get().collection(collectionname.ADMIN_PRODUCTS_ADD).updateOne({ _id: objectid(responce._id) }, { $set: { ...responce } }).then(() => {
                    resolve()
                }).catch((err) => {
                    reject(err)
                })
            }).catch((err) => {
                reject(err)
            })
        })
    },
    showOffers: () => {
        return new Promise(async (resolve, reject) => {
            try {
                let offers = await db.get().collection(collectionname.ADMIN_PRODUCTS_ADD).find({ ofId: { $exists: true } }).toArray()
                resolve(offers)
            }
            catch (err) {
                reject(err)
            }
        })
    },
    ofList: (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                db.get().collection(collectionname.ADMIN_PRODUCTS_ADD).findOne({ _id: objectid(data.id) }).then(async (responce) => {
                    console.log(responce);
                    let price = await responce.oldRate
                    responce.productPrize = await price
                    responce.ofId = ''
                    responce.oldRate = ''
                    responce.ofpesantage = ''
                    responce.ofstartDateTime = ''
                    responce.ofexpDate = ''
                    db.get().collection(collectionname.ADMIN_PRODUCTS_ADD).updateOne({ _id: objectid(responce._id) }, { $set: { ...responce } }).then(() => {
                        db.get().collection(collectionname.ADMIN_PRODUCTS_ADD).updateOne({ _id: objectid(responce._id) }, { $unset: { ofId: '' } })
                        resolve()
                    }).catch((err) => {
                        reject(err)
                    })
                }).catch((err) => {
                    reject(err)
                })
            } catch (e) {
                reject(e)
            }
        })
    },
    totalSales: () => {
        return new Promise(async (resolve, reject) => {
            try {
                let allusers = await db.get().collection(collectionname.USER_COLLECTION).find().toArray()
                resolve(allusers)
            } catch (e) {
                reject(e)
            }
        })
    },
    totalProducts: () => {
        return new Promise(async (resolve, reject) => {
            try {
                let totalpro = await db.get().collection(collectionname.ADMIN_PRODUCTS_ADD).find().toArray()
                let count = 0
                for (let i = 0; i < totalpro.length; i++) {
                    count++
                }
                resolve(count)
            } catch (e) {
                reject(e)
            }
        })
    },
    salesReport: (date) => {
        console.log(date);
        let date1 = new Date().toISOString().slice(0, 10);
        let date2 = new Date().toISOString().slice(0, 10);

        if (date != undefined) {
            date1 = date.date1
            date2 = date.date2
            console.log('given', date1);
        }
        console.log(date1);
        return new Promise(async (resolve, reject) => {
            try {
                let allUsers = await db.get().collection(collectionname.USER_COLLECTION).find({ "orderhistory.OrderDate": { $gte: date1, $lt: date2 } }).toArray()
                console.log(allUsers);
                resolve(allUsers)
            } catch (e) {
                reject(e)
            }
        })
    },
    proImageDelete: (data) => {
        let way = data.path
        return new Promise((resolve, reject) => {
            console.log(data.path);
            db.get().collection(collectionname.ADMIN_PRODUCTS_ADD).updateOne({ _id: objectid(data.proId) }, {
                $unset: { [`image2.${way}`]: 1 }
            }).then((b) => {
                resolve()
                console.log(b);
            }).catch((err) => reject(err))
        })
    },
    productImageAdd: (data, image) => {
        return new Promise((resolve, reject) => {
            console.log(image.image2[0]);
            let way = data.arrpos
            db.get().collection(collectionname.ADMIN_PRODUCTS_ADD).updateOne({ _id: objectid(data.proId) }, {
                $set: { [`image2.${way}`]: image.image2[0] }
            }).then((b) => {
                console.log(b);
                resolve()
            }).catch((err) => reject(err))
        })
    }
} 
