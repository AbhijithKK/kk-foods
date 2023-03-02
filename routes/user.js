var express = require('express');
var router = express.Router();
var db = require('../controler/databaseConfig/users')
const { guestUserHome, login, signup, mainHome, otpPage, resendOtp,  userLogout, singleProductView,  cartDelet, profilEdit, 
    paymentAddressGet, successpage, productSearch,  addressDelete, updateAdd, addget, orderhistoryyy, orderhistoryPage, orderCanceled, onlinepayDetails,postProfileUpdate,
    PostProfileAddess, postCount, postCoopenAppply, postOtp, postUserData, postHomelogin, getCartProductadd,getForgotPassword,forgotMailCheck,
    passOtpverify, passResendOtp, passwordReset,
    loginCheck} = require('../controler/userControl');
const proImageupload = require('../helpers/profileMulter')


/* GET home page. */
router.get('/', guestUserHome)
router.get('/login', login);
// router.post('/mailerr',loginMailErr)
router.get('/signup', signup)
router.get('/home', mainHome)
router.get('/otp', otpPage)
router.get('/singleProductView', loginCheck, singleProductView)
router.get('/resendOtp', resendOtp)
router.get('/profile', loginCheck, profilEdit)
router.get('/payment', loginCheck, loginCheck, paymentAddressGet)
router.get('/success', successpage)
router.get('/cart', loginCheck, getCartProductadd)
router.get('/deleteCartitem', loginCheck, cartDelet)
router.get('/orderhistory', loginCheck, orderhistoryPage)
router.get('/getAddress', loginCheck, addget)
router.get('/forgotPassword',getForgotPassword)
// router.get('/offer_page', loginCheck, offerpage)
// post
router.post('/otp', postOtp)
router.post('/', postUserData)
router.post("/home", postHomelogin)
router.post('/updateProfile', loginCheck, proImageupload, postProfileUpdate)
router.post('/addAddress', PostProfileAddess)
// logout
router.get('/logout', userLogout)

router.post('/search', loginCheck, productSearch)
router.post("/count", loginCheck, postCount)
router.post('/addDelete', loginCheck, addressDelete)
router.post('/updateAddress', loginCheck, updateAdd)
router.post('/coopenapply', loginCheck, postCoopenAppply)
router.post('/orderHistory', loginCheck, orderhistoryyy)
router.post('/ordercancel', loginCheck, orderCanceled)
router.post('/onlinePayDetails', loginCheck, onlinepayDetails)
router.post('/forgotPasswordMailCheck',forgotMailCheck)
router.post('/passResetOtpVerify',passOtpverify)
router.post('/resendOtpPassReset',passResendOtp)
router.post('/resetPassword',passwordReset)
module.exports = router; 
