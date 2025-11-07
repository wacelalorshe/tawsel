// js/admin-products.js - الكود الكامل المحدث
console.log('🛠️ تحميل إدارة المنتجات مع الميزات الجديدة');

// متغير لتخزين معرّف المستمع
let productsListener = null;

// دالة إنشاء نافذة إضافة منتج جديدة
window.addNewProduct = function() {
    // إغلاق أي نافذة مفتوحة مسبقاً
    closeModal();
    
    // إنشاء نافذة مخصصة
    const modalHtml = `
        <div id="productModal" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;z-index:9999;backdrop-filter:blur(5px);">
            <div style="background:linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);padding:30px;border-radius:20px;width:95%;max-width:500px;max-height:90vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,0.3);border:1px solid #e2e8f0;">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h3 class="text-primary mb-0">➕ إضافة منتج جديد</h3>
                    <button type="button" class="btn-close" onclick="closeModal()" style="border:none;background:none;font-size:1.5em;cursor:pointer;">×</button>
                </div>
                
                <div class="mb-3">
                    <label class="form-label fw-bold">📝 اسم المنتج</label>
                    <input type="text" id="productName" class="form-control form-control-lg" placeholder="أدخل اسم المنتج" style="border-radius:12px;border:2px solid #e2e8f0;">
                </div>
                
                <div class="mb-3">
                    <label class="form-label fw-bold">💰 السعر ($)</label>
                    <input type="number" id="productPrice" class="form-control form-control-lg" placeholder="أدخل السعر" step="0.01" min="0" style="border-radius:12px;border:2px solid #e2e8f0;">
                </div>
                
                <div class="mb-3">
                    <label class="form-label fw-bold">📄 الوصف</label>
                    <textarea id="productDescription" class="form-control" rows="3" placeholder="أدخل وصف مفصل للمنتج..." style="border-radius:12px;border:2px solid #e2e8f0;resize:vertical;"></textarea>
                </div>
                
                <div class="mb-3">
                    <label class="form-label fw-bold">📂 الفئة</label>
                    <select id="productCategory" class="form-select form-select-lg" style="border-radius:12px;border:2px solid #e2e8f0;">
                        <option value="إلكترونيات">🖥️ إلكترونيات</option>
                        <option value="ملابس">👕 ملابس</option>
                        <option value="أجهزة">📱 أجهزة</option>
                        <option value="منزلية">🏠 منزلية</option>
                        <option value="رياضية">⚽ رياضية</option>
                        <option value="أخرى">📦 أخرى</option>
                    </select>
                </div>
                
                <div class="mb-4">
                    <label class="form-label fw-bold">🖼️ صورة المنتج</label>
                    <input type="file" id="productImage" class="form-control form-control-lg" accept="image/*" style="border-radius:12px;border:2px solid #e2e8f0;">
                    <small class="text-muted">اختر صورة للمنتج (JPG, PNG, GIF, WebP - بحد أقصى 5MB)</small>
                    <div id="imagePreview" class="mt-3 text-center" style="display:none;">
                        <img id="previewImg" style="max-width:100%;max-height:200px;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.1);">
                        <p class="text-success mt-2">✅ تم تحميل الصورة بنجاح</p>
                    </div>
                </div>
                
                <div class="d-flex gap-2 mt-4">
                    <button type="button" class="btn btn-success flex-fill py-3" onclick="saveNewProduct()" style="border-radius:12px;font-weight:bold;">
                        💾 حفظ المنتج
                    </button>
                    <button type="button" class="btn btn-secondary flex-fill py-3" onclick="closeModal()" style="border-radius:12px;font-weight:bold;">
                        ❌ إلغاء
                    </button>
                </div>
                
                <div id="formMessage" class="mt-3" style="display:none;"></div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // معاينة الصورة
    document.getElementById('productImage').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('previewImg').src = e.target.result;
                document.getElementById('imagePreview').style.display = 'block';
            }
            reader.readAsDataURL(file);
        }
    });
    
    // التركيز على حقل الاسم
    setTimeout(() => {
        document.getElementById('productName').focus();
    }, 100);
}

// دالة حفظ المنتج الجديد
window.saveNewProduct = async function() {
    const name = document.getElementById('productName').value.trim();
    const price = document.getElementById('productPrice').value;
    const description = document.getElementById('productDescription').value.trim();
    const category = document.getElementById('productCategory').value;
    const imageFile = document.getElementById('productImage').files[0];
    const messageDiv = document.getElementById('formMessage');
    
    // إخفاء الرسائل السابقة
    messageDiv.style.display = 'none';
    
    // التحقق من الحقول المطلوبة
    if (!name) {
        showMessage('❌ يرجى إدخال اسم المنتج', 'danger');
        document.getElementById('productName').focus();
        return;
    }
    
    if (!price || isNaN(price) || price <= 0) {
        showMessage('❌ يرجى إدخال سعر صحيح أكبر من الصفر', 'danger');
        document.getElementById('productPrice').focus();
        return;
    }
    
    if (!description) {
        showMessage('❌ يرجى إدخال وصف للمنتج', 'danger');
        document.getElementById('productDescription').focus();
        return;
    }
    
    let imageUrl = `https://via.placeholder.com/400x300/2c5aa0/ffffff?text=${encodeURIComponent(name)}`;
    
    // إذا تم رفع صورة، استخدمها
    if (imageFile) {
        try {
            showMessage('🔄 جاري رفع الصورة...', 'info');
            imageUrl = await uploadImage(imageFile);
        } catch (error) {
            showMessage(`❌ ${error.message}`, 'danger');
            return;
        }
    }
    
    const newProduct = {
        name: name,
        price: parseFloat(price),
        description: description,
        category: category,
        image: imageUrl,
        dateAdded: new Date().toLocaleDateString('ar-EG'),
        createdAt: new Date()
    };
    
    try {
        showMessage('🔄 جاري إضافة المنتج...', 'info');
        await addProductToFirebase(newProduct);
        showMessage(`✅ تم إضافة "${name}" بنجاح!`, 'success');
        
        setTimeout(() => {
            closeModal();
            displayProductsInAdmin();
            updateProductsCount();
        }, 1500);
        
    } catch (error) {
        showMessage('❌ فشل في إضافة المنتج - حاول مرة أخرى', 'danger');
        console.error('Error adding product:', error);
    }
}

