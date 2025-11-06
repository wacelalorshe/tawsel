// كود الصفحة الرئيسية مع Firebase
console.log('✅ تم تحميل الصفحة الرئيسية');

// عرض المنتجات المميزة
async function displayFeaturedProducts() {
    const container = document.getElementById('featured-products');
    if (!container) return;

    try {
        const products = await getProductsFromFirebase();
        container.innerHTML = '';

        // عرض آخر 6 منتجات
        const featuredProducts = products.slice(-6).reverse();

        if (featuredProducts.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center">
                    <div class="alert alert-info">
                        <h4>🛍️ مرحبا بكم في متجرنا!</h4>
                        <p>لم يتم إضافة منتجات بعد</p>
                        <a href="admin/dashboard.html" class="btn btn-primary mt-2">📊 إضافة منتجات</a>
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
                            <p class="card-text text-muted">${product.description.substring(0, 100)}...</p>
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="h5 text-primary">$${product.price}</span>
                                <button class="btn btn-success" onclick="addToCart('${product.id}')">
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
    } catch (error) {
        console.error('❌ خطأ في عرض المنتجات المميزة:', error);
    }
}

// التهيئة
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 الصفحة الرئيسية جاهزة');
    displayFeaturedProducts();
    
    // تحديث تلقائي
    setupProductsListener(function(products) {
        displayFeaturedProducts();
    });
});
