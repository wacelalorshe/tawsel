// إدارة المنتجات
console.log('🛠️ تحميل إدارة المنتجات');

// دالة الإضافة
window.addNewProduct = async function() {
    if (!db) {
        alert('❌ قاعدة البيانات غير جاهزة');
        return;
    }
    
    // استخدام نموذج بدلاً من النوافذ المنبثقة
    const productName = prompt('📝 أدخل اسم المنتج:');
    if (!productName) return;

    const productPrice = prompt('💰 أدخل سعر المنتج:');
    if (!productPrice || isNaN(productPrice)) {
        alert('❌ يرجى إدخال سعر صحيح');
        return;
    }

    const productDescription = prompt('📄 أدخل وصف المنتج:') || 'لا يوجد وصف';
    const productCategory = prompt('📂 أدخل فئة المنتج:') || 'عام';
    const productImage = prompt('🖼️ أدخل رابط صورة المنتج:') || `https://via.placeholder.com/300x200/007bff/ffffff?text=${encodeURIComponent(productName)}`;
    const purchaseLink = prompt('🔗 أدخل رابط الشراء (اختياري):') || '';

    const newProduct = {
        name: productName,
        price: parseFloat(productPrice),
        description: productDescription,
        category: productCategory,
        image: productImage,
        purchaseLink: purchaseLink,
        dateAdded: new Date().toLocaleDateString('ar-EG')
    };

    try {
        await addProductToFirebase(newProduct);
        alert(`✅ تم إضافة "${productName}" بنجاح!`);
        displayProductsInAdmin();
        updateProductsCount();
    } catch (error) {
        alert('❌ فشل في الإضافة');
    }
}

// دالة العرض
window.displayProductsInAdmin = async function() {
    const container = document.getElementById('admin-products-container');
    if (!container) return;

    try {
        const products = await getProductsFromFirebase();
        container.innerHTML = '';

        if (products.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <div class="text-muted">
                        <i class="fas fa-box-open display-1 mb-3"></i>
                        <h5>📦 لا توجد منتجات</h5>
                        <p>استخدم "إضافة منتج جديد" لبدء إضافة منتجاتك</p>
                    </div>
                </div>
            `;
            return;
        }

        products.forEach(product => {
            container.innerHTML += `
                <div class="col-lg-4 col-md-6 mb-4">
                    <div class="card h-100 admin-product-card">
                        <div class="position-relative">
                            <img src="${product.image}" class="card-img-top" alt="${product.name}" style="height: 200px; object-fit: cover;">
                            <span class="badge bg-primary position-absolute top-0 start-0 m-2">${product.category}</span>
                        </div>
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text text-muted flex-grow-1">${product.description}</p>
                            <div class="mb-2">
                                <strong class="text-primary">السعر: $${product.price}</strong>
                            </div>
                            ${product.purchaseLink ? `
                                <div class="mb-2">
                                    <small><strong>رابط الشراء:</strong></small>
                                    <a href="${product.purchaseLink}" target="_blank" class="d-block text-truncate">${product.purchaseLink}</a>
                                </div>
                            ` : ''}
                            <div class="mt-auto">
                                <button class="btn btn-sm btn-danger" onclick="deleteProduct('${product.id}')">
                                    <i class="fas fa-trash me-1"></i>حذف
                                </button>
                                <button class="btn btn-sm btn-warning" onclick="editProduct('${product.id}')">
                                    <i class="fas fa-edit me-1"></i>تعديل
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        container.innerHTML = `
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-triangle me-2"></i>خطأ في تحميل المنتجات
            </div>
        `;
    }
}

// دالة الإضافة التجريبية
window.addSampleProduct = async function() {
    const sampleProduct = {
        name: "منتج تجريبي",
        price: 149.99,
        description: "هذا منتج تجريبي للمتجر",
        category: "إلكترونيات",
        image: "https://via.placeholder.com/300x200/28a745/ffffff?text=منتج+تجريبي",
        purchaseLink: "https://example.com/buy",
        dateAdded: new Date().toLocaleDateString('ar-EG')
    };

    try {
        await addProductToFirebase(sampleProduct);
        alert('✅ تم إضافة المنتج التجريبي بنجاح!');
        displayProductsInAdmin();
        updateProductsCount();
    } catch (error) {
        alert('❌ فشل في الإضافة');
    }
}

// دالة الحذف
window.deleteProduct = async function(productId) {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
    
    try {
        await deleteProductFromFirebase(productId);
        alert('✅ تم حذف المنتج بنجاح!');
        displayProductsInAdmin();
        updateProductsCount();
    } catch (error) {
        alert('❌ فشل في الحذف');
    }
}

// دالة التعديل
window.editProduct = async function(productId) {
    alert('ميزة التعديل قيد التطوير!');
    // يمكن تطوير هذه الدالة لفتح نموذج تعديل
}
