// إدارة المنتجات في لوحة التحكم
let products = JSON.parse(localStorage.getItem('storeProducts')) || [];

// تحديث عدد المنتجات
function updateProductsCount() {
    const products = JSON.parse(localStorage.getItem('storeProducts')) || [];
    const countElement = document.getElementById('products-count');
    if (countElement) {
        countElement.textContent = products.length;
    }
}

// إضافة منتج جديد
function addNewProduct() {
    const productName = prompt('أدخل اسم المنتج:');
    if (!productName) return;

    const productPrice = prompt('أدخل سعر المنتج:');
    if (!productPrice) return;

    const productDescription = prompt('أدخل وصف المنتج:') || 'لا يوجد وصف';

    const newProduct = {
        id: Date.now(), // استخدام الوقت كمعرف فريد
        name: productName,
        price: parseFloat(productPrice),
        description: productDescription,
        image: "https://via.placeholder.com/300x200?text=New+Product",
        category: "عام"
    };

    products.push(newProduct);
    localStorage.setItem('storeProducts', JSON.stringify(products));
    
    updateProductsCount();
    alert('تم إضافة المنتج بنجاح!');
    displayProducts(); // تحديث العرض إذا كنا في صفحة المنتجات
}

// عرض المنتجات في لوحة التحكم
function displayProductsInAdmin() {
    const container = document.getElementById('admin-products-container');
    if (!container) return;

    container.innerHTML = '';

    products.forEach(product => {
        const productCard = `
            <div class="col-md-6 mb-3">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.description}</p>
                        <p class="card-text"><strong>السعر: $${product.price}</strong></p>
                        <button class="btn btn-danger btn-sm" onclick="deleteProduct(${product.id})">حذف</button>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += productCard;
    });
}

// حذف المنتج
function deleteProduct(productId) {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
        products = products.filter(product => product.id !== productId);
        localStorage.setItem('storeProducts', JSON.stringify(products));
        updateProductsCount();
        displayProductsInAdmin();
        alert('تم حذف المنتج بنجاح!');
    }
}

// التهيئة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    updateProductsCount();
    displayProductsInAdmin();
});
