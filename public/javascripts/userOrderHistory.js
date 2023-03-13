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
function orderCancel(userid, orderid, productName, currentsts) {
    let stsbn = document.getElementById(orderid)

    fetch(`${userRoute}/ordercancel`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            userid: userid,
            orderId: orderid,
            productName: productName,
            currentStatus: currentsts
        })
    }).then((data) => data.json()).then((data) => {
        location.reload()
    })
}