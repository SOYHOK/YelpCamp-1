

document.getElementById('cart').addEventListener('click', () => {
    let order = document.querySelector('.order')
    order.style.display = 'block'
})
document.getElementById('btn-close').addEventListener('click', () => {
    let close = document.querySelector('.order')
    close.style.display = 'none'
})
const ADDTCartoHtml = document.querySelector('.order-wrapper');

console.log(ADDTCartoHtml)
let ADDTCardBtn =
    document.querySelectorAll('.addtocard');
ADDTCardBtn.forEach(btn => {
    btn.addEventListener('click', (event) => {
        var button = event.target.parentElement.parentElement;
        var shopItem = button.parentElement.parentElement;
        var title = shopItem.querySelector("#title").innerText;
        var price = shopItem.querySelector("#price").innerText;
        var imageSrc = shopItem.querySelector("#image").src;
        addItemToCart(title,price, imageSrc);
        console.log(shopItem)
        console.log(title)
        console.log(price)
        console.log(imageSrc)
        console.log(button)
    })
})

function addItemToCart(title,  price, imageSrc) {
    var cartRow = document.createElement("div");
    cartRow.classList.add("order-list");
   
    var cartRowContents = `
    <div class="order-list">
            <img src="${imageSrc}" alt="" width="50px">
            <div class="title">${title}</div>
            <span class="price">${price}</span>
            <div class="qty">
              <span class="qty">1</span>
              <span class="x">x</span>
              <span class="x">2</span>
            </div>
            <div class="delete">Delete</div>
          </div>
    `;
    
    cartRow.innerHTML = cartRowContents;
    ADDTCartoHtml.append(cartRow);
}

