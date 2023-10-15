const nodemailer=require('nodemailer')
require('dotenv').config()

let otpVerify=(mail,otp)=>{
    return new Promise((resove,reject)=>{
        const transporter = nodemailer.createTransport({
            // service: 'gmail',
             host: 'smtp.gmail.com',
              port: 465,
               secure: true, 
             auth: {
               user:process.env.G_MAIL,
               pass:process.env.PASSW
             }
           });
           const mailOptions = {
             from:process.env.G_MAIL,
             to: mail,
             subject: 'KK foods',
             text: `Your OTP is ${otp}`
           };
           transporter.sendMail(mailOptions, function (error, info) {
             if (error) {
               console.log(error);
             } else {
               console.log('Email sent: ' + info.response);
             }
             
            
           });
    })
}
module.exports=otpVerify;