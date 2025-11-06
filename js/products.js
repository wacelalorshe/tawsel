// كود صفحة المنتجات مع Firebase
console.log('✅ تم تحميل صفحة المنتجات');

// عرض جميع المنتجات
async function displayAllProducts() {
    console.log('🔄 جلب المنتجات للعملاء...');
    
    const container = document.getElementById('products-container');
    const noProducts = document.getElementById('no-products');
    
    if (!container) return;

    try {
        const products = await getProductsFromFirebase();
        container.innerHTML = '';

        if (products.length === 0) {
            container.classList.add('d-none');
            if (noProducts) noProducts.classList.remove('d-none');
            return;
        }

        if (noProducts) noProducts.classList.add('d-none');
        container.classList.remove('d-none');

        products.forEach(product => {
            const productCard = `
                <div class="col-lg-4 col-md-6 mb-4" data-category="${product.category}" data-name="${product.name.toLowerCase()}">
                    <div class="card h-100 product-card">
                        <img src="${product.image}" class="card-img-top product-image" alt="${product.name}">
                        <div class="card-body">
                            <h5 class="card-title text-primary">${product.name}</h5>
                            <p class="card-text text-muted">${product.description}</p>
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="h4 text-success">$${product.price}</span>
                                <button class="btn btn-primary" onclick="addToCart('${product.id}')">
                                    🛒 أضف للسلة
                                </button>
                            </div>
                            <div class="mt-2">
                                <span class="badge bg-secondary">${product.category}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += productCard;
        });

        console.log('✅ تم عرض المنتجات:', products.length);
    } catch (error) {
        console.error('❌ خطأ في عرض المنتجات:', error);
    }
}

// التهيئة
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 صفحة المنتجات جاهزة');
    displayAllProducts();
    setupFilters();
    
    // تحديث تلقائي عند إضافة منتجات جديدة
    setupProductsListener(function(products) {
        console.log('🔄 تحديث تلقائي للمنتجات');
        displayAllProducts();
    });
});

// باقي الدوال تبقى كما هي (addToCart, setupFilters, filterProducts, etc.)
