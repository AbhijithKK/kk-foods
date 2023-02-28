var express = require('express');
var router = express.Router();
var db = require('../controler/databaseConfig/users')
const { guestUserHome, login, signup, mainHome, otpPage, post_Otp, resendOtp, post_userData, post_homelogin,
    userLogout, singleProductView, cartProductadd, cartDelet, profilEdit, post_profileUpdate,
    Post_profileAddess, paymentAddressGet, successpage, productSearch, post_count,
    addressDelete, updateAdd, addget,
    post_coopenAppply,

    orderhistoryyy,
    orderhistoryPage,
    orderCanceled,
    onlinepayDetails,
    offerpage,
    loginMailErr, 
    postProfileUpdate,
    PostProfileAddess,
    postCount,
    postCoopenAppply,
    postOtp,
    postUserData,
    postHomelogin} = require('../controler/userControl');
const proImageupload = require('../helpers/profileMulter')

function loginCheck(req, res, next) {
    if (req.session.loginId != undefined) {
        next()
    } else {
        res.redirect('/')
    }
}
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
router.get('/cart', loginCheck, cartProductadd)
router.get('/deleteCartitem', loginCheck, cartDelet)
router.get('/orderhistory', loginCheck, orderhistoryPage)
router.get('/getAddress', loginCheck, addget)
router.get('/offer_page', loginCheck, offerpage)
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

module.exports = router; 
