const userRoute='http://localhost:3000'

let count=document.querySelectorAll('.cartQuantityss')
//count.addEventListener('input' ,countAdd)

function counter(proid,counter,index,ofId){
    console.log(counter+'-'+proid+'-'+ofId);
    fetch(`${userRoute}/count`,{
      method:"post",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({countValue:counter,proId:proid,ofId:ofId})
    }).then((data)=>data.json()).then((data)=>{
      console.log(data)
      document.getElementById(index).innerHTML=data.result
       document.getElementById('newtotal').innerHTML=data.newTotal
       document.getElementById(index+'pro').innerHTML=data. prototal
     
    })
}