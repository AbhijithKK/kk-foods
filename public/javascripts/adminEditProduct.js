const currentUrl = window.location.href; // "http://localhost:3000/payment"
const currentDomain = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;


console.log(currentDomain);
let userRoute=currentDomain

let fileInput2 = document.imageForm2.image2
let fileInput1 = document.imageForm1.image2
let fileInput = document.imageForm.image2
function viewImage(event) {
    document.getElementById('viewimage').src = URL.createObjectURL(event.target.files[0])
  }
// 3images
function imgShow(event,no){
    if(no==1){
    document.getElementById("showIMG").src = URL.createObjectURL(event.target.files[0])
    }
     if(no==2){
    document.getElementById("showIMG1").src = URL.createObjectURL(event.target.files[0])
    }
     if(no==3){
    document.getElementById("showIMG2").src = URL.createObjectURL(event.target.files[0])
    }
  }
// ens img sec


let name = document.editForm.productName;
function validCheck() {
    if (name.value.charCodeAt() == 32) {
        document.getElementById('proName').innerHTML = "Enter Propr Name"
        document.getElementById('proName0').style.display = 'none'
        return false
    }
    document.getElementById('proName').innerHTML = ""
    document.getElementById('proName0').style.display = 'block'
}

function imageChange(proid, imagePath) {
    console.log(imagePath)
    fetch(`${adminRoute}/admin/proSingleImageDelete`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ proId: proid, path: imagePath })
    }).then(() => location.reload())
    return false
}
function imagesAdd(id, position) {
    console.log(position)

    if (position == 0) {
        // let file=image.files[0]
        var formData = new FormData(); // create a new FormData object
        //var fileInput = document.getElementById('image-input'); // get the file input element
        var file = fileInput2.files[0]; // get the first file selected
        formData.append('image2', file)
        formData.append('proId', id)
        formData.append('arrpos', position)
    }
    if (position == 1) {
        // let file=image.files[0]
        var formData = new FormData(); // create a new FormData object
        //var fileInput = document.getElementById('image-input'); // get the file input element
        var file = fileInput1.files[0]; // get the first file selected
        formData.append('image2', file)
        formData.append('proId', id)
        formData.append('arrpos', position)
    }
    if (position == 2) {
        // let file=image.files[0]
        var formData = new FormData(); // create a new FormData object
        //var fileInput = document.getElementById('image-input'); // get the file input element
        var file = fileInput.files[0]; // get the first file selected
        formData.append('image2', file)
        formData.append('proId', id)
        formData.append('arrpos', position)
    }
    console.log(formData)
    fetch(`${adminRoute}/admin/imageAdd`, {
        method: "post",

        body: formData
    }).then(() => location.reload())
    return false

}