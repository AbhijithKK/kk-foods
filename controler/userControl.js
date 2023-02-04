var express = require('express');
// var router = express.Router();
var db = require('../dbs/users')
const mailer = require('../helpers/nodeMailer')

let emailNotMarchc=null;
let tempmail;
var mailCheck = null;
var emailNotMarch = null;
let tempData;
let otpMsg = null;
let userId=null;
const generateOTP = () => {
    return Math.floor(Math.random() * 100000);
};
let otp = generateOTP();

let usercotrol = {
    guestUserHome: (req, res) => {
        if (req.session.loginId != undefined) {
            res.redirect('/home')
        } else {
        db.getProducts().then((products) => {
            res.render('user/guestHome', {
                css: ["/stylesheets/logintemp/css/bootstrap.css", "/stylesheets/logintemp/css/font-awesome.min.css", "/stylesheets/logintemp/css/responsive.css", "/stylesheets/logintemp/css/style.css",
                    "https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css", "https://cdnjs.cloudflare.com/ajax/libs/jquery-nice-select/1.1.0/css/nice-select.min.css"],
                js: ['bootstrap.js', "custom.js", 'jquery-3.4.1.min.js'],
                 products
            })
        
        })
      }
    },
    login: function (req, res, next) {
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
    },
    signup: (req, res) => {
        if (mailCheck == null) {
            var msg = null;
        } else {
            msg = mailCheck;
        }
        res.render('user/signup', { css: ['/stylesheets/login.css', "/stylesheets/fonts/material-icon/css/material-design-iconic-font.min.css"], msg })
        mailCheck = null;
    },
    mainHome: (req, res) => {
        db.doblock(req.session.loginId).then((resp) => {
        if(resp!=null){
            if (resp.block!='unBlock' || !res.block) {

                if (req.session.loginId == undefined) {
                    res.redirect('/login')
                } else {
                    db.getProducts().then((products) => {
                        userId=resp._id;
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
        }else{
            res.redirect('/login')
        }
        })
    },
    otpPage: (req, res) => {

        let msg;
        if (otpMsg == null) {
            let msg = null;
        } else {
            msg = otpMsg;
        }
        res.render('user/otp', { css: ["/stylesheets/otp.css"], msg })
        otpMsg = null;
        // ##############
        var countDownTime = 30000;
        var x = setInterval(function () {
            countDownTime -= 1000;
            var seconds = Math.floor((countDownTime % (1000 * 60)) / 1000);
            if (countDownTime < 0) {
                clearInterval(x);
                otp = undefined;
                console.log("main");
            }
        }, 1000);
        // ##############
        generateOTP()
    },
    resendOtp: (req, res) => {
        otp = generateOTP()
        mailer(tempmail, otp)
        res.redirect('/otp')
        console.log("reseb" + otp);

        // ##############
        var countDownTime = 30000;
        setTimeout(() => {
            otp = undefined;
            console.log("recountown");
        }, countDownTime);
        // ##############
        generateOTP()

    },
    post_Otp: (req, res) => {
        if (req.body.otp == otp) {

            db.userAdd(tempData).then(() => {
                res.redirect('/login')
            })
        } else {
            otpMsg = 'your enterd wrong otp'
            res.redirect('/otp')
        }

    },
    post_userData: (req, res) => {
        db.emailverify(req.body.email).then((resp) => {
            if (resp == null) {
                tempmail = req.body.email
                mailer(req.body.email, otp)
                console.log(otp);
                tempData = req.body


                res.redirect('/otp')
            } else {
                mailCheck = "Already have an account"
                res.redirect('/signup')
            }
        })

    },
    post_homelogin: (req, res) => {
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
    },
    singleProductView:(req,res)=>{
        if (req.session.loginId != undefined) {
          
        db. getCatogaryProducts(req.query.catogery).then((data)=>{
          let brg;
          let piz;
          let chk;
          console.log(data[0].productCatogary);
          if(data[0].productCatogary=='burger'){
            brg="active"
            piz=null;
            chk=null;
      
          }else if(data[0].productCatogary=='pizza'){
            piz="active"
            brg=null;
            chk=null;
          }else if(data[0].productCatogary=='chiken'){
            chk="active"
            piz=null;
            brg=null;
          }
        res.render('user/singleProductview',{css: ["/stylesheets/logintemp/css/bootstrap.css", "/stylesheets/logintemp/css/font-awesome.min.css", "/stylesheets/logintemp/css/responsive.css", "/stylesheets/logintemp/css/style.css",
        "https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css", "https://cdnjs.cloudflare.com/ajax/libs/jquery-nice-select/1.1.0/css/nice-select.min.css"],
        js: ['bootstrap.js', "custom.js", 'jquery-3.4.1.min.js'],data,brg,piz,chk})
      })
        }else{
          res.redirect('/login')
        }
      },
      cartProductadd:(req,res)=>{
        if (req.session.loginId != undefined) {
        db.cartProductAdd(req.query.productId,userId).then((product)=>{
           
       
        res.render('user/cart',{css: ["/stylesheets/logintemp/css/bootstrap.css", "/stylesheets/logintemp/css/font-awesome.min.css", "/stylesheets/logintemp/css/responsive.css", "/stylesheets/logintemp/css/style.css",
        "https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css", "https://cdnjs.cloudflare.com/ajax/libs/jquery-nice-select/1.1.0/css/nice-select.min.css"],
        js: ['bootstrap.js', "custom.js", 'jquery-3.4.1.min.js'],product})
      }).catch((err)=>{
        res.redirect('/cart')
      })
    }else{
        res.redirect('/login')
      }

      },
    userLogout: (req, res) => {
       
        req.session.loginId = undefined;
        res.redirect('/')
    } ,
    cartDelet:(req,res)=>{
        if (req.session.loginId != undefined) {
        db.delCartitem(userId,req.query.id).then((ress=>{
          res.redirect('/cart')
        }))
    }else{
        res.redirect('/login')
      }
      },
     
      profilEdit:(req,res)=>{
        if (req.session.loginId != undefined) {
        db.profile(userId).then((userData)=>{
            let proImag=null;
            if(userData.image!=null){
                
            proImag=userData.image.proImage[0].filename;
            }
            

            
      if(emailNotMarchc!=null){
        emailNotMarchc=emailNotMarch
      }
        res.render('user/profilePage',{css: ["/stylesheets/logintemp/css/bootstrap.css", "/stylesheets/logintemp/css/font-awesome.min.css", "/stylesheets/logintemp/css/responsive.css", "/stylesheets/logintemp/css/style.css",
        "https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css", "https://cdnjs.cloudflare.com/ajax/libs/jquery-nice-select/1.1.0/css/nice-select.min.css",'/stylesheets/profile.css'],
        js: ['bootstrap.js', "custom.js", 'jquery-3.4.1.min.js'],userData,emailNotMarch,proImag})
    })
    emailNotMarchc=null
}else{
    res.redirect('/login')
  }
    },post_profileUpdate:(req,res)=>{
        db.emailverify(req.body.proEmail).then((resp)=>{
            console.log('//////',resp);
            if(resp.email==null || resp.email==''){
                
                db.profileUpdate(userId,req.body,req.files).then((resp)=>{
                    res.redirect('/profile')
                   })
                }else{
                    emailNotMarchc="already exist";
                    res.redirect('/profile')
                }
        })
       
        
     }
}
module.exports = usercotrol