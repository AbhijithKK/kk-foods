const adminRoute='http://localhost:3000/admin'


function orderCancel(userid, orderid, productName, currentsts) {
    console.log(orderid, productName,)
    let stsbn = document.getElementById(orderid)
    if(confirm('Are you Sure')){
      confirm('Click ok')
      
    
    fetch(`${adminRoute}/ordercancel`, {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ userid: userid, orderId: orderid, productName: productName, currentStatus: currentsts })
    }).then((data) => data.json()).then((data) => {
      console.log(data)
      location.reload()
      stsbn.classList.remove('btn-success')
      stsbn.classList.add('btn-danger')
      stsbn.innerHTML = 'cancell'

    })

      return false
    }else{
      confirm('click Ok')
      console.log('noo')
      return false
    }
  }