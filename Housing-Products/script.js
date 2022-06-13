// dom elements
const productDom = document.querySelector('.products-center');
const cartContent = document.querySelector('.cart-content');
const cartItems = document.querySelector('.cart-items');
const cartButton = document.querySelector('.cart-btn');
const cartOverlay = document.querySelector('.cart-overlay');
const closeCart = document.querySelector('.close-cart');
// const bagButtons = document.querySelectorAll('.bag-btn');
// console.log(bagButtons);

class Products {
    anyvalue = 'sonething'
    async fetchProducts(){
        try{
            const res = await fetch('./data/products.json');
            let data = await res.json();
            let productData = data.items.map((me) => {
                const { title, price, type, rating} = me.fields
                const id = me.id;
                const imgaeUrl = me.fields.image.url
                return {id, title, price, type, rating, imgaeUrl}
                // let obj1 = JSON.parse(me);
            })
            return productData
        } catch(e){
            console.log(e);
        }
    }
}


// let a = 0
// a = a+1


class USerInterface {
    insertProductsInDom(productArray){
        let productHtml = ""
        productArray.forEach((ele) => {
            productHtml = productHtml+ `
            <section>
                <div class="img-container">
                    <img src="${ele.imgaeUrl}" class="product-img">
                    <button data-itemid=${ele.id} class="bag-btn">Add to cart</button>
                    <p>${ele.title}</p>
                </div>
                <div>
                    <h4 class="light">${ele.type}</h4>
                    <h4 class="price">${ele.price}</h4>
                </div>
            </section>
            `
        })
        productDom.innerHTML = productHtml
    }

    insertProductsInCart(){

    }
}


let product = new Products();
let ui = new USerInterface();

// let arr = [1,2,3]
// let arr1 = [2,5,6]
// let arr3 = [...arr, ...arr1]


data = [{}, {}, {}]

product.fetchProducts()
.then((data) => {
    ui.insertProductsInDom(data);
    // for saving the data in local storage
    localStorage.setItem("HousingProducts", JSON.stringify(data));

    // copy all the itms from nodelist into an array
    const bagButtons = [...document.querySelectorAll('.bag-btn')]
    console.log(bagButtons);
    bagButtons.forEach((btn) => {
        let id = btn.dataset.itemid;
        btn.addEventListener('click', () => {
            btn.textContent = 'In Cart'
            let selectedproduct = data.find((ele) => ele.id === id)
            console.log(selectedproduct);
            let cartHtml = `
                <div class="cart-item">
                    <h4>${selectedproduct.title}</h4>
                    <h5>${selectedproduct.price}</h5>
                </div>
            `
            cartContent.innerHTML = cartContent.innerHTML+cartHtml
        })
    })
})


cartButton.addEventListener('click', () => {
    cartOverlay.classList.add('show-cart');
})

closeCart.addEventListener('click', () => {
    cartOverlay.classList.remove('show-cart');
})

















// template Literals
// let add = 'Delhi'
// let name1 = 'Abhinav'

// console.log('MY name is' +name1 +' My address is ' +add + ', India');

// console.log(`My name is ${name1}, My address is ${add}, India`);



// let product = new Products();
// product.fetchProducts().then((data) => {
//     console.log(data);
// })

// let obj1 = {
//     name: 'abhinav',
//     address: 'delhi'
// }

// console.log(JSON.stringify(obj1));












// productData = [
//     {
//         id: "1",
//         title: "queen size bed",
//         type: "Hpusehold",
//         price: 2500,
//         raing: 4,
//         imgaeUrl: "../images/product-1.jpeg"
//     },
//     {
//         title: "queen size bed",
//         type: "Hpusehold",
//         price: 2500,
//         raing: 4,
//         imgaeUrl: "../images/product-1.jpeg"
//     },
//     {
//         title: "queen size bed",
//         type: "Hpusehold",
//         price: 2500,
//         raing: 4,
//         imgaeUrl: "../images/product-1.jpeg"
//     }
// ]