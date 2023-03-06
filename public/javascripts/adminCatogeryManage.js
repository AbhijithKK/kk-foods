
//import { adminRoute, userRoute } from './featchRoute'
const adminRoute = 'http://localhost:3000/admin'

let modalclose = document.getElementById('modalClose')
let modal = document.getElementById("staticBackdrop")
let newcatogary = document.addForm.catogaryAdd
function addCatogary() {
    console.log(newcatogary.value)
    fetch(`${adminRoute}/catogaryAdd`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ catogaryAdd: newcatogary.value })
    }).then((data) => data.json()).then((data) => {
        console.log(data)
        if (data == false) {
            location.reload()
        } else {
            modal.style.display = 'block'

        }
    })
    return false

}
modalclose.addEventListener('click', closemodal)
function closemodal() {
    modal.style.display = 'none'
}
document.getElementById("addCatogary").style.display = "block";
document.getElementById("editCatogary").style.display = "none";
let updateId;
function edit(id) {
    updateId = id;
    document.getElementById("addCatogary").style.display = "none";
    document.getElementById("editCatogary").style.display = "block";
    fetch(`${adminRoute}/editCatogary`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: id })

    }).then((data) => data.json()).then((data) => {
        console.log(data)
        document.getElementById('editCatogatyName').value = data.catogary
    })

}
function update() {
    let updateval = document.updateform.changeCatogary
    console.log('gggg')
    fetch(`${adminRoute}/upadeCatogatiess`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: updateId, catogaryAdd: updateval.value })
    }).then((data) => data.json()).then((data) => {
        console.log(data)
        location.reload()
    })
    return false
}

function closeedit() {
    document.getElementById("addCatogary").style.display = "block";
    document.getElementById("editCatogary").style.display = "none";

}