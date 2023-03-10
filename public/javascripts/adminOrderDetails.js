const adminRoute = 'http://localhost:3000/admin'


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