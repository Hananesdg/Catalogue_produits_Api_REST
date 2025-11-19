const productsContainer = document.getElementById("products");
const productDetail = document.getElementById("productDetail");

// Affichage d'un message en attendant
productsContainer.innerHTML = "<p>Chargement des produits...</p>";

// Chargement de la liste des produits
fetch("https://fakestoreapi.com/products")
    .then(res => res.json())
    .then(data => {
        productsContainer.innerHTML = ""; // Efface le message

        data.forEach(product => {
            const div = document.createElement("div");
            div.classList.add("card");

            div.innerHTML = `
                <img src="${product.image}" alt="">
                <h3>${product.title}</h3>
                <p><strong>${product.price} €</strong></p>
            `;

            div.addEventListener("click", () => showDetails(product.id));

            productsContainer.appendChild(div);
        });
    })
    .catch(() => {
        productsContainer.innerHTML = "<p style='color:red'>Erreur : impossible de charger les produits.</p>";
    });


// Fonction pour afficher le détail d’un produit
function showDetails(id) {
    productDetail.innerHTML = "<p>Chargement...</p>";
    productDetail.classList.remove("hidden");

    fetch(`https://fakestoreapi.com/products/${id}`)
        .then(res => res.json())
        .then(product => {
            productDetail.innerHTML = `
                <h2>${product.title}</h2>
                <img src="${product.image}">
                <p>${product.description}</p>
                <p><strong>Prix : ${product.price} €</strong></p>

                <button id="closeBtn">Fermer</button>
            `;

            document.getElementById("closeBtn").onclick = () => {
                productDetail.classList.add("hidden");
            };
        })
        .catch(() => {
            productDetail.innerHTML = "<p style='color:red'>Erreur : impossible d'afficher ce produit.</p>";
        });
}
