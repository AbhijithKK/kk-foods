const userRoute = 'http://localhost:3000'


let otpv=document.form.otp
document.getElementById('msg').innerHTML=''
document.getElementById("unhide").style.display = "none";
function send(){
  console.log(otpv.value)
fetch(`${userRoute}/otp`,{
  method:"post",
  headers:{
    "Content-Type":"application/json"
    },
    body:JSON.stringify({otp:otpv.value})

}).then((data)=>data.json()).then((data)=>{
  if(data==false){
    document.getElementById('msg').innerHTML='Enter Currect OTP'
    return false
  }else{
    location.href=`${userRoute}/login`
  }
})
event.preventDefault()
return false
}
function resend(){
  document.getElementById('msg').innerHTML=''
  fetch(`${userRoute}/resendOtp`,{
    method:"get",
    headers:{
      "Content-Type":"application/json"
  },

  }).then((data)=>data.json()).then((data)=>{
    if(data==false){
      document.getElementById('msg').innerHTML='Plese Re-Enter Signup form Properly'
      return false
    }else{
      alert('OTP resend your Mail')
      document.getElementById('msg').innerHTML=''
document.getElementById("unhide").style.display = "none";
      var countDownTime = 60000;
var x = setInterval(function () {
  countDownTime -= 1000;
  var seconds = Math.floor((countDownTime % (1000 * 60)) / 1000);
  document.getElementById("countdown").innerHTML = "otp expire in " + seconds + "s ";
  if (countDownTime < 0) {
    clearInterval(x);
    document.getElementById("countdown").innerHTML = ""
    document.getElementById("unhide").style.display = "block";
  }
}, 1000);
      
    }
    
    
  })
  return false
}




var countDownTime = 60000;
var x = setInterval(function () {
  countDownTime -= 1000;
  var seconds = Math.floor((countDownTime % (1000 * 60)) / 1000);
  document.getElementById("countdown").innerHTML = "otp expire in " + seconds + "s ";
  if (countDownTime < 0) {
    clearInterval(x);
    document.getElementById("countdown").innerHTML = ""
    document.getElementById("unhide").style.display = "block";
  }
}, 1000);