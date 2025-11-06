// كود الصفحة الرئيسية
console.log('✅ تم تحميل الصفحة الرئيسية');

// عرض المنتجات المميزة في الصفحة الرئيسية
function displayFeaturedProducts() {
    const container = document.getElementById('featured-products');
    if (!container) return;

    const products = JSON.parse(localStorage.getItem('storeProducts')) || [];
    container.innerHTML = '';

    // عرض آخر 6 منتجات
    const featuredProducts = products.slice(-6).reverse();

    if (featuredProducts.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center">
                <div class="alert alert-info">
                    <h4>مرحبا بكم في متجرنا!</h4>
                    <p>سيتم إضافة المنتجات قريباً</p>
                    <a href="admin/dashboard.html" class="btn btn-primary">لوحة التحكم</a>
                </div>
            </div>
        `;
        return;
    }

    featuredProducts.forEach(product => {
        const productCard = `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="card h-100 product-card">
                    <img src="${product.image}" class="card-img-top product-image" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text text-muted">${product.description}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="h5 text-primary">$${product.price}</span>
                            <button class="btn btn-success" onclick="addToCart(${product.id})">
                                🛒 أضف للسلة
                            </button>
                        </div>
                        <small class="text-muted">${product.category}</small>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += productCard;
    });
}

// إضافة للسلة (وظيفة أساسية)
function addToCart(productId) {
    const products = JSON.parse(localStorage.getItem('storeProducts')) || [];
    const product = products.find(p => p.id === productId);
    
    if (product) {
        // الحصول على السلة الحالية
        let cart = JSON.parse(localStorage.getItem('storeCart')) || [];
        
        // التحقق إذا كان المنتج موجود بالفعل
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }
        
        // حفظ السلة
        localStorage.setItem('storeCart', JSON.stringify(cart));
        
        alert(`✅ تم إضافة ${product.name} إلى سلة التسوق`);
        updateCartCount();
    }
}

// تحديث عداد السلة
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('storeCart')) || [];
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// التهيئة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 الصفحة الرئيسية جاهزة');
    displayFeaturedProducts();
    updateCartCount();
});
