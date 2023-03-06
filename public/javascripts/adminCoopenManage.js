const adminRoute = 'http://localhost:3000/admin'

let val = '';
let newcoopen = document.getElementById('newCoopen')
let addWindow = document.getElementById('addwindow')
let cpname = document.addform.cpName;
let cpcode = document.addform.cpCode;
let disAmt = document.addform.cpDiscountAmt;
let pruchaseAmt = document.addform.cpMinPurchaseAmt;
let date = document.addform.expDate
function addcoopen() {
    fetch(`${adminRoute}/addCoopen`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            cpName: cpname.value,
            cpCode: cpcode.value,
            cpDisamt: disAmt.value,
            cpPurchaseAmt: pruchaseAmt.value,
            cpstartDateTime: new Date(),
            cpEndDataTime: date.value
        })
    }).then((daata) => daata.json()).then((data) => {
        val = data[data.length - 1]

        newcoopen.innerHTML += `
            <td>${val.cpName}</td>
            <td>${val.cpCode}</td>
            <td>${val.cpDisamt}</td>
            <td>${val.cpPurchaseAmt}</td>
            <td style="width: 200px;">${val.cpstartDateTime}</td>
            <td style="width: 200px;">${val.cpEndDataTime}</td>
           
            <td><a href="/admin/listCoupon/${val.cpList}"
                onclick="return confirm('Are you sure to list ${val.cpList}')" class="btn btn-dark">List
                coupon</a></td>`


    })


    alert('coopen Aded')
    newcoopen.innerHTML = ''
    cpcode.value = ''
    cpname.value = ''
    disAmt.value = ''
    pruchaseAmt.value = ''
    date.value = ''
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
    fetch(`${adminRoute}/coopelist`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: id, data: data })
    }).then((data) => data.json()).then((data) => {
        location.reload()
    })
}