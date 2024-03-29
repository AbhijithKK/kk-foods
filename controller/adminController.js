let db = require('../model/adminConfig')

let catogarydetails = null;

let admincontrol = {
    loginCheck: (req, res, next) => {
        if (req.session.adminLogin != undefined) {
            next()
        } else {
            res.redirect('/admin/')
        }
    },
    adminlogin: function (req, res, next) {
        try {
            if (req.session.adminLogin == undefined) {
                res.render('admin/adminLogin')
            } else {
                res.redirect('/admin/Home')
            }
        } catch (e) {
            res.redirect('/404')
        }
    },
    adminHome: (req, res) => {
        try {
            db.totalSales().then((allusers) => {
                let orederCount = 0;
                let totalOrder = 0
                for (i = 0; i < allusers.length; i++) {
                    for (let j = 0; j < allusers[i].orderhistory.length; j++) {
                        for (let k = 0; k < allusers[i].orderhistory[j].productDetails.length; k++) {
                            //total orderd
                            if (allusers[i].orderhistory[j].productDetails[k].orderStatus == "Delivered") {

                                totalOrder = totalOrder + (allusers[i].orderhistory[j].productDetails[k].proTotal * allusers[i].orderhistory[j].productDetails[k].count)
                            }
                            if (allusers[i].orderhistory[j].productDetails[k].orderStatus) {
                                orederCount++;
                            }
                        }
                    }
                }
                req.session.salesRedirect = 0
                db.totalProducts().then((totalpro) => {
                    res.render('admin/adminHome', {
                        css: ["/stylesheets/logintemp/css/font-awesome.min.css",
                            "/stylesheets/logintemp/css/style.css",], totalOrder, orederCount, totalpro
                    })
                })
            })
        } catch (e) {
            res.redirect('/404')
        }
    },
    productDetails: (req, res) => {
        try {
            db.showProducts().then((product) => {
                res.render('admin/productDetails', {
                    product, css: ["/stylesheets/logintemp/css/font-awesome.min.css",
                        "https://cdn.datatables.net/1.13.3/css/jquery.dataTables.css",]
                })
            }).catch((err) => {
                res.redirect('/admin/')
            })
        } catch (e) {
            res.redirect('/404')
        }
    },
    orderdetails: (req, res) => {
        try {
            db.userOrderHistory().then((order) => {
                let orders = [];
                for (let i = 0; i < order.length; i++) {
                    for (j = 0; j < order[i].orderhistory.length; j++) {
                        for (k = 0; k < order[i].orderhistory[j].productDetails.length; k++) {
                            orders.push({
                                OrderDate:new Date(order[i].orderhistory[j].OrderDate).toLocaleDateString(),
                                userName: order[i].name1,
                                address: order[i].orderhistory[j].address,
                                image: order[i].orderhistory[j].productDetails[k].image1[0].filename,
                                proName: order[i].orderhistory[j].productDetails[k].productName,
                                quantity: order[i].orderhistory[j].productDetails[k].count,
                                productPrize: order[i].orderhistory[j].productDetails[k].productPrize,
                                paymethod: order[i].orderhistory[j].payMethod,
                                coupenSts: order[i].orderhistory[j].coopenstatus,
                                orderStatus: order[i].orderhistory[j].productDetails[k].orderStatus,
                                orderid: order[i].orderhistory[j].orderid,
                                userId: order[i]._id,
                                proId: order[i].orderhistory[j].productDetails[k]._id,
                                proOrderId: order[i].orderhistory[j].productDetails[k].proOrderId
                            })
                        }
                    }
                }
                //  orders.reverse()
                res.render('admin/orderDetails', {
                    orders, css: ["/stylesheets/logintemp/css/font-awesome.min.css", "https://cdn.datatables.net/1.13.3/css/jquery.dataTables.css"
                    ]
                })
            })
        } catch (e) {
            res.redirect('/404')
        }
    },
    userDetails: (req, res) => {
        try {
            db.userData().then((result) => {
                res.render('admin/userDetails', {
                    result, css: ["/stylesheets/logintemp/css/font-awesome.min.css", "https://cdn.datatables.net/1.13.3/css/jquery.dataTables.css"
                    ]
                })
            }).catch((err) => {
                res.redirect('/admin/')
            })
        } catch (e) {
            res.redirect('/404')
        }
    }, addproducts: (req, res) => {
        try {
            db.showCatogary().then((cat) => {
                let data = [];
                for (let i = 0; i < cat.length; i++) {
                    if (cat[i].block == 'unBlock') {
                        data.push(cat[i])
                    }
                }
                res.render('admin/addProduct', {
                    data, css: ["/stylesheets/logintemp/css/font-awesome.min.css",
                        "/stylesheets/logintemp/css/responsive.css", "/stylesheets/logintemp/css/style.css",]
                })
            }).catch((err) => {
                res.redirect('/admin/')
            })
        } catch (e) {
            res.redirect('/404')
        }
    },
    editProduct: (req, res) => {
        try {
            db.editProduct(req.params.id).then((data) => {
                db.showCatogary().then((cat) => {
                    let datas = [];
                    for (let i = 0; i < cat.length; i++) {
                        if (cat[i].block == 'unBlock') {
                            datas.push(cat[i])
                        }
                    }
                    res.render('admin/editProduct', {
                        data, datas, css: ["/stylesheets/logintemp/css/font-awesome.min.css",
                            "/stylesheets/logintemp/css/responsive.css", "/stylesheets/logintemp/css/style.css",]
                    })
                }).catch((err) => {
                    res.redirect('/admin/')
                })
            })
        } catch (e) {
            res.redirect('/404')
        }
    },
    blockuser: (req, res) => {
        try {
            db.blockUser(req.params.id).then((block) => {
                res.json('success')
            }).catch((err) => {
                res.redirect('/admin/')
            })
        } catch (e) {
            res.redirect('/404')
        }
    },
    unblockUsers: (req, res) => {
        try {
            db.unblockUser(req.params.id).then((unblock) => {
                res.json('success')
            }).catch((err) => {
                res.redirect('/admin/')
            })
        } catch (e) {
            res.redirect('/404')
        }
    },
    postAdminhome: (req, res) => {
        try {
            db.adminLogin(req.body).then((result) => {
                if (result != true) {
                    res.redirect('/admin/')
                } else {
                    req.session.adminLogin = req.body.name
                    res.redirect('/admin/Home')
                }
            }).catch((err) => {
                res.redirect('/admin/Home')
            })
        } catch (e) {
            res.redirect('/404')
        }
    },
    postAdminAddproduct: (req, res) => {
        try {
            db.addProduct(req.body, req.files).then((id) => {

                res.redirect('/admin/addProduct')
            }).catch((err) => {
                res.redirect('/admin/')
            })
        } catch (e) {
            res.redirect('/404')
        }
    },
    postAdminEditproduct: (req, res) => {
        try {
            db.updateProduct(req.params.id, req.body, req.files).then((resp) => {

                res.redirect('/admin/productDetails')
            }).catch((err) => {
                res.redirect('/admin/')
            })
        } catch (e) {
            res.redirect('/404')
        }
    },
    postAdminDeleteProduct: (req, res) => {
        try {
            // let flaged = 
            let flg=req.query.delet;
            // if (flaged == "unflage" || flaged == '') {
            //     flg = "flage";
            // } else {
            //     flg = "unflage";
            // }
            db.deleteProduct(req.query.id, flg).then((resp) => {

                res.json(resp)
            }).catch((err) => {
                res.redirect('/404')
            })
        } catch (e) {
            res.redirect('/404')
        }
    },
    postCatogaryAdd: (req, res) => {
        try {
            db.catogatyAdd(req.body.catogaryAdd).then((resp) => {
                res.json(resp)
            }).catch((err) => {
                res.redirect('/404')
            })
        } catch (e) {
            res.redirect('/404')
        }
    },
    catogaryManage: (req, res) => {
        try {
            db.showCatogary().then((catogary) => {
                let data;
                if (catogarydetails == null) {
                    data = null
                } else {
                    data = catogarydetails
                }
                res.render('admin/catogaryManage', {
                    catogary, data, css: ["/stylesheets/logintemp/css/font-awesome.min.css",
                        "https://cdn.datatables.net/1.13.3/css/jquery.dataTables.css"]
                })
                catogarydetails = null;
            }).catch((err) => {
                res.redirect('/404')
            })
        } catch (e) {
            res.redirect('/404')
        }
    },
    editCatogary: (req, res) => {
        try {
            db.findCatogary(req.body.id).then((data) => {
                catogarydetails = data
                res.json(data)
            }).catch((err) => {
                res.redirect('/404')
            })

        } catch (e) {
            res.redirect('/404')
        }
    },
    postUpdatecatogary: (req, res) => {
        try {
            db.updateCatogary(req.body.id, req.body.catogaryAdd).then((resp) => {
                res.json(resp)
            }).catch((err) => {
                res.redirect('/404')
            })
        } catch (e) {
            res.redirect('/404')
        }
    },
    catogaryBlock: (req, res) => {
        try {
            let val = "unBlock";
            if (req.query.delet == "unBlock") {
                val = "block"
            }
            db.blockCatogary(req.query.id, val).then((ress) => {
                res.redirect("/admin/catogaryManage")
            }).catch((err) => {
                res.redirect('/404')
            })

        } catch (e) {
            res.redirect('/404')
        }
    },
    catogaryDelete: (req, res) => {
        try {
            db.deleteCatogary(req.query.id).then(() => {
                res.redirect("/admin/catogaryManage")
            }).catch((err) => {
                res.redirect('/404')
            })

        } catch (e) {
            res.redirect('/404')
        }
    },
    addcoopens: (req, res) => {
        try {
            db.coopenAdd(req.body).then((data) => {
                res.json(data)
            }).catch((e) => {
                res.redirect('/404')
            })
        } catch (e) {
            res.redirect('/404')
        }
    },
    coopenlist: (req, res) => {
        try {
            if (req.session.adminLogin != undefined) {
                db.cpList(req.body.id, req.body.data).then((data) => {
                    res.json(data)
                }).catch((e) => {
                    res.redirect('/admin/')
                })
            } else {
                res.redirect('/404')
            }
        } catch (e) {
            res.redirect('/404')
        }
    },
    coupenPage: (req, res) => {
        try {
            db.coopenFind().then((result) => {
               
                for (const i of result) {
                    i.cpstartDateTime = new Date(i.cpstartDateTime).toLocaleDateString()
                    i.cpEndDataTime = new Date(i.cpEndDataTime).toLocaleDateString()
                }
                res.render('admin/coupenManagement', {
                    css: ["/stylesheets/logintemp/css/font-awesome.min.css",
                        "https://cdn.datatables.net/1.13.3/css/jquery.dataTables.css"], result
                })
            }).catch((e) => {
                res.redirect('/404')
            })

        } catch (e) {
            res.redirect('/404')
        }
    },
    logout: (req, res) => {
        try {
            req.session.adminLogin = undefined
            res.redirect("/admin/")
        } catch (e) {
            res.redirect('/404')
        }
    },
    orederCancel: (req, res) => {
        try {
            db.cancelOrder(req.body.userid, req.body.orderId, req.body.productName, req.body.currentStatus).then((data) => {
                res.json(data)
            }).catch((e) => {
                res.redirect('/404')
            })
        } catch (e) {
            res.redirect('/404')
        }
    },
    offerlistAndunlist: (req, res) => {
        try {
            db.ofList(req.body).then(() => {
                res.json('success')
            })
        } catch (e) {
            res.redirect('/404')
        }
    }, addeOffers: (req, res) => {
        db.addOffer(req.body).then((data) => {
            res.json(data)
        })
    },
    offergetpage: (req, res) => {
        try {
            db.showProducts().then((product) => {
                db.showOffers().then((offersPro) => {
                    console.log(offersPro);
                    for (const i of offersPro) {
                        i.ofexpDate = new Date(i.ofexpDate).toLocaleDateString()
                        i.ofstartDateTime = new Date(i.ofstartDateTime).toLocaleDateString()
                    }
                    res.render('admin/offer', {
                        css: ["/stylesheets/logintemp/css/font-awesome.min.css",
                            "https://cdn.datatables.net/1.13.3/css/jquery.dataTables.css"], product, offersPro
                    })
                }).catch((err) => {
                    res.redirect('/404')
                })
            }).catch((err) => {
                res.redirect('/404')
            })
        } catch (e) {
            res.redirect('/404')
        }
    },
    monthlyRevannue: (req, res) => {
        try {
            db.monthlyRevanue().then((data) => {
                res.json(data)
            }).catch((err) => {
                res.redirect('/404')
            })
        } catch (e) {
            res.redirect('/404')
        }
    },
    updateCatogariess: (req, res) => {
        try {
            db.updateCatogary(req.body.id, req.body.catogaryAdd).then((resp) => {
                res.json(resp)
            }).catch((err) => {
                res.redirect('/404')
            })
        } catch (e) {
            res.redirect('/404')
        }
    },
    postSalesReport: (req, res) => {
        try {
            req.session.fromDate=req.body.date1;
            req.session.toDate=req.body.date2;
            
            db.salesReport(req.body).then((allUsers) => {
                let product = []
                for (let i = 0; i < allUsers.length; i++) {
                    for (let j = 0; j < allUsers[i].orderhistory.length; j++) {
                        for (let k = 0; k < allUsers[i].orderhistory[j].productDetails.length; k++) {
                            if (allUsers[i].orderhistory[j].productDetails[k].orderStatus == "Delivered") {
                                product.push({
                                    orderid: allUsers[i].orderhistory[j].orderid,
                                    name: allUsers[i].name1,
                                    productName: allUsers[i].orderhistory[j].productDetails[k].productName,
                                    productPrice: allUsers[i].orderhistory[j].productDetails[k].productPrize,
                                    productQuantity: allUsers[i].orderhistory[j].productDetails[k].count,
                                    subTotal: allUsers[i].orderhistory[j].productDetails[k].productPrize * allUsers[i].orderhistory[j].productDetails[k].count,

                                })
                            }
                        }
                    }
                }
                req.session.salesTotal = 0
                for (let i = 0; i < product.length; i++) {
                    req.session.salesTotal = req.session.salesTotal + product[i].subTotal
                }
                req.session.salesData = product
                req.session.salesRedirect = 1
                res.json({product,fromDate:req.session.fromDate, toDate:req.session.toDate ,total:req.session.salesTotal})
            })
        } catch (e) {
            res.redirect('/404')
        }
    },
    getSalesReport: (req, res) => {
        try {
            let product = []
            db.salesReport().then((allUsers) => {
                for (let i = 0; i < allUsers.length; i++) {
                    for (let j = 0; j < allUsers[i].orderhistory.length; j++) {
                        for (let k = 0; k < allUsers[i].orderhistory[j].productDetails.length; k++) {
                            if (allUsers[i].orderhistory[j].productDetails[k].orderStatus == "Delivered") {
                                product.push({
                                    orderid: allUsers[i].orderhistory[j].orderid,
                                    name: allUsers[i].name1,
                                    productName: allUsers[i].orderhistory[j].productDetails[k].productName,
                                    productPrice: allUsers[i].orderhistory[j].productDetails[k].productPrize,
                                    productQuantity: allUsers[i].orderhistory[j].productDetails[k].count,
                                    subTotal: allUsers[i].orderhistory[j].productDetails[k].productPrize * allUsers[i].orderhistory[j].productDetails[k].count,

                                })
                            }
                        }
                    }
                }
                req.session.salesDatahome = product
                req.session.salesTotalhome = 0
                for (let i = 0; i < product.length; i++) {
                    req.session.salesTotalhome = req.session.salesTotalhome + product[i].subTotal
                }
                let users
                let total
                if (req.session.salesRedirect == 0) {
                    users = req.session.salesDatahome
                    total = req.session.salesTotalhome
                } else {
                    users = req.session.salesData
                    total = req.session.salesTotal
                }
                res.render('admin/salesReport', {
                    users, total, css: ["/stylesheets/logintemp/css/font-awesome.min.css",
                        "/stylesheets/logintemp/css/responsive.css", "/stylesheets/logintemp/css/style.css"]
                       ,fromDate:req.session.fromDate,
                        toDate:req.session.toDate })
                req.session.salesRedirect = 0
            })
        } catch (e) {
            res.redirect('/404')
        }
    },
    singleImageDelete: (req, res) => {
        try{
        db.proImageDelete(req.body).then(() => {
            res.json('success')
        })
    }catch(e){
        res.redirect('/404')
    }
    },
    postSingleImageAdd: (req, res) => {
        try {
            db.productImageAdd(req.body, req.files).then(() => {
                res.json('success')
            })

        } catch (err) {
            res.redirect('/404')
        }
    }
}

module.exports = admincontrol;