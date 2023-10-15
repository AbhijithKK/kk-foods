const currentUrl = window.location.href; // "http://localhost:3000/payment"
const currentDomain = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;


console.log(currentDomain);
let adminRoute=currentDomain


function downloadPDF() {
    console.log('jii')
    const table = document.getElementById('table-id');
    const tableHTML = table.outerHTML;
    const fileName = 'table' + new Date() + '.pdf';

    html2pdf().from(tableHTML).save(fileName);
  }
  let date1=document.salesReport.date1;
  let date2=document.salesReport.date2;
 document.getElementById('date11').innerHTML=''
      document.getElementById('date22').innerHTML=''
  function report(){
    
    fetch(`${adminRoute}/admin/postSalesReport`,{
      method:"post",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({date1:date1.value,date2:date2.value})
    }).then((data)=>data.json()).then((data)=>{
      console.log(data.total)
       document.getElementById('date11').innerHTML ='From:'+date1.value
       document.getElementById('date22').innerHTML ='To:'+date2.value
      data.product.forEach((val)=>{

      document.getElementById('getReport').innerHTML +=`
      <tr>
         <td>
            <p class="fw-normal mb-1">${val.orderid}</p>
          </td>
          <td>
            <p class="fw-normal mb-1">${val.name} </p>
          </td>
          <td>
            <p class="fw-normal mb-1">${val.productName}</p>
          </td>
          <td>
            <p class="fw-normal mb-1">${val.productPrice}</p>
          </td>
          <td>
            <p class="fw-normal mb-1">${val.productQuantity}</p>
          </td>
          <td>
            <p class="fw-normal mb-1">${val.subTotal}</p>
          </td>
        </tr>`
})

     document.getElementById('getReport').innerHTML +=` <tr>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td>
            <h5 style="width: 0; font-weight: bold; font-family: cursive; ">Total Revenue:</h5>
          </td>

          <td>

            <i  id="totals" style="font-size: 25px;  " class="bi bi-currency-rupee">${data.total}</i>
 
  </td>
  </tr>`
      
    })
    
     document.getElementById('status').style.display='none'
    document.getElementById('getReport').innerHTML=''
    document.getElementById('date11').innerHTML=''
    document.getElementById('date22').innerHTML=''
    return false
  }