const userRoute='http://localhost:3000'

let searchVal = '';
  let val='';
 
   let serchResp= document.getElementById('frond_endProductSearch')
  let mainshowItem = document.getElementById('frond_endProduct')
  let bodyHeiight = document.querySelector('.hero_area')
  let offerSection = document.querySelector('.offer_section')
  let sliderSection = document.querySelector('.slider_section')
  let sea = document.getElementById('searchFood')
  let btn = document.getElementById('submitSearch')
  sea.addEventListener('input', itemSearch)
  function itemSearch() {
    console.log(sea.value)
    if (sea.value == '' || sea.value.charCodeAt() == 32) {
      serchResp.style.display='none';
      mainshowItem.style.display = "block"
      bodyHeiight.style.minHeight = "100vh"
      offerSection.style.display = "block"
      sliderSection.style.display = "block"
    } else {
      mainshowItem.style.display = "none"
      bodyHeiight.style.minHeight = "90px"
      offerSection.style.display = "none"
      sliderSection.style.display = "none"
       serchResp.style.display= "contents"
      fetch(`${userRoute}/search`, {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ data: sea.value })
      }).then((data) => data.json())
        .then((data) => {
         data.forEach((dd) => {
          val=dd
          console.log('hii',val._id);
           if(val._id==val._id){
             serchResp.innerHTML +=`
<div class="col-sm-6 col-lg-4 all pizza">
          <div class="box">
            <div>
              <div class="img-box">
                <img src="/images/${val.image1[0].filename}" alt=""> 
              </div>
              <div class="detail-box">
                <h5>
                  ${val.productName}
                </h5>
                <p>
                  ${val.productDiscription}
                </p>
                <div class="options">
                  <h6>
                    ₹ ${val.productPrize}
                  </h6> 
                  <a href="/cart?productId=${val._id}">
                    <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 456.029 456.029"
                      style="enable-background:new 0 0 456.029 456.029;" xml:space="preserve">
                      <g>
                        <g>
                          <path d="M345.6,338.862c-29.184,0-53.248,23.552-53.248,53.248c0,29.184,23.552,53.248,53.248,53.248
                         c29.184,0,53.248-23.552,53.248-53.248C398.336,362.926,374.784,338.862,345.6,338.862z" />
                        </g>
                      </g>
                      <g>
                        <g>
                          <path d="M439.296,84.91c-1.024,0-2.56-0.512-4.096-0.512H112.64l-5.12-34.304C104.448,27.566,84.992,10.67,61.952,10.67H20.48
                         C9.216,10.67,0,19.886,0,31.15c0,11.264,9.216,20.48,20.48,20.48h41.472c2.56,0,4.608,2.048,5.12,4.608l31.744,216.064
                         c4.096,27.136,27.648,47.616,55.296,47.616h212.992c26.624,0,49.664-18.944,55.296-45.056l33.28-166.4
                         C457.728,97.71,450.56,86.958,439.296,84.91z" />
                        </g>
                      </g>
                      <g>
                        <g>
                          <path
                            d="M215.04,389.55c-1.024-28.16-24.576-50.688-52.736-50.688c-29.696,1.536-52.224,26.112-51.2,55.296
                         c1.024,28.16,24.064,50.688,52.224,50.688h1.024C193.536,443.31,216.576,418.734,215.04,389.55z" />
                        </g></g> <g></g> <g></g> <g> </g><g> </g><g> </g> <g></g> <g> </g> <g></g> <g> </g> <g></g><g> </g><g> </g> <g></g> <g> </g>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
         `
           }
           
          })
          
        })
        serchResp.innerHTML =''
    }
   
  }

//   @@@@@@@@@@@@@@@@cart section@@@@@@@@@@//
