//dom Elements
const productDom = document.querySelector(".products-center");
const home = document.querySelector(".home");
const shop = document.querySelector(".shop");

// cart
const cartDom = document.querySelector(".cart-content");
const cartMain = document.querySelector(".cart");
const cartPrice = document.querySelector(".cart-total");
const cartItems = document.querySelector(".cart-items");
const cartOverlay = document.querySelector(".cart-overlay");
const cartButton = document.querySelector(".cart-btn");
const cartClose = document.querySelector(".close-cart");
const clearCart = document.querySelector(".btn-clear");
const btnBuy = document.querySelector(".btn-buy");
const totalBuyPrice = document.querySelector(".total-Buy-Price");

//modal
const loginModal = document.querySelector(".login-modal");
const signUpModal = document.querySelector(".signup-modal");
const buyModal = document.querySelector(".buy-modal");
const buyContent = document.querySelector(".buy-content");
const closeModal = document.querySelectorAll(".close-modal");

// header
const searchButton = document.querySelector(".search-button");
const loginLink = document.querySelector(".login-link");
const signUpLink = document.querySelector(".signup-link");
const LogoutLink = document.querySelector(".logout-link");
const searchInput = document.querySelector(".search-input");

// forms
const logInForm = document.querySelector(".login-form");
const signUpForm = document.querySelector(".signup-form");
const userEl = document.querySelector(".username");
const navbarLinks = document.querySelector(".links");

//cart products
let cart = [];

const LOGIN_STATES = {
  SUCCESS: "success",
  WRONG_PASSWORD: "wrong password",
  NOT_VALID: "not a valid iser",
};

//products class
class Products {
  async getProducts() {
    try {
      const result = await fetch("data/products.json"); //returns response object
      let products = await result.json(); // to get the data from response object
      // fetch("data/products.json")
      // .then((res) => {
      //   return res.json()
      // })
      // .then((data) => {

      // })
      const data = products.items;
      const structuredData = data.map((item) => {
        const { title, price, type, rating } = item.fields;
        const id = item.sys.id;
        const url = item.fields.image.fields.file.url;
        return { title, price, type, rating, id, url };
      });
      return structuredData;
    } catch (error) {
      console.log(error);
    }
  }
}

//display class
class UserInterface {
  insertProductsInDom(products) {
    let result = "";
    products.forEach((element) => {
      let star = "";
      for (let i = 0; i < element.rating; i++) {
        star += `<i class="fas fa-star"></i>`; //gives a filled star
      }
      for (let i = 0; i < 5 - element.rating; i++) {
        star += `<i class="far fa-star"></i>`;
      }
      result += `
            <article class="product">
                <div class="img-container">
                    <img src=${element.url} alt="product" class="product-img">
                    <button class="bag-btn" data-id=${element.id}><i class="fas fa-shopping-cart"></i>Add To Cart</button>
                    <p>${element.title}</p>
                </div>
                <div>
                    <h4 class="light">${element.type}</h4>
                    <h4 class="price">$ ${element.price}</h4>
                </div>
                <div class="star">
                   ${star}
                </div>
            </article>
          `;
    });
    productDom.innerHTML = result;
  }

  addCartItems(cart) {
    let cartHtml = "";
    cart.forEach((cartItem) => {
      cartHtml += ` <div class="cart-item">
                <img src=${cartItem.url} alt="cart">
                <div>
                    <h4>${cartItem.title}</h4>
                    <h5>$ ${cartItem.price}</h5>
                    <span class="remove-item" data-id=${cartItem.id}>remove</span>
                </div>

                <div class="addremove" data-id=${cartItem.id}>
                    <i class="fas fa-plus-circle"></i>
                    <p class="itemNo">${cartItem.amount}</p>
                    <i class="fas fa-minus-circle"></i>
                </div>
            </div>
          `;
    });
    cartDom.innerHTML = cartHtml;
  }

  setCartValues(cart) {
    let totalPrice = 0;
    let totalItems = 0;
    cart = cart.map((cartItem) => {
      totalPrice += cartItem.price * cartItem.amount;
      totalItems += cartItem.amount;
    });
    cartPrice.innerHTML = parseFloat(totalPrice.toFixed(2));
    cartItems.innerHTML = totalItems;
  }

  showCart() {
    cartOverlay.classList.add("show-cart");
    cartMain.classList.add("transparentbg");
  }

  closeCart() {
    cartOverlay.classList.remove("show-cart");
    cartMain.classList.remove("transparentbg");
  }

  initialSetup() {
    cart = Storage.getCart();
    this.setCartValues(cart);
    this.addCartItems(cart);
  }

  resetButtons() {
    //convert nodelist into an array
    let buttons = [...document.querySelectorAll(".bag-btn")];
    buttons.forEach((btn) => {
      // getting id from data attribute --->data-id
      let id = btn.dataset.id;
      let incart = cart.find((items) => items.id === id);
      if (incart) {
        btn.innerHTML = "In Cart";
        btn.disabled = true;
      } else {
        btn.innerHTML = '<i class="fas fa-shopping-cart"></i>Add to Cart';
        btn.disabled = false;
      }
    });
  }

