const currentUrl = window.location.href; // "http://localhost:3000/payment"
const currentDomain = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;


console.log(currentDomain);
let userRoute
if (currentDomain ==  'https://kkfoods.online') {
    userRoute='https://kkfoods.online'
}
if (currentDomain ==   'https://www.kkfoods.online') {
    userRoute= 'https://www.kkfoods.online'
}
if (currentDomain ==    'http://3.227.231.17') {
    userRoute=  'http://3.227.231.17'
}
if (currentDomain ==    'http://localhost:3000') {
    userRoute= 'http://localhost:3000'
}

document.passForm.style.display = 'none'
document.otpForm.style.display = 'none'
let mail = document.mailForm.email
let otp = document.otpForm.otp
let passw1 = document.passForm.pass1;
let passw2 = document.passForm.pass2;
function mailsubmit() {
    console.log(mail.value)
    fetch(`${userRoute}/forgotPasswordMailCheck`, {
        method: 'post',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: mail.value })
    }).then((data) => data.json()).then((data) => {

        if (data == true) {
            document.getElementById('errmsg').innerHTML = ''
            document.mailForm.style.display = 'none'
            document.otpForm.style.display = 'block'
            //countdown
            document.getElementById("unhide").style.display = "none"
            var countDownTime = 60000;
            var x = setInterval(function () {
                countDownTime -= 1000;
                var seconds = Math.floor((countDownTime % (1000 * 60)) / 1000);
                document.getElementById("countdown").innerHTML = "otp expire in " + seconds + "s ";
                if (countDownTime < 0) {
                    clearInterval(x);
                    document.getElementById("countdown").innerHTML = ""
                    document.getElementById("unhide").style.display = "block";
                }
            }, 1000);
            //countdown
            return false
        } else {
            document.getElementById('errmsg').innerHTML = 'Plese Enter Linked Email Address'
            return false
        }
        document.getElementById('errmsg').innerHTML = ''
    })
    return false
}

function otpEnter() {
    fetch(`${userRoute}/passResetOtpVerify`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ otp: otp.value })
    }).then((data) => data.json()).then((data) => {
        console.log(data)
        if (data.data != false) {
            document.otpForm.style.display = 'none'
            document.passForm.style.display = 'block'

            return false
        } else {
            document.getElementById('otperrmsg').innerHTML = 'Enter valid OTP'

            return false
        }
        document.getElementById('otperrmsg').innerHTML = ''
    })
    return false
}

function resendOtp() {
    fetch(`${userRoute}/resendOtpPassReset`, {
        method: 'post',
        headers: {
            "Content-Type": "application/json"
        },
    }).then((data) => data.json()).then((data) => {

        //countdown
        document.getElementById("unhide").style.display = "none"
        var countDownTime = 60000;
        var x = setInterval(function () {
            countDownTime -= 1000;
            var seconds = Math.floor((countDownTime % (1000 * 60)) / 1000);
            document.getElementById("countdown").innerHTML = "otp expire in " + seconds + "s ";
            if (countDownTime < 0) {
                clearInterval(x);
                document.getElementById("countdown").innerHTML = ""
                document.getElementById("unhide").style.display = "block";
            }
        }, 1000);
        //countdown
    })
    return false
}
function passEnter() {
    if (passw1.value.length < 5 || passw1.value.charCodeAt() == 32) {
        document.getElementById('pass1txt').innerHTML = "password must 6 letter or above"
        return false;
    }
    if (passw2.value.length < 5) {
        document.getElementById('pass2txt').innerHTML = "password must 6 letter or above"
        return false;
    }
    document.getElementById('pass2txt').innerHTML = ""
    if (passw2.value !== passw1.value) {
        document.getElementById('pass2txt').innerHTML = "password not matched"
        return false;
    }
    document.getElementById('pass2txt').innerHTML = ""

    if (passw2.value == passw1.value) {
        fetch(`${userRoute}/resetPassword`, {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ pass1: passw1.value, pass2: passw2.value })
        }).then((data) => data.json()).then((data) => {
            console.log('hii')
            location.href = `${userRoute}/login`
        })
        return false
    }
    return false
}