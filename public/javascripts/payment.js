let alet = document.getElementById('alertWindow')
let paymentMethod = document.radiobtns.payment
let onlinePay = document.getElementById('onlinePayment')
let cod = document.getElementById('cashOnDelivery')
let coopencode = document.coopenForm.couponCode;
let editform = document.getElementById('hiddeneditform')
let proForm = document.getElementById('profileforms')
let Aname = document.addform.addName
let Aadd = document.addform.addAddress
let Apin = document.addform.addPin
let Amob = document.addform.addMob
let Aplace = document.addform.addPlace
let hideFM = document.getElementById("hiddenform")
let section = '';
let addShow = document.getElementById('addshow')
let addText = document.getElementById('addressText')
let addBtn = document.getElementById('addressButton')

let Editname = document.editform.addName;
let EditAddress = document.editform.addAddress;
let EditPin = document.editform.addPin;
let EditMob = document.editform.addMob;
let EditPlace = document.editform.addPlace;

let nme, adr, pn, mbl, plc;
function editForm(name, address, pin, mob, place) {
    nme = name;
    adr = address;
    pn = pin;
    mbl = mob;
    plc = place;
    Editname.value = name;
    EditAddress.value = address;
    EditPin.value = pin;
    EditMob.value = mob;
    EditPlace.value = place;
    editform.style.display = 'block'
    document.getElementById('closeBtn').style.display = 'block'
    popwindow.style.display = 'none'
    hideFM.style.display = 'none'

}
function updateAddr() {
    fetch('http://localhost:3000/updateAddress', {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            fname: nme,
            faddr: adr,
            fpin: pn,
            fmob: mbl,
            fplace: plc,
            uname: Editname.value,
            uaddr: EditAddress.value,
            upin: EditPin.value,
            umob: EditMob.value,
            uplace: EditPlace.value,
        })
    }).then((data) => data.json()).then((data) => location.reload())
    return false
}


function viewform() {
    popwindow.style.display = 'none'
    editform.style.display = 'none'
    hideFM.style.display = 'block'

    document.getElementById('closeBtn').style.display = 'block'
}
function closeForm() {
    hideFM.style.display = 'none'

    editform.style.display = 'none'
    document.getElementById('closeBtn').style.display = 'none'


}

function addSubmit() {

    fetch("http://localhost:3000/addAddress", {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            addName: Aname.value,
            addAddress: Aadd.value,
            addPin: Apin.value,
            addMob: Amob.value,
            addPlace: Aplace.value

        })
    }).then((res) => res.json()).then((data) => {
        console.log(data)

        section = data[data.length - 1]
        console.log('gd', section)

        addShow.innerHTML += `<h6>${section.addName}</h6>
      <h6>${section.addAddress}</h6>
      <h6>${section.addPin}</h6>
      <h6>${section.addMob}</h6>
      <h6>${section.addPlace}</h6>
      <div class="col-sm-12">
                <button type="submit" onclick="editForm('${section.addName}','${section.addAddress}','${section.addPin}','${section.addMob}','${section.addPlace}')"
                 class="btn btn-primary text-white">edit</button>
                <button type="submit"
                  onclick="addDelete('${section.addName}','${section.addAddress}','${section.addPin}','${section.addMob}','${section.addPlace}')"
                  class="btn btn-danger text-white">delete</button>
              </div>
      <hr>`

    })
    alert('address added')
    addShow.innerHTML = ''
    return false
   

}


//####################################################
let text = document.getElementById('textShow')
let addChange = document.getElementById('addAddorChange')
let popwindow = document.getElementById('popWindow')
addChange.addEventListener('click', addraddChange)
function addraddChange() {
    console.log('hii')
    popwindow.style.display = 'block'
    fetch('http://localhost:3000/getAddress', {
        method: "get",
        headers: {
            "Content-Type": "application/json"
        }

    }).then((result) => result.json())
        .then((data) => {
            popwindow.innerHTML = ` <div>
                <button style="margin-top: 5px;" class="btn btn-primary" onclick="viewform()">add new address</button>
                 <button style="margin-top: 5px; margin-left:150px" class="btn btn-danger " onclick="closepop()">close</button>
              </div>`
            data.forEach((val) => {
                console.log('huuuu', val)
                if (val != null) {
                    popwindow.innerHTML += `
      <div class="card-body"> 
             
              <h6>${val.addName}</h6>
              <h6>${val.addAddress}</h6>
              <h6>${val.addPin}</h6>
              <h6>${val.addMob}</h6>
              <h6>${val.addPlace}</h6>
              <div class="col-sm-12">
                <button type="submit" onclick="selectForm('${val.addName}','${val.addAddress}','${val.addPin}','${val.addMob}',
                '${val.addPlace}')" class="btn btn-success text-white">select</button>
                <button type="submit" onclick="editForm('${val.addName}','${val.addAddress}','${val.addPin}','${val.addMob}',
                '${val.addPlace}')" class="btn btn-primary text-white">edit</button>
                <button type="submit"
                  onclick="addDelete('${val.addName}','${val.addAddress}','${val.addPin}','${val.addMob}','${val.addPlace}')"
                  class="btn btn-danger text-white">delete</button>
              </div>
              <hr>

            </div>`
                }

            })

        })

    popwindow.innerHTML = ''

}
function closepop() {
    popwindow.style.display = 'none'
}
function selectForm(name, addr, pin, mob, place) {
    text.innerHTML = `${name},
${addr},
${pin},
${mob},
${place}`
    popwindow.style.display = 'none'
}
function addDelete(name, addr, pin, mob, place) {
    console.log(name, addr, pin, mob, place)
    fetch('http://localhost:3000/addDelete', {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: name, addr: addr, pin: pin, mob: mob, place: place })
    }).then((data) => data.json()).then((data) => {

        location.reload()
    })
}
let coopenstatus = ''
let coopenDisTotalamt=0
function coopenApply() {
    fetch('http://localhost:3000/coopenapply', {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            cpApply: coopencode.value
        })
    }).then((data) => data.json()).then((data) => {

        if (data.msg) {
            document.getElementById('cpMsg').innerHTML = data.msg
            document.getElementById('cpDisAmt').innerHTML = '0.00'

            document.getElementById('cpmainAmt').innerHTML = data.oldVal + '.00'
        } else {
            document.getElementById('cpDisAmt').innerHTML = data.disAmt + '.00'
            document.getElementById('cpmainAmt').innerHTML = data.amt + '.00'
            coopenDisTotalamt=data.amt
            
            document.getElementById('cpMsg').innerHTML = ''
        }
        coopenstatus = data
    })
    document.getElementById('cpMsg').innerHTML = ''
    document.getElementById('cpDisAmt').innerHTML = ''
    document.getElementById('cpmainAmt').innerHTML = ''

    return false
}
function orderPlace() {
    console.log(text.value)

    if (text.value && text.value.trim() !== '') {
        fetch('http://localhost:3000/orderHistory', {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ address: text.value, coopenStatus: coopenstatus, date: new Date(), payMethod: paymentMethod.value })
        }).then((data) => data.json()).then((data) => {
            if (data.status == true) {
                location.href = 'http://localhost:3000/success'
            } else {
                let price=0
                console.log(coopenDisTotalamt)
                if(coopenDisTotalamt==0){
                   
                    price=data.amount
                }else{
                    price=coopenDisTotalamt
                }
                if (text.value != null && text.value != undefined && text.value != '' && text.value.charCodeAt() != 32) {
                    let options = {
                        "key": 'rzp_test_tkUZeWI1OfAb4R', // Enter the Key ID generated from the Dashboard
                        "amount":price , // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
                        "currency": "INR",
                        "name": "KK FOODS", //your business name
                        "description": "Test Transaction",
                        "image": "https://example.com/your_logo",
                        "order_id": data.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
                        "handler": function (response) {


                            verifypayment(response, data)

                        },
                        "prefill": {
                            "name": "Gaurav Kumar", //your customer's name
                            "email": "gaurav.kumar@example.com",
                            "contact": "9000090000"
                        },
                        "notes": {
                            "address": "Razorpay Corporate Office"
                        },
                        "theme": {
                            "color": "#3399cc"
                        }
                    };
                    let rzp1 = new Razorpay(options);
                    rzp1.open();

                } else {

                    alert('please add address')
                    return false
                }
            }


        })


    } else {
        alet.style.display = 'block'
        alet.innerHTML = `<div class="" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content" style="  border-style: ridge;
          border-block-color: currentColor;
          background-color: lightskyblue;
        }">
            
            <div class="modal-body">
              <p>Fill the Address box</p>
            </div>
            <div class="modal-footer">
              
              <button onclick="colseAlet()" type="button" class="btn btn-primary">ok</button>
            </div>
          </div>
        </div>`

        return false
    }
}

function verifypayment(responce, orderDetails) {
    console.log(responce)
    fetch('http://localhost:3000/onlinePayDetails', {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ responce, orderDetails })
    }).then((data)=>data.json()).then((data)=>{
        if(data.pay==true){
            location.href = 'http://localhost:3000/success'
        }else{
            alet.style.display = 'block'
            alet.innerHTML = `<div class="" tabindex="-1">
            <div class="modal-dialog">
              <div class="modal-content" style="  border-style: ridge;
              border-block-color: red;
              background-color: red;
            }">
                
                <div class="modal-body">
                  <p>payment faild!</p>
                </div>
                <div class="modal-footer">
                  
                  <button onclick="colseAlet()" type="button" class="btn btn-primary">ok</button>
                </div>
              </div>
            </div>`
        }
    })

    return false
}

let colseAlett = document.getElementById('colseAlet')

function colseAlet() {
    alet.style.display = 'none'
    return false
}