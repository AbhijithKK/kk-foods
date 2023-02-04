var express = require('express');
const { Db } = require('mongodb');
var router = express.Router();
var db = require('../dbs/users')
const { guestUserHome, login, signup, mainHome, otpPage, post_Otp, resendOtp, post_userData, post_homelogin, userLogout, singleProductView, cartProductadd, cartDelet, profilEdit, post_profileUpdate }=require('../controler/userControl');
const { cartProductAdd } = require('../dbs/users');
const proImageupload=require('../helpers/profileMulter')


/* GET home page. */
router.get('/', guestUserHome)
router.get('/login',login);
router.get('/signup',signup)
router.get('/home',mainHome )
router.get('/otp', otpPage)
router.get('/singleProductView',singleProductView)
router.get('/resendOtp',resendOtp)
// post
router.post('/otp',post_Otp)
router.post('/',post_userData ) 
router.post("/home",post_homelogin)
router.get('/cart',cartProductadd)
router.get('/deleteCartitem',cartDelet)
// logout
router.get('/logout',userLogout )


router.get('/profile',profilEdit)
 
router.post('/updateProfile',proImageupload,post_profileUpdate)
// router.post('/',(req,res)=>{
//     req.file
// })
module.exports = router; 