  getBagButtons() {
    let buttons = [...document.querySelectorAll(".bag-btn")];
    buttons.forEach((btn) => {
      let id = btn.dataset.id;
      let incart = cart.find((items) => items.id === id);
      if (incart) {
        btn.innerHTML = "In Cart";
        btn.disabled = true;
      }
      btn.addEventListener("click", (event) => {
        event.target.innerHTML = "In Cart";
        event.target.disabled = true;
        //get the selected products
        let selectedProduct = Storage.getLocalProduct(event.target.dataset.id);
        //update the cartItems
        selectedProduct = { ...selectedProduct, amount: 1 };
        cart = [...cart, selectedProduct];
        //updating cart in sessionStorage
        Storage.setCartItems(cart);
        //setting the cart values
        this.setCartValues(cart);
        //show cart values
        this.addCartItems(cart);
        //adding show class
        this.showCart();
      });
    });
  }

  cartFuntionality() {
    cartDom.addEventListener("click", (event) => {
      if (event.target.classList.contains("remove-item")) {
        // filter can be used
        let index = cart.findIndex(
          (item) => item.id === event.target.dataset.id
        );
        cart.splice(index, 1);
        Storage.setCartItems(cart);
        //setting the cart values
        this.setCartValues(cart);
        // will add updated cart html in in the cart
        this.addCartItems(cart);
        //resetting buttons
        this.resetButtons();
      }
      if (event.target.classList.contains("fa-plus-circle")) {
        let tempItem = cart.find(
          (item) => item.id === event.target.parentElement.dataset.id
        );
        tempItem.amount = tempItem.amount + 1;
        Storage.setCartItems(cart);
        //setting the cart values
        this.setCartValues(cart);
        //show cart values
        this.addCartItems(cart);
      }
      if (event.target.classList.contains("fa-minus-circle")) {
        let tempItem = cart.find(
          (item) => item.id === event.target.parentElement.dataset.id
        );
        if (tempItem.amount === 1) {
          let index = cart.findIndex(
            (item) => item.id === event.target.parentElement.dataset.id
          );
          cart.splice(index, 1);
          Storage.setCartItems(cart);
          //setting the cart values
          this.setCartValues(cart);
          //show cart values
          this.addCartItems(cart);
          //resetting buttons
          this.resetButtons();
        }
        tempItem.amount = tempItem.amount - 1;
        Storage.setCartItems(cart);
        //setting the cart values
        this.setCartValues(cart);
        //show cart values
        this.addCartItems(cart);
      }
    });
  }

  clearCart() {
    cart = [];
    Storage.setCartItems(cart);
    //setting the cart values
    this.setCartValues(cart);
    //show cart values
    this.addCartItems(cart);
    //removing show class
    this.closeCart();
    //resetting buttons
    this.resetButtons();
  }

  addCartItemsToModel(cart) {
    let cartHtml = "";
    let totalPrice = 0;
    cart.forEach((cartItem) => {
      totalPrice += cartItem.price * cartItem.amount;
      cartHtml += ` <div class="cart-item">
                <img src=${cartItem.url} alt="cart">
                <div>
                    <h4>${cartItem.title}</h4>
                    <h5>$ ${cartItem.price}</h5>
                </div>
                <div class="addremove" data-id=${cartItem.id}>
                    <p class="itemNo"> Qty:${cartItem.amount}</p>
                </div>
              </div>
          `;
    });
    buyContent.innerHTML = cartHtml;
    totalBuyPrice.innerHTML = totalPrice;
  }
}

//storage class
class Storage {
  static saveProducts(products) {
    sessionStorage.setItem("Products", JSON.stringify(products));
  }
  static getLocalProduct(id) {
    return JSON.parse(sessionStorage.getItem("Products")).find(
      (prod) => prod.id === id
    );
  }
  static setCartItems(cart) {
    sessionStorage.setItem("Cart", JSON.stringify(cart));
  }
  static getCart() {
    return sessionStorage.getItem("Cart")
      ? JSON.parse(sessionStorage.getItem("Cart"))
      : [];
  }
  static createUser(user) {
    const userList = JSON.parse(sessionStorage.getItem("users"));
    if (userList) {
      userList.push(user);
      sessionStorage.setItem("users", JSON.stringify(userList));
    } else {
      sessionStorage.setItem("users", JSON.stringify([user]));
    }
  }

  static getUser(userInfo) {
    const userList = JSON.parse(sessionStorage.getItem("users"));
    if (userList) {
      const user = userList.find(
        (userInStore) => userInStore.email === userInfo.email
      );
      if (user) {
        if (user.password === userInfo.password) {
          return { state: LOGIN_STATES.SUCCESS, user };
        } else {
          return { state: LOGIN_STATES.WRONG_PASSWORD };
        }
      } else {
        return { state: LOGIN_STATES.NOT_VALID };
      }
    } else {
      return "no user created";
    }
  }

  static setLoggedInUser(user) {
    sessionStorage.setItem("loggedInUser", JSON.stringify(user));
  }
  static getLoggedInUser() {
    return JSON.parse(sessionStorage.getItem("loggedInUser"));
  }
}

