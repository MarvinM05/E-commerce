/*====Carrito==== */

//#1 Base de datos

const db = [
  {
    id: 1,
    name: "Hoodie #YOSOYTICO Gold Edition",
    price: 65.5,
    image: "assets/img/sueter-dorado.png",
    category: "tdmax",
    quantity: 5,
  },
  {
    id: 2,
    name: "Gorra #YOSOYTICO PLANA",
    price: 31.7,
    image: "assets/img/gorra-plana.png",
    category: "tdmax",
    quantity: 3,
  },
  {
    id: 3,
    name: "#YOSOYTICO #elequipodesugente",
    price: 31.7,
    image: "assets/img/gorra3.png",
    category: "tdmax",
    quantity: 5,
  },
  {
    id: 4,
    name: "Gorra Mapa CR Gold Edition",
    price: 35,
    image: "assets/img/gorra-life.png",
    category: "tdmax",
    quantity: 5,
  },
  {
    id: 5,
    name: "T-Shirt #YOSOYTICO",
    price: 25,
    image: "assets/img/camisa.png",
    category: "tdmax",
    quantity: 3,
  },
  {
    id: 6,
    name: "Straw Lifeguard Hat #YOSOYTICO",
    price: 50,
    image: "assets/img/sombrero-men.png",
    category: "tdmax",
    quantity: 5,
  },
  {
    id: 8,
    name: "Orquídea 2",
    price: 25,
    image: "assets/img/orq2-1.png",
    category: "orquideas",
    quantity: 3,
  },
  {
    id: 9,
    name: "Orquídea 3",
    price: 50,
    image: "assets/img/orq3.png",
    category: "orquideas",
    quantity: 5,
  },
  {
    id: 10,
    name: "Orquídea 1",
    price: 35,
    image: "assets/img/orq1-3.png",
    category: "orquideas",
    quantity: 5,
  },
  {
    id: 11,
    name: "Medias Costa Rica Fabrizzio Berrocal",
    price: 25,
    image: "assets/img/medias.png",
    category: "otrosProductos",
    quantity: 3,
  },
  {
    id: 12,
    name: "Straw Lifeguard Hat #YOSOYTICO",
    price: 50,
    image: "assets/img/sombrero2.png",
    category: "otrosProductos",
    quantity: 5,
  },
  {
    id: 13,
    name: "Nueva Gorra Morgan y los Súper Bichillos",
    price: 50,
    image: "assets/img/gorra-morgan.png",
    category: "otrosProductos",
    quantity: 5,
  },
];

const products = window.localStorage.getItem('productsDB') ? JSON.parse(window.localStorage.getItem('productsDB')) : db
// const products = db;

//#2 display productos en el DOM
const productContainer = document.getElementById("products__content");
function displayProducts() {
  let html = "";
  for (const product of products) {
    html += `<article class="products__card ${product.category}">
            <div class="products__shape">
              <img src="${product.image}" alt="${product.name}" class="products__img">
            </div>

            <div class="products__data">
              <h2 class="products__name">${product.name}</h2>
              <div class="">
                <h3 class="products__price">$${product.price}</h3>
                <span class="products__quantity">Quedan solo ${product.quantity} unidades</span>
              </div>
              <button type="button" class="button products__button addToCart" data-id="${product.id}">
                <i class="bx bx-plus"></i>
              </button>
            </div>
          </article>`;
  }
  productContainer.innerHTML = html;
  window.localStorage.setItem("productsDB", JSON.stringify(products));
}

displayProducts();

//#3 Crear el Carrito de compra
let cart = window.localStorage.getItem("cartDB")
  ? JSON.parse(window.localStorage.getItem("cartDB"))
  : [];
const cartContainer = document.getElementById("cart__container");
const cartCounter = document.getElementById("cart-count");
const itemCounter = document.getElementById("items-count");
const totalPrice = document.getElementById("cart-total");

function displayCart() {
  let html = "";
  for (const article of cart) {
    const product = products.find((p) => p.id === article.id);
    html += `<article class="cart__card">
        <div class="cart__box">
          <img src="${product.image}" alt="${product.name}" class="cart__img">
        </div>

        <div class="cart__details">
          <h3 class="cart__title">${product.name} <span class="cart__price">$${
      product.price
    }</span></h3>

          <div class="cart__amount">
            <div class="cart__amount-content">
              <span class="cart__amount-box removeToCart" data-id="${
                product.id
              }">
                <i class="bx bx-minus"></i>
              </span>

              <span class="cart__amount-number">${article.qty}</span>

              <span class="cart__amount-box addToCart" data-id="${product.id}">
                <i class="bx bx-plus"></i>
              </span>
            </div>

            <i class="bx bx-trash-alt cart__amount-trash deleteToCart" data-id="${
              product.id
            }"></i>
          </div>

          <span class="cart__subtotal">
            <span class="cart__stock">Quedan ${
              product.quantity - article.qty
            } unidades</span>
            <span class="cart__subtotal-price">${
              product.price * article.qty
            }</span>
          </span>
        </div>
      </article>`;
  }
  cartContainer.innerHTML = html;
  cartCounter.innerHTML = totalArticles();
  itemCounter.innerHTML = totalArticles();
  totalPrice.innerHTML = numberToCurrency(totalAmount());
  checkButtons();
  window.localStorage.setItem("cartDB", JSON.stringify(cart));
}
displayCart();

//#4 Agregar productos al carrito
function addToCart(id, qty = 1) {
  const product = products.find((p) => p.id === id);
  if (product && product.quantity > 0) {
    const article = cart.find((a) => a.id === id);

    if (article) {
      if (checkStock(id, qty + article.qty)) {
        article.qty++;
      } else {
        Swal.fire("No hay suficiente stock", "Finalizar!", "info");
      }
    } else {
      cart.push({ id, qty });
    }
  } else {
    Swal.fire("Gracias por tu compra", "Finalizar!", "info");
  }
  displayCart();
}

function checkStock(id, qty) {
  const product = products.find((p) => p.id === id);
  return product.quantity - qty >= 0;
}

//#5 Remover articulos del carrito
function removeFromCart(id, qty = 1) {
  const article = cart.find((a) => a.id === id);

  if (article && article.qty - qty > 0) {
    article.qty--;
  } else {
    const confirm = window.confirm("Estás seguro?");
    if (confirm) {
      cart = cart.filter((a) => a.id !== id);
    }
  }
  displayCart();

}

//#6 Eliminar todo del carrito
function deleteFromCart(id) {
  //   const article = cart.find((a) => a.id === id);
  //   cart.splice(cart.indexOf(article), 1);
  //   displayCart();
  Swal.fire({
    title: "Estas seguro?",
    text: "Perderas los productos seleccionados!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, Eliminarlo!",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire("Eliminado!", "Gestión exitosa.", "success");
      const article = cart.find((a) => a.id === id);
      cart.splice(cart.indexOf(article), 1);
      displayCart();
    }
  });
}

//#7 Contar Articulos
function totalArticles() {
  return cart.reduce((acc, article) => acc + article.qty, 0);
}

//#8 Total a cobrar
function totalAmount() {
  return cart.reduce((acc, article) => {
    const product = products.find((p) => p.id === article.id);
    return acc + product.price * article.qty;
  }, 0);
}

//#9 Limpiar Carrito
function clearCart() {
  cart = [];
  displayCart();
}

//#10 funcion checkout
function checkout() {
  cart.forEach((article) => {
    const product = products.find((p) => p.id === article.id);

    product.quantity -= article.qty;
  });
  Swal.fire("Gracias por tu compra", "Finalizar!", "success");
  clearCart();
  displayProducts();
  displayCart();
}

//Activar botones de compra y limpiar
function checkButtons() {
  if (cart.length > 0) {
    document.getElementById("cart-checkout").removeAttribute("disabled");
    document.getElementById("cart-empty").removeAttribute("disabled");
  } else {
    document
      .getElementById("cart-checkout")
      .setAttribute("disabled", "disabled");
    document.getElementById("cart-empty").setAttribute("disabled", "disabled");
  }
}

function numberToCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

/*Agregando Eventos a los botones */

const home__content = document.getElementById('home__content')

home__content.addEventListener('click', function (e) {
  const add = e.target.closest('.home__button')
  if (add) {
    const id = +add.dataset.id;
    addToCart(id);
  }
})

productContainer.addEventListener("click", function (e) {
  const add = e.target.closest(".addToCart");

  if (add) {
    const id = +add.dataset.id;
    addToCart(id);
  }
});

cartContainer.addEventListener("click", function (e) {
  const remove = e.target.closest(".removeToCart");
  const add = e.target.closest(".addToCart");
  const deleteCart = e.target.closest(".deleteToCart");

  if (remove) {
    const id = +remove.dataset.id;
    removeFromCart(id);
  }
  if (add) {
    const id = +add.dataset.id;
    addToCart(id);
  }
  if (deleteCart) {
    const id = +deleteCart.dataset.id;
    deleteFromCart(id);
  }
});

const actionButtons = document.getElementById("action-buttons");

actionButtons.addEventListener("click", function (e) {
  const clear = e.target.closest("#cart-empty");
  const buy = e.target.closest("#cart-checkout");

  if (clear) {
    Swal.fire({
      title: "Estas seguro?",
      text: "Perderas los productos seleccionados!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminarlo!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Eliminado", "Gestión exitosa.", "success");

        clearCart();
      }
    });
  }
  if (buy) {
    checkout();
  }
});

const filterContent = document.getElementById("filter__content");

function stocks(product) {
  let fragment = ``;
  let obj = {};

  for (const i of product) {
    if (obj[i.category]) {
      obj[i.category]++;
    } else {
      obj[i.category] = 1;
    }
  }

  fragment += `   <li class="products__item products__line" data-filter="all" category="all">
            <h3 class="products__title">
              Mostrar todo
            </h3>
            <span class="products__stock">
              Mostrar todos los productos
            </span>
          </li>`;

  for (const key in obj) {
    if (key == "orquideas") {
      fragment += `<li class="products__item products__line" data-filter=".orquideas">
            <h3 class="products__title">
              Orquídeas
            </h3>
            <span class="products__stock">
              ${obj[key]} productos
            </span>
          </li>`;
    }
    if (key == "tdmax") {
      fragment += `<li class="products__item products__line active-product" data-filter=".tdmax">
            <h3 class="products__title">
              #YOSOYTICO
            </h3>
            <span class="products__stock">
              ${obj[key]} productos
            </span>
          </li>
`;
    }
    if (key == "otrosProductos") {
      fragment += ` <li class="products__item" data-filter=".otrosProductos">
            <h3 class="products__title">
              Descubrir
            </h3>
            <span class="products__stock">
              ${obj[key]} productos
            </span>
          </li>`;
    }
  }

  console.log(filterContent.innerHTML);
  console.log(fragment.appendChild);
  filterContent.innerHTML = fragment;
}

stocks(db);
