const userRoute='http://localhost:3000'

function orderCancel(userid,orderid,productName,currentsts){
    let stsbn=document.getElementById(orderid)
     
    fetch(`${userRoute}/ordercancel`,{
      method:"post",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({userid:userid,
      orderId:orderid,
      productName:productName,
      currentStatus:currentsts})
    }).then((data)=>data.json()).then((data)=>{
     location.reload()
    })
  }