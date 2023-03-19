const currentUrl = window.location.href; // "http://localhost:3000/payment"
const currentDomain = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;


console.log(currentDomain);
let adminRoute=currentDomain


$(document).ready( function () {
    $('#myTable').DataTable();
} );
function message(id,del){
 let tempr= document.getElementById('temp')
  let m=''
    if(tempr.value=="unflage"){
      m='flage'
    }else{
      m='unflage'
    }  
  console.log(del,tempr.value)
  tempr.value=m
  fetch(`${adminRoute}/admin/productDelete?id=${id}&delet=${m}`,{
    method:"get",
    headers:{
      "Content-Type":"application/json"
    },

  }).then((data)=>data.json()).then((data)=>{
    console.log(data)
    document.getElementById(id).innerHTML=m
    document.getElementById('staticBackdropLabel').innerHTML=`Product ${m}ed `
    document.getElementById('staticBackdrop').style.display='block'
    setTimeout(function() {
      document.getElementById('staticBackdrop').style.display = "none";
    }, 900); 
  })
  
    return false
}