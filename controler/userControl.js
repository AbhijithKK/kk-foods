

const db = require('./databaseConfig/users')
const mailer = require('../helpers/nodeMailer');
const { json } = require('express');

let emailNotMarchc = null;
let tempmail;
let mailCheck = null;
var emailNotMarch = null;
let tempData;
let otpMsg = null;
let userId = null;
let total = 0;
let cartProducts;


const generateOTP = () => {
    return Math.floor(Math.random() * 100000);
};
let otp = generateOTP();
//######### user contol start##########
let usercotrol = {
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
                            res.redirect('/login')
                        } else {
                            db.getProducts().then((products) => {
                                userId = resp._id;
                                db.profile(userId).then(async (userData) => {
                                    console.log('imageeeee', userData);

                                    if (userData.image != null) {
                                        if (userData.image.proImage != null) {

                                            proImag = await userData.image.proImage[0].filename;
                                        } else {
                                            proImag = null
                                        }

                                    } else {
                                        proImag = null
                                    }


                                    res.render('user/home', {
                                        css: ["/stylesheets/logintemp/css/bootstrap.css", "/stylesheets/logintemp/css/font-awesome.min.css",
                                            "/stylesheets/logintemp/css/responsive.css", "/stylesheets/logintemp/css/style.css",
                                            "https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css",
                                            "https://cdnjs.cloudflare.com/ajax/libs/jquery-nice-select/1.1.0/css/nice-select.min.css"],
                                        js: ['bootstrap.js', "custom.js", 'jquery-3.4.1.min.js'], products, proImag, userData
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
    post_Otp: (req, res) => {
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
    post_userData: (req, res) => {
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
    post_homelogin: (req, res) => {
        try {
            db.doLogin(req.body).then((result) => {
                console.log(req.session.block);
                if (result.a == true) {
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
            if (req.session.loginId != undefined) {

                db.getCatogaryProducts(req.query.catogery).then((data) => {
                    let brg;
                    let piz;
                    let chk;
                    console.log(data[0].productCatogary);
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
                    db.profile(userId).then(async (userData) => {
                        console.log('imageeeee', userData);

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
            } else {
                res.redirect('/login')
            }
        } catch (e) {
            res.redirect('/')
        }
    },
    cartProductadd: (req, res) => {
        try {
            if (req.session.loginId != undefined) {

                db.cartProductAdd(req.query.productId, userId).then((product) => {
                    let totalcartCount = product.length;
                    db.profile(userId).then(async (userData) => {
                        req.session.userDetails = userData
                        for (let i = 0; i < product.length; i++) {
                            for (let j = 0; j < userData.cart.length; j++) {
                                if (product[i]._id == userData.cart[j].productId) {
                                    product[i].count = userData.cart[j].quantity
                                }
                            }
                        }
                        if (total != 0) {
                            total = 0
                        }
                        for (let i = 0; i < product.length; i++) {
                            for (let j = 0; j < userData.cart.length; j++) {
                                if (product[i]._id == userData.cart[j].productId) {
                                    total += product[i].productPrize * product[i].count
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

                        console.log('countssss', product);

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
            } else {
                res.redirect('/login')
            }
        } catch (e) {
            res.redirect('/')
        }

    },
    userLogout: (req, res) => {
        total = 0;
        req.session.loginId = undefined;
        res.redirect('/')
    },
    cartDelet: (req, res) => {
        try {
            if (req.session.loginId != undefined) {
                db.delCartitem(userId, req.query.id).then((ress => {
                    res.redirect('/cart')
                })).catch((err) => {
                    res.redirect('/')
                })
            } else {
                res.redirect('/login')
            }
        } catch (e) {
            res.redirect('/')
        }
    },

    profilEdit: (req, res) => {
        try {
            if (req.session.loginId != undefined) {
                db.profile(userId).then((userData) => {
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
            } else {
                res.redirect('/login')
            }
        } catch (e) {
            res.redirect('/')
        }
    },
    post_profileUpdate: (req, res) => {
        try {

            db.emailverify(req.body.proEmail).then((resp) => {

                if (resp == null || resp.email == null) {
                    console.log(' in post profile update', resp);

                    db.profileUpdate(userId, req.body, req.files).then((resp) => {
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
    Post_profileAddess: (req, res) => {
        try {
            if (req.session.loginId != undefined) {
                db.address(userId, req.body).then((resp) => {
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
                db.address(userId).then((addr) => {

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
    post_count: (req, res) => {
        try {
            db.cartCount(userId, req.body.countValue, req.body.proId).then((result) => {
                res.json(result)
            })

        } catch (e) {
            res.redirect('/')
        }
    },
    addressDelete: (req, res) => {
        try {
            db.adddelete(userId, req.body).then((resp) => {
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

            db.updateaddress(userId, req.body).then((data) => {
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
            db.getAddress(userId).then((data) => {
                res.json(data)
            })
        } catch (e) {
            res.redirect('/')
        }
    },
    post_coopenAppply: (req, res) => {
        db.coopenFind(req.body.cpApply).then((data) => {
            console.log(data);
            let results = {}
            if (data != null) {
                if (data.cpList == 'Unlist') {
                    if (total > data.cpPurchaseAmt) {
                        if (new Date() < new Date(data.cpEndDataTime)) {
                            let amt = total - data.cpDisamt
                            results = { disAmt: parseInt(data.cpDisamt), amt: amt }
                        } else {
                            results = { msg: 'coopen date expired', oldVal: total }
                        }
                    } else {
                        results = { msg: 'purchase the given amount', oldVal: total }
                    }
                } else {
                    results = { msg: 'coopen blocked', oldVal: total }
                }
            } else {
                results = { msg: 'enter valid coopen', oldVal: total }
            }
            res.json(results)

        })
    }


}
module.exports = usercotrol