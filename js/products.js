// بيانات المنتجات (تخزين محلي)
let products = JSON.parse(localStorage.getItem('storeProducts')) || [
    {
        id: 1,
        name: "لابتوب ديل",
        price: 2500,
        description: "لابتوب ممتاز للأعمال",
        image: "https://via.placeholder.com/300x200?text=Laptop",
        category: "إلكترونيات"
    },
    {
        id: 2,
        name: "هاتف سامسونج",
        price: 1800,
        description: "هاتف ذكي حديث",
        image: "https://via.placeholder.com/300x200?text=Phone",
        category: "إلكترونيات"
    }
];

// عرض المنتجات
function displayProducts() {
    const container = document.getElementById('products-container');
    if (!container) return;

    container.innerHTML = '';

    products.forEach(product => {
        const productCard = `
            <div class="col-md-4 mb-4">
                <div class="card h-100">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.description}</p>
                        <p class="card-text"><strong>السعر: $${product.price}</strong></p>
                        <button class="btn btn-primary" onclick="addToCart(${product.id})">أضف إلى السلة</button>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += productCard;
    });
}

// تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    displayProducts();
    updateProductsCount();
});
