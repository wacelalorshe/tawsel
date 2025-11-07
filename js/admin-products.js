// إدارة المنتجات
console.log('🛠️ تحميل إدارة المنتجات');

// دالة الإضافة المحسنة
window.addNewProduct = async function() {
    console.log('🔄 محاولة إضافة منتج جديد...');
    
    if (!window.db) {
        console.error('❌ قاعدة البيانات غير متاحة');
        alert('❌ قاعدة البيانات غير جاهزة. يرجى التحقق من اتصال الإنترنت.');
        return;
    }

    try {
        // استخدام نموذج بدلاً من النوافذ المنبثقة
        const productName = prompt('📝 أدخل اسم المنتج:');
        if (!productName) {
            console.log('❌ المستخدم ألغى العملية');
            return;
        }

        const productPrice = prompt('💰 أدخل سعر المنتج:');
        if (!productPrice || isNaN(productPrice) || parseFloat(productPrice) <= 0) {
            alert('❌ يرجى إدخال سعر صحيح أكبر من الصفر');
            return;
        }

        const productDescription = prompt('📄 أدخل وصف المنتج:') || 'لا يوجد وصف';
        const productCategory = prompt('📂 أدخل فئة المنتج:') || 'عام';
        
        // رابط الصورة
        let productImage = prompt('🖼️ أدخل رابط صورة المنتج (اختياري):');
        if (!productImage) {
            productImage = `https://via.placeholder.com/300x200/007bff/ffffff?text=${encodeURIComponent(productName)}`;
        }
        
        // رابط الشراء
        const purchaseLink = prompt('🔗 أدخل رابط الشراء (اختياري):') || '';

        const newProduct = {
            name: productName,
            price: parseFloat(productPrice),
            description: productDescription,
            category: productCategory,
            image: productImage,
            purchaseLink: purchaseLink,
            dateAdded: new Date().toISOString(),
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        console.log('📦 بيانات المنتج:', newProduct);

        // إضافة المنتج مع معالجة الأخطاء
        const docRef = await window.db.collection('products').add(newProduct);
        console.log('✅ تمت الإضافة بنجاح، المعرف:', docRef.id);
        
        alert(`✅ تم إضافة "${productName}" بنجاح!`);
        
        // تحديث العرض
        setTimeout(() => {
            displayProductsInAdmin();
            updateProductsCount();
        }, 1000);
        
    } catch (error) {
        console.error('❌ فشل في الإضافة:', error);
        
        // عرض رسالة خطأ مفصلة
        let errorMessage = '❌ فشل في إضافة المنتج';
        
        if (error.code === 'permission-denied') {
            errorMessage += '\n⛔ ليس لديك صلاحية للإضافة. تحقق من قواعد الأمان في Firebase.';
        } else if (error.code === 'unavailable') {
            errorMessage += '\n🌐 مشكلة في الاتصال بالإنترنت.';
        } else {
            errorMessage += `\n🔧 الخطأ: ${error.message}`;
        }
        
        alert(errorMessage);
    }
}

// دالة اختبار الاتصال
window.testFirebaseConnection = async function() {
    console.log('🔍 اختبار اتصال Firebase...');
    
    const resultDiv = document.getElementById('debug-result');
    if (resultDiv) {
        resultDiv.innerHTML = '<div class="alert alert-info">🔄 جاري اختبار الاتصال...</div>';
    }

    try {
        if (typeof firebase === 'undefined') {
            throw new Error('مكتبة Firebase غير محملة');
        }

        if (!window.db) {
            throw new Error('قاعدة البيانات غير مهيأة');
        }

        // محاولة قراءة بسيطة لاختبار الاتصال
        const snapshot = await window.db.collection('products').limit(1).get();
        
        const message = `✅ الاتصال يعمل بشكل صحيح\n📊 عدد المنتجات: ${snapshot.size}`;
        console.log(message);
        
        if (resultDiv) {
            resultDiv.innerHTML = `<div class="alert alert-success">${message}</div>`;
        }
        
        return true;
    } catch (error) {
        console.error('❌ فشل اختبار الاتصال:', error);
        
        let errorMessage = `❌ فشل الاتصال: ${error.message}`;
        if (error.code) {
            errorMessage += `\n🔧 كود الخطأ: ${error.code}`;
        }
        
        if (resultDiv) {
            resultDiv.innerHTML = `<div class="alert alert-danger">${errorMessage}</div>`;
        }
        
        return false;
    }
}

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

        const snapshot = await window.db.collection('products')
            .orderBy('createdAt', 'desc')
            .get();
            
        const products = [];
        snapshot.forEach(doc => {
            products.push({ 
                id: doc.id, 
                ...doc.data(),
                // تنسيق التاريخ
                formattedDate: doc.data().createdAt ? 
                    new Date(doc.data().createdAt.toDate()).toLocaleDateString('ar-EG') : 
                    doc.data().dateAdded || 'غير معروف'
            });
        });

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
                        <div class="position-relative">
                            <img src="${product.image}" 
                                 class="card-img-top" 
                                 alt="${product.name}" 
                                 style="height: 200px; object-fit: cover;"
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
                                    <small class="text-muted">أضيف في: ${product.formattedDate}</small>
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
        
        await window.db.collection('products').doc(productId).delete();
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

// دالة الإضافة التجريبية المحسنة
window.addSampleProduct = async function() {
    if (!window.db) {
        alert('❌ قاعدة البيانات غير جاهزة');
        return;
    }

    const sampleProduct = {
        name: "منتج تجريبي",
        price: 149.99,
        description: "هذا منتج تجريبي للمتجر الإلكتروني",
        category: "إلكترونيات",
        image: "https://via.placeholder.com/300x200/28a745/ffffff?text=منتج+تجريبي",
        purchaseLink: "https://example.com/buy",
        dateAdded: new Date().toISOString(),
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
        const docRef = await window.db.collection('products').add(sampleProduct);
        console.log('✅ تم إضافة المنتج التجريبي بنجاح:', docRef.id);
        
        alert('✅ تم إضافة المنتج التجريبي بنجاح!');
        
        // تحديث العرض
        setTimeout(() => {
            displayProductsInAdmin();
            updateProductsCount();
        }, 1000);
        
    } catch (error) {
        console.error('❌ فشل في إضافة المنتج التجريبي:', error);
        alert(`❌ فشل في الإضافة: ${error.message}`);
    }
}
