// كود صفحة المنتجات - الإصدار المصحح
console.log('🛒 تم تحميل صفحة المنتجات');

// جلب المنتجات من localStorage
function getProducts() {
    try {
        const products = JSON.parse(localStorage.getItem('storeProducts')) || [];
        console.log('📦 عدد المنتجات في المتجر:', products.length);
        console.log('📋 قائمة المنتجات:', products);
        return products;
    } catch (error) {
        console.error('❌ خطأ في جلب المنتجات:', error);
        return [];
    }
}

// عرض جميع المنتجات
function displayAllProducts() {
    console.log('🔄 بدء عرض المنتجات...');
    
    const container = document.getElementById('products-container');
    const noProducts = document.getElementById('no-products');
    
    if (!container) {
        console.log('❌ لم يتم العثور على products-container');
        return;
    }

    const products = getProducts();
    container.innerHTML = '';

    if (products.length === 0) {
        console.log('⚠️ لا توجد منتجات للعرض');
        container.classList.add('d-none');
        if (noProducts) noProducts.classList.remove('d-none');
        return;
    }

    console.log(`🎯 عرض ${products.length} منتج`);
    
    if (noProducts) noProducts.classList.add('d-none');
    container.classList.remove('d-none');

    products.forEach((product, index) => {
        console.log(`📝 عرض المنتج ${index + 1}:`, product.name);
        
        const productCard = `
            <div class="col-lg-4 col-md-6 mb-4" data-category="${product.category}" data-name="${product.name.toLowerCase()}">
                <div class="card h-100 product-card">
                    <img src="${product.image}" class="card-img-top product-image" alt="${product.name}" 
                         onerror="this.src='https://via.placeholder.com/300x200/cccccc/666666?text=صورة+غير+متاحة'">
                    <div class="card-body">
                        <h5 class="card-title text-primary">${product.name}</h5>
                        <p class="card-text text-muted">${product.description}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="h4 text-success">$${product.price}</span>
                            <button class="btn btn-primary" onclick="addToCart(${product.id})">
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

// فلترة المنتجات
function setupFilters() {
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');

    if (searchInput) {
        searchInput.addEventListener('input', filterProducts);
    }

    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterProducts);
    }
}

// تطبيق الفلترة
function filterProducts() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const category = document.getElementById('category-filter').value;
    
    const productCards = document.querySelectorAll('#products-container .col-lg-4');
    
    let visibleCount = 0;
    
    productCards.forEach(card => {
        const productName = card.getAttribute('data-name');
        const productCategory = card.getAttribute('data-category');
        
        const matchesSearch = productName.includes(searchTerm);
        const matchesCategory = !category || productCategory === category;
        
        if (matchesSearch && matchesCategory) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    // إظهار رسالة إذا لم توجد نتائج
    const noResults = document.getElementById('no-products');
    if (noResults) {
        if (visibleCount === 0 && (searchTerm || category)) {
            noResults.innerHTML = `
                <div class="alert alert-warning text-center">
                    <h4>⚠️ لا توجد نتائج</h4>
                    <p>لم نتمكن من العثور على منتجات تطابق بحثك</p>
                    <button class="btn btn-primary" onclick="resetFilters()">إعادة تعيين الفلتر</button>
                </div>
            `;
            noResults.classList.remove('d-none');
        } else {
            noResults.classList.add('d-none');
        }
    }
}

// إعادة تعيين الفلتر
function resetFilters() {
    document.getElementById('search-input').value = '';
    document.getElementById('category-filter').value = '';
    displayAllProducts();
}

// اختبار البيانات
function testData() {
    console.log('🧪 اختبار البيانات...');
    const products = getProducts();
    console.log('📊 المنتجات في localStorage:', products);
    
    // إضافة بيانات تجريبية إذا لم توجد
    if (products.length === 0) {
        console.log('⚠️ لا توجد منتجات، جرب إضافة منتج من لوحة التحكم');
        alert('⚠️ لا توجد منتجات! اذهب إلى لوحة التحكم وأضف بعض المنتجات أولاً.');
    }
}

// التهيئة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 صفحة المنتجات جاهزة');
    testData();
    displayAllProducts();
    setupFilters();
    updateCartCount();
});
