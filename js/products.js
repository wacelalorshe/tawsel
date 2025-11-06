// كود صفحة المنتجات
console.log('✅ تم تحميل صفحة المنتجات');

// عرض جميع المنتجات
function displayAllProducts() {
    const container = document.getElementById('products-container');
    const noProducts = document.getElementById('no-products');
    
    if (!container) return;

    const products = JSON.parse(localStorage.getItem('storeProducts')) || [];
    container.innerHTML = '';

    if (products.length === 0) {
        container.classList.add('d-none');
        noProducts.classList.remove('d-none');
        return;
    }

    noProducts.classList.add('d-none');
    container.classList.remove('d-none');

    products.forEach(product => {
        const productCard = `
            <div class="col-lg-4 col-md-6 mb-4" data-category="${product.category}" data-name="${product.name.toLowerCase()}">
                <div class="card h-100 product-card">
                    <img src="${product.image}" class="card-img-top product-image" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
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
    
    productCards.forEach(card => {
        const productName = card.getAttribute('data-name');
        const productCategory = card.getAttribute('data-category');
        
        const matchesSearch = productName.includes(searchTerm);
        const matchesCategory = !category || productCategory === category;
        
        if (matchesSearch && matchesCategory) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// التهيئة
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 صفحة المنتجات جاهزة');
    displayAllProducts();
    setupFilters();
});
