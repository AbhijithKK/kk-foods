var express = require('express');
var router = express.Router();
var db = require('../dbs/users')
// const nodemailer = require('nodemailer');
const { temp } = require('../dbs/users');
require('dotenv').config()
const mailer=require('../helpers/nodeMailer')

let  tempmail;
var mailCheck = null;
var emailNotMarch = null;
let tempData;
let otpMsg=null;
/* GET home page. */
router.get('/', (req, res) => {
  db.getProducts().then((products) => {
    res.render('user/guestHome', {
      css: ["/stylesheets/logintemp/css/bootstrap.css", "/stylesheets/logintemp/css/font-awesome.min.css", "/stylesheets/logintemp/css/responsive.css", "/stylesheets/logintemp/css/style.css",
        "https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css", "https://cdnjs.cloudflare.com/ajax/libs/jquery-nice-select/1.1.0/css/nice-select.min.css"],
      js: ['bootstrap.js', "custom.js", 'jquery-3.4.1.min.js'], products
    })

  })
})
router.get('/login', function (req, res, next) {
  if (req.session.loginId != undefined) {
    res.redirect('/home')
  } else {
    if (emailNotMarch == null) {
      var msg = null;
    } else {
      msg = emailNotMarch;
    }
    res.render('user/login', { css: ['/stylesheets/login.css', "/stylesheets/fonts/material-icon/css/material-design-iconic-font.min.css"], msg });
    emailNotMarch = null;
  }
});
router.get('/signup', (req, res) => {
  if (mailCheck == null) {
    var msg = null;
  } else {
    msg = mailCheck;
  }
  res.render('user/signup', { css: ['/stylesheets/login.css', "/stylesheets/fonts/material-icon/css/material-design-iconic-font.min.css"], msg })
  mailCheck = null;
})
router.get('/home', (req, res) => {
  db.doblock(req.session.loginId).then((resp)=>{
    console.log(resp);
    if(resp==false){
   
    if (req.session.loginId == undefined) {
      res.redirect('/login')
    } else {
      db.getProducts().then((products) => {
       
        res.render('user/home', {
          css: ["/stylesheets/logintemp/css/bootstrap.css", "/stylesheets/logintemp/css/font-awesome.min.css", "/stylesheets/logintemp/css/responsive.css", "/stylesheets/logintemp/css/style.css",
            "https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css", "https://cdnjs.cloudflare.com/ajax/libs/jquery-nice-select/1.1.0/css/nice-select.min.css"],
          js: ['bootstrap.js', "custom.js", 'jquery-3.4.1.min.js'], products
        })
      })


    }
  } else {
   
    req.session.loginId = undefined;
    res.redirect('/login')
  }

})
})
router.get('/otp', (req, res) => {
  
  let msg;
  if(otpMsg==null){
    let msg=null;
  }else{
    msg=otpMsg;
  }
  res.render('user/otp', { css: ["/stylesheets/otp.css"] ,msg})
  otpMsg=null;
  // ##############
  var countDownTime = 30000;
  var x = setInterval(function() {
 countDownTime -= 1000;
 var seconds = Math.floor((countDownTime % (1000 * 60)) / 1000);
 if (countDownTime < 0) {
   clearInterval(x);
   otp=undefined;
   console.log("main");
  
 }
}, 1000);
  // ##############
  generateOTP()
  
})
router.post('/otp',(req,res)=>{
  if(req.body.otp==otp){
    
    db.userAdd(tempData).then(()=>{
      res.redirect('/login')
    })
  }else{
    otpMsg='your enterd wrong otp'
    res.redirect('/otp')
  }
 
 })

router.get('/resendOtp',(req,res)=>{
 otp=generateOTP()
  mailer(tempmail,otp)
  res.redirect('/otp')
  console.log("reseb"+otp);

   // ##############
   var countDownTime = 30000;
   setTimeout(() => {
    otp=undefined;
    console.log("recountown");
   }, countDownTime);
   // ##############
   generateOTP()

})

const generateOTP = () => {
  return Math.floor(Math.random() * 100000);
};
let otp = generateOTP();
// post
router.post('/', (req, res) => {
  db.emailverify(req.body.email).then((resp) => {
    if (resp == null) {
      tempmail=req.body.email
    mailer(req.body.email,otp)
    console.log(otp);
    tempData=req.body
     
     
      res.redirect('/otp')
    } else {
      mailCheck = "Already have an account"
      res.redirect('/signup')
    }
  })

}) 



router.post("/home", (req, res) => {
  db.doLogin(req.body).then((result) => {
    console.log(req.session.block);
    if (result.a == true) {
      req.session.loginId = req.body.email
     
      res.redirect('/home')

    } else {
      res.redirect('/login')
    }
  }).catch((err) => {

    emailNotMarch = err
    res.redirect('/login')
  })
})

router.get('/logout', (req, res) => {
  req.session.loginId = undefined;
  res.redirect('/')
})









module.exports = router; 
