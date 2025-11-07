// js/admin-products.js - الكود الكامل المصحح
console.log('🛠️ تحميل إدارة المنتجات');

// متغير لتخزين معرّف المستمع
let productsListener = null;

// دالة إنشاء نافذة إضافة منتج جديدة
window.addNewProduct = function() {
    // إغلاق أي نافذة مفتوحة مسبقاً
    closeModal();
    
    // إنشاء نافذة مخصصة
    const modalHtml = `
        <div id="productModal" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;z-index:9999;backdrop-filter:blur(5px);">
            <div style="background:white;padding:25px;border-radius:15px;width:95%;max-width:500px;max-height:90vh;overflow-y:auto;box-shadow:0 10px 40px rgba(0,0,0,0.3);">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h4 class="text-primary mb-0">➕ إضافة منتج جديد</h4>
                    <button type="button" class="btn-close" onclick="closeModal()" style="border:none;background:none;font-size:1.3em;cursor:pointer;">×</button>
                </div>
                
                <div class="mb-3">
                    <label class="form-label">📝 اسم المنتج</label>
                    <input type="text" id="productName" class="form-control" placeholder="أدخل اسم المنتج">
                </div>
                
                <div class="mb-3">
                    <label class="form-label">💰 السعر ($)</label>
                    <input type="number" id="productPrice" class="form-control" placeholder="أدخل السعر" step="0.01" min="0">
                </div>
                
                <div class="mb-3">
                    <label class="form-label">📄 الوصف</label>
                    <textarea id="productDescription" class="form-control" rows="3" placeholder="أدخل وصف المنتج"></textarea>
                </div>
                
                <div class="mb-3">
                    <label class="form-label">📂 الفئة</label>
                    <select id="productCategory" class="form-select">
                        <option value="إلكترونيات">إلكترونيات</option>
                        <option value="ملابس">ملابس</option>
                        <option value="أجهزة">أجهزة</option>
                        <option value="منزلية">منزلية</option>
                        <option value="أخرى">أخرى</option>
                    </select>
                </div>
                
                <div class="mb-3">
                    <label class="form-label">🖼️ صورة المنتج</label>
                    <input type="file" id="productImage" class="form-control" accept="image/*">
                    <small class="text-muted">اختر صورة للمنتج (JPG, PNG, GIF)</small>
                    <div id="imagePreview" class="mt-2 text-center" style="display:none;">
                        <img id="previewImg" style="max-width:200px;max-height:150px;border-radius:8px;border:2px solid #ddd;">
                    </div>
                </div>
                
                <div class="d-flex gap-2 mt-4">
                    <button type="button" class="btn btn-success flex-fill" onclick="saveNewProduct()">
                        💾 حفظ المنتج
                    </button>
                    <button type="button" class="btn btn-secondary flex-fill" onclick="closeModal()">
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
        return;
    }
    
    if (!price || isNaN(price) || price <= 0) {
        showMessage('❌ يرجى إدخال سعر صحيح أكبر من الصفر', 'danger');
        return;
    }
    
    let imageUrl = `https://via.placeholder.com/300x200/007bff/ffffff?text=${encodeURIComponent(name)}`;
    
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
        dateAdded: new Date().toLocaleDateString('ar-EG')
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
        showMessage('❌ فشل في إضافة المنتج', 'danger');
        console.error('Error:', error);
    }
}

// دالة عرض الرسائل
function showMessage(text, type) {
    const messageDiv = document.getElementById('formMessage');
    messageDiv.innerHTML = text;
    messageDiv.className = `alert alert-${type} mt-3`;
    messageDiv.style.display = 'block';
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
            <div class="col-12 text-center py-4">
                <div class="text-muted">
                    <div class="spinner-border text-primary"></div>
                    <p class="mt-2">جاري تحميل المنتجات...</p>
                </div>
            </div>
        `;

        const products = await getProductsFromFirebase();
        container.innerHTML = '';

        if (products.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-4">
                    <div class="text-muted">
                        <h5>📦 لا توجد منتجات</h5>
                        <p class="mb-3">لم يتم إضافة أي منتجات بعد</p>
                        <button class="btn btn-primary" onclick="addNewProduct()">
                            ➕ إضافة أول منتج
                        </button>
                    </div>
                </div>
            `;
            return;
        }

        products.forEach(product => {
            const productCard = `
                <div class="col-lg-4 col-md-6 mb-3">
                    <div class="card h-100">
                        <img src="${product.image}" class="card-img-top" alt="${product.name}" style="height: 200px; object-fit: cover;">
                        <div class="card-body">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text text-muted">${product.description}</p>
                            <p class="card-text"><strong>السعر: $${product.price}</strong></p>
                            <p class="card-text"><small class="text-muted">${product.category}</small></p>
                            <button class="btn btn-danger btn-sm" onclick="deleteProduct('${product.id}')">
                                🗑️ حذف
                            </button>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += productCard;
        });
        
    } catch (error) {
        container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger">
                    <h5>❌ خطأ في تحميل المنتجات</h5>
                    <p>${error.message}</p>
                    <button class="btn btn-secondary mt-2" onclick="displayProductsInAdmin()">
                        🔄 إعادة المحاولة
                    </button>
                </div>
            </div>
        `;
    }
}

// دالة الحذف
window.deleteProduct = async function(productId) {
    if (!confirm('⚠️ هل أنت متأكد من حذف هذا المنتج؟')) {
        return;
    }
    
    try {
        await deleteProductFromFirebase(productId);
        alert('✅ تم حذف المنتج بنجاح!');
        displayProductsInAdmin();
        updateProductsCount();
    } catch (error) {
        alert('❌ فشل في حذف المنتج');
    }
}

// دالة الإضافة التجريبية
window.addSampleProduct = async function() {
    const sampleProduct = {
        name: "منتج تجريبي",
        price: 99.99,
        description: "هذا منتج تجريبي للمتجر",
        category: "إلكترونيات",
        image: "https://via.placeholder.com/300x200/28a745/ffffff?text=منتج+تجريبي",
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

// دالة تحديث عدد المنتجات
window.updateProductsCount = async function() {
    try {
        const products = await getProductsFromFirebase();
        const countElement = document.getElementById('products-count');
        if (countElement) {
            countElement.textContent = products.length;
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// التهيئة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 لوحة التحكم جاهزة');
    updateProductsCount();
    displayProductsInAdmin();
});
