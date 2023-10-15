const currentUrl = window.location.href; // "http://localhost:3000/payment"
const currentDomain = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;


console.log(currentDomain);
let userRoute=currentDomain

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