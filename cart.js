const cartItemsDiv = document.getElementById("cartItems");
const totalPriceDiv = document.getElementById("totalPrice");
const clearCartBtn = document.getElementById("clearCart");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

displayCart();

function displayCart() {
    cartItemsDiv.innerHTML = "";

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = "<p>Votre panier est vide.</p>";
        totalPriceDiv.innerHTML = "";
        return;
    }

    cart.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("card");

        div.innerHTML = `
            <img src="${item.image}" width="80">
            <h3>${item.title}</h3>
            <p>${item.price} €</p>

            <div>
                <button onclick="changeQty(${item.id}, -1)">-</button>
                <span>${item.qty}</span>
                <button onclick="changeQty(${item.id}, 1)">+</button>
            </div>

            <button class="danger" onclick="removeItem(${item.id})">Supprimer</button>
        `;

        cartItemsDiv.appendChild(div);
    });

    updateTotal();
}

function changeQty(id, value) {
    let item = cart.find(p => p.id === id);

    item.qty += value;
    if (item.qty <= 0) removeItem(id);

    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
}

function removeItem(id) {
    cart = cart.filter(p => p.id !== id);
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
}

clearCartBtn.onclick = () => {
    localStorage.removeItem("cart");
    cart = [];
    displayCart();
};

function updateTotal() {
    let total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    totalPriceDiv.innerHTML = "Total : " + total.toFixed(2) + " €";
}