const ShowProducts = (products = []) => {
  const p = new Products();
  const ui = new UserInterface();

  if (products.length) {
    console.log("got products");
    ui.insertProductsInDom(products);
  } else {
    p.getProducts().then((data) => {
      // rendering products in the browser
      ui.insertProductsInDom(data);
      // saving products in the session storage
      Storage.saveProducts(data);
      ui.initialSetup();
      ui.getBagButtons();
      ui.cartFuntionality();
    });
  }
};

document.addEventListener("DOMContentLoaded", ShowProducts);

cartClose.addEventListener("click", () => {
  const ui = new UserInterface();
  ui.closeCart();
});

cartButton.addEventListener("click", () => {
  const ui = new UserInterface();
  ui.showCart();
});

btnBuy.onclick = () => {
  const ui = new UserInterface();
  let cartval = Storage.getCart();
  ui.addCartItemsToModel(cartval);
  ui.closeCart();
  ui.clearCart();
  buyModal.style.display = "block";
};

// clearCart.addEventListener("click", () => {
//   const ui = new UserInterface();
//   cart = [];
//   Storage.setCartItems(cart);
//   //setting the cart values
//   ui.setCartValues(cart);
//   //show cart values
//   ui.addCartItems(cart);
//   //removing show class
//   ui.closeCart();
//   //resetting buttons
//   ui.resetButtons();
// });

clearCart.onclick = () => {
  const ui = new UserInterface();
  ui.clearCart();
};

// open the modal on click
loginLink.onclick = function () {
  loginModal.style.display = "block";
};
signUpLink.onclick = function () {
  signUpModal.style.display = "block";
};

// close the modal on click
closeModal.forEach((el) => {
  el.onclick = function (e) {
    e.target.parentElement.parentElement.parentElement.style.display = "none";
  };
});

// close modal When the user clicks anywhere outside of the modal
window.onclick = function (event) {
  if (event.target == loginModal) {
    loginModal.style.display = "none";
  }
  if (event.target == signUpModal) {
    signUpModal.style.display = "none";
  }
};

searchButton.onclick = () => {
  const p = new Products();
  p.getProducts().then((products) => {
    let filteredProducts = products.filter((product) => {
      return product.title.includes(searchInput.value);
    });
    ShowProducts(filteredProducts);
  });
};

home.onclick = () => {
  searchInput.value = "";
  ShowProducts();
};

shop.onclick = () => {
  const ui = new UserInterface();
  ui.showCart();
};

// handle forms

const setLoggedInUser = (user) => {
  console.log("seeting user 111");
  Storage.setLoggedInUser(user);
  handleLoggedInState();
  console.log("seeting user 222");
  window.location.reload();
};

const handleLoggedInState = () => {
  const user = Storage.getLoggedInUser();
  if (user) {
    loginLink.style.display = "none";
    signUpLink.style.display = "none";
    LogoutLink.style.display = "block";
    userEl.style.display = "block";
    userEl.textContent = user.username;
    console.log(user);
  } else {
    LogoutLink.style.display = "none";
    userEl.style.display = "none";
  }
};

LogoutLink.onclick = () => {
  Storage.setLoggedInUser(null);
  window.location.reload();
};

signUpForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const signUpFormData = new FormData(signUpForm);
  const username = signUpFormData.get("username");
  const email = signUpFormData.get("email");
  const password = signUpFormData.get("password");
  Storage.createUser({ username, email, password });
  setLoggedInUser({ username, email, password });
  signUpForm.reset();
  e.target.parentElement.parentElement.style.display = "none";
});

logInForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const logInFormData = new FormData(logInForm);
  const email = logInFormData.get("email");
  const password = logInFormData.get("password");
  const response = Storage.getUser({ email, password });
  if (response.state === LOGIN_STATES.SUCCESS) {
    setLoggedInUser({ username, email, password });
    e.target.parentElement.parentElement.style.display = "none";
  } else if (response.state === LOGIN_STATES.WRONG_PASSWORD) {
    alert("Wrong Password!, Please try again");
  } else if (response.state === LOGIN_STATES.NOT_VALID) {
    alert("you are not an USER!, Please Sign Up first!");
  } else {
    alert("No user created yet, Please signup");
  }
  logInForm.reset();
});

document.addEventListener("DOMContentLoaded", handleLoggedInState);

// console.log(document.URL);

// let arr = [1,2,3]
// let val = 0;
// arr.forEach((el) => {
//   val += el
// })

// export
// import

// export const getProducts = async() => {
//   try {
//     const result = await fetch("data/products.json"); //returns response object
//     let products = await result.json(); // to get the data from response object
//     let data = products.items;
//     data = data.map((item) => {
//       const { title, price, type, rating } = item.fields;
//       const id = item.sys.id;
//       const url = item.fields.image.fields.file.url;
//       return { title, price, type, rating, id, url };
//     });
//     return data;
//   } catch (error) {
//     console.log(error);
//   }
// }

// import {getProducts} from './'
