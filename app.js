const productsContainer = document.getElementById("products");
const productDetail = document.getElementById("productDetail");
const modalContent = document.getElementById("modalContent");

const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const sortSelect = document.getElementById("sortSelect");

let products = [];

/* =============== FETCH PRODUITS =============== */
fetch("https://fakestoreapi.com/products")
    .then(res => res.json())
    .then(data => {
        products = data;
        loadCategories();
        displayProducts(data);
    });

/* =============== AFFICHAGE CATALOGUE =============== */
function displayProducts(list) {
    productsContainer.innerHTML = "";

    list.forEach(product => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <img src="${product.image}">
            <h3>${product.title}</h3>
            <p><strong>${product.price} €</strong></p>
        `;

        card.onclick = () => showDetails(product);

        productsContainer.appendChild(card);
    });
}

/* =============== CATEGORIES =============== */
function loadCategories() {
    fetch("https://fakestoreapi.com/products/categories")
        .then(res => res.json())
        .then(cats => {
            categoryFilter.innerHTML = `<option value="">Toutes catégories</option>`;
            cats.forEach(c => {
                categoryFilter.innerHTML += `<option value="${c}">${c}</option>`;
            });
        });
}

/* =============== FILTRE & TRI =============== */
searchInput.addEventListener("input", applyFilters);
categoryFilter.addEventListener("change", applyFilters);
sortSelect.addEventListener("change", applyFilters);

function applyFilters() {
    let filtered = [...products];

    const q = searchInput.value.toLowerCase();
    filtered = filtered.filter(p => p.title.toLowerCase().includes(q));

    if (categoryFilter.value)
        filtered = filtered.filter(p => p.category === categoryFilter.value);

    switch (sortSelect.value) {
        case "price-asc": filtered.sort((a,b) => a.price - b.price); break;
        case "price-desc": filtered.sort((a,b) => b.price - a.price); break;
        case "az": filtered.sort((a,b) => a.title.localeCompare(b.title)); break;
        case "za": filtered.sort((a,b) => b.title.localeCompare(a.title)); break;
    }

    displayProducts(filtered);
}

/* =============== MODAL DETAILS =============== */
function showDetails(product) {
    modalContent.innerHTML = `
        <h2>${product.title}</h2>
        <img src="${product.image}">
        <p>${product.description}</p>
        <p><strong>${product.price} €</strong></p>

        <button class="addBtn" onclick="addToCart(${product.id})">Ajouter au panier</button>
        <button class="closeBtn" onclick="closeModal()">Fermer</button>
    `;

    productDetail.classList.remove("hidden");
}

function closeModal() {
    productDetail.classList.add("hidden");
}

productDetail.onclick = (e) => {
    if (e.target === productDetail) closeModal();
};

/* =============== PANIER =============== */
function addToCart(id) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let product = products.find(p => p.id === id);

    let existing = cart.find(item => item.id === id);

    if (existing) existing.qty++;
    else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            qty: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Produit ajouté au panier !");
}
