const db = require('./connection')
const collectionname = require('./collectionName')
const bcript = require('bcrypt')
const objectid = require('mongodb').ObjectId
const Razorpay = require('razorpay');
const { resolve } = require('path');
require('dotenv')
const instance = new Razorpay({
    key_id: 'rzp_test_tkUZeWI1OfAb4R',
    key_secret: 'Dr92MosMlHUqZMP1kfmRlbze',
});
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
            db.get().collection(collectionname.USER_COLLECTION).insertOne({ ...data, block: "unBlock", cart: [], orderhistory: [],wallet:0 }).then((result) => {
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
                                res.true = result

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


        return new Promise(async (resolve, reject) => {
            try {
                let data = await db.get().collection(collectionname.ADMIN_PRODUCTS_ADD).find().toArray()
                let val = []
                for (i = 0; i < data.length; i++) {
                    if (data[i].productCatogary == catogary) {
                        val.push(data[i])
                    }
                }
                console.log(val);
                resolve(val)
            } catch (e) {
                reject(e)
            }
        })

    },
    cartProductAdd: (productId, userId) => {

        try {
            return new Promise(async (resolve, reject) => {
                if (productId != undefined && userId != undefined) {

                    let finduser = await db.get().collection(collectionname.USER_COLLECTION).findOne({ _id: objectid(userId) })

                    let quantity = 1;
                    if (finduser.cart.length < 0 || finduser.cart != '') {

                        for (let i = 0; i < finduser.cart.length; i++) {
                            if (finduser.cart[i].productId == productId) {

                                quantity = finduser.cart[i].quantity + 1;
                                await db.get().collection(collectionname.USER_COLLECTION).updateOne({ _id: objectid(userId) }, { $pull: { cart: { productId: productId } } })
                                await db.get().collection(collectionname.USER_COLLECTION).updateOne({ _id: objectid(userId) }, { $addToSet: { cart: { productId, quantity: quantity } } })
                            } else {
                                await db.get().collection(collectionname.USER_COLLECTION).updateOne({ _id: objectid(userId) }, { $addToSet: { cart: { productId, quantity: quantity } } })
                            }
                        }
                    } else {

                        await db.get().collection(collectionname.USER_COLLECTION).updateOne({ _id: objectid(userId) }, { $addToSet: { cart: { productId, quantity: quantity } } })
                    }
                } else {

                    let data = await db.get().collection(collectionname.USER_COLLECTION).findOne({ _id: objectid(userId) })
                    console.log(data.cart);
                    if (data.cart != undefined || data.cart != null) {
                        let arr = [];

                        for (let i = 0; i < data.cart.length; i++) {
                            arr.push(await db.get().collection(collectionname.ADMIN_PRODUCTS_ADD).findOne({ _id: objectid(data.cart[i].productId) }))
                        }
                        console.log('new', arr);
                        resolve(arr)
                    } else {

                        resolve()

                    }
                }

                resolve()
            })
        } catch (e) {

        }

    },
    delCartitem: async (id, cartid, ofId) => {
        try {
            return await new Promise((resolve, reject) => {

                db.get().collection(collectionname.USER_COLLECTION).updateOne({ _id: objectid(id) }, { $pull: { cart: { productId: cartid } } }).then((ree) => {
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
                if (id != null && id != undefined) {
                    let res = await db.get().collection(collectionname.USER_COLLECTION).findOne({ _id: objectid(id) })
                    resolve(res)
                }

            })
        } catch (e) {
            reject(e)
        }
    },
    profileUpdate: (id, data, image) => {
        try {

            return new Promise(async (resolve, reject) => {
                let mailcheck = await db.get().collection(collectionname.USER_COLLECTION).findOne({ _id: objectid(id) })
                console.log(mailcheck);
                if (data.proEmail == null || data.proEmail == '') {
                    data.proEmail = mailcheck.email;
                }
                if (data.proPassword == null || data.proPassword == "" || data.proPassword.value < 5) {
                    data.proPassword = mailcheck.password;
                } else {
                    data.proPassword = await bcript.hash(data.proPassword, 10)
                }
                if (image.proImage == null || image.proImage == '') {
                    if (mailcheck.image != null) {
                        image.proImage = mailcheck.image.proImage;
                    } else {
                        image.proImage = null
                    }
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
                db.get().collection(collectionname.ADMIN_PRODUCTS_ADD).find({
                    $or: [{ productName: new RegExp(data, 'i') },
                    { productCatogary: new RegExp(data) }]
                })
                    .toArray().then((data) => {
                        resolve(data)


                    })
            } catch (e) {
                reject(e)
            }
        })

    },
    cartCount: (id, count, proId, ofid) => {

        return new Promise(async (resolve, reject) => {

            try {
                let result = await db.get().collection(collectionname.USER_COLLECTION).findOne({ _id: objectid(id) })


                for (let i = 0; i < result.cart.length; i++) {
                    let c;

                    if (result.cart[i].productId == proId || result.cart[i].ofId == ofid) {

                        if (count != '-1') {

                            c = parseInt(result.cart[i].quantity) + parseInt(count)
                            console.log(typeof (c) + c);
                        } else {
                            if (result.cart[i].quantity == 1) {
                                c = parseInt(result.cart[i].quantity)
                            } else {
                                c = parseInt(result.cart[i].quantity) + parseInt(count)
                            }
                        }

                        db.get().collection(collectionname.USER_COLLECTION).updateOne({ _id: objectid(id), "cart.productId": proId }, { $set: { "cart.$.quantity": c } }).then((result) => {
                            db.get().collection(collectionname.USER_COLLECTION).findOne({ _id: objectid(id) }).then((data) => {

                                for (let i = 0; i < data.cart.length; i++) {


                                    if (data.cart[i].productId == proId) {


                                        db.get().collection(collectionname.ADMIN_PRODUCTS_ADD).findOne({ _id: objectid(data.cart[i].productId) }).then((datas) => {
                                            let result = parseInt(data.cart[i].quantity) * parseInt(datas.productPrize)

                                            let values = { quantity: data.cart[i].quantity, prototal: result }
                                            resolve(values)
                                        })

                                    }
                                }


                            })

                        })


                    }

                }

            } catch (e) {

            }
        })
    },
    adddelete: (id, data) => {

        return new Promise((resolve, reject) => {
            try {
                db.get().collection(collectionname.USER_COLLECTION).updateOne({ _id: objectid(id) }, {
                    $pull: {
                        address: {
                            addName: data.name,
                            addAddress: data.addr,
                            addPin: data.pin,
                            addMob: data.mob,
                            addPlace: data.place,
                        }
                    }
                }).then((del) => {
                    resolve(del)
                })
            }
            catch (e) {
                reject(e)
            }
        })

    },
    updateaddress: (id, data) => {
        console.log(data.uname);
        return new Promise(async (resolve, reject) => {

            await db.get().collection(collectionname.USER_COLLECTION).updateOne(
                {
                    _id: objectid(id),
                    "address.addName": data.fname,
                    "address.addAddress": data.faddr,
                    "address.addPin": data.fpin,
                    "address.addMob": data.fmob,
                    "address.addPlace": data.fplace
                },
                {
                    $set: {
                        "address.$.addName": data.uname,
                        "address.$.addAddress": data.uaddr,
                        "address.$.addPin": data.upin,
                        "address.$.addMob": data.umob,
                        "address.$.addPlace": data.uplace
                    }
                }
            )
                .then((result) => {

                    resolve(result)
                }).catch((e) => {
                    reject()
                })
        })
    },
    getAddress: (id) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collectionname.USER_COLLECTION).findOne({ _id: objectid(id) }).then((result) => {
                if (result != null) {
                    resolve(result.address)
                }
            }).catch((e) => {
                reject(e)
            })
        })
    },
    coopenFind: (code) => {

        return new Promise(async (resolve, reject) => {
            try {
                let res = await db.get().collection('coopen').findOne({ cpCode: code })

                resolve(res)
            } catch (e) {
                reject(e)
            }
        })
    },
    orderHistoryAdd: (id, cartProducts, address, coopenStatus, tatalAmt, date, method,wallet) => {

        return new Promise((resolve, reject) => {
            try {
                let orderid = Date.now()
                db.get().collection(collectionname.USER_COLLECTION).updateOne({ _id: objectid(id) }, {
                    $push: {
                        orderhistory: {
                            orderid: orderid,
                            totalAmt: tatalAmt,
                            address: address,
                            coopenstatus: coopenStatus,
                            walletAmt:wallet,
                            OrderDate: date,
                            payMethod: method,
                            productDetails: cartProducts,
                        }
                    }
                }).then(() => {
                    db.get().collection(collectionname.USER_COLLECTION).findOne({ _id: objectid(id) }).then((result) => {


                        resolve(result.orderhistory.slice(-1))
                    })


                })
            } catch (e) {
                reject(e)
            }
        })
    },
    OnlineorderHistoryAdd: (id, cartProducts, address, coopenStatus, tatalAmt, date, method,wallet) => {

        return new Promise((resolve, reject) => {
            try {
                let orderid = Date.now()
                db.get().collection(collectionname.ONLINE_HISTORY).insertOne({

                    userid: id,
                    orderid: orderid,
                    totalAmt: tatalAmt,
                    address: address,
                    coopenstatus: coopenStatus,
                    walletAmt:wallet,
                    OrderDate: date,
                    payMethod: method,
                    productDetails: cartProducts,
                    onlinePay: "processError",

                }).then(() => {
                    db.get().collection(collectionname.ONLINE_HISTORY).find().toArray().then((result) => {

                        console.log(result.slice(-1));
                        resolve(result.slice(-1))
                    })


                })
            } catch (e) {
                reject(e)
            }
        })
    },
    ordercancel: (id, datas) => {

        return new Promise((resolve, reject) => {

            db.get().collection(collectionname.USER_COLLECTION).findOne({ _id: objectid(id) }).then((data) => {
                
                let newsts;
                for (let i = 0; i < data.orderhistory.length; i++) {
                    for (let j = 0; j < data.orderhistory[i].productDetails.length; j++) {
                        if (data.orderhistory[i].productDetails[j].proOrderId == datas.orderId) {
                            proidss = { [data.orderhistory[i].productDetails[j].proOrderId]: parseInt(datas.orderId) }
                            let ordrsts = data.orderhistory[i].productDetails[j].orderStatus
                           
                            // wallet
                            if(data.orderhistory[i].payMethod!="cod" && ordrsts == 'Orderd'){
                                console.log(parseInt(data.wallet));
                                let walletAmount=0
                                walletAmount +=data.wallet+data.orderhistory[i].productDetails[j].proTotal
                                db.get().collection(collectionname.USER_COLLECTION).updateOne({ _id: objectid(id) },
                                {$set:{wallet:walletAmount}})
                                console.log(walletAmount);
                            }
                            // end wallet

                            if (ordrsts == 'Orderd') {
                                newsts = 'Cancel'
                            } else {
                                newsts = 'Cancel'
                            }
                            db.get().collection(collectionname.USER_COLLECTION).updateOne(

                                {
                                    _id: objectid(id), "orderhistory.productDetails._id": objectid(datas.userid)
                                },
                                {
                                    $set: { "orderhistory.$[].productDetails.$[elem].orderStatus": newsts }
                                },
                                {
                                    arrayFilters: [
                                        {
                                            "elem._id": objectid(datas.userid),
                                            "elem.proOrderId": parseInt(datas.orderId)
                                        }
                                    ]
                                }


                            ).then((resp) => {
                                resolve(resp)

                            })
                            // console.log('gggggg',data.orderhistory[i].productDetails[j].proOrderId);

                        }
                    }
                }
            })
        })

    },
    razorpay: (orderId, total) => {
        return new Promise((resolve, reject) => {


            let options = {
                amount: parseInt(total * 100),
                currency: "INR",
                receipt: orderId,

            }
            instance.orders.create(options, function (err, ordder) {

                resolve(ordder)
            })


        })

    },
    verifyPayment: (data) => {
        console.log(data);
        return new Promise(async (resolve, reject) => {
            const crypto = require('crypto')
            let hmac = crypto.createHmac('sha256', 'Dr92MosMlHUqZMP1kfmRlbze')
            hmac.update(data.responce.razorpay_order_id + '|' + data.responce.razorpay_payment_id)
            hmac = hmac.digest('hex')
            if (hmac == data.responce.razorpay_signature) {
                let useridd
                await db.get().collection(collectionname.ONLINE_HISTORY).findOne({ orderid: parseInt(data.orderDetails.receipt) }).then(async (result) => {
                    console.log('result', result);
                    useridd = result.userid
                    await db.get().collection(collectionname.USER_COLLECTION).updateOne({ _id: objectid(result.userid) }, {
                        $push: {
                            orderhistory: {
                                orderid: result.orderid,
                                totalAmt: result.totalAmt,
                                address: result.address,
                                coopenstatus: result.coopenStatus,
                                walletAmt:result.walletAmt,
                                OrderDate: result.OrderDate,
                                payMethod: result.payMethod,
                                productDetails: result.productDetails,
                                onlinePay: "success",
                            }
                        }
                    })

                })
                resolve()
                await db.get().collection(collectionname.ONLINE_HISTORY).deleteMany({ userid: objectid(useridd) }).then((a) => {
                    console.log(a);
                })
                console.log('success pay');
            } else {
                console.log('faild pay');
                reject()
            }
        })
    },
    showOffers: (catogary) => {

        return new Promise(async (resolve, reject) => {
            try {
                let data = await db.get().collection(collectionname.OFFER_ADD).find().toArray()
                let product = []
                data.forEach(val => {
                    if (val.productCatogary == catogary) {
                        product.push(val)
                    }
                });

                resolve(product)
            } catch (err) {
                reject(err)
            }
        })
    },
    forgotPassMailCheck: (mail) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collectionname.USER_COLLECTION).findOne({ email: mail }).then((data) => {
                resolve(data)
            }).catch((err) => {
                reject(err)
            })
        })
    },
    resetpass: (email, newpass) => {
        return new Promise(async (resolve, reject) => {
            let data = await db.get().collection(collectionname.USER_COLLECTION).findOne({ email: email })
            console.log(data.password + newpass);
            data.password = await bcript.hash(newpass, 10)
            await db.get().collection(collectionname.USER_COLLECTION).updateOne({ email: email }, { $set: { ...data } })
            resolve()

        })
    },
    getWalletamt:(id,walletAmount)=>{

        console.log('wallet Amount',walletAmount);
        return new Promise(async(resolve,reject)=>{
        let user=await db.get().collection(collectionname.USER_COLLECTION).findOne({_id:objectid(id)})
        if(walletAmount==1 || walletAmount==undefined||walletAmount==null){
          walletAmount=user.wallet
        }
        console.log('amt',walletAmount);
       await db.get().collection(collectionname.USER_COLLECTION).updateOne({_id:objectid(id)},{
            $set:{wallet:walletAmount}
        }).then((a)=>{
            console.log(a);
            resolve()
        })
        })
    }
    
}             