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
let emailss = document.getElementById('emailVerify')
function mailchecker() {
    console.log(emailss.value)
    fetch(`${userRoute}/`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ Emailverify: emailss.value })
    }).then((data) => data.json()).then((data) => {
        document.getElementById('emailMsg').innerHTML = data
    })
    document.getElementById('emailMsg').innerHTML = ''
}
var names = document.form.name1;
var pass = document.form.password;
var re_pass = document.form.re_password;
function valid() {
    if (names.value.charCodeAt() == 32 || name.value == '') {
        document.getElementById('namep').innerHTML = "enter your full name"
        return false;
    }
    document.getElementById('namep').innerHTML = ""
    if (pass.value.length < 5) {
        document.getElementById('pass1').innerHTML = "password must 6 letter or above"
        return false;
    }
    document.getElementById('pass1').innerHTML = ""
    if (re_pass.value.length < 5) {
        document.getElementById('pass2').innerHTML = "password must 6 letter or above"
        return false;
    }
    document.getElementById('pass2').innerHTML = ""
    if (re_pass.value !== pass.value) {
        document.getElementById('pass2').innerHTML = "password not matched"
        return false;
    }
    document.getElementById('pass2').innerHTML = ""
}