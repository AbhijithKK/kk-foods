var express = require('express');
var router = express.Router();
const { adminHome, productDetails, orderdetails, userDetails, addproducts, editProduct, blockuser,
    unblockUsers, post_adminhome, post_admin_addproduct, post_admin_editproduct, post_admin_deleteProduct,
    adminlogin, post_catogaryAdd, catogaryManage, editCatogary, post_updatecatogary,
    catogaryBlock, catogaryDelete, addcoopens, coopenlist, coopenPage, orederCancel, logout, offerlistAndunlist, createOffer, addeOffers, offergetpage, monthlyRevannue, updateCatogariess, post_salesReport, get_salesReport, loginCheck } = require('../controler/admincontrol');
const { multiUpload } = require('../helpers/multer');
var db = require('../controler/databaseConfig/admin')

/* GET users listing. */
router.get('/', adminlogin);
router.get('/Home', loginCheck, adminHome)
router.get('/productDetails', loginCheck, productDetails)
router.get('/orderDetails', loginCheck, orderdetails)
router.get('/userDetails', loginCheck, userDetails)
router.get('/addProduct', loginCheck, addproducts)
router.get('/editProduct/:id', loginCheck, editProduct)
router.get('/block/:id', loginCheck, blockuser)
router.get('/unblock/:id', loginCheck, unblockUsers)
router.get('/catogaryManage', loginCheck, catogaryManage)
router.get('/productDelete', loginCheck, post_admin_deleteProduct)
router.get('/catogaryBlock', loginCheck, catogaryBlock)
router.get('/catogaryDelete', loginCheck, catogaryDelete)
router.get('/coopen', loginCheck, coopenPage)
router.get('/logout', logout)
router.get('/monthlyRevanue', loginCheck, monthlyRevannue)
router.get('/offer_create', loginCheck, offergetpage)
router.get('/salesReport', loginCheck, get_salesReport)


// post
router.post('/editCatogary', loginCheck, editCatogary)
router.post("/Home", post_adminhome)
router.post('/catogaryAdd', loginCheck, post_catogaryAdd)
router.post('/addProduct', loginCheck, multiUpload, post_admin_addproduct)
router.post('/editProduct/:id', loginCheck, multiUpload, post_admin_editproduct)
router.post('/updateCatogaryss', loginCheck, post_updatecatogary)
router.post('/addCoopen', loginCheck, addcoopens)
router.post('/coopelist', loginCheck, coopenlist)
router.post('/ordercancel', loginCheck, orederCancel)
router.post('/upadeCatogatiess', loginCheck, updateCatogariess)
router.post('/listOffer', loginCheck, offerlistAndunlist)
router.post('/addoffer', loginCheck, addeOffers)
router.post('/postSalesReport', loginCheck, post_salesReport)
module.exports = router;  