// دالة عرض الرسائل
function showMessage(text, type) {
    const messageDiv = document.getElementById('formMessage');
    messageDiv.innerHTML = text;
    messageDiv.className = `alert alert-${type} mt-3`;
    messageDiv.style.display = 'block';
    messageDiv.scrollIntoView({ behavior: 'smooth' });
}

// دالة إغلاق النافذة
window.closeModal = function() {
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.remove();
    }
}

// دالة العرض المحسنة
window.displayProductsInAdmin = async function() {
    const container = document.getElementById('admin-products-container');
    if (!container) return;

    try {
        // إظهار تحميل
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="text-muted">
                    <div class="loading" style="width:40px;height:40px;margin:0 auto;"></div>
                    <h5 class="mt-3">جاري تحميل المنتجات...</h5>
                </div>
            </div>
        `;

        const products = await getProductsFromFirebase();
        container.innerHTML = '';

        if (products.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-5 fade-in">
                    <div class="text-muted">
                        <i style="font-size: 4em; opacity: 0.5;">📦</i>
                        <h4 class="mt-3 text-secondary">لا توجد منتجات مضافة بعد</h4>
                        <p class="mb-4 text-muted">ابدأ برحلة متجرك بإضافة أول منتج</p>
                        <button class="btn btn-primary btn-lg px-4 py-2" onclick="addNewProduct()" style="border-radius:15px;">
                            ➕ إضافة أول منتج
                        </button>
                    </div>
                </div>
            `;
            return;
        }

        products.forEach((product, index) => {
            // تأخير بسيط للرسوم المتحركة
            const delay = index * 100;
            
            const productCard = `
                <div class="col-lg-4 col-md-6 mb-4 fade-in" style="animation-delay: ${delay}ms;">
                    <div class="card h-100 product-card">
                        <div class="position-relative">
                            <img src="${product.image}" class="card-img-top product-image" alt="${product.name}" 
                                 onerror="this.src='https://via.placeholder.com/400x300/cccccc/666666?text=صورة+غير+متاحة'">
                            <span class="position-absolute top-0 start-0 m-2 badge product-category">
                                ${product.category}
                            </span>
                        </div>
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title text-primary flex-grow-1">${product.name}</h5>
                            <p class="card-text text-muted flex-grow-1">${product.description}</p>
                            <div class="mt-auto">
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <span class="h4 text-success fw-bold">$${product.price}</span>
                                    <small class="text-muted">${product.dateAdded}</small>
                                </div>
                                <div class="d-grid gap-1">
                                    <button class="btn btn-outline-danger btn-sm" onclick="deleteProduct('${product.id}')">
                                        🗑️ حذف المنتج
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += productCard;
        });
        
        console.log(`✅ تم عرض ${products.length} منتج بنجاح`);
        
    } catch (error) {
        container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger">
                    <h5>❌ خطأ في تحميل المنتجات</h5>
                    <p>${error.message}</p>
                    <button class="btn btn-outline-danger mt-2" onclick="displayProductsInAdmin()">
                        🔄 إعادة المحاولة
                    </button>
                </div>
            </div>
        `;
        console.error('Error displaying products:', error);
    }
}

// دالة الحذف مع تأكيد محسن
window.deleteProduct = async function(productId) {
    const productElement = document.querySelector(`[onclick="deleteProduct('${productId}')"]`);
    const originalText = productElement.innerHTML;
    
    // تغيير النص إلى تحميل
    productElement.innerHTML = '<span class="loading"></span> جاري الحذف...';
    productElement.disabled = true;
    
    try {
        // تأكيد الحذف
        if (!confirm('⚠️ هل أنت متأكد من حذف هذا المنتج؟\n\nهذا الإجراء لا يمكن التراجع عنه.')) {
            productElement.innerHTML = originalText;
            productElement.disabled = false;
            return;
        }
        
        await deleteProductFromFirebase(productId);
        
        // إظهار رسالة نجاح
        productElement.innerHTML = '✅ تم الحذف';
        productElement.className = 'btn btn-success btn-sm';
        
        setTimeout(() => {
            displayProductsInAdmin();
            updateProductsCount();
        }, 1000);
        
    } catch (error) {
        productElement.innerHTML = '❌ فشل الحذف';
        productElement.className = 'btn btn-danger btn-sm';
        setTimeout(() => {
            productElement.innerHTML = originalText;
            productElement.className = 'btn btn-outline-danger btn-sm';
            productElement.disabled = false;
        }, 2000);
        console.error('Error deleting product:', error);
    }
}

// دالة الإضافة التجريبية المحسنة
window.addSampleProduct = async function() {
    if (!confirm('هل تريد إضافة منتجات تجريبية؟\n\nسيتم إضافة 3 منتجات مختلفة إلى المتجر.')) {
        return;
    }
    
    const sampleProducts = [
        {
            name: "هاتف ذكي متطور",
            price: 1999.99,
            description: "هاتف ذكي بمواصفات عالية، كاميرا ممتازة، وشاشة OLED رائعة. مثالي للأعمال والترفيه.",
            category: "إلكترونيات",
            image: "https://via.placeholder.com/400x300/007bff/ffffff?text=📱+هاتف+ذكي",
            dateAdded: new Date().toLocaleDateString('ar-EG')
        },
        {
            name: "لابتوب للأعمال",
            price: 3499.50,
            description: "لابتوب قوي بمعالج حديث، ذاكرة عالية، ومثالي للأعمال والمهام الثقيلة.",
            category: "إلكترونيات", 
            image: "https://via.placeholder.com/400x300/28a745/ffffff?text=💻+لابتوب",
            dateAdded: new Date().toLocaleDateString('ar-EG')
        },
        {
            name: "ساعة ذكية رياضية",
            price: 899.00,
            description: "ساعة ذكية بتقنيات متطورة، مقاومة للماء، ومتابعة للصحة واللياقة البدنية.",
            category: "إلكترونيات",
            image: "https://via.placeholder.com/400x300/dc3545/ffffff?text=⌚+ساعة+ذكية",
            dateAdded: new Date().toLocaleDateString('ar-EG')
        }
    ];

    try {
        let addedCount = 0;
        
        for (const product of sampleProducts) {
            await addProductToFirebase(product);
            addedCount++;
        }
        
        alert(`✅ تم إضافة ${addedCount} منتج تجريبي بنجاح!`);
        displayProductsInAdmin();
        updateProductsCount();
        
    } catch (error) {
        alert('❌ فشل في إضافة بعض المنتجات التجريبية');
        console.error('Error adding sample products:', error);
    }
}

// دالة تحديث عدد المنتجات
window.updateProductsCount = async function() {
    try {
        const products = await getProductsFromFirebase();
        const countElement = document.getElementById('products-count');
        if (countElement) {
            countElement.textContent = products.length;
            countElement.style.fontSize = products.length > 99 ? '2em' : '2.5em';
        }
    } catch (error) {
        console.error('Error updating products count:', error);
    }
}

// التهيئة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 لوحة التحكم جاهزة للتشغيل');
    
    // بدء الاستماع للتحديثات الفورية
    productsListener = setupProductsListener(function(products) {
        console.log('🔄 تحديث فوري للمنتجات:', products.length);
        updateProductsCount();
    });
    
    // تحميل البيانات الأولية
    updateProductsCount();
    displayProductsInAdmin();
    
    // إضافة تأثيرات عند التمرير
    setTimeout(() => {
        const elements = document.querySelectorAll('.fade-in');
        elements.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
    }, 500);
});

// التنظيف عند مغادرة الصفحة
window.addEventListener('beforeunload', function() {
    if (productsListener) {
        productsListener();
    }
});
