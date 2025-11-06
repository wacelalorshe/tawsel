// إدارة المنتجات - كود منفصل للوحة التحكم
console.log('تم تحميل كود إدارة المنتجات');

// جلب المنتجات من localStorage
function getProducts() {
    return JSON.parse(localStorage.getItem('storeProducts')) || [];
}

// حفظ المنتجات في localStorage
function saveProducts(products) {
    localStorage.setItem('storeProducts', JSON.stringify(products));
}

// إضافة منتج جديد
function addNewProduct() {
    console.log('تم النقر على إضافة منتج');
    
    const productName = prompt('أدخل اسم المنتج:');
    if (!productName) {
        alert('لم يتم إدخال اسم المنتج');
        return;
    }

    const productPrice = prompt('أدخل سعر المنتج:');
    if (!productPrice || isNaN(productPrice)) {
        alert('يرجى إدخال سعر صحيح');
        return;
    }

    const productDescription = prompt('أدخل وصف المنتج:') || 'لا يوجد وصف';

    const products = getProducts();
    
    const newProduct = {
        id: Date.now(), // استخدام الوقت كمعرف فريد
        name: productName,
        price: parseFloat(productPrice),
        description: productDescription,
        image: "https://via.placeholder.com/300x200/007bff/ffffff?text=" + encodeURIComponent(productName),
        category: "عام"
    };

    products.push(newProduct);
    saveProducts(products);
    
    alert('تم إضافة المنتج بنجاح!');
    
    // تحديث العرض
    displayProductsInAdmin();
    updateProductsCount();
}

// عرض المنتجات في لوحة التحكم
function displayProductsInAdmin() {
    console.log('محاولة عرض المنتجات...');
    const container = document.getElementById('admin-products-container');
    if (!container) {
        console.log('لم يتم العثور على admin-products-container');
        return;
    }

    const products = getProducts();
    console.log('عدد المنتجات:', products.length);

    container.innerHTML = '';

    if (products.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center">
                <p class="text-muted">لا توجد منتجات مضافة بعد</p>
            </div>
        `;
        return;
    }

    products.forEach(product => {
        const productCard = `
            <div class="col-md-6 mb-3">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.description}</p>
                        <p class="card-text"><strong>السعر: $${product.price}</strong></p>
                        <img src="${product.image}" class="img-fluid mb-2" style="max-height: 150px;">
                        <br>
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
        const products = getProducts();
        const updatedProducts = products.filter(product => product.id !== productId);
        saveProducts(updatedProducts);
        displayProductsInAdmin();
        updateProductsCount();
        alert('تم حذف المنتج بنجاح!');
    }
}

// تحديث عدد المنتجات
function updateProductsCount() {
    const products = getProducts();
    const countElement = document.getElementById('products-count');
    if (countElement) {
        countElement.textContent = products.length;
    }
}

// التهيئة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    console.log('تم تحميل صفحة لوحة التحكم');
    displayProductsInAdmin();
    updateProductsCount();
});
