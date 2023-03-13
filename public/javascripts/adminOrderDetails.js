const currentUrl = window.location.href; // "http://localhost:3000/payment"
const currentDomain = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;


console.log(currentDomain);
let adminRoute
if (currentDomain ==  'https://kkfoods.online') {
    adminRoute='https://kkfoods.online'
}
if (currentDomain ==   'https://www.kkfoods.online') {
    adminRoute= 'https://www.kkfoods.online'
}
if (currentDomain ==    'http://3.227.231.17') {
    adminRoute=  'http://3.227.231.17'
}
if (currentDomain ==    'http://localhost:3000') {
    adminRoute= 'http://localhost:3000'
}


function orderCancel(userid, orderid, productName, currentsts) {
    console.log(orderid, productName,currentsts)
        fetch(`${adminRoute}/ordercancel`, {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userid: userid, orderId: orderid, productName: productName, currentStatus: currentsts })
        }).then((data) => data.json()).then((data) => {
            console.log(data)
            location.reload() 

        })

        return false
    
}

$(document).ready( function () {
    $('#myTable').DataTable();
} );