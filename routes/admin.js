let express = require('express');
let router = express.Router();
const { adminHome, productDetails, orderdetails, userDetails, addproducts, editProduct, blockuser,
    unblockUsers, adminlogin, catogaryManage, editCatogary,
    catogaryBlock, catogaryDelete, addcoopens, coopenlist, coopenPage, orederCancel, logout, offerlistAndunlist,
    addeOffers, offergetpage, monthlyRevannue, updateCatogariess, loginCheck, getSalesReport, postSalesReport,
    postAdminhome, postUpdatecatogary, postCatogaryAdd, postAdminDeleteProduct, postAdminEditproduct,
    postAdminAddproduct,
    singleImageDelete,
    postSingleImageAdd } = require('../controller/adminController');
const { multiUpload } = require('../helpers/multer');

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
router.get('/productDelete', loginCheck, postAdminDeleteProduct)
router.get('/catogaryBlock', loginCheck, catogaryBlock)
router.get('/catogaryDelete', loginCheck, catogaryDelete)
router.get('/coopen', loginCheck, coopenPage)
router.get('/logout', logout)
router.get('/monthlyRevanue', loginCheck, monthlyRevannue)
router.get('/offer_create', loginCheck, offergetpage)
router.get('/salesReport', loginCheck, getSalesReport)


// post
router.post('/editCatogary', loginCheck, editCatogary)
router.post("/Home", postAdminhome)
router.post('/catogaryAdd', loginCheck, postCatogaryAdd)
router.post('/addProduct', loginCheck, multiUpload, postAdminAddproduct)
router.post('/editProduct/:id', loginCheck, multiUpload, postAdminEditproduct)
router.post('/updateCatogaryss', loginCheck, postUpdatecatogary)
router.post('/addCoopen', loginCheck, addcoopens)
router.post('/coopelist', loginCheck, coopenlist)
router.post('/ordercancel', loginCheck, orederCancel)
router.post('/upadeCatogatiess', loginCheck, updateCatogariess)
router.post('/listOffer', loginCheck, offerlistAndunlist)
router.post('/addoffer', loginCheck, addeOffers)
router.post('/postSalesReport', loginCheck, postSalesReport)
router.post('/proSingleImageDelete', loginCheck, singleImageDelete)
router.post('/imageAdd', loginCheck, multiUpload, postSingleImageAdd)
module.exports = router;
