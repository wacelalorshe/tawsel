// كود الصفحة الرئيسية - الإصدار المصحح
console.log('🏠 تم تحميل الصفحة الرئيسية');

// جلب المنتجات من localStorage
function getProducts() {
    try {
        const products = JSON.parse(localStorage.getItem('storeProducts')) || [];
        console.log('📦 عدد المنتجات في الرئيسية:', products.length);
        return products;
    } catch (error) {
        console.error('❌ خطأ في جلب المنتجات:', error);
        return [];
    }
}

// عرض المنتجات المميزة في الصفحة الرئيسية
function displayFeaturedProducts() {
    const container = document.getElementById('featured-products');
    if (!container) return;

    const products = getProducts();
    container.innerHTML = '';

    // عرض آخر 6 منتجات
    const featuredProducts = products.slice(-6).reverse();

    if (featuredProducts.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center">
                <div class="alert alert-info">
                    <h4>🛍️ مرحبا بكم في متجرنا!</h4>
                    <p>لم يتم إضافة منتجات بعد</p>
                    <p class="small text-muted">استخدم لوحة التحكم لإضافة منتجاتك الأولى</p>
                    <a href="admin/dashboard.html" class="btn btn-primary mt-2">📊 لوحة التحكم</a>
                </div>
            </div>
        `;
        return;
    }

    console.log(`🎯 عرض ${featuredProducts.length} منتج في الرئيسية`);

    featuredProducts.forEach(product => {
        const productCard = `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="card h-100 product-card">
                    <img src="${product.image}" class="card-img-top product-image" alt="${product.name}"
                         onerror="this.src='https://via.placeholder.com/300x200/cccccc/666666?text=صورة+منتج'">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text text-muted">${product.description.substring(0, 100)}...</p>
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

// إضافة للسلة
function addToCart(productId) {
    const products = getProducts();
    const product = products.find(p => p.id === productId);
    
    if (product) {
        let cart = JSON.parse(localStorage.getItem('storeCart')) || [];
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }
        
        localStorage.setItem('storeCart', JSON.stringify(cart));
        alert(`✅ تم إضافة "${product.name}" إلى سلة التسوق`);
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

// اختبار البيانات
function testData() {
    console.log('🧪 اختبار البيانات في الرئيسية...');
    const products = getProducts();
    console.log('📊 المنتجات:', products);
}

// التهيئة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 الصفحة الرئيسية جاهزة');
    testData();
    displayFeaturedProducts();
    updateCartCount();
});
