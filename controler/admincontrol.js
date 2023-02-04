
var express = require('express');
var router = express.Router();
var db = require('../dbs/admin')
let {ids}=require('../helpers/multer')
let catogarydetails = null;

let admincontrol = {
    adminlogin: function (req, res, next) {
        if (req.session.adminLogin == undefined) {
            res.render('admin/adminLogin')
        } else {
            res.redirect('/admin/Home')
        }
    },
    adminHome: (req, res) => {
        if (req.session.adminLogin != undefined) {
            res.render('admin/adminHome')

        } else {
            res.redirect('/admin/')
        }
    },
    productDetails: (req, res) => {
        if (req.session.adminLogin != undefined) {
            db.showProducts().then((product) => {

                res.render('admin/productDetails', { product })
            })

        } else {
            res.redirect('/admin/')
        }
    },
    orderdetails: (req, res) => {
        if (req.session.adminLogin != undefined) {
            res.render('admin/orderDetails')
        } else {
            res.redirect('/admin/')
        }
    },
    userDetails: (req, res) => {
        if (req.session.adminLogin != undefined) {
            db.userData().then((result) => {

                res.render('admin/userDetails', { result })
            })

        } else {
            res.redirect('/admin/')
        }
    }, addproducts: (req, res) => {
        if (req.session.adminLogin != undefined) {
            db.showCatogary().then((cat)=>{
                let data=[];
                for(let i=0;i<cat.length;i++){
                     if(cat[i].block=='unBlock'){
                         data.push(cat[i])
                     }
                }

            res.render('admin/addProduct',{data})
        })

        } else {
            res.redirect('/admin/')
        }
    },
    editProduct: (req, res) => {

        if (req.session.adminLogin != undefined) {
            db.editProduct(req.params.id).then((data) => {
                db.showCatogary().then((cat)=>{
                    let datas=[];
                    for(let i=0;i<cat.length;i++){
                         if(cat[i].block=='unBlock'){
                             datas.push(cat[i])
                         }
                    }
                res.render('admin/editProduct', { data,datas })
                })
            })
        } else {
            res.redirect('/admin/')
        }
    },
    blockuser: (req, res) => {
        db.blockUser(req.params.id).then((block) => {

            res.redirect('/admin/userDetails')
        })
    },
    unblockUsers: (req, res) => {
        db.unblockUser(req.params.id).then((unblock) => {

            res.redirect('/admin/userDetails')
        })
    },
    post_adminhome: (req, res) => {
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
    },
    post_admin_addproduct: (req, res) => {

        db.addProduct(req.body, req.files).then((id) => {
            
            res.redirect('/admin/addProduct')
        })
    },
    post_admin_editproduct: (req, res) => {
        db.updateProduct(req.params.id, req.body, req.files).then((resp) => {
            
            res.redirect('/admin/productDetails')
        })
    },
    post_admin_deleteProduct: (req, res) => {
        let flaged = req.query.delet;
        let flg;
        if (flaged == "unflage" || flaged == '') {
            flg = "flage";
        } else {
            flg = "unflage";
        }
        db.deleteProduct(req.query.id, flg).then((resp) => {

            res.redirect('/admin/productDetails')
        })
    },
    post_catogaryAdd:(req,res)=>{
        db.catogatyAdd(req.body.catogaryAdd).then((resp)=>{
            res.redirect('/admin/catogaryManage')
        })
    },
    catogaryManage:(req, res) => {
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
            })
        } else {
            res.redirect('/admin/')
        }
    },
    editCatogary:(req, res) => {
        if (req.session.adminLogin != undefined) {
            db.findCatogary(req.params.id).then((data) => {
                catogarydetails = data
                res.redirect('/admin/catogaryManage')
            })
        } else {
            res.redirect('/admin/')
        }
    },
    post_updatecatogary:(req, res) => {
        console.log("update", req.body.catogaryAdd);
        db.updateCatogary(req.params.id, req.body.catogaryAdd).then((resp) => {
            res.redirect("/admin/catogaryManage")
        })
    
    },
    catogaryBlock:(req, res) => {
        if (req.session.adminLogin != undefined) {
    
            let val = "unBlock";
            if (req.query.delet == "unBlock") {
                val = "block"
            }
            db.blockCatogary(req.query.id, val).then((ress) => {
                res.redirect("/admin/catogaryManage")
            })
        } else {
            res.redirect('/admin/')
        }
    },
    catogaryDelete:(req, res) => {
        if (req.session.adminLogin != undefined) {
            db.deleteCatogary(req.query.id).then(() => {
                res.redirect("/admin/catogaryManage")
            })
        } else {
            res.redirect('/admin/')
        }
    }
}

module.exports = admincontrol;