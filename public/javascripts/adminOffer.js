const currentUrl = window.location.href; // "http://localhost:3000/payment"
const currentDomain = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;


console.log(currentDomain);
let userRoute=currentDomain



let val = '';
let newcoopen = document.getElementById('newCoopen')
let addWindow = document.getElementById('addwindow')
let id = document.addform.productId;
let Persantage = document.addform.ofPesantage;
let expdata = document.addform.ofexpDate;

function addoffer() {

    fetch(`${adminRoute}/admin/addoffer`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            productId: id.value,
            ofpesantage: Persantage.value,
            ofstartDateTime: new Date(),
            ofexpDate: expdata.value,

        })
    }).then((daata) => daata.json()).then((data) => {
        val = data[data.length - 1]

        newcoopen.innerHTML += `
<td>${val.productName}</td>
<td>${val.cpCode}</td>
<td>${val.cpDisamt}</td>
<td>${val.cpPurchaseAmt}</td>
<td style="width: 200px;">${val.cpstartDateTime}</td>
<td style="width: 200px;">${val.cpEndDataTime}</td>

<td><a href="/admin/listCoupon/${val.ofList}"
    onclick="return confirm('Are you sure to list ${val.ofList}')" class="btn btn-dark">List
    coupon</a></td>`


    })


    alert('offer Aded')
    newcoopen.innerHTML = ''
    id.value = ''
    cpname.value = ''
    Persantage.value = ''
    expdata.value = ''

    return false
}
function showWindow() {
    addWindow.style.display = 'block'
}
function closewindow() {
    addWindow.style.display = 'none'
}
function listCp(id, data) {
    console.log(id, data)
    fetch(`${adminRoute}/admin/listOffer`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: id, })
    }).then((data) => data.json()).then((data) => {
        location.reload()
    })
}

$(document).ready( function () {
    $('#myTable').DataTable();
} );