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