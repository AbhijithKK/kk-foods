
var express = require('express');
var router = express.Router();
var db = require('./databaseConfig/admin')
let { ids } = require('../helpers/multer')
let catogarydetails = null;

let admincontrol = {

    adminlogin: function (req, res, next) {
        try {
            if (req.session.adminLogin == undefined) {
                res.render('admin/adminLogin')
            } else {
                res.redirect('/admin/Home')
            }
        } catch (e) {
            res.redirect('/admin/')
        }
    },
    adminHome: (req, res) => {
        try {
            if (req.session.adminLogin != undefined) {
                res.render('admin/adminHome')

            } else {
                res.redirect('/admin/')
            }
        } catch (e) {
            res.redirect('/admin/')
        }
    },
    productDetails: (req, res) => {
        try {
            if (req.session.adminLogin != undefined) {
                db.showProducts().then((product) => {

                    res.render('admin/productDetails', { product })
                }).catch((err) => {
                    res.redirect('/admin/')
                })

            } else {
                res.redirect('/admin/')
            }
        } catch (e) {
            res.redirect('/admin/')
        }
    },
    orderdetails: (req, res) => {
        try {
            if (req.session.adminLogin != undefined) {
                res.render('admin/orderDetails')
            } else {
                res.redirect('/admin/')
            }
        } catch (e) {
            res.redirect('/admin/')
        }
    },
    userDetails: (req, res) => {
        try {
            if (req.session.adminLogin != undefined) {
                db.userData().then((result) => {

                    res.render('admin/userDetails', { result })
                }).catch((err) => {
                    res.redirect('/admin/')
                })

            } else {
                res.redirect('/admin/')
            }
        } catch (e) {
            res.redirect('/admin/')
        }
    }, addproducts: (req, res) => {
        try {
            if (req.session.adminLogin != undefined) {
                db.showCatogary().then((cat) => {
                    let data = [];
                    for (let i = 0; i < cat.length; i++) {
                        if (cat[i].block == 'unBlock') {
                            data.push(cat[i])
                        }
                    }

                    res.render('admin/addProduct', { data })
                }).catch((err) => {
                    res.redirect('/admin/')
                })

            } else {
                res.redirect('/admin/')
            }
        } catch (e) {
            res.redirect('/admin/')
        }
    },
    editProduct: (req, res) => {
        try {
            if (req.session.adminLogin != undefined) {
                db.editProduct(req.params.id).then((data) => {
                    db.showCatogary().then((cat) => {
                        let datas = [];
                        for (let i = 0; i < cat.length; i++) {
                            if (cat[i].block == 'unBlock') {
                                datas.push(cat[i])
                            }
                        }
                        res.render('admin/editProduct', { data, datas })
                    }).catch((err) => {
                        res.redirect('/admin/')
                    })
                })
            } else {
                res.redirect('/admin/')
            }
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
    post_adminhome: (req, res) => {
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
    post_admin_addproduct: (req, res) => {
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
    post_admin_editproduct: (req, res) => {
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
    post_admin_deleteProduct: (req, res) => {
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
    post_catogaryAdd: (req, res) => {
        try {
            db.catogatyAdd(req.body.catogaryAdd).then((resp) => {
                res.redirect('/admin/catogaryManage')
            }).catch((err) => {
                res.redirect('/admin/')
            })
        } catch (e) {
            res.redirect('/admin/')
        }
    },
    catogaryManage: (req, res) => {
        try {
            if (req.session.adminLogin != undefined) {
                db.showCatogary().then((catogary) => {
                    let data;
                    if (catogarydetails == null) {
                        data = null
                    } else {
                        data = catogarydetails
                    }
                    res.render('admin/catogaryManage', { catogary, data })
                    catogarydetails = null;
                }).catch((err) => {
                    res.redirect('/admin/')
                })
            } else {
                res.redirect('/admin/')
            }
        } catch (e) {
            res.redirect('/admin/')
        }
    },
    editCatogary: (req, res) => {
        try {
            if (req.session.adminLogin != undefined) {
                db.findCatogary(req.params.id).then((data) => {
                    catogarydetails = data
                    res.redirect('/admin/catogaryManage')
                }).catch((err) => {
                    res.redirect('/admin/')
                })
            } else {
                res.redirect('/admin/')
            }
        } catch (e) {
            res.redirect('/admin/')
        }
    },
    post_updatecatogary: (req, res) => {
        try {
            console.log("update", req.body.catogaryAdd);
            db.updateCatogary(req.params.id, req.body.catogaryAdd).then((resp) => {
                res.redirect("/admin/catogaryManage")
            }).catch((err) => {
                res.redirect('/admin/')
            })
        } catch (e) {
            res.redirect('/admin/')
        }
    },
    catogaryBlock: (req, res) => {
        try {
            if (req.session.adminLogin != undefined) {

                let val = "unBlock";
                if (req.query.delet == "unBlock") {
                    val = "block"
                }
                db.blockCatogary(req.query.id, val).then((ress) => {
                    res.redirect("/admin/catogaryManage")
                }).catch((err) => {
                    res.redirect('/admin/')
                })
            } else {
                res.redirect('/admin/')
            }
        } catch (e) {
            res.redirect('/admin/')
        }
    },
    catogaryDelete: (req, res) => {
        try {
            if (req.session.adminLogin != undefined) {
                db.deleteCatogary(req.query.id).then(() => {
                    res.redirect("/admin/catogaryManage")
                }).catch((err) => {
                    res.redirect('/admin/')
                })
            } else {
                res.redirect('/admin/')
            }
        } catch (e) {
            res.redirect('/admin/')
        }
    }

}

module.exports = admincontrol;