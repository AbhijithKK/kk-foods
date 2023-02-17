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

router.get('/catogaryBlock', catogaryBlock)
router.get('/catogaryDelete', catogaryDelete)

router.get('/coopen',(req,res)=>{
   db.coopenFind().then((result)=>{
      console.log(result);
   res.render('admin/coopenManagement',{css: [ "/stylesheets/logintemp/css/font-awesome.min.css",
                            "/stylesheets/logintemp/css/responsive.css", "/stylesheets/logintemp/css/style.css",],result})
                           }).catch((e)=>{
                              res.redirect('admin/')
                           })
})


// post
router.post('/editCatogary', editCatogary)
router.post("/Home", post_adminhome)
router.post('/catogaryAdd', post_catogaryAdd)
router.post('/addProduct', multiUpload, post_admin_addproduct)
router.post('/editProduct/:id', multiUpload, post_admin_editproduct)
router.post('/updateCatogary/:id', post_updatecatogary)
router.post('/addCoopen',(req,res)=>{
   db.coopenAdd(req.body).then((data)=>{
      res.json(data)
   }).catch((e)=>{
      res.redirect('admin/')
   })
})
router.post('/coopelist',(req,res)=>{
   db.cpList(req.body.id,req.body.data).then((data)=>{
      res.json(data)
   }).catch((e)=>{
      res.redirect('admin/')
   })
   
})

module.exports = router;  
