

const db = require('./databaseConfig/users')
const mailer = require('../helpers/nodeMailer');
const { json } = require('express');
require('dotenv')
const rasorpay = require('razorpay')
const otpGenerator = require('otp-generator')

let emailNotMarchc = null;
let tempmail;
let mailCheck = null;
var emailNotMarch = null;
let tempData;
let otpMsg = null;
let userId = null;
let total = 0;
let cartProducts;
let forgotPassMail = ''
let countDownTime = 60000;


let generateOTP = () => {
    return otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
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
                    res.redirect('/')
                })
            }
        } catch (e) {
            res.redirect('/')
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
            res.redirect('/')
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
            res.redirect('/')
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
                                        } else {
                                            proImag = null
                                        }

                                    } else {
                                        proImag = null
                                    }
                                    db.cartProductAdd(req.query.productId, req.session.userId).then((product) => {

                                        console.log('hii');
                                        let totalcartCount = product.length;


                                        res.render('user/home', {
                                            css: ["/stylesheets/logintemp/css/bootstrap.css", "/stylesheets/logintemp/css/font-awesome.min.css",
                                                "/stylesheets/logintemp/css/responsive.css", "/stylesheets/logintemp/css/style.css",
                                                "https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css",
                                                "https://cdnjs.cloudflare.com/ajax/libs/jquery-nice-select/1.1.0/css/nice-select.min.css"],
                                            js: ['bootstrap.js', "custom.js", 'jquery-3.4.1.min.js'], products, proImag, userData, totalcartCount
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
                res.redirect('/')
            })
        } catch (e) {
            res.redirect('/')
        }
    },
    otpPage: (req, res) => {
        try {

            let msg;
            if (otpMsg == null) {
                let msg = null;
            } else {
                msg = otpMsg;
            }
            res.render('user/otp', { css: ["/stylesheets/otp.css"], msg })
            otpMsg = null;
            // ##############
            var countDownTime = 30000;
            var x = setInterval(function () {
                countDownTime -= 1000;
                var seconds = Math.floor((countDownTime % (1000 * 60)) / 1000);
                if (countDownTime < 0) {
                    clearInterval(x);
                    otp = undefined;
                    console.log("main");
                }
            }, 1000);
            // ##############
            generateOTP()
        } catch (e) {
            res.redirect('/')
        }
    },
    resendOtp: (req, res) => {
        try {
            otp = generateOTP()
            mailer(tempmail, otp)
            res.redirect('/otp')
            console.log("reseb" + otp);

            // ##############
            var countDownTime = 30000;
            setTimeout(() => {
                otp = undefined;
                console.log("recountown");
            }, countDownTime);
            // ##############
            generateOTP()
        } catch (e) {
            res.redirect('/')
        }

    },
    postOtp: (req, res) => {
        try {
            if (req.body.otp == otp) {

                db.userAdd(tempData).then(() => {
                    res.redirect('/login')
                }).catch((err) => {
                    res.redirect('/')
                })
            } else {
                otpMsg = 'your enterd wrong otp'
                res.redirect('/otp')
            }
        } catch (e) {
            res.redirect('/')
        }
    },
    postUserData: (req, res) => {
        try {
            db.emailverify(req.body.Emailverify).then((resp) => {
                if (resp == null) {
                    tempmail = req.body.email
                    mailer(req.body.email, otp)
                    console.log(otp);
                    tempData = req.body


                    res.redirect('/otp')
                } else {

                    res.json('This Email Already Exists')
                }
            }).catch((err) => {
                res.redirect('/')
            })
        } catch (e) {
            res.redirect('/')
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
            res.redirect('/')
        }
    },
    singleProductView: (req, res) => {
        try {


            db.getCatogaryProducts(req.query.catogery).then((data) => {
                let brg;
                let piz;
                let chk;

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
                        js: ['bootstrap.js', "custom.js", 'jquery-3.4.1.min.js'], data, brg, piz, chk, proImag, userData
                    })
                })
            }).catch((err) => {
                res.redirect('/')
            })

        } catch (e) {
            res.redirect('/')
        }
    },
    getCartProductadd: (req, res) => {
        try {


            db.cartProductAdd(req.query.productId, req.session.userId).then((product) => {

                console.log('hii');
                let totalcartCount = product.length;
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
                    console.log('haiii', product);
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
                            "/stylesheets/logintemp/css/responsive.css", "/stylesheets/logintemp/css/style.css",
                            "https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css",
                            "https://cdnjs.cloudflare.com/ajax/libs/jquery-nice-select/1.1.0/css/nice-select.min.css"],
                        js: ['bootstrap.js', "custom.js", 'jquery-3.4.1.min.js'], product, proImag, userData, total, totalcartCount
                    })

                    cartProducts = product;
                })
            }).catch((err) => {
                res.redirect('/cart')
            })

        } catch (e) {
            res.redirect('/')
        }

    },
    userLogout: (req, res) => {
        req.session.total = 0;
        req.session.loginId = undefined;
        res.redirect('/')
    },
    cartDelet: (req, res) => {
        try {

            db.delCartitem(req.session.userId, req.query.id, req.query.ofId).then((ress => {
                res.redirect('/cart')
            })).catch((err) => {
                res.redirect('/')
            })

        } catch (e) {
            res.redirect('/')
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
                        "/stylesheets/logintemp/css/responsive.css", "/stylesheets/logintemp/css/style.css",
                        "https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css",
                        "https://cdnjs.cloudflare.com/ajax/libs/jquery-nice-select/1.1.0/css/nice-select.min.css",
                        '/stylesheets/profile.css'],
                    js: ['bootstrap.js', "custom.js", 'jquery-3.4.1.min.js'], userData, emailNotMarch, proImag, addrs
                })
            }).catch((err) => {
                res.redirect('/')
            })
            emailNotMarchc = null

        } catch (e) {
            res.redirect('/')
        }
    },
    postProfileUpdate: (req, res) => {
        try {

            db.emailverify(req.body.proEmail).then((resp) => {

                if (resp == null || resp.email == null) {

                    db.profileUpdate(req.session.userId, req.body, req.files).then((resp) => {
                        console.log('done');
                        res.redirect('/profile')
                    })
                } else {
                    emailNotMarchc = "already exist";
                    console.log('post profile update');
                    res.redirect('/profile')
                }
            }).catch((err) => {
                res.redirect('/')
            })
        } catch (e) {
            console.log('post profile update');
            res.redirect('/')
        }


    },
    PostProfileAddess: (req, res) => {
        try {
            if (req.session.loginId != undefined) {
                db.address(req.session.userId, req.body).then((resp) => {
                    res.json(resp)
                }).catch((err) => {
                    res.redirect('/')
                })
            } else {
                emailNotMarchc = "already exist";
                res.redirect('/profile')
            }
        } catch (e) {
            res.redirect('/')
        }
    },
    paymentAddressGet: (req, res) => {
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
                db.address(req.session.userId).then((addr) => {
                    let total = req.session.total
                    res.render('user/payment', {
                        css: ["/stylesheets/logintemp/css/bootstrap.css", "/stylesheets/logintemp/css/font-awesome.min.css",
                            "/stylesheets/logintemp/css/responsive.css", "/stylesheets/logintemp/css/style.css",
                            "https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css",
                            "https://cdnjs.cloudflare.com/ajax/libs/jquery-nice-select/1.1.0/css/nice-select.min.css", '/stylesheets/checkout.css'],
                        js: ['bootstrap.js', "custom.js", 'jquery-3.4.1.min.js'], addr, total, cartProducts, user, proImag
                    })
                }).catch((err) => {
                    res.redirect('/')
                })
            } else {
                emailNotMarchc = "already exist";
                res.redirect('/profile')
            }
        } catch (e) {
            res.redirect('/')
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
                    js: ['bootstrap.js', "custom.js", 'jquery-3.4.1.min.js'], user, proImag
                })

            } else {
                emailNotMarchc = "already exist";
                res.redirect('/profile')
            }
        } catch (e) {
            res.redirect('/')
        }
    },
    productSearch: (req, res) => {
        try {
            db.searchproduct(req.body.data).then((data) => {
                res.json(data)

            }).catch(() => {
                res.redirect('/')
            })
        } catch (e) {
            res.redirect('/')
        }

    },
    postCount: (req, res) => {
        try {
            db.cartCount(req.session.userId, req.body.countValue, req.body.proId, req.body.ofId).then((result) => {
                db.cartProductAdd(req.query.productId, req.session.userId, req.body.ofId).then((product) => {
                    console.log(product);
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
                        console.log(req.session.total);

                        res.json({ result: result.quantity, newTotal: req.session.total, prototal: result.prototal })
                    })
                })
            })

        } catch (e) {
            res.redirect('/')
        }
    },
    addressDelete: (req, res) => {
        try {
            db.adddelete(req.session.userId, req.body).then((resp) => {
                console.log(req.body);
                res.json(resp)
            }).catch((e) => {
                res.redirect('/')
            })
        } catch (e) {
            res.redirect('/')
        }
    },
    updateAdd: (req, res) => {
        try {

            db.updateaddress(req.session.userId, req.body).then((data) => {
                res.json(data)
            }).catch((e) => {
                res.redirect('/')
            })
        } catch (e) {
            res.redirect('/')
        }
    },
    addget: (req, res) => {
        try {
            db.getAddress(req.session.userId).then((data) => {
                res.json(data)
            })
        } catch (e) {
            res.redirect('/')
        }
    },
    postCoopenAppply: (req, res) => {
        db.coopenFind(req.body.cpApply).then((data) => {

            let results = {}
            if (data != null) {
                if (data.cpList == 'Unlist') {
                    if (req.session.total > data.cpPurchaseAmt) {
                        if (new Date() < new Date(data.cpEndDataTime)) {
                            let amt = req.session.total - data.cpDisamt
                            results = { disAmt: parseInt(data.cpDisamt), amt: amt }
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
    },
    orderhistoryyy: (req, res) => {
        if (req.body.payMethod == 'cod') {
            db.orderHistoryAdd(req.session.userId, cartProducts, req.body.address, req.body.coopenStatus, req.session.total, req.body.date, req.body.payMethod,req.session.newwallAmt).then(() => {
                console.log('voopen', req.body.coopenStatus);

                res.json({ status: true })
            })
            db.getWalletamt(req.session.userId, req.session.newwallAmt)
        } else {
            db.OnlineorderHistoryAdd(req.session.userId, cartProducts, req.body.address, req.body.coopenStatus, req.session.total, req.body.date, req.body.payMethod,req.session.newwallAmt).then((responce) => {
                console.log('online',req.session.walletTemp);
                req.session.cpsts = 0
                if (req.body.coopenStatus.amt) {

                    req.session.cpsts = req.body.coopenStatus.amt
                } else {
                    req.session.cpsts = responce[0].totalAmt
                }
                db.razorpay(responce[0].orderid, req.session.cpsts).then((resp) => {
                    res.json(resp)
                })
            })
        }
        db.getWalletamt(req.session.userId, req.session.newwallAmt)


    },
    orderhistoryPage: async (req, res) => {

        db.profile(req.session.userId).then((data) => {
            let datas = data.orderhistory
            req.session.allOrderTotal = 0;
            for (i = 0; i < datas.length; i++) {
                for (j = 0; j < datas[i].productDetails.length; j++) {


                    console.log('ordered', req.session.allOrderTotal);
                    if (datas[i].productDetails[j].orderStatus == 'Delivered') {
                        req.session.allOrderTotal = req.session.allOrderTotal + parseInt(datas[i].productDetails[j].proTotal)

                    }

                    if (datas[i].coopenstatus != '' && datas[i].coopenstatus != null) {
                        if (datas[i].productDetails[j].orderStatus == 'Delivered') {
                            req.session.allOrderTotal = req.session.allOrderTotal - parseInt(datas[i].coopenstatus.disAmt)
                        }
                        console.log('aa', req.session.allOrderTotal);

                    }

                }

            }


            res.render('user/orderhistory', {
                css: ["/stylesheets/logintemp/css/bootstrap.css", "/stylesheets/logintemp/css/font-awesome.min.css",
                    "/stylesheets/logintemp/css/responsive.css", "/stylesheets/logintemp/css/style.css",
                    "https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css",
                    "https://cdnjs.cloudflare.com/ajax/libs/jquery-nice-select/1.1.0/css/nice-select.min.css", '/stylesheets/checkout.css'],
                js: ['bootstrap.js', "custom.js", 'jquery-3.4.1.min.js'], datas, allOrderTotal: req.session.allOrderTotal
            })
        }).catch((e) => {
            res.redirect('/')
        })

    },
    orderCanceled: (req, res) => {

        db.ordercancel(req.session.userId, req.body).then((result) => {
            res.json(result)
        })
    },
    onlinepayDetails: (req, res) => {
        db.verifyPayment(req.body).then(() => {
            res.json({ pay: true })
        }).catch(() => {
            res.json({ pay: false })
        })

    },
    getForgotPassword: (req, res) => {

        otp = null
        res.render('user/forgotPassword', {
            css: [, "/stylesheets/logintemp/css/font-awesome.min.css",
                "/stylesheets/logintemp/css/responsive.css", "/stylesheets/logintemp/css/style.css",
                "https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css",
                "https://cdnjs.cloudflare.com/ajax/libs/jquery-nice-select/1.1.0/css/nice-select.min.css"],
            js: ['bootstrap.js', "custom.js", 'jquery-3.4.1.min.js']
        })
        countDownTime = 0;
    },

    forgotMailCheck: (req, res) => {
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
                console.log('forgot', req.session.otp + req.session.resetPassword);
                res.json(data = true)
                // ##############
                //countdown

                countDownTime = 60000;
                let x = setInterval(function () {
                    countDownTime -= 1000;

                    if (countDownTime < 0) {
                        clearInterval(x);
                        req.session.otp = null
                        console.log('otp null', req.session.otp);
                    }
                }, 1000);
                //countdown
                // ##############


            } else {
                res.json(data = false)
            }
        }).catch((err) => {
            res.redirect('/')
        })
    },
    passOtpverify: (req, res) => {
        if (req.body.otp == req.session.otp) {
            res.json({ data: true })
        } else {
            res.json({ data: false })
        }
    },
    passResendOtp: (req, res) => {
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
        console.log('re', req.session.otp);
        res.json('success')
        countDownTime = 60000;
        let x = setInterval(function () {
            countDownTime -= 1000;

            if (countDownTime < 0) {
                clearInterval(x);
                req.session.otp = null
                console.log('reotp null', req.session.otp);
            }
        }, 1000);
        //countdown

    },
    passwordReset: (req, res) => {
        console.log('fff');
        db.resetpass(req.session.resetPassword, req.body.pass1).then(() => {
            res.json('success')
        })
    },
    walletAmtAdd: (req, res) => {
        
        if (req.body.walletamt != 0) {
            req.session.walletTemp=req.body.walletamt
            req.session.totaltemp=req.session.total
           if(req.body.walletamt<=req.session.total){
            req.session.newwallAmt=0
            req.session.total=req.session.total-req.body.walletamt
           }else{
            req.session.newwallAmt=req.body.walletamt-req.session.total
            req.session.total=0
           }
                 
                    res.json({total:req.session.total,wallet:req.session.walletTemp})
               
             
        } else {
            req.session.newwallAmt=1
                req.session.total = req.session.totaltemp
                res.json({total:req.session.total,wallet:0})
                
            
            
            console.log('tttt', req.session.total);

        }
       
    }

}

module.exports = usercotrol