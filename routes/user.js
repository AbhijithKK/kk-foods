var express = require('express');
var router = express.Router();
var db = require('../controler/databaseConfig/users')
const { guestUserHome, login, signup, mainHome, otpPage, post_Otp, resendOtp, post_userData, post_homelogin,
        userLogout, singleProductView, cartProductadd, cartDelet, profilEdit, post_profileUpdate,
        Post_profileAddess,
        paymentAddressGet,
        successpage, 
        productSearch} = require('../controler/userControl');
const proImageupload = require('../helpers/profileMulter')


/* GET home page. */
router.get('/', guestUserHome)
router.get('/login', login);
router.get('/signup', signup)
router.get('/home', mainHome)
router.get('/otp', otpPage)
router.get('/singleProductView', singleProductView)
router.get('/resendOtp', resendOtp)
router.get('/profile', profilEdit)
router.get('/payment', paymentAddressGet)
router.get('/success', successpage)
// post
router.post('/otp', post_Otp)
router.post('/', post_userData)
router.post("/home", post_homelogin)
router.get('/cart', cartProductadd)
router.get('/deleteCartitem', cartDelet)
router.post('/updateProfile', proImageupload, post_profileUpdate)
router.post('/addAddress', Post_profileAddess)
// logout
router.get('/logout', userLogout)

router.post('/search',productSearch )


module.exports = router; 
