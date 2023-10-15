let express = require('express');
let router = express.Router();
const { guestUserHome, login, signup, mainHome, otpPage, resendOtp, userLogout, singleProductView, cartDelet, profilEdit,
    paymentAddressGet, successpage, productSearch, addressDelete, updateAdd, addget, orderhistoryyy, orderhistoryPage, orderCanceled, onlinepayDetails, postProfileUpdate,
    PostProfileAddess, postCount, postCoopenAppply, postOtp, postUserData, postHomelogin, getCartProductadd, getForgotPassword, forgotMailCheck,
    passOtpverify, passResendOtp, passwordReset,
    loginCheck,
    walletAmtAdd, 
    errPage,
    cartResp} = require('../controller/userController');
const proImageupload = require('../helpers/profileMulter')


/* GET home page. */
router.get('/', guestUserHome)
router.get('/login', login);
router.get('/signup', signup)
router.get('/home', mainHome)
router.get('/otp', otpPage)
router.get('/singleProductView', loginCheck, singleProductView)
router.get('/resendOtp', resendOtp)
router.get('/profile', loginCheck, profilEdit)
router.get('/payment', loginCheck, loginCheck, paymentAddressGet)
router.get('/payment/success', successpage)
router.get('/cart', loginCheck, getCartProductadd)
router.get('/deleteCartitem', loginCheck, cartDelet)
router.get('/orderhistory', loginCheck, orderhistoryPage)
router.get('/getAddress', loginCheck, addget)
router.get('/forgotPassword', getForgotPassword)
router.get('/404',errPage)

// logout
router.get('/logout', userLogout)
// post
router.post('/otp', postOtp)
router.post('/', postUserData)
router.post("/home", postHomelogin)
router.post('/updateProfile', loginCheck, proImageupload, postProfileUpdate)
router.post('/addAddress', PostProfileAddess)
router.post('/search', productSearch)
router.post("/count", loginCheck, postCount)
router.post('/addDelete', loginCheck, addressDelete)
router.post('/updateAddress', loginCheck, updateAdd)
router.post('/coopenapply', loginCheck, postCoopenAppply)
router.post('/orderHistory', loginCheck, orderhistoryyy)
router.post('/ordercancel', loginCheck, orderCanceled)
router.post('/onlinePayDetails', loginCheck, onlinepayDetails)
router.post('/forgotPasswordMailCheck', forgotMailCheck)
router.post('/passResetOtpVerify', passOtpverify)
router.post('/resendOtpPassReset', passResendOtp)
router.post('/resetPassword', passwordReset)
router.post('/walletAmtAdd',loginCheck, walletAmtAdd)
module.exports = router; 
