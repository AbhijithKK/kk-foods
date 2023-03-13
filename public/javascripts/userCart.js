const currentUrl = window.location.href; // "http://localhost:3000/payment"
const currentDomain = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;


console.log(currentDomain);
let userRoute
if (currentDomain ==  'https://kkfoods.online') {
    userRoute='https://kkfoods.online'
}
if (currentDomain ==   'https://www.kkfoods.online') {
    userRoute= 'https://www.kkfoods.online'
}
if (currentDomain ==    'http://3.227.231.17') {
    userRoute=  'http://3.227.231.17'
}
if (currentDomain ==    'http://localhost:3000') {
    userRoute= 'http://localhost:3000'
}

let count = document.querySelectorAll('.cartQuantityss')
//count.addEventListener('input' ,countAdd)

function counter(proid, counter, index, ofId) {
    console.log(counter + '-' + proid + '-' + ofId);
    fetch(`${userRoute}/count`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ countValue: counter, proId: proid, ofId: ofId })
    }).then((data) => data.json()).then((data) => {
        console.log(data)
        document.getElementById(index).innerHTML = data.result
        document.getElementById('newtotal').innerHTML = data.newTotal
        document.getElementById(index + 'pro').innerHTML = data.prototal

    })
}