// إدارة المنتجات
console.log('🛠️ تحميل إدارة المنتجات');

// دالة العرض المحسنة
window.displayProductsInAdmin = async function() {
    const container = document.getElementById('admin-products-container');
    if (!container) {
        console.error('❌ حاوية المنتجات غير موجودة');
        return;
    }

    container.innerHTML = `
        <div class="col-12 text-center py-4">
            <div class="loading-spinner"></div>
            <p class="mt-2">جاري تحميل المنتجات...</p>
        </div>
    `;

    try {
        if (!window.db) {
            throw new Error('قاعدة البيانات غير متاحة');
        }

        const products = await getProductsFromFirebase();
        container.innerHTML = '';

        if (products.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <div class="text-muted">
                        <i class="fas fa-box-open display-1 mb-3"></i>
                        <h5>📦 لا توجد منتجات</h5>
                        <p class="mb-4">استخدم "إضافة منتج جديد" لبدء إضافة منتجاتك</p>
                        <button class="btn btn-primary" onclick="addNewProduct()">
                            <i class="fas fa-plus me-2"></i>إضافة منتج جديد
                        </button>
                    </div>
                </div>
            `;
            return;
        }

        products.forEach(product => {
            const productCard = `
                <div class="col-lg-4 col-md-6 mb-4">
                    <div class="card h-100 admin-product-card">
                        <div class="position-relative overflow-hidden">
                            <img src="${product.image}" 
                                 class="card-img-top product-image" 
                                 alt="${product.name}" 
                                 onerror="this.src='https://via.placeholder.com/300x200/cccccc/ffffff?text=صورة+غير+متاحة'">
                            <span class="badge bg-primary position-absolute top-0 start-0 m-2">${product.category}</span>
                        </div>
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title text-primary">${product.name}</h5>
                            <p class="card-text text-muted flex-grow-1">${product.description}</p>
                            
                            <div class="product-details">
                                <div class="mb-2">
                                    <strong class="text-success">السعر: $${product.price}</strong>
                                </div>
                                <div class="mb-2">
                                    <small class="text-muted">أضيف في: ${product.dateAdded ? new Date(product.dateAdded).toLocaleDateString('ar-EG') : 'غير معروف'}</small>
                                </div>
                                ${product.purchaseLink ? `
                                    <div class="mb-2">
                                        <small><strong>رابط الشراء:</strong></small>
                                        <a href="${product.purchaseLink}" target="_blank" class="d-block text-truncate small">${product.purchaseLink}</a>
                                    </div>
                                ` : ''}
                            </div>
                            
                            <div class="mt-auto pt-3">
                                <div class="btn-group w-100">
                                    <button class="btn btn-sm btn-danger" onclick="deleteProduct('${product.id}', '${product.name}')">
                                        <i class="fas fa-trash me-1"></i>حذف
                                    </button>
                                    <button class="btn btn-sm btn-warning" onclick="editProduct('${product.id}')">
                                        <i class="fas fa-edit me-1"></i>تعديل
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += productCard;
        });

        console.log(`✅ تم عرض ${products.length} منتج`);

    } catch (error) {
        console.error('❌ خطأ في تحميل المنتجات:', error);
        container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    <strong>خطأ في تحميل المنتجات</strong>
                    <p class="mb-0 mt-2">${error.message}</p>
                    <button class="btn btn-sm btn-outline-danger mt-2" onclick="displayProductsInAdmin()">
                        <i class="fas fa-redo me-1"></i>إعادة المحاولة
                    </button>
                </div>
            </div>
        `;
    }
}

// دالة الحذف المحسنة
window.deleteProduct = async function(productId, productName) {
    if (!confirm(`هل أنت متأكد من حذف المنتج "${productName}"؟\nهذا الإجراء لا يمكن التراجع عنه.`)) {
        return;
    }
    
    try {
        if (!window.db) {
            throw new Error('قاعدة البيانات غير متاحة');
        }
        
        await deleteProductFromFirebase(productId);
        console.log(`✅ تم حذف المنتج: ${productName}`);
        
        alert(`✅ تم حذف المنتج "${productName}" بنجاح!`);
        
        // تحديث العرض
        displayProductsInAdmin();
        updateProductsCount();
        
    } catch (error) {
        console.error('❌ فشل في الحذف:', error);
        alert(`❌ فشل في حذف المنتج: ${error.message}`);
    }
}

// دالة التعديل
window.editProduct = async function(productId) {
    alert('ميزة التعديل قيد التطوير! سيتم إضافتها في تحديث قادم.');
    // يمكن تطوير هذه الدالة لفتح نموذج تعديل
}
