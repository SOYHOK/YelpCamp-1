

document.getElementById('cart').addEventListener('click', () => {
    let order = document.querySelector('.order')
    order.style.display = 'block'
})
document.getElementById('btn-close').addEventListener('click', () => {
    let close = document.querySelector('.order')
    close.style.display = 'none'
})
document.getElementById('checkout').addEventListener('click', function() {
    var contactPopup = document.querySelector('.user-contact');
      contactPopup.style.display = 'block'
      let order1 = document.querySelector('.order')
      order1.style.display = 'none'
  }
  );

const ADDTCartoHtml = document.querySelector('.order-wrapper');


let ADDTCardBtn =
    document.querySelectorAll('.addtocard');
ADDTCardBtn.forEach(btn => {
    btn.addEventListener('click', (event) => {
        var button = event.target.parentElement.parentElement;
        var shopItem = button.parentElement.parentElement;
        var shopItemId = button.parentElement.parentElement.dataset.id;
        var title = shopItem.querySelector("#title").innerText;
        var price = shopItem.querySelector("#price").innerText
        var imageSrc = shopItem.querySelector("#image").src;
        let product_id = shopItem.dataset.id = shopItemId
        addItemToCart(product_id,title,price, imageSrc);
    })
})
let carts = []

ADDTCartoHtml.addEventListener("click",(event)=>{
    let Btn = event.target
    let product_id = Btn.parentElement.parentElement.parentElement.parentElement.dataset.id
    let type = Btn.classList.contains('btn-plus')?"plus":"minus"
    ChangeQty(product_id,type)
    RemoveItem(Btn)

})
const RemoveItem =(btnDelete)=>{
    if(btnDelete.classList.contains())
    console.log(btnDelete)

}

const ChangeQty =(product_id,type)=>{
    let IsProductInCart = carts.findIndex((value)=>
        value.product_id==product_id
    )
    console.log(IsProductInCart)
    console.log(product_id)
    console.log(type)
    if(carts.length>0&&IsProductInCart>=0&&carts[IsProductInCart].product_id ==product_id){
        if(type=='plus'){
            carts[IsProductInCart].qty = carts[IsProductInCart].qty+1
        }else{
            carts[IsProductInCart].qty = carts[IsProductInCart].qty-1
            if(carts[IsProductInCart].qty<=0){
                carts.splice(IsProductInCart,1)
            }
        }
    }
    AddItemToHTMLCart()
}

function addItemToCart(product_id, title,  price, imageSrc) {
    let IsProductInCart = carts.findIndex((value)=>
        value.product_id==product_id
   )
    console.log(IsProductInCart)

    if(carts.length<=0){
        carts=[
            {
                product_id,
                title,
                price,
                imageSrc,
                qty:1
            }
        ]
    }else if(carts.length>0&&IsProductInCart>=0&&carts[IsProductInCart].product_id ==product_id
    ){
        carts[IsProductInCart].qty = carts[IsProductInCart].qty + 1;
    }else{
        carts.push(
            {
                product_id,
                title,
                price, 
                imageSrc,
                qty:1
            }
        )
    }
    console.log(carts)
    AddItemToHTMLCart()
}



const AddItemToHTMLCart =()=>{
    ADDTCartoHtml.innerHTML=''
    let TotalPrice = 0
    let countItem = 0
    carts.forEach((item)=>{
        TotalPrice=TotalPrice+item.price*item.qty
        countItem = countItem + item.qty
        document.querySelector('.total-price').innerText=TotalPrice
        document.querySelector('.countItem').innerHTML=countItem
        console.log(TotalPrice)
        console.log(countItem)
        var cartRow = document.createElement("div");
        cartRow.classList.add("order-list");
        cartRow.dataset.id = item.product_id
        cartRow.innerHTML = `
        <div class="order-list">
                <img src="${item.imageSrc}" alt="" >
                <div class="title" >${item.title}</div>
                <span class="price">${item.price*item.qty}</span>
                <div class="qty">
                    <div class="btn">
                        <button class="btn-minus">-</button>
                        <span class='quantity'>${item.qty}</span>
                        <button class="btn-plus">+</button>
                    </div>
                </div>
                <div class="btn-delete">Delete</div>
              </div>
        `;
        ADDTCartoHtml.appendChild(cartRow);
    })

}
