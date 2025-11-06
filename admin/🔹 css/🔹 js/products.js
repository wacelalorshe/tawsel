// عرض المنتجات في المتجر
function displayProducts() {
    const container = document.getElementById('products-container');
    if (!container) return;

    // جلب المنتجات من localStorage
    const products = JSON.parse(localStorage.getItem('storeProducts')) || [];
    
    container.innerHTML = '';

    if (products.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center">
                <p class="text-muted">لا توجد منتجات متاحة حالياً</p>
                <a href="admin/dashboard.html" class="btn btn-primary">إضافة منتجات من لوحة التحكم</a>
            </div>
        `;
        return;
    }

    products.forEach(product => {
        const productCard = `
            <div class="col-md-4 mb-4">
                <div class="card h-100">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}" style="height: 200px; object-fit: cover;">
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

// إضافة إلى السلة (وظيفة أساسية)
function addToCart(productId) {
    const products = JSON.parse(localStorage.getItem('storeProducts')) || [];
    const product = products.find(p => p.id === productId);
    
    if (product) {
        alert(`تم إضافة ${product.name} إلى السلة`);
        // هنا يمكنك إضافة منطق السلة
    }
}

// تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    displayProducts();
});
