const currentUrl = window.location.href; // "http://localhost:3000/payment"
const currentDomain = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;


console.log(currentDomain);
let adminRoute=currentDomain


function orderCancel(userid, orderid, productName, currentsts) {
    console.log(orderid, productName,currentsts)
        fetch(`${adminRoute}/admin/ordercancel`, {
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