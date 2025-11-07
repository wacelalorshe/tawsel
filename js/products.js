// كود صفحة المنتجات مع Firebase
console.log('✅ تم تحميل صفحة المنتجات');

// متغيرات عامة
let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
const productsPerPage = 9;
let currentView = 'grid';
let currentCategory = '';
let currentSearchTerm = '';
let currentSort = 'newest';

// التحقق من توفر الدوال المطلوبة
function checkRequiredFunctions() {
    const requiredFunctions = ['getProductsFromFirebase', 'addToCart', 'buyNow'];
    const missingFunctions = [];
    
    requiredFunctions.forEach(func => {
        if (typeof window[func] === 'undefined') {
            missingFunctions.push(func);
        }
    });
    
    if (missingFunctions.length > 0) {
        console.error('❌ الدوال المطلوبة غير متاحة:', missingFunctions);
        return false;
    }
    
    return true;
}

// عرض جميع المنتجات
async function displayAllProducts(page = 1, append = false) {
    console.log('🔄 جلب المنتجات للعملاء...');
    
    const container = document.getElementById('products-container');
    const noProducts = document.getElementById('no-products');
    const resultsInfo = document.getElementById('results-info');
    const loadMoreContainer = document.getElementById('load-more-container');
    
    if (!container) return;

    // التحقق من توفر الدوال المطلوبة
    if (!checkRequiredFunctions()) {
        container.innerHTML = `
            <div class="col-12 text-center">
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    <h5>خطأ في تحميل النظام</h5>
                    <p class="mb-3">بعض الملفات المطلوبة غير محملة بشكل صحيح</p>
                    <button class="btn btn-outline-danger" onclick="location.reload()">
                        <i class="fas fa-redo me-2"></i>إعادة تحميل الصفحة
                    </button>
                </div>
            </div>
        `;
        return;
    }

    try {
        // إذا كانت هذه هي الصفحة الأولى، إعادة تعيين البيانات
        if (page === 1) {
            allProducts = await getProductsFromFirebase();
            applyFiltersAndSort();
        }

        if (!append) {
            container.innerHTML = `
                <div class="col-12 text-center">
                    <div class="loading-spinner"></div>
                    <p class="mt-3">جاري تحميل المنتجات...</p>
                </div>
            `;
        }

        if (filteredProducts.length === 0) {
            container.innerHTML = '';
            container.classList.add('d-none');
            if (noProducts) noProducts.classList.remove('d-none');
            if (resultsInfo) resultsInfo.innerHTML = 'لم يتم العثور على منتجات';
            if (loadMoreContainer) loadMoreContainer.classList.add('d-none');
            return;
        }

        // حساب المنتجات للصفحة الحالية
        const startIndex = (page - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        const productsToShow = filteredProducts.slice(startIndex, endIndex);

        if (!append) {
            container.innerHTML = '';
        }

        if (noProducts) noProducts.classList.add('d-none');
        container.classList.remove('d-none');

        // تحديث معلومات النتائج
        if (resultsInfo) {
            const total = filteredProducts.length;
            const showing = Math.min(endIndex, total);
            resultsInfo.innerHTML = `عرض ${showing} من ${total} منتج`;
        }

        // عرض المنتجات
        productsToShow.forEach(product => {
            const productCard = currentView === 'grid' ? 
                createGridProductCard(product) : 
                createListProductCard(product);
            
            container.innerHTML += productCard;
        });

        // التحكم في زر تحميل المزيد
        if (loadMoreContainer) {
            const hasMoreProducts = endIndex < filteredProducts.length;
            if (hasMoreProducts) {
                loadMoreContainer.classList.remove('d-none');
                document.getElementById('load-more-btn').onclick = () => loadMoreProducts();
            } else {
                loadMoreContainer.classList.add('d-none');
            }
        }

        // إظهار عناصر التحكم في العرض
        document.getElementById('view-controls').classList.remove('d-none');

        console.log('✅ تم عرض المنتجات:', productsToShow.length);

    } catch (error) {
        console.error('❌ خطأ في عرض المنتجات:', error);
        container.innerHTML = `
            <div class="col-12 text-center">
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    <h5>حدث خطأ في تحميل المنتجات</h5>
                    <p class="mb-3">${error.message}</p>
                    <button class="btn btn-outline-danger" onclick="displayAllProducts()">
                        <i class="fas fa-redo me-2"></i>إعادة المحاولة
                    </button>
                </div>
            </div>
        `;
    }
}

// إنشاء بطاقة منتج بتصميم الشبكة
function createGridProductCard(product) {
    const isInCart = window.isInCart ? window.isInCart(product.id) : false;
    const cartQuantity = window.getCartQuantity ? window.getCartQuantity(product.id) : 0;
    
    return `
        <div class="col-lg-4 col-md-6 mb-4">
            <div class="card h-100 product-card">
                <div class="position-relative overflow-hidden">
                    <img src="${product.image}" class="card-img-top product-image" alt="${product.name}"
                         onerror="this.src='https://via.placeholder.com/300x200/cccccc/ffffff?text=صورة+غير+متاحة'">
                    <span class="badge bg-primary product-badge">${product.category}</span>
                    ${product.purchaseLink ? `
                        <span class="badge bg-success position-absolute top-0 end-0 m-2">متوفر للشراء</span>
                    ` : ''}
                </div>
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text text-muted flex-grow-1">${product.description}</p>
                    
                    <div class="product-meta mb-3">
                        ${product.restaurantName ? `
                            <div class="d-flex align-items-center mb-2">
                                <i class="fas fa-store text-muted me-2"></i>
                                <small class="text-muted">${product.restaurantName}</small>
                            </div>
                        ` : ''}
                        <div class="d-flex align-items-center">
                            <i class="fas fa-tag text-muted me-2"></i>
                            <small class="text-muted">${product.category}</small>
                        </div>
                    </div>
                    
                    <div class="d-flex justify-content-between align-items-center mt-auto">
                        <span class="h5 text-primary price-tag">$${product.price}</span>
                        <div class="d-flex gap-2">
                            ${isInCart ? `
                                <div class="d-flex align-items-center">
                                    <button class="btn btn-sm btn-outline-secondary" onclick="updateCartQuantity('${product.id}', ${cartQuantity - 1})">
                                        <i class="fas fa-minus"></i>
                                    </button>
                                    <span class="mx-2 fw-bold">${cartQuantity}</span>
                                    <button class="btn btn-sm btn-outline-secondary" onclick="updateCartQuantity('${product.id}', ${cartQuantity + 1})">
                                        <i class="fas fa-plus"></i>
                                    </button>
                                </div>
                            ` : `
                                <button class="btn btn-success" 
                                        onclick="addToCart('${product.id}', '${product.name}', ${product.price}, '${product.image}', '${product.restaurantId || ''}', '${product.restaurantName || ''}')">
                                    <i class="fas fa-cart-plus me-1"></i>أضف للسلة
                                </button>
                            `}
                            <button class="btn btn-primary" 
                                    onclick="buyNow('${product.id}', '${product.name}', ${product.price}, '${product.image}', '${product.restaurantId || ''}', '${product.restaurantName || ''}')">
                                <i class="fas fa-bolt me-1"></i>شراء الآن
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// إنشاء بطاقة منتج بتصميم القائمة
function createListProductCard(product) {
    const isInCart = window.isInCart ? window.isInCart(product.id) : false;
    const cartQuantity = window.getCartQuantity ? window.getCartQuantity(product.id) : 0;
    
    return `
        <div class="col-12 mb-4">
            <div class="card product-card">
                <div class="row g-0">
                    <div class="col-md-4">
                        <div class="position-relative h-100">
                            <img src="${product.image}" class="product-image w-100 h-100" alt="${product.name}"
                                 style="object-fit: cover;"
                                 onerror="this.src='https://via.placeholder.com/300x200/cccccc/ffffff?text=صورة+غير+متاحة'">
                            <span class="badge bg-primary product-badge">${product.category}</span>
                        </div>
                    </div>
                    <div class="col-md-8">
                        <div class="card-body d-flex flex-column h-100">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text text-muted flex-grow-1">${product.description}</p>
                            
                            <div class="product-meta mb-3">
                                ${product.restaurantName ? `
                                    <div class="d-flex align-items-center mb-2">
                                        <i class="fas fa-store text-muted me-2"></i>
                                        <small class="text-muted">${product.restaurantName}</small>
                                    </div>
                                ` : ''}
                                <div class="d-flex align-items-center">
                                    <i class="fas fa-tag text-muted me-2"></i>
                                    <small class="text-muted">${product.category}</small>
                                </div>
                            </div>
                            
                            <div class="d-flex justify-content-between align-items-center mt-auto">
                                <span class="h5 text-primary price-tag">$${product.price}</span>
                                <div class="d-flex gap-2">
                                    ${isInCart ? `
                                        <div class="d-flex align-items-center">
                                            <button class="btn btn-sm btn-outline-secondary" onclick="updateCartQuantity('${product.id}', ${cartQuantity - 1})">
                                                <i class="fas fa-minus"></i>
                                            </button>
                                            <span class="mx-2 fw-bold">${cartQuantity}</span>
                                            <button class="btn btn-sm btn-outline-secondary" onclick="updateCartQuantity('${product.id}', ${cartQuantity + 1})">
                                                <i class="fas fa-plus"></i>
                                            </button>
                                        </div>
                                    ` : `
                                        <button class="btn btn-success" 
                                                onclick="addToCart('${product.id}', '${product.name}', ${product.price}, '${product.image}', '${product.restaurantId || ''}', '${product.restaurantName || ''}')">
                                            <i class="fas fa-cart-plus me-1"></i>أضف للسلة
                                        </button>
                                    `}
                                    <button class="btn btn-primary" 
                                            onclick="buyNow('${product.id}', '${product.name}', ${product.price}, '${product.image}', '${product.restaurantId || ''}', '${product.restaurantName || ''}')">
                                        <i class="fas fa-bolt me-1"></i>شراء الآن
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// تطبيق الفلاتر والترتيب
function applyFiltersAndSort() {
    filteredProducts = [...allProducts];
    
    // تطبيق البحث
    if (currentSearchTerm) {
        filteredProducts = filteredProducts.filter(product => 
            product.name.toLowerCase().includes(currentSearchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(currentSearchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(currentSearchTerm.toLowerCase()) ||
            (product.restaurantName && product.restaurantName.toLowerCase().includes(currentSearchTerm.toLowerCase()))
        );
    }
    
    // تطبيق تصفية الفئة
    if (currentCategory) {
        filteredProducts = filteredProducts.filter(product => 
            product.category === currentCategory
        );
    }
    
    // تطبيق الترتيب
    switch (currentSort) {
        case 'newest':
            filteredProducts.sort((a, b) => new Date(b.dateAdded || b.createdAt) - new Date(a.dateAdded || a.createdAt));
            break;
        case 'oldest':
            filteredProducts.sort((a, b) => new Date(a.dateAdded || a.createdAt) - new Date(b.dateAdded || b.createdAt));
            break;
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name, 'ar'));
            break;
    }
    
    updateActiveFilters();
}

// تحديث الفلاتر النشطة
function updateActiveFilters() {
    const activeFiltersContainer = document.getElementById('active-filters');
    activeFiltersContainer.innerHTML = '';
    
    let hasActiveFilters = false;
    
    if (currentSearchTerm) {
        activeFiltersContainer.innerHTML += `
            <div class="filter-tag">
                بحث: "${currentSearchTerm}"
                <span class="close" onclick="clearSearch()">×</span>
            </div>
        `;
        hasActiveFilters = true;
    }
    
    if (currentCategory) {
        activeFiltersContainer.innerHTML += `
            <div class="filter-tag">
                فئة: ${currentCategory}
                <span class="close" onclick="clearCategory()">×</span>
            </div>
        `;
        hasActiveFilters = true;
    }
    
    if (hasActiveFilters) {
        activeFiltersContainer.classList.remove('d-none');
    } else {
        activeFiltersContainer.classList.add('d-none');
    }
}

// مسح البحث
function clearSearch() {
    currentSearchTerm = '';
    document.getElementById('search-input').value = '';
    applyFiltersAndDisplay();
}

// مسح الفئة
function clearCategory() {
    currentCategory = '';
    document.getElementById('category-filter').value = '';
    applyFiltersAndDisplay();
}

// تطبيق الفلاتر وعرض النتائج
function applyFiltersAndDisplay() {
    currentPage = 1;
    applyFiltersAndSort();
    displayAllProducts(1, false);
}

// تحميل المزيد من المنتجات
function loadMoreProducts() {
    currentPage++;
    displayAllProducts(currentPage, true);
}

// البحث في الصفحة
function setupSearch() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    
    if (searchParam) {
        currentSearchTerm = searchParam;
        document.getElementById('search-input').value = searchParam;
    }
    
    // البحث أثناء الكتابة
    document.getElementById('search-input').addEventListener('input', function(e) {
        currentSearchTerm = e.target.value;
        applyFiltersAndDisplay();
    });
    
    // تصفية الفئة
    document.getElementById('category-filter').addEventListener('change', function(e) {
        currentCategory = e.target.value;
        applyFiltersAndDisplay();
    });
    
    // ترتيب النتائج
    document.getElementById('sort-filter').addEventListener('change', function(e) {
        currentSort = e.target.value;
        applyFiltersAndDisplay();
    });
}

// التحكم في طريقة العرض
function setupViewControls() {
    document.getElementById('grid-view').addEventListener('click', function() {
        if (currentView !== 'grid') {
            currentView = 'grid';
            this.classList.add('active');
            document.getElementById('list-view').classList.remove('active');
            displayAllProducts(currentPage, false);
        }
    });
    
    document.getElementById('list-view').addEventListener('click', function() {
        if (currentView !== 'list') {
            currentView = 'list';
            this.classList.add('active');
            document.getElementById('grid-view').classList.remove('active');
            displayAllProducts(currentPage, false);
        }
    });
}

// التهيئة
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 صفحة المنتجات جاهزة');
    setupSearch();
    setupViewControls();
    displayAllProducts();
    
    // تحديث تلقائي عند إضافة منتجات جديدة
    if (typeof setupProductsListener === 'function') {
        setupProductsListener(function(products) {
            console.log('🔄 تحديث تلقائي للمنتجات');
            allProducts = products;
            applyFiltersAndDisplay();
        });
    }
});
