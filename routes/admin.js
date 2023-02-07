var express = require('express');
var router = express.Router();
const { adminHome, productDetails, orderdetails, userDetails, addproducts, editProduct, blockuser, 
         unblockUsers, post_adminhome, post_admin_addproduct, post_admin_editproduct, post_admin_deleteProduct,
            adminlogin, post_catogaryAdd, catogaryManage, editCatogary, post_updatecatogary,
             catogaryBlock, catogaryDelete } = require('../controler/admincontrol');
const { multiUpload } = require('../helpers/multer');
var db = require('../controler/databaseConfig/admin')

/* GET users listing. */
router.get('/', adminlogin);
router.get('/Home', adminHome)
router.get('/productDetails', productDetails)
router.get('/orderDetails', orderdetails)
router.get('/userDetails', userDetails)
router.get('/addProduct', addproducts)
router.get('/editProduct/:id', editProduct)
router.get('/block/:id', blockuser)
router.get('/unblock/:id', unblockUsers)
router.get('/catogaryManage', catogaryManage)
router.get('/productDelete', post_admin_deleteProduct)
router.get('/editCatogary/:id', editCatogary)
router.get('/catogaryBlock', catogaryBlock)
router.get('/catogaryDelete', catogaryDelete)
// post
router.post("/Home", post_adminhome)
router.post('/catogaryAdd', post_catogaryAdd)
router.post('/addProduct', multiUpload, post_admin_addproduct)
router.post('/editProduct/:id', multiUpload, post_admin_editproduct)
router.post('/updateCatogary/:id', post_updatecatogary)

module.exports = router;  
