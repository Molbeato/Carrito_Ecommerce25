const URL= "https://ecommercebackend.fundamentos-29.repl.co/"

const cartToggle= document.querySelector(".cart_toggle")
const cartBlock= document.querySelector(".cart_block")
const listOfProducts= document.querySelector("#products_container")
const cart= document.querySelector("#cart")
const cartList= document.querySelector("#cart_list")
const emptyCartButton= document.querySelector("#empty_cart")
const modalContainer= document.querySelector("#modal_container")


cartToggle.addEventListener("click", ()=>{
    cartBlock.classList.toggle("cart_visible")
})

eventListenerLoader()

function eventListenerLoader(){
    listOfProducts.addEventListener("click", addProduct)
    cart.addEventListener("click", deleteProduct)
    emptyCartButton.addEventListener("click", emptyCart)
    document.addEventListener('DOMContentLoaded', () => {
        cartProducts= JSON.parse(localStorage.getItem('cart')) || []
        cartElementsHTML()
    })
    listOfProducts.addEventListener("click", viewDetails)
    modalContainer.addEventListener("click", closeDetails)
}

function getProducts(){
    axios.get(URL)
        .then(function (response){
            const products= response.data
            printProducts(products)
        })
        .catch(function(error){
            console.log(error)
    })
}

getProducts()

function printProducts(products){
    let html= "";
    for(let i= 0; i < products.length; i++){
        html+= `
        <div class="product_container">
            <div class="product_container_img">
                <img src="${products[i].image}" alt="image>
            </div>
            <div class="product_container_name">
                <p>${products[i].name}</p>
            </div>
            <div class="product_container_price">
                <p>$${products[i].price.toFixed(2)}</p>
            </div>
            <div class="product_container_button">
                <button class="cart_button add_to_cart" id="add" data-id="${products[i].id}">Add to cart</button>
                <button class="details_button" id= "details">Details</button>
            </div>
        </div>
        `
    }
    listOfProducts.innerHTML = html
}

let cartProducts= []

function addProduct(event){
    if(event.target.classList.contains("add_to_cart")){
        const product= event.target.parentElement.parentElement
        console.log(product)
        cartProductsElements(product)
    }
}

function cartProductsElements(product){
    const infoProduct= {
        id: product.querySelector("button").getAttribute('data-id'),
        image: product.querySelector("img").src,
        name: product.querySelector(".product_container_img p").textContent,
        price: product.querySelector(".product_container_price p").textContent,
        quantity: 1
    }
    if(cartProducts.some(product => product.id === infoProduct.id)){
        const product= cartProducts.map(product => {
            if(product.id === infoProduct.id){
                product.quantity++
                return product
            } else {
             return product
            }
        })
        cartProducts= [...product]
    } else{
        cartProducts = [...cartProducts, infoProduct]
    }
    console.log(cartProducts)
    cartElementsHTML()
}

function cartElementsHTML(){
    cartList.innerHTML= ""
    cartProducts.forEach(product => {
        const div= document.createElement("div")
        div.innerHTML = `
        <div class="cart_product">
            <div class="cart_product_img">
                <img src="${product.image}" alt="image>
            </div>
            <div class="cart_product_description">
                <p>${product.name}</p>
                <p>${product.price}</p>
                <p>Quantity: ${product.quantity}</p>
            </div>
            <div class="cart_product_button">
                <button class="delete_product" data-id="${product.id}">Remove</button>
            </div>
        </div>
        <hr>
        `
        cartList.appendChild(div)
    })
    productsStorage()
}

function deleteProduct(event){
    if(event.target.classList.contains('delete_product')){
        const productId= event.target.getAttribute('data-id')
        cartProducts = cartProducts.filter(product => product.id !== productId)
        cartElementsHTML()
    } 
}

function emptyCart(){
    cartProducts= [];
    cartElementsHTML();
}

function viewDetails(event){
    if(event.target.classList.contains("details_button")){
        modalContainer.classList.add('show_modal')
    }
}

function closeDetails(event){
    if(event.target.classList.contains("close_modal")){
        modalContainer.classList.remove('show_modal')
    }
}

function productsStorage(){
    localStorage.setItem("cart", JSON.stringify(cartProducts))
}