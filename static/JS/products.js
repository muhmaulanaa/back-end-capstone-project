// ===========
// AUTO SLIDE
// ===========
var slideIndex = 0;
showSlides();

function showSlides() {
  var i;
  var slides = document.getElementsByClassName("slide");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slideIndex++;
  if (slideIndex > slides.length) {
    slideIndex = 1;
  }
  slides[slideIndex - 1].style.display = "block";
  setTimeout(showSlides, 3000); // Change after 3 second
}

function plusSlides(n) {
  showSlide((slideIndex += n));
}

function showSlide(n) {
  var slides = document.getElementsByClassName("slide");

  if (n > slides.length) {
    slideIndex = 1;
  }

  if (n < 1) {
    slideIndex = slides.length;
  }

  for (var i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }

  slides[slideIndex - 1].style.display = "block";
}

// =============
//fetching products from database
// =============
fetch("http://localhost:3000/products")
  .then((response) => response.json())
  .then((data) => {
    // Loop melalui data produk dan tambahkan setiap produk ke dalam DOM
    data.forEach((product) => {
      addProductToDOM(product);
    });
  });

//looping product to html structures
function addProductToDOM(product) {
  const menuItems = document.querySelector(".menu-item"); // Ganti dengan elemen HTML tempat menampilkan produk

  // Buat elemen div untuk menampilkan produk
  const productDiv = document.createElement("div");
  productDiv.className = "menu-items";
  productDiv.dataset.category = product.category;

  // Buat elemen gambar
  const img = document.createElement("img");
  img.src = product.imageSrc;
  img.alt = product.name;

  // Buat elemen judul produk
  const h3 = document.createElement("h3");
  h3.textContent = product.name;

  // Buat elemen harga produk
  const p = document.createElement("p");
  p.textContent = `Rp. ${parseFloat(product.price)}`;

  const button = document.createElement("button");
  button.className = "add-to-cart-button";
  button.innerHTML = '<i class="fa-solid fa-cart-plus"></i>Add to Cart';

  productDiv.appendChild(img);
  productDiv.appendChild(h3);
  productDiv.appendChild(p);
  productDiv.appendChild(button);
  menuItems.appendChild(productDiv);
}


// ===============
// Shopping  cart
// ===============
let cartTotal = 0;
let cartQuantity = 0;

const list = document.querySelector(".card .list");

function addToCartAndUpdate(itemName, itemPrice, itemImageSrc) {
  const cartList = document.querySelector(".cart-list");

  // Cari apakah produk sudah ada dalam keranjang
  const existingCartItem = Array.from(cartList.children).find(
    (item) => item.dataset.productName === itemName
  );

  if (existingCartItem) {
    // Produk sudah ada dalam keranjang, tingkatkan jumlahnya
    const quantityDisplay = existingCartItem.querySelector(".quantity-display");
    const currentQuantity = parseInt(quantityDisplay.textContent);
    quantityDisplay.textContent = (currentQuantity + 1).toString();
  } else {
    const cartItem = document.createElement("li");
    cartItem.classList.add("cart-item");
    cartItem.dataset.productName = itemName;

    // Menambahkan gambar produk
    const itemImage = document.createElement("img");
    itemImage.src = itemImageSrc;
    itemImage.alt = itemName;
    cartItem.appendChild(itemImage);

    // Membuat elemen "item-info" untuk nama produk, harga, jumlah, tombol decrement, dan tombol increment
    const itemInfo = document.createElement("div");
    itemInfo.classList.add("item-info");

    const itemNameElement = document.createElement("h4");
    itemNameElement.textContent = itemName;
    itemInfo.appendChild(itemNameElement);

    const itemPriceElement = document.createElement("p");
    itemPriceElement.textContent = `Rp. ${itemPrice}`;
    itemInfo.appendChild(itemPriceElement);

    const itemQuantity = document.createElement("div");
    itemQuantity.classList.add("item-quantity");

    const decrementButton = document.createElement("button");
    decrementButton.classList.add("decrement"); // Menambahkan kelas "decrement"
    decrementButton.innerHTML = '<div class="button-text">-</div>'; // Menambahkan angka di dalam tombol
    decrementButton.addEventListener("click", () => {
      const currentQuantity = parseInt(quantityDisplay.textContent);
      if (currentQuantity > 1) {
        quantityDisplay.textContent = (currentQuantity - 1).toString();
        cartTotal -= itemPrice;
        document.querySelector(".total").textContent = `Rp. ${cartTotal}`;
      } else if (currentQuantity === 1) {
        cartList.removeChild(cartItem);
        cartTotal -= itemPrice;
        cartQuantity--;
        const cartIcon = document.querySelector(".quantity");
        cartIcon.textContent = cartQuantity.toString();

        // Perbarui tampilan jumlah produk di keranjang
        document.querySelector(".total").textContent = `Rp. ${cartTotal}`;
      }
    });
    itemQuantity.appendChild(decrementButton);
    //Deafult jumlah barang
    const quantityDisplay = document.createElement("span");
    quantityDisplay.textContent = "1";
    quantityDisplay.classList.add("quantity-display");
    itemQuantity.appendChild(quantityDisplay);

    const incrementButton = document.createElement("button");
    incrementButton.classList.add("increment"); // Menambahkan kelas "increment"
    incrementButton.innerHTML = '<div class="button-text">+</div>'; // Menambahkan angka di dalam tombol
    incrementButton.addEventListener("click", () => {
      const currentQuantity = parseInt(quantityDisplay.textContent);
      quantityDisplay.textContent = (currentQuantity + 1).toString();
      cartTotal += itemPrice;
      document.querySelector(".total").textContent = `Rp. ${cartTotal}`;
    });
    itemQuantity.appendChild(incrementButton);
    itemInfo.appendChild(itemQuantity);
    cartItem.appendChild(itemInfo);
    cartList.appendChild(cartItem);
  }

  // Perbarui total dan jumlah item di dalam keranjang
  cartTotal += itemPrice;
  cartQuantity++;

  document.querySelector(".total").textContent = `Rp. ${cartTotal}`;
  document.querySelector(".quantity").textContent = cartQuantity;

  document.querySelector(".quantity").textContent = cartQuantity.toString();
}

//add event to button add-to-cart
document.querySelector(".menu-item").addEventListener("click", (event) => {
  if (event.target.classList.contains("add-to-cart-button")) {
    //cek apakah user sudah login
    const token = localStorage.getItem("token");
    if(!token){
      alert("Silahkan login untuk aksi ini!");
      return;
    }

    //jika pengguna sudah login lanjut seperti biasa
    const productDiv = event.target.closest(".menu-items"); // Mencari elemen terdekat dengan class "menu-items"
    if (productDiv) {
      const productName = productDiv.querySelector("h3").textContent;
      const productPriceText = productDiv.querySelector("p").innerText;
      const cleanedPriceText = productPriceText
        .replace("Rp. ", "")
        .replace(",", "");
      const productPrice = parseFloat(cleanedPriceText);
      const productImageSrc = productDiv.querySelector("img").src;

      addToCartAndUpdate(productName, productPrice, productImageSrc);
    }
  }
});

//Fetch to backend for processing shopping cart
const checkoutButton = document.querySelector(".checkout");
console.log(checkoutButton);

checkoutButton.addEventListener("click", function() {
  // Dapatkan data keranjang dari variabel atau elemen HTML yang menyimpannya
  const cartItems = Array.from(document.querySelectorAll(".cart-item")).map(item => {
    const productName = item.dataset.productName;
    
    // Periksa apakah elemen .item-price dan .quantity-display ada
    const itemPriceElement = item.querySelector("p");
    const quantityDisplayElement = item.querySelector(".quantity-display");    
    
    // Cek apakah elemen-elemen tersebut ada
    if (itemPriceElement && quantityDisplayElement) {
      const itemPrice = parseFloat(itemPriceElement.textContent.replace("Rp. ", ""));
      const quantity = parseInt(quantityDisplayElement.textContent);
      return {
        productName,
        itemPrice,
        quantity
      };
    } else {
      // Tindakan jika elemen tidak ditemukan (misalnya, lewati item ini)
      return null;
    }
  });

  // Hapus item yang tidak ditemukan dari hasil pemetaan
  const validCartItems = cartItems.filter(item => item !== null);

  // Dapatkan token dari local storage
  const token = localStorage.getItem("token");

  // Jika tidak ada item dalam keranjang, beri peringatan
  if (validCartItems.length === 0) {
    alert("Keranjang belanja kosong. Tambahkan produk ke keranjang terlebih dahulu.");
    return;
  }

  // Buat data keranjang untuk dikirim ke server
  const cartData = {
    items: validCartItems
  };
  console.log("Data Keranjang: ",cartData);
  // Lakukan permintaan HTTP untuk mengirim data keranjang ke server
  fetch("http://localhost:3000/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}` // Sertakan token untuk otorisasi
    },
    body: JSON.stringify(cartData),
  })
    .then(function(response) {
      if (response.ok) {
        return response.json();
      }
      return Promise.reject(response);
    })
    .then(function(data) {
      // Lakukan sesuatu setelah checkout berhasil, seperti membersihkan keranjang di frontend
      alert(data.message);
      // Hapus item dari keranjang
      document.querySelector(".cart-list").innerHTML = "";
      // Update tampilan jumlah produk di keranjang
      document.querySelector(".total").textContent = "Rp. 0";
    })
    .catch(function(error) {
      console.log(error);
    });
});


// Open and Close Shopping Cart
const shoppingCart = document.querySelector(".shopping img");
const closeShoppingCart = document.querySelector(".closeShopping");
const body = document.body;

shoppingCart.addEventListener("click", () => {
  body.classList.toggle("active");
});

closeShoppingCart.addEventListener("click", (event) => {
  if (event.target.classList.contains("closeShopping")) {
    body.classList.remove("active");
  }
});

// Fungsi untuk mengaktifkan filter berdasarkan kategori
const categoryOptions = document.querySelectorAll(".category-option");

function filterProducts(category) {
  const menuItems = document.querySelectorAll(".menu-items");

  menuItems.forEach((menuItem) => {
    const productCategory = menuItem.dataset.category;

    console.log(productCategory);
    if (category === "all" || category === productCategory) {
      console.log(productCategory);
      menuItem.style.display = "inline-block";
    } else {
      menuItem.style.display = "none";
    }
  });
}

categoryOptions.forEach((option) => {
  option.addEventListener("click", (event) => {
    event.preventDefault();

    categoryOptions.forEach((opt) => {
      opt.classList.remove("active");
    });

    // Tambahkan kelas "active" ke opsi kategori yang dipilih
    option.classList.add("active");

    // Ambil nilai data-category dari opsi kategori yang dipilih
    const selectedCategory = option.dataset.category;

    // Panggil fungsi untuk mengaktifkan filter
    filterProducts(selectedCategory);
  });
});

// berpindah halaman ke checkout.html
function redirectToPage() {
  if (cartQuantity > 0) {
    window.location.href = "http://localhost:3000/static/checkout.html";
  } else {
    alert("Shopping cart is empty. Add items to the cart before checkout.");
  }
}
