var express = require('express');
var router = express.Router();
var db = require('../dbs//admin')
const path=require('path')
const multer=require('multer')


/* GET users listing. */
router.get('/', function (req, res, next) {
  if (req.session.adminLogin == undefined) {
    res.render('admin/adminLogin')
  } else {
    res.redirect('/admin/Home')
  }
});
router.get('/Home', (req, res) => {
  if (req.session.adminLogin != undefined) {
    res.render('admin/adminHome')

  } else {
    res.redirect('/admin/')
  }
}) 
router.get('/productDetails', (req, res) => {
  if (req.session.adminLogin != undefined) {
    db.showProducts().then((product)=>{
      
      res.render('admin/productDetails',{product})
    })
    
  } else {
    res.redirect('/admin/')
  }
})
router.get('/orderDetails', (req, res) => {
  if (req.session.adminLogin != undefined) {
    res.render('admin/orderDetails')
  } else {
    res.redirect('/admin/')
  }
})
router.get('/userDetails', (req, res) => {
  if (req.session.adminLogin != undefined) {
    db.userData().then((result) => {

      res.render('admin/userDetails', { result })
    })

  } else {
    res.redirect('/admin/')
  }
})
router.get('/addProduct', (req, res) => {
  if (req.session.adminLogin != undefined) {
    

      res.render('admin/addProduct')
   

  } else {
    res.redirect('/admin/')
  }
})


router.get('/editProduct/:id', (req, res) => {
  
  if (req.session.adminLogin != undefined) {
    db.editProduct(req.params.id).then((data)=>{
      res.render('admin/editProduct',{data})
    })
  } else {
    res.redirect('/admin/')
  }
})
router.get('/block/:id', (req, res) => {
  db.blockUser(req.params.id).then((block) => {

    res.redirect('/admin/userDetails')
  })
})
router.get('/unblock/:id', (req, res) => {
  db.unblockUser(req.params.id).then((unblock) => {

    res.redirect('/admin/userDetails')
  })
})


// post
router.post("/Home", (req, res) => {
  db.adminLogin(req.body).then((result) => {
    if (result !=true ) {
      res.redirect('/admin/')
 
    } else {
      
      req.session.adminLogin = req.body.name
      res.redirect('/admin/Home')
    }
  }).catch((err)=>{
    res.redirect('/admin/Home')
  })
})

let ids=[];
// multer start
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null,'public/images/')
  },
  filename: function (req, file, cb) {
   const uniqueSuffix = Date.now()
   ids.push(file.fieldname + '-' + uniqueSuffix)
      cb(null, file.fieldname + '-' + uniqueSuffix+'.jpg',)

  }
})
const upload = multer({ storage: storage })
const multiUpload=upload.fields([{name:'image1',maxCount:1},{name:'image2',maxCount:3}])
// multer end

router.post('/addProduct',multiUpload,(req,res)=>{
  
  db.addProduct(req.body,ids).then((id)=>{ 
    ids=[];
    res.redirect('/admin/addProduct')
  })
})

router.post('/editProduct/:id',multiUpload,(req,res)=>{
  db.updateProduct(req.params.id,req.body,ids).then((resp)=>{
    ids=[];
    res.redirect('/admin/productDetails')
  })
})

router.get('/productDelete',(req,res)=>{
  let flaged=req.query.delet;
  let flg;
  if(flaged=="unflage" || flaged==''){
    flg="flage";
  }else{
    flg="unflage";
  }
db.deleteProduct(req.query.id,flg).then((resp)=>{

  res.redirect('/admin/productDetails')
})
})
module.exports = router; 
 