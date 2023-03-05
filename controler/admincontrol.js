let db = require('./databaseConfig/admin')

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
            res.redirect('/admin/', {
                css: ["/stylesheets/logintemp/css/font-awesome.min.css",
                    "/stylesheets/logintemp/css/responsive.css", "/stylesheets/logintemp/css/style.css",]
            })
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
                db.totalProducts().then((totalpro) => {
                    res.render('admin/adminHome', {
                        css: ["/stylesheets/logintemp/css/font-awesome.min.css",
                            "/stylesheets/logintemp/css/responsive.css", "/stylesheets/logintemp/css/style.css",], totalOrder, orederCount, totalpro
                    })
                })
            })
        } catch (e) {
            res.redirect('/admin/')
        }
    },
    productDetails: (req, res) => {
        try {
            db.showProducts().then((product) => {
                res.render('admin/productDetails', {
                    product, css: ["/stylesheets/logintemp/css/font-awesome.min.css",
                        "/stylesheets/logintemp/css/responsive.css", "/stylesheets/logintemp/css/style.css",]
                })
            }).catch((err) => {
                res.redirect('/admin/')
            })
        } catch (e) {
            res.redirect('/admin/')
        }
    },
    orderdetails: (req, res) => {
        try {
            db.userOrderHistory().then((order) => {
                function reverseArray(arr) {
                    arr.reverse();
                    for (let i = 0; i < arr.length; i++) {
                        if (Array.isArray(arr[i])) {
                            reverseArray(arr[i]);
                        }
                    }
                    return arr;
                }
                let orders = reverseArray(order);

                res.render('admin/orderDetails', {
                    orders, css: ["/stylesheets/logintemp/css/font-awesome.min.css",
                        "/stylesheets/logintemp/css/responsive.css", "/stylesheets/logintemp/css/style.css",]
                })
            })
        } catch (e) {
            res.redirect('/admin/')
        }
    },
    userDetails: (req, res) => {
        try {
            db.userData().then((result) => {

                res.render('admin/userDetails', {
                    result, css: ["/stylesheets/logintemp/css/font-awesome.min.css",
                        "/stylesheets/logintemp/css/responsive.css", "/stylesheets/logintemp/css/style.css",]
                })
            }).catch((err) => {
                res.redirect('/admin/')
            })
        } catch (e) {
            res.redirect('/admin/')
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
            res.redirect('/admin/')
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
            res.redirect('/admin/')
        }
    },
    blockuser: (req, res) => {
        try {
            db.blockUser(req.params.id).then((block) => {

                res.redirect('/admin/userDetails')
            }).catch((err) => {
                res.redirect('/admin/')
            })
        } catch (e) {
            res.redirect('/admin/')
        }
    },
    unblockUsers: (req, res) => {
        try {
            db.unblockUser(req.params.id).then((unblock) => {

                res.redirect('/admin/userDetails')
            }).catch((err) => {
                res.redirect('/admin/')
            })
        } catch (e) {
            res.redirect('/admin/')
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
            res.redirect('/admin/')
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
            res.redirect('/admin/')
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
            res.redirect('/admin/')
        }
    },
    postAdminDeleteProduct: (req, res) => {
        try {
            let flaged = req.query.delet;
            let flg;
            if (flaged == "unflage" || flaged == '') {
                flg = "flage";
            } else {
                flg = "unflage";
            }
            db.deleteProduct(req.query.id, flg).then((resp) => {

                res.redirect('/admin/productDetails')
            }).catch((err) => {
                res.redirect('/admin/')
            })
        } catch (e) {
            res.redirect('/admin/')
        }
    },
    postCatogaryAdd: (req, res) => {
        try {
            db.catogatyAdd(req.body.catogaryAdd).then((resp) => {
                res.json(resp)
            }).catch((err) => {
                res.redirect('/admin/')
            })
        } catch (e) {
            res.redirect('/admin/')
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
                        "/stylesheets/logintemp/css/responsive.css", "/stylesheets/logintemp/css/style.css",]
                })
                catogarydetails = null;
            }).catch((err) => {
                res.redirect('/admin/')
            })

        } catch (e) {
            res.redirect('/admin/')
        }
    },
    editCatogary: (req, res) => {
        try {
            db.findCatogary(req.body.id).then((data) => {

                catogarydetails = data
                res.json(data)
            }).catch((err) => {
                res.redirect('/admin/')
            })

        } catch (e) {
            res.redirect('/admin/')
        }
    },
    postUpdatecatogary: (req, res) => {

        try {

            db.updateCatogary(req.body.id, req.body.catogaryAdd).then((resp) => {
                res.json(resp)
            }).catch((err) => {
                res.redirect('/admin/')
            })
        } catch (e) {
            res.redirect('/admin/')
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
                res.redirect('/admin/')
            })

        } catch (e) {
            res.redirect('/admin/')
        }
    },
    catogaryDelete: (req, res) => {
        try {

            db.deleteCatogary(req.query.id).then(() => {
                res.redirect("/admin/catogaryManage")
            }).catch((err) => {
                res.redirect('/admin/')
            })

        } catch (e) {
            res.redirect('/admin/')
        }
    },
    addcoopens: (req, res) => {
        try {

            db.coopenAdd(req.body).then((data) => {
                res.json(data)
            }).catch((e) => {
                res.redirect('/admin/')
            })

        } catch (e) {
            res.redirect('/admin/')
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
                res.redirect('/admin/')
            }
        } catch (e) {
            res.redirect('/admin/')
        }
    },
    coopenPage: (req, res) => {
        try {

            db.coopenFind().then((result) => {

                res.render('admin/coopenManagement', {
                    css: ["/stylesheets/logintemp/css/font-awesome.min.css",
                        "/stylesheets/logintemp/css/responsive.css", "/stylesheets/logintemp/css/style.css"], result
                })
            }).catch((e) => {
                res.redirect('admin/')
            })

        } catch (e) {
            res.redirect('/admin/')
        }
    },
    logout: (req, res) => {
        try {
            req.session.adminLogin = undefined
            res.redirect("/admin/")
        } catch (e) {
            res.redirect('/admin/')
        }
    },
    orederCancel: (req, res) => {
        try {
            db.cancelOrder(req.body.userid, req.body.orderId, req.body.productName, req.body.currentStatus).then((data) => {
                res.json(data)
            }).catch((e) => {
                res.redirect('/admin/')
            })
        } catch (e) {
            res.redirect('/admin/')
        }
    },
    offerlistAndunlist: (req, res) => {
        try {
            db.ofList(req.body).then(() => {
                res.json('success')
            })
        } catch (e) {
            res.redirect('/admin/')
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
                    res.render('admin/offer', {
                        css: ["/stylesheets/logintemp/css/font-awesome.min.css",
                            "/stylesheets/logintemp/css/responsive.css", "/stylesheets/logintemp/css/style.css"], product, offersPro
                    })
                }).catch((err) => {
                    res.redirect('/admin/')
                })
            }).catch((err) => {
                res.redirect('/admin/')
            })
        } catch (e) {
            res.redirect('/admin/')
        }
    },
    monthlyRevannue: (req, res) => {
        try {
            db.monthlyRevanue().then((data) => {
                res.json(data)
            }).catch((err) => {
                res.redirect('/admin/')
            })
        } catch (e) {
            res.redirect('/admin/')
        }
    },
    updateCatogariess: (req, res) => {
        try {
            db.updateCatogary(req.body.id, req.body.catogaryAdd).then((resp) => {
                res.json(resp)
            }).catch((err) => {
                res.redirect('/admin/')
            })
        } catch (e) {
            res.redirect('/admin/')
        }
    },
    postSalesReport: (req, res) => {
        try {
            db.salesReport(req.body).then((allUsers) => {
                
                let product=[]
            for(let i=0;i<allUsers.length;i++){
                for(let j=0;j<allUsers[i].orderhistory.length;j++){
                    for(let k=0;k<allUsers[i].orderhistory[j].productDetails.length;k++){
                        if (allUsers[i].orderhistory[j].productDetails[k].orderStatus == "Delivered") {
                            product.push({
                                orderid:allUsers[i].orderhistory[j].orderid,
                                name:allUsers[i].name1,
                                productName:allUsers[i].orderhistory[j].productDetails[k].productName,
                                productPrice:allUsers[i].orderhistory[j].productDetails[k].productPrize,
                                productQuantity:allUsers[i].orderhistory[j].productDetails[k].count,
                                subTotal:allUsers[i].orderhistory[j].productDetails[k].productPrize*allUsers[i].orderhistory[j].productDetails[k].count,
                                
                            })
                           
                        }
                                
                    }
                }
            }
            req.session.salesTotal=0
            for(let i=0;i<product.length;i++){
                req.session.salesTotal=req.session.salesTotal+product[i].subTotal   
            }   
                req.session.salesData=product
                req.session.salesRedirect=1
                res.redirect('/admin/salesReport')
            })
        } catch (e) {
            res.redirect('/admin/')
        }
    },
    getSalesReport: (req, res) => {
        
        try {
            if(req.session.salesRedirect!=1){
            db.salesReport().then((allUsers) => {
                
                let product=[]
            for(let i=0;i<allUsers.length;i++){
                for(let j=0;j<allUsers[i].orderhistory.length;j++){
                    for(let k=0;k<allUsers[i].orderhistory[j].productDetails.length;k++){
                        if (allUsers[i].orderhistory[j].productDetails[k].orderStatus == "Delivered") {
                            product.push({
                                orderid:allUsers[i].orderhistory[j].orderid,
                                name:allUsers[i].name1,
                                productName:allUsers[i].orderhistory[j].productDetails[k].productName,
                                productPrice:allUsers[i].orderhistory[j].productDetails[k].productPrize,
                                productQuantity:allUsers[i].orderhistory[j].productDetails[k].count,
                                subTotal:allUsers[i].orderhistory[j].productDetails[k].productPrize*allUsers[i].orderhistory[j].productDetails[k].count,
                                
                            })
                           
                        }
                                
                    }
                }
            }
            req.session.salesTotal=0
            for(let i=0;i<product.length;i++){    
                req.session.salesTotal=req.session.salesTotal+product[i].subTotal  
            }
                req.session.salesData=product
            })
        }
            res.render('admin/salesReport',{users:req.session.salesData,total:req.session.salesTotal, css: ["/stylesheets/logintemp/css/font-awesome.min.css",
            "/stylesheets/logintemp/css/responsive.css", "/stylesheets/logintemp/css/style.css"]})
            req.session.salesRedirect=undefined;
        } catch (e) {
            res.redirect('/admin/')
        }
    },
    singleImageDelete:(req,res)=>{
        db.proImageDelete(req.body).then(()=>{
            res.json('success')
        })
    },
    postSingleImageAdd:(req,res)=>{
        try{
            
            db.productImageAdd(req.body,req.files).then(()=>{
                res.json('success')
            })
           
        }catch(err){

        }
    }
}

module.exports = admincontrol;