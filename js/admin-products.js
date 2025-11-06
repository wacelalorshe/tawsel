// إدارة المنتجات - كود منفصل للوحة التحكم
console.log('✅ تم تحميل كود إدارة المنتجات');

// جلب المنتجات من localStorage
function getProducts() {
    const products = JSON.parse(localStorage.getItem('storeProducts')) || [];
    console.log('📦 عدد المنتجات:', products.length);
    return products;
}

// حفظ المنتجات في localStorage
function saveProducts(products) {
    localStorage.setItem('storeProducts', JSON.stringify(products));
    console.log('💾 تم حفظ المنتجات');
}

// إضافة منتج جديد - نسخة محسنة
function addNewProduct() {
    console.log('🎯 تم النقر على إضافة منتج جديد');
    
    // إنشاء نموذج إدخال بديل عن prompt
    const productName = prompt('📝 أدخل اسم المنتج:');
    if (!productName) {
        console.log('❌ لم يتم إدخال اسم المنتج');
        return;
    }

    const productPrice = prompt('💰 أدخل سعر المنتج:');
    if (!productPrice || isNaN(productPrice) || productPrice <= 0) {
        alert('❌ يرجى إدخال سعر صحيح أكبر من الصفر');
        return;
    }

    const productDescription = prompt('📄 أدخل وصف المنتج:') || 'لا يوجد وصف مفصل';
    const productCategory = prompt('📂 أدخل فئة المنتج:') || 'عام';

    const products = getProducts();
    
    const newProduct = {
        id: Date.now(), // استخدام الوقت كمعرف فريد
        name: productName,
        price: parseFloat(productPrice),
        description: productDescription,
        category: productCategory,
        image: `https://via.placeholder.com/300x200/007bff/ffffff?text=${encodeURIComponent(productName)}`,
        dateAdded: new Date().toLocaleDateString('ar-EG')
    };

    products.push(newProduct);
    saveProducts(products);
    
    // 🔥 الكود المضاف - بداية
    console.log('💾 تم حفظ المنتجات الجديدة في localStorage');
    console.log('📋 المنتجات الحالية:', getProducts());

    // تأكد من أن البيانات محفوظة بشكل صحيح
    const testProducts = JSON.parse(localStorage.getItem('storeProducts')) || [];
    console.log('✅ اختبار القراءة من localStorage:', testProducts.length, 'منتج');
    // 🔥 الكود المضاف - نهاية
    
    alert(`✅ تم إضافة المنتج "${productName}" بنجاح!`);
    console.log('🆕 المنتج المضاف:', newProduct);
    
    // تحديث العرض
    displayProductsInAdmin();
    updateProductsCount();
}

// عرض المنتجات في لوحة التحكم
function displayProductsInAdmin() {
    console.log('🔄 محاولة عرض المنتجات...');
    const container = document.getElementById('admin-products-container');
    if (!container) {
        console.log('❌ لم يتم العثور على admin-products-container');
        return;
    }

    const products = getProducts();
    console.log('📊 عدد المنتجات للعرض:', products.length);

    container.innerHTML = '';

    if (products.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="text-muted">
                    <i class="fas fa-box-open fa-3x mb-3"></i>
                    <h4>لا توجد منتجات مضافة بعد</h4>
                    <p>انقر على "إضافة منتج جديد" لبدء إضافة منتجاتك</p>
                </div>
            </div>
        `;
        return;
    }

    products.forEach(product => {
        const productCard = `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="card h-100">
                    <img src="${product.image}" class="card-img-top product-image" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title text-primary">${product.name}</h5>
                        <p class="card-text">${product.description}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="h5 text-success">$${product.price}</span>
                            <small class="text-muted">${product.category}</small>
                        </div>
                        <div class="mt-3">
                            <button class="btn btn-danger btn-sm" onclick="deleteProduct(${product.id})">
                                🗑️ حذف
                            </button>
                            <small class="text-muted d-block mt-2">أضيف في: ${product.dateAdded}</small>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += productCard;
    });
}

// حذف المنتج
function deleteProduct(productId) {
    if (confirm('⚠️ هل أنت متأكد من حذف هذا المنتج؟')) {
        const products = getProducts();
        const productToDelete = products.find(p => p.id === productId);
        const updatedProducts = products.filter(product => product.id !== productId);
        saveProducts(updatedProducts);
        displayProductsInAdmin();
        updateProductsCount();
        alert(`✅ تم حذف المنتج "${productToDelete.name}" بنجاح!`);
    }
}

// تحديث عدد المنتجات
function updateProductsCount() {
    const products = getProducts();
    const countElement = document.getElementById('products-count');
    if (countElement) {
        countElement.textContent = products.length;
        console.log('🔢 تم تحديث عدد المنتجات:', products.length);
    }
}

// إضافة منتج تجريبي للاختبار
function addSampleProduct() {
    console.log('🧪 إضافة منتج تجريبي');
    const products = getProducts();
    
    const sampleProducts = [
        {
            id: Date.now(),
            name: "لابتوب ديل",
            price: 2500,
            description: "لابتوب ممتاز للأعمال والاستخدام اليومي",
            category: "إلكترونيات",
            image: "https://via.placeholder.com/300x200/28a745/ffffff?text=Dell+Laptop",
            dateAdded: new Date().toLocaleDateString('ar-EG')
        },
        {
            id: Date.now() + 1,
            name: "هاتف سامسونج",
            price: 1800,
            description: "هاتف ذكي بمواصفات عالية",
            category: "إلكترونيات",
            image: "https://via.placeholder.com/300x200/dc3545/ffffff?text=Samsung+Phone",
            dateAdded: new Date().toLocaleDateString('ar-EG')
        }
    ];

    sampleProducts.forEach(product => {
        products.push(product);
    });

    saveProducts(products);
    
    // 🔥 الكود المضاف - بداية
    console.log('💾 تم حفظ المنتجات التجريبية في localStorage');
    console.log('📋 المنتجات الحالية بعد الإضافة:', getProducts());

    // تأكد من أن البيانات محفوظة بشكل صحيح
    const testProducts = JSON.parse(localStorage.getItem('storeProducts')) || [];
    console.log('✅ اختبار القراءة من localStorage:', testProducts.length, 'منتج');
    // 🔥 الكود المضاف - نهاية
    
    displayProductsInAdmin();
    updateProductsCount();
    alert('✅ تم إضافة منتجات تجريبية بنجاح!');
}

// التهيئة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 تم تحميل صفحة لوحة التحكم');
    displayProductsInAdmin();
    updateProductsCount();
    
    // إضافة أزرار إضافية للاختبار
    const header = document.querySelector('.border-bottom');
    if (header) {
        const testButton = document.createElement('button');
        testButton.className = 'btn btn-warning btn-sm ms-2';
        testButton.textContent = 'إضافة منتجات تجريبية';
        testButton.onclick = addSampleProduct;
        header.appendChild(testButton);
    }
});
