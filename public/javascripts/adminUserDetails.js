const currentUrl = window.location.href; // "http://localhost:3000/payment"
const currentDomain = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;


console.log(currentDomain);
let adminRoute=currentDomain




$(document).ready( function () {
    $('#myTable').DataTable();
} );

  
  function blocker(id){
    
    fetch(`${adminRoute}/admin/unblock/${id}`,{
      method:"get",
      headers:{
        "Content-Type":"application/json"
      },

    }).then((data)=>data.json()).then((data)=>{
     document.getElementById('staticBackdropLabel').innerHTML=`User Un Blocked Successfully`
    document.getElementById('staticBackdrop').style.display='block'
    setTimeout(function() {
      document.getElementById('staticBackdrop').style.display = "none";
      location.reload()
    }, 900); 
    
    })
    return false
  }

  function blocker2(id){
    
    fetch(`${adminRoute}/admin/block/${id}`,{
      method:"get",
      headers:{
        "Content-Type":"application/json"
      },

    }).then((data)=>data.json()).then((data)=>{
      document.getElementById('staticBackdropLabel').innerHTML=`User Blocked Successfully`
    document.getElementById('staticBackdrop').style.display='block'
    setTimeout(function() {
      document.getElementById('staticBackdrop').style.display = "none";
      location.reload()
    }, 900); 
    

    })
    return false
  }