let name = document.addForm.productName;
function validCheck() {
    if (name.value.charCodeAt() == 32) {
        document.getElementById('proName').innerHTML = "Enter Propr Name"
        document.getElementById('proName0').style.display = 'none'
        return false
    }
    document.getElementById('proName').innerHTML = ""
    document.getElementById('proName0').style.display = 'block'
    alert('product added')
}
function viewImage(event) {
    document.getElementById('imgView').src = URL.createObjectURL(event.target.files[0])
  }
  function viewMultiImg(event){
    document.getElementById('imgMulti').src = URL.createObjectURL(event.target.files[0])
    document.getElementById('imgMulti1').src = URL.createObjectURL(event.target.files[1])
    document.getElementById('imgMulti2').src = URL.createObjectURL(event.target.files[2])
  }