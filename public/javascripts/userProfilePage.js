const userRoute = 'http://localhost:3000'
let editDiv=document.getElementById('hiddenEform')
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
    editDiv .style.display = 'block'
    document.getElementById('closeBtn2').style.display = 'block'
    proForm.style.display = 'none'
    hideFM.style.display = 'none'
 
}
function updateAddr() {
    fetch(`${userRoute}/updateAddress`, {
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
    editDiv.style.display = 'none'
    hideFM.style.display = 'block'
    proForm.style.display = 'none'
    document.getElementById('closeBtn').style.display = 'block'
}
function closeForm() {
    hideFM.style.display = 'none'
    proForm.style.display = 'block'
    editDiv.style.display = 'none'
    document.getElementById('closeBtn').style.display = 'none'


}

function addSubmit() {

    fetch(`${userRoute}/addAddress`, {
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

    return false
    addShow.innerHTML = ''
}
function addDelete(name, addr, pin, mob, place) {
    console.log(name, addr, pin, mob, place)
    fetch(`${userRoute}/addDelete`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: name, addr: addr, pin: pin, mob: mob, place: place })
    }).then((data) => data.json()).then((data) => {

        location.reload()
    })
}
