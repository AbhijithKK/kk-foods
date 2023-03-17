

const db = require('../model/userConfig')
const mailer = require('../helpers/nodeMailer');
const { json } = require('express');
require('dotenv')
const rasorpay = require('razorpay')
const otpGenerator = require('otp-generator')

let emailNotMarchc = null;
let mailCheck = null;
let emailNotMarch = null;
let otpMsg = null;
let countDownTime = 60000;
let generateOTP = () => {
    return otpGenerator.generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false
    });
};
let otp = generateOTP();
//######### user contol start##########
let usercotrol = {
    loginCheck: (req, res, next) => {
        if (req.session.loginId != undefined) {
            next()
        } else {
            res.redirect('/')
        }
    },
    guestUserHome: (req, res) => {
        try {
            if (req.session.loginId != undefined) {
                res.redirect('/home')
            } else {
                db.getProducts().then((products) => {
                    res.render('user/guestHome', {
                        css: ["/stylesheets/logintemp/css/bootstrap.css", "/stylesheets/logintemp/css/font-awesome.min.css",
                            "/stylesheets/logintemp/css/responsive.css", "/stylesheets/logintemp/css/style.css",
                            "https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css",
                            "https://cdnjs.cloudflare.com/ajax/libs/jquery-nice-select/1.1.0/css/nice-select.min.css"],
                        js: ['bootstrap.js', "custom.js", 'jquery-3.4.1.min.js'],
                        products
                    })

                }).catch((err) => {
                    res.redirect('/404')
                })
            }
        } catch (e) {
            res.redirect('/404')
        }
    },
    login: function (req, res, next) {
        try {
            if (req.session.loginId != undefined) {
                res.redirect('/home')
            } else {
                if (emailNotMarch == null) {
                    var msg = null;
                } else {
                    msg = emailNotMarch;
                }
                res.render('user/login', {
                    css: ['/stylesheets/login.css',
                        "/stylesheets/fonts/material-icon/css/material-design-iconic-font.min.css",
                        "/stylesheets/logintemp/css/style.css",], msg
                });
                emailNotMarch = null;
            }
        } catch (e) {
            res.redirect('/404')
        }
    },
    signup: (req, res) => {
        try {
            if (mailCheck == null) {
                var msg = null;
            } else {
                msg = mailCheck;
            }
            res.render('user/signup', {
                css: ['/stylesheets/login.css',
                    "/stylesheets/fonts/material-icon/css/material-design-iconic-font.min.css",
                    "/stylesheets/logintemp/css/style.css"], msg
            })
            mailCheck = null;
        } catch (e) {
            res.redirect('/404')
        }
    },
    mainHome: (req, res) => {
        try {
            let proImag;
            db.doblock(req.session.loginId).then((resp) => {
                if (resp != null) {
                    if (resp.block != 'unBlock' || !res.block) {
                        if (req.session.loginId == undefined) {
                            req.session.total = 0
                            res.redirect('/login')
                        } else {
                            db.getProducts().then((products) => {
                                req.session.userId = resp._id;
                                db.profile(req.session.userId).then(async (userData) => {
                                    if (userData.image != null) {
                                        if (userData.image.proImage != null) {
                                            proImag = await userData.image.proImage[0].filename;
                                            req.session.proImag = await userData.image.proImage[0].filename;
                                        } else {
                                            proImag = null
                                        }
                                    } else {
                                        proImag = null
                                    }
                                    db.cartProductAdd(req.query.productId, req.session.userId).then((product) => {
                                        req.session.totalcartCount = product.length;
                                        res.render('user/home', {
                                            css: ["/stylesheets/logintemp/css/bootstrap.css", "/stylesheets/logintemp/css/font-awesome.min.css",
                                                "/stylesheets/logintemp/css/responsive.css", "/stylesheets/logintemp/css/style.css",
                                                "https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css",
                                                "https://cdnjs.cloudflare.com/ajax/libs/jquery-nice-select/1.1.0/css/nice-select.min.css"],
                                            js: ['bootstrap.js', "custom.js", 'jquery-3.4.1.min.js'], products, proImag, userData, totalcartCount: req.session.totalcartCount
                                        })
                                    })
                                })
                            })
                        }
                    } else {

                        req.session.loginId = undefined;
                        res.redirect('/login')
                    }
                } else {
                    res.redirect('/login')
                }
            }).catch((err) => {
                res.redirect('/404')
            })
        } catch (e) {
            res.redirect('/404')
        }
    },
    otpPage: (req, res) => {
        try {
            let countDownTime = 0000;
            //    otpmailSend Section
            if (req.session.tempmail != undefined) {
                let generateOTP = () => {
                    return otpGenerator.generate(6, {
                        digits: true,
                        lowerCaseAlphabets: false,
                        upperCaseAlphabets: false,
                        specialChars: false
                    });
                };
                req.session.otpsign = generateOTP();
                mailer(req.session.tempmail, req.session.otpsign)
            }
            // otp Mail Send end
            let msg;
            if (otpMsg == null) {
                msg = null;
            } else {
                msg = otpMsg;
            }
            res.render('user/otp', {
                css: ["/stylesheets/otp.css",
                    "/stylesheets/fonts/material-icon/css/material-design-iconic-font.min.css",
                    "/stylesheets/logintemp/css/style.css",], msg
            })
            otpMsg = null;
            // ##############
            countDownTime = 60000;
            var x = setInterval(function () {
                countDownTime -= 1000;
                if (countDownTime < 0) {
                    clearInterval(x);
                    req.session.otpsign = undefined;
                }
            }, 1000);
            // ##############

        } catch (e) {
            res.redirect('/404')
        }
    },
    resendOtp: (req, res) => {
        try {
            if (req.session.tempmail == undefined) {
                res.json(data = false)
            } else {
                let generateOTP = () => {
                    return otpGenerator.generate(6, {
                        digits: true,
                        lowerCaseAlphabets: false,
                        upperCaseAlphabets: false,
                        specialChars: false
                    });
                };
                req.session.otp = generateOTP();
                mailer(req.session.tempmail, req.session.otpsign)
                res.json(data = true)
                // ############## 
                //countdown
                countDownTime = 60000;
                let x = setInterval(function () {
                    countDownTime -= 1000;
                    if (countDownTime < 0) {
                        clearInterval(x);
                        req.session.otpsign = null
                    }
                }, 1000);
                //countdown
                // ##############
            }
        } catch (e) {
            res.redirect('/404')
        }
    },
    postOtp: (req, res) => {
        try {
            if (req.body.otp != req.session.otpsign) {
                let data = false
                res.json(data)

            } else {
                if (req.session.userTempData != undefined) {
                    db.userAdd(req.session.userTempData).then(() => {
                        res.json(data = true)

                        req.session.userTempData = undefined;
                    }).catch((err) => {
                        res.redirect('/')
                    })
                } else {
                    let data = false
                    res.json(data)
                }
            }
        } catch (e) {
            res.redirect('/404')
        }
    },
    postUserData: (req, res) => {
        try {
            db.emailverify(req.body.Emailverify).then((resp) => {
                if (resp == null) {
                    req.session.tempmail = req.body.email
                    req.session.userTempData = req.body
                    res.redirect('/otp')
                } else {

                    res.json('This Email Already Exists')
                }
            }).catch((err) => {
                res.redirect('/404')
            })
        } catch (e) {
            res.redirect('/404')
        }
    },
    postHomelogin: (req, res) => {
        try {
            db.doLogin(req.body).then((result) => {
                if (result.true == true) {
                    req.session.loginId = req.body.email
                    res.redirect('/home')
                } else {
                    res.redirect('/login')
                }
            }).catch((err) => {
                emailNotMarch = err
                res.redirect('/login')
            })
        } catch (e) {
            res.redirect('/404')
        }
    },
    singleProductView: (req, res) => {
        try {
            db.getCatogaryProducts(req.query.catogery).then((data) => {
                let brg;
                let piz;
                let chk;
                let All;
                if(req.query.catogery!='All'){
                if (data[0].productCatogary == 'burger') {
                    brg = "active"
                    piz = null;
                    chk = null;

                } else if (data[0].productCatogary == 'pizza') {
                    piz = "active"
                    brg = null;
                    chk = null;
                } else if (data[0].productCatogary == 'chiken') {
                    chk = "active"
                    piz = null;
                    brg = null;
                }else {
                    All="active"
                    piz = null;
                    brg = null;
                    chk = null;
                }
            }else{
                All="active"
                piz = null;
                brg = null;
                chk = null; 
            }
                db.profile(req.session.userId).then(async (userData) => {
                    if (userData.image != null) {
                        if (userData.image.proImage != null) {
                            proImag = await userData.image.proImage[0].filename;
                        } else {
                            proImag = null
                        }
                    } else {
                        proImag = null
                    }
                    res.render('user/singleProductview', {
                        css: ["/stylesheets/logintemp/css/bootstrap.css", "/stylesheets/logintemp/css/font-awesome.min.css",
                            "/stylesheets/logintemp/css/responsive.css", "/stylesheets/logintemp/css/style.css",
                            "https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css",
                            "https://cdnjs.cloudflare.com/ajax/libs/jquery-nice-select/1.1.0/css/nice-select.min.css"],
                        js: ['bootstrap.js', "custom.js", 'jquery-3.4.1.min.js'], data, brg, piz, chk,All, proImag, userData, totalcartCount: req.session.totalcartCount
                    })
                })
            }).catch((err) => {
                res.redirect('/404')
            })
        } catch (e) {
            res.redirect('/404')
        }
    },
    getCartProductadd: (req, res) => {
        try {
            db.cartProductAdd(req.query.productId, req.session.userId).then((product) => {
                req.session.cartProductDetails = product
                req.session.totalcartCount = product.length;
                db.profile(req.session.userId).then(async (userData) => {
                    req.session.userDetails = userData
                    for (let i = 0; i < product.length; i++) {
                        for (let j = 0; j < userData.cart.length; j++) {
                            if (product[i]._id == userData.cart[j].productId) {
                                product[i].count = userData.cart[j].quantity
                                product[i].orderStatus = "Orderd"
                                product[i].proOrderId = Date.now()
                                product[i].proTotal = parseInt(product[i].productPrize) * parseInt(product[i].count)
                            }
                        }
                    }
                    if (req.session.total != 0) {
                        req.session.total = 0
                    }
                    for (let i = 0; i < product.length; i++) {
                        for (let j = 0; j < userData.cart.length; j++) {
                            if (product[i]._id == userData.cart[j].productId) {
                                req.session.total += product[i].productPrize * product[i].count
                            }
                        }
                    }
                    if (userData.image != null) {
                        if (userData.image.proImage != null) {
                            proImag = await userData.image.proImage[0].filename;
                        } else {
                            proImag = null
                        }
                    } else {
                        proImag = null
                    }
                    let total = req.session.total
                    res.render('user/cart', {
                        css: ["/stylesheets/logintemp/css/bootstrap.css", "/stylesheets/logintemp/css/font-awesome.min.css",
                            , "/stylesheets/logintemp/css/style.css",
                            "https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css",
                            "https://cdnjs.cloudflare.com/ajax/libs/jquery-nice-select/1.1.0/css/nice-select.min.css",],
                        js: ['bootstrap.js', "custom.js", 'jquery-3.4.1.min.js'], product, proImag, userData, total, totalcartCount: req.session.totalcartCount
                    })
                    cartProducts = product;
                })
            }).catch((err) => {
                db.cartCountGet(req.session.userId).then((product) => {
                    
                    req.session.totalcartCount =product
                    res.json({cartCount:req.session.totalcartCount,status:true})
                })
                
            })
        } catch (e) {
            res.redirect('/404')
        }
        
    },
    
    userLogout: (req, res) => {
        try{
        req.session.total = 0;
        req.session.loginId = undefined;
        res.redirect('/')
        }catch(e){
            res.redirect('/404')
        }
    },
    cartDelet: (req, res) => {
        try {
            db.delCartitem(req.session.userId, req.query.id, req.query.ofId).then((ress => {
                res.redirect('/cart')
            })).catch((err) => {
                res.redirect('/404')
            })

        } catch (e) {
            res.redirect('/404')
        }
    },
    profilEdit: (req, res) => {
        try {
            db.profile(req.session.userId).then((userData) => {
                let addrs = userData.address
                let proImag = null;

                if (userData.image != null) {
                    if (userData.image.proImage != null) {
                        proImag = userData.image.proImage[0].filename;
                    } else {
                        proImag = null
                    }
                } else {
                    proImag = null
                }
                if (emailNotMarchc != null) {
                    emailNotMarchc = emailNotMarch
                }
                res.render('user/profilePage', {
                    css: ["/stylesheets/logintemp/css/bootstrap.css", "/stylesheets/logintemp/css/font-awesome.min.css",
                        "/stylesheets/logintemp/css/responsive.css",
                        "https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css",
                        "https://cdnjs.cloudflare.com/ajax/libs/jquery-nice-select/1.1.0/css/nice-select.min.css",
                        '/stylesheets/profile.css', "/stylesheets/logintemp/css/style.css"],
                    js: ['bootstrap.js', "custom.js", 'jquery-3.4.1.min.js'], userData, emailNotMarch, proImag, addrs, totalcartCount: req.session.totalcartCount
                })
            }).catch((err) => {
                res.redirect('/404')
            })
            emailNotMarchc = null

        } catch (e) {
            res.redirect('/404')
        }
    },
    postProfileUpdate: (req, res) => {
        try {
            db.emailverify(req.body.proEmail).then((resp) => {

                if (resp == null || resp.email == null) {

                    db.profileUpdate(req.session.userId, req.body, req.files).then((resp) => {
                        res.redirect('/profile')
                    })
                } else {
                    emailNotMarchc = "already exist";
                    res.redirect('/profile')
                }
            }).catch((err) => {
                res.redirect('/404')
            })
        } catch (e) {
            res.redirect('/404')
        }


    },
    PostProfileAddess: (req, res) => {
        try {
            if (req.session.loginId != undefined) {
                db.address(req.session.userId, req.body).then((resp) => {
                    res.json(resp)
                }).catch((err) => {
                    res.redirect('/404')
                })
            } else {
                emailNotMarchc = "already exist";
                res.redirect('/profile')
            }
        } catch (e) {
            res.redirect('/404')
        }
    },
    paymentAddressGet: (req, res) => {
        try {
            if (req.session.loginId != undefined) {
                let users = req.session.userDetails
                let proImag = null;
                if (users.image != null) {
                    if (users.image.proImage != null) {
                        proImag = users.image.proImage[0].filename;
                    } else {
                        proImag = null
                    }
                } else {
                    proImag = null
                }
                // ############################################
                db.profile(req.session.userId).then(async (userData) => {
                    for (let i = 0; i < req.session.cartProductDetails.length; i++) {
                        for (let j = 0; j < userData.cart.length; j++) {
                            if (req.session.cartProductDetails[i]._id == userData.cart[j].productId) {

                                req.session.cartProductDetails[i].count = userData.cart[j].quantity
                                req.session.cartProductDetails[i].orderStatus = "Orderd"
                                req.session.cartProductDetails[i].proOrderId = Date.now()
                                req.session.cartProductDetails[i].proTotal = parseInt(req.session.cartProductDetails[i].productPrize) * parseInt(req.session.cartProductDetails[i].count)
                            }
                        }
                    }
                })
                // ##############################################
                db.address(req.session.userId).then((addr) => {

                    res.render('user/payment', {
                        css: ["/stylesheets/logintemp/css/bootstrap.css", "/stylesheets/logintemp/css/font-awesome.min.css",
                            "/stylesheets/logintemp/css/responsive.css", "/stylesheets/logintemp/css/style.css",
                            "https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css",
                            "https://cdnjs.cloudflare.com/ajax/libs/jquery-nice-select/1.1.0/css/nice-select.min.css", '/stylesheets/checkout.css'],
                        js: ['bootstrap.js', "custom.js", 'jquery-3.4.1.min.js'], addr, total: req.session.total, cartProducts: req.session.cartProductDetails, user: req.session.userDetails, proImag, totalcartCount: req.session.totalcartCount
                    })
                }).catch((err) => {
                    res.redirect('/404')
                })
            } else {
                emailNotMarchc = "already exist";
                res.redirect('/profile')
            }
        } catch (e) {
            res.redirect('/404')
        }
    },
    successpage: (req, res) => {
        try {
            if (req.session.loginId != undefined) {
                let user = req.session.userDetails;
                let proImag = null;

                if (user.image != null) {
                    if (user.image.proImage != null) {
                        proImag = user.image.proImage[0].filename;
                    } else {
                        proImag = null
                    }
                } else {
                    proImag = null
                }
                res.render('user/success', {
                    css: ["/stylesheets/logintemp/css/bootstrap.css", "/stylesheets/logintemp/css/font-awesome.min.css",
                        "/stylesheets/logintemp/css/responsive.css", "/stylesheets/logintemp/css/style.css",
                        "https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css",
                        "https://cdnjs.cloudflare.com/ajax/libs/jquery-nice-select/1.1.0/css/nice-select.min.css", '/stylesheets/checkout.css'],
                    js: ['bootstrap.js', "custom.js", 'jquery-3.4.1.min.js'], user, proImag, totalcartCount: req.session.totalcartCount
                })
            } else {
                emailNotMarchc = "already exist";
                res.redirect('/profile')
            }
        } catch (e) {
            res.redirect('/404')
        }
    },
    productSearch: (req, res) => {
        try {
            db.searchproduct(req.body.data).then((data) => {
                if(req.session.loginId != undefined){
                    res.json({data,status:true})

                }else{
                    res.json({data,status:false})
                }
                
            }).catch(() => {
                res.redirect('/404')
            })
        } catch (e) {
            res.redirect('/404')
        }
    },
    postCount: (req, res) => {
        try {
            db.cartCount(req.session.userId, req.body.countValue, req.body.proId, req.body.ofId).then((result) => {
                db.cartProductAdd(req.query.productId, req.session.userId, req.body.ofId).then((product) => {
                    db.profile(req.session.userId).then((userData) => {
                        for (let i = 0; i < product.length; i++) {
                            for (let j = 0; j < userData.cart.length; j++) {
                                if (product[i]._id == userData.cart[j].productId) {
                                    product[i].count = userData.cart[j].quantity
                                }
                            }
                        }

                        if (req.session.total != 0) {
                            req.session.total = 0
                        }
                        for (let i = 0; i < product.length; i++) {
                            for (let j = 0; j < userData.cart.length; j++) {
                                if (product[i]._id == userData.cart[j].productId) {
                                    req.session.total += parseInt(product[i].productPrize) * product[i].count
                                }
                            }
                        }
                        res.json({ result: result.quantity, newTotal: req.session.total, prototal: result.prototal })
                    })
                })
            })

        } catch (e) {
            res.redirect('/404')
        }
    },
    addressDelete: (req, res) => {
        try {
            db.adddelete(req.session.userId, req.body).then((resp) => {
                res.json(resp)
            }).catch((e) => {
                res.redirect('/404')
            })
        } catch (e) {
            res.redirect('/404')
        }
    },
    updateAdd: (req, res) => {
        try {
            db.updateaddress(req.session.userId, req.body).then((data) => {
                res.json(data)
            }).catch((e) => {
                res.redirect('/404')
            })
        } catch (e) {
            res.redirect('/404')
        }
    },
    addget: (req, res) => {
        try {
            db.getAddress(req.session.userId).then((data) => {
                res.json(data)
            })
        } catch (e) {
            res.redirect('/404')
        }
    },
    postCoopenAppply: (req, res) => {
        try{
        db.coopenFind(req.body.cpApply).then((data) => {
            req.session.coupenDisTotal = 0
            let results = {}
            if (data != null) {
                if (data.cpList == 'Unlist') {
                    if (req.session.total > data.cpPurchaseAmt) {
                        if (new Date() < new Date(data.cpEndDataTime)) {
                            req.session.coupenDisTotal = data.cpDisamt
                            req.session.newCpAmt = req.session.total - data.cpDisamt
                            results = { disAmt: parseInt(data.cpDisamt), amt: req.session.newCpAmt }
                        } else {
                            results = { msg: 'coopen date expired', oldVal: req.session.total }
                        }
                    } else {
                        results = { msg: 'purchase the given amount', oldVal: req.session.total }
                    }
                } else {
                    results = { msg: 'coopen blocked', oldVal: req.session.total }
                }
            } else {
                results = { msg: 'enter valid coopen', oldVal: req.session.total }
            }
            res.json(results)
        })
    }catch(e){
        res.redirect('/404')
    }
    },
    orderhistoryyy: (req, res) => {
        try{
        if (req.body.payMethod == 'cod') {
            db.orderHistoryAdd(req.session.userId, req.session.cartProductDetails, req.body.address, req.body.coopenStatus, req.session.total, req.body.date, req.body.payMethod, req.session.newwallAmt).then(() => {

                res.json({ status: true })
                db.getWalletamt(req.session.userId, req.session.newwallAmt, req.session.walletMinus)
            })
        } else {
            db.OnlineorderHistoryAdd(req.session.userId, req.session.cartProductDetails, req.body.address, req.body.coopenStatus, req.session.total, req.body.date, req.body.payMethod, req.session.newwallAmt).then((responce) => {

                req.session.cpsts = 0
                if (req.body.coopenStatus.amt) {
                    if (req.session.walletTemp != undefined) {

                        req.session.cpsts = req.body.coopenStatus.amt - req.session.walletTemp
                    } else {
                        req.session.cpsts = req.body.coopenStatus.amt
                    }
                } else {
                    req.session.cpsts = responce[0].totalAmt
                }
                db.razorpay(responce[0].orderid, req.session.cpsts).then((resp) => {
                    res.json(resp)
                })
            })
        }
    }catch(e){
        res.redirect('/404')
    }
    },
    orderhistoryPage: async (req, res) => {
        try{
        db.profile(req.session.userId).then((data) => {
            let datas = data.orderhistory
            req.session.allOrderTotal = 0;
            for (i = 0; i < datas.length; i++) {
                for (j = 0; j < datas[i].productDetails.length; j++) {
                    if (datas[i].productDetails[j].orderStatus == 'Delivered') {
                        req.session.allOrderTotal = req.session.allOrderTotal + parseInt(datas[i].productDetails[j].proTotal)
                    }
                    if (datas[i].coopenstatus != '' && datas[i].coopenstatus != null) {
                        if (datas[i].productDetails[j].orderStatus == 'Delivered') {
                            req.session.allOrderTotal = req.session.allOrderTotal - parseInt(datas[i].coopenstatus.disAmt)
                        }
                    }
                }
            }
            res.render('user/orderhistory', {
                css: ["/stylesheets/logintemp/css/bootstrap.css", "/stylesheets/logintemp/css/font-awesome.min.css",
                    "/stylesheets/logintemp/css/responsive.css", "/stylesheets/logintemp/css/style.css",
                    "https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css",
                    "https://cdnjs.cloudflare.com/ajax/libs/jquery-nice-select/1.1.0/css/nice-select.min.css", '/stylesheets/checkout.css'],
                js: ['bootstrap.js', "custom.js", 'jquery-3.4.1.min.js'], datas, allOrderTotal: req.session.allOrderTotal, proImag: req.session.proImag, user: req.session.userDetails, totalcartCount: req.session.totalcartCount
            })
        }).catch((e) => {
            res.redirect('/404')
        })
    }catch(e){
        res.redirect('/404')
    }
    },
    orderCanceled: (req, res) => {
        try{
        db.ordercancel(req.session.userId, req.body).then((result) => {
            res.json(result)
        })
    }catch(e){
        res.redirect('/404')
    }
    },
    onlinepayDetails: (req, res) => {
        try{
        db.verifyPayment(req.body).then(() => {
            res.json({ pay: true })
            db.getWalletamt(req.session.userId, req.session.newwallAmt, req.session.walletMinus)
        }).catch(() => {
            res.json({ pay: false })
        })
    }catch(e){
        res.redirect('/404')
    }
    },
    getForgotPassword: (req, res) => {
        try{
        otp = null
        res.render('user/forgotPassword', {
            css: [, "/stylesheets/logintemp/css/font-awesome.min.css",
                "/stylesheets/logintemp/css/responsive.css", "/stylesheets/logintemp/css/style.css",
                "https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css",
                "https://cdnjs.cloudflare.com/ajax/libs/jquery-nice-select/1.1.0/css/nice-select.min.css"],
            js: ['bootstrap.js', "custom.js", 'jquery-3.4.1.min.js']
        })
        countDownTime = 0;
    }catch(e){
        res.redirect('/404')
    }
    },
    forgotMailCheck: (req, res) => {
        try{
        db.forgotPassMailCheck(req.body.email).then((data) => {
            req.session.resetPassword = req.body.email
            if (data != null) {
                let generateOTP = () => {
                    return otpGenerator.generate(6, {
                        digits: true,
                        lowerCaseAlphabets: false,
                        upperCaseAlphabets: false,
                        specialChars: false
                    });
                };
                req.session.otp = generateOTP();
                mailer(req.session.resetPassword, req.session.otp)
                res.json(data = true)
                // ##############
                //countdown
                countDownTime = 60000;
                let x = setInterval(function () {
                    countDownTime -= 1000;

                    if (countDownTime < 0) {
                        clearInterval(x);
                        req.session.otp = null
                    }
                }, 1000);
                //countdown
                // ##############
            } else {
                res.json(data = false)
            }
        }).catch((err) => {
            res.redirect('/404')
        })
    }catch(e){
        res.redirect('/404')
    }
    },
    passOtpverify: (req, res) => {
        try{
        if (req.body.otp == req.session.otp) {
            res.json({ data: true })
        } else {
            res.json({ data: false })
        }
    }catch(e){
        res.redirect('/404')
    }
    },
    passResendOtp: (req, res) => {
        try{
        let generateOTP = () => {
            return otpGenerator.generate(6, {
                digits: true,
                lowerCaseAlphabets: false,
                upperCaseAlphabets: false,
                specialChars: false
            });
        };
        req.session.otp = generateOTP();
        mailer(req.session.resetPassword, req.session.otp)
        res.json('success')
        countDownTime = 60000;
        let x = setInterval(function () {
            countDownTime -= 1000;

            if (countDownTime < 0) {
                clearInterval(x);
                req.session.otp = null
            }
        }, 1000);
        //countdown
    }catch(e){
        res.redirect('/404')
    }
    },
    passwordReset: (req, res) => {
        try{
        db.resetpass(req.session.resetPassword, req.body.pass1).then(() => {
            res.json('success')
        })
    }catch(e){
        res.redirect('/404')
    }
    },
    walletAmtAdd: (req, res) => {
        try{
        req.session.walletMinus = 0
        if (req.session.totaltemp == undefined) {
            req.session.totaltemp = req.session.total
        }
        if (req.body.walletamt != 0) {
            req.session.walletTemp = req.body.walletamt
            if (req.body.walletamt <= req.session.total) {
                req.session.newwallAmt = 0
                req.session.walletMinus = req.body.walletamt
                req.session.total = req.session.total - req.body.walletamt
            } else {
                req.session.walletMinus = req.session.total
                req.session.newwallAmt = req.body.walletamt - req.session.total
                req.session.total = 0
            }
            if (req.session.coupenDisTotal != undefined) {
                req.session.total = req.session.total - req.session.coupenDisTotal
                res.json({ total: req.session.total, wallet: req.session.walletTemp })
                req.session.coupenDisTotal = 0
            } else {
                res.json({ total: req.session.total, wallet: req.session.walletTemp })
            }
        } else {
            req.session.newwallAmt = 1
            if (req.session.coupenDisTotal != undefined && req.session.total != 0) {
                req.session.total = req.session.totaltemp
                req.session.total = req.session.total - req.session.coupenDisTotal
                req.session.coupenDisTotal = 0
                res.json({ total: req.session.total, wallet: 0 })
            } else {
                req.session.total = req.session.totaltemp
                res.json({ total: req.session.totaltemp, wallet: 0 })
            }
        }
    }catch(e){
        res.redirect('/404')
    }

    },
    errPage:(req,res)=>{
        res.render('404')
    }
}
module.exports = usercotrol