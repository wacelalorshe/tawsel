// كود صفحة المنتجات مع Firebase
console.log('✅ تم تحميل صفحة المنتجات');

// عرض جميع المنتجات
async function displayAllProducts(searchTerm = '') {
    console.log('🔄 جلب المنتجات للعملاء...');
    
    const container = document.getElementById('products-container');
    const noProducts = document.getElementById('no-products');
    
    if (!container) return;

    try {
        let products;
        if (searchTerm) {
            products = await searchProducts(searchTerm);
        } else {
            products = await getProductsFromFirebase();
        }
        
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
                        <div class="position-relative">
                            <img src="${product.image}" class="card-img-top product-image" alt="${product.name}">
                            <span class="badge bg-primary position-absolute top-0 start-0 m-2">${product.category}</span>
                        </div>
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title text-primary">${product.name}</h5>
                            <p class="card-text text-muted flex-grow-1">${product.description}</p>
                            <div class="d-flex justify-content-between align-items-center mt-auto">
                                <span class="h4 text-success price-tag">$${product.price}</span>
                                <div>
                                    <button class="btn btn-primary me-2" onclick="addToCart('${product.id}')">
                                        <i class="fas fa-cart-plus me-1"></i>أضف للسلة
                                    </button>
                                    ${product.purchaseLink ? `<a href="${product.purchaseLink}" target="_blank" class="btn btn-success">
                                        <i class="fas fa-shopping-cart me-1"></i>شراء
                                    </a>` : ''}
                                </div>
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

// البحث في الصفحة
function setupSearch() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    
    if (searchParam) {
        document.getElementById('search-input').value = searchParam;
        displayAllProducts(searchParam);
    }
    
    document.getElementById('search-input').addEventListener('input', function(e) {
        displayAllProducts(e.target.value);
    });
}

// التهيئة
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 صفحة المنتجات جاهزة');
    setupSearch();
    setupFilters();
    
    // تحديث تلقائي عند إضافة منتجات جديدة
    if (typeof setupProductsListener === 'function') {
        setupProductsListener(function(products) {
            console.log('🔄 تحديث تلقائي للمنتجات');
            displayAllProducts();
        });
    }
});
