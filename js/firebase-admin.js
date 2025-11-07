// js/firebase-admin.js - الإصدار المصحح
console.log('🚀 تحميل إدارة Firebase للمتجر...');

// ==================== تكوين Firebase ====================
const firebaseConfig = {
    apiKey: "AIzaSyBnCeIjj1PHBrDRS-zjw8qLEGc-w4SS1XE",
    authDomain: "tawsel735.firebaseapp.com",
    projectId: "tawsel735",
    storageBucket: "tawsel735.firebasestorage.app",
    messagingSenderId: "723079637443",
    appId: "1:723079637443:web:170f06eec77d25e4647576",
    measurementId: "G-R84FEYXMDJ"
};

// التحقق و التهيئة
let db = null;
let isFirebaseReady = false;

function initializeFirebase() {
    try {
        if (typeof firebase === 'undefined') {
            console.error('❌ مكتبة Firebase غير محملة');
            return false;
        }

        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
            console.log('✅ تم تهيئة Firebase');
        } else {
            console.log('✅ Firebase مثبت مسبقاً');
        }

        db = firebase.firestore();
        isFirebaseReady = true;
        console.log('🗄️ قاعدة البيانات جاهزة');
        return true;
        
    } catch (error) {
        console.error('❌ خطأ في تهيئة Firebase:', error);
        return false;
    }
}

// محاولة التهيئة فوراً
initializeFirebase();

// ==================== دوال قاعدة البيانات ====================

async function addProductToFirebase(product) {
    if (!isFirebaseReady || !db) {
        console.error('❌ قاعدة البيانات غير جاهزة');
        throw new Error('قاعدة البيانات غير متاحة. يرجى تحديث الصفحة والمحاولة مرة أخرى.');
    }
    
    try {
        console.log('🔄 محاولة إضافة منتج:', product);
        
        const productData = {
            name: product.name || 'بدون اسم',
            price: product.price || 0,
            description: product.description || 'لا يوجد وصف',
            category: product.category || 'عام',
            image: product.image || 'https://via.placeholder.com/300x200/cccccc/666666?text=لا+توجد+صورة',
            dateAdded: product.dateAdded || new Date().toLocaleDateString('ar-EG'),
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        const docRef = await db.collection('products').add(productData);
        console.log('✅ تمت الإضافة بنجاح:', docRef.id);
        return docRef.id;
        
    } catch (error) {
        console.error('❌ فشل الإضافة:', error);
        
        // رسالة خطأ مبسطة للمستخدم
        let userMessage = 'فشل في إضافة المنتج';
        if (error.code === 'permission-denied') {
            userMessage = 'ليس لديك صلاحية لإضافة منتجات. تحقق من إعدادات Firebase.';
        } else if (error.code === 'unavailable') {
            userMessage = 'الاتصال بالإنترنت غير متوفر';
        }
        
        throw new Error(userMessage);
    }
}

async function getProductsFromFirebase() {
    if (!isFirebaseReady || !db) {
        console.error('❌ قاعدة البيانات غير جاهزة');
        return [];
    }
    
    try {
        console.log('🔄 جلب المنتجات...');
        const snapshot = await db.collection('products').orderBy('createdAt', 'desc').get();
        const products = [];
        
        snapshot.forEach(doc => {
            const data = doc.data();
            products.push({ 
                id: doc.id, 
                name: data.name,
                price: data.price,
                description: data.description,
                category: data.category,
                image: data.image,
                dateAdded: data.dateAdded
            });
        });
        
        console.log('✅ تم جلب المنتجات:', products.length);
        return products;
        
    } catch (error) {
        console.error('❌ فشل الجلب:', error);
        return [];
    }
}

async function deleteProductFromFirebase(productId) {
    if (!isFirebaseReady || !db) {
        throw new Error('قاعدة البيانات غير متاحة');
    }
    
    try {
        console.log('🔄 حذف المنتج:', productId);
        await db.collection('products').doc(productId).delete();
        console.log('✅ تم الحذف بنجاح');
        return true;
    } catch (error) {
        console.error('❌ فشل الحذف:', error);
        throw error;
    }
}

function uploadImage(file) {
    return new Promise((resolve, reject) => {
        if (!file) {
            resolve(null);
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            console.log('✅ تم تحميل الصورة');
            resolve(e.target.result);
        };
        reader.onerror = function() {
            reject(new Error('فشل في قراءة الملف'));
        };
        reader.readAsDataURL(file);
    });
}

// ==================== دوال واجهة المستخدم ====================

function addNewProduct() {
    closeModal();
    
    const modalHtml = `
        <div id="productModal" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;z-index:9999;">
            <div style="background:white;padding:25px;border-radius:15px;width:95%;max-width:500px;max-height:90vh;overflow-y:auto;">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h4 class="text-primary mb-0">➕ إضافة منتج جديد</h4>
                    <button type="button" onclick="closeModal()" style="border:none;background:none;font-size:1.3em;cursor:pointer;">×</button>
                </div>
                
                <div class="mb-3">
                    <label class="form-label">📝 اسم المنتج</label>
                    <input type="text" id="productName" class="form-control" placeholder="أدخل اسم المنتج" required>
                </div>
                
                <div class="mb-3">
                    <label class="form-label">💰 السعر ($)</label>
                    <input type="number" id="productPrice" class="form-control" placeholder="أدخل السعر" step="0.01" min="0" required>
                </div>
                
                <div class="mb-3">
                    <label class="form-label">📄 الوصف</label>
                    <textarea id="productDescription" class="form-control" rows="3" placeholder="أدخل وصف المنتج" required></textarea>
                </div>
                
                <div class="mb-3">
                    <label class="form-label">📂 الفئة</label>
                    <select id="productCategory" class="form-select" required>
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
                        <img id="previewImg" style="max-width:200px;max-height:150px;border-radius:8px;">
                    </div>
                </div>
                
                <div class="d-flex gap-2 mt-4">
                    <button type="button" class="btn btn-success flex-fill" onclick="saveNewProduct()" id="saveBtn">
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

async function saveNewProduct() {
    const name = document.getElementById('productName').value.trim();
    const price = document.getElementById('productPrice').value;
    const description = document.getElementById('productDescription').value.trim();
    const category = document.getElementById('productCategory').value;
    const imageFile = document.getElementById('productImage').files[0];
    const messageDiv = document.getElementById('formMessage');
    const saveBtn = document.getElementById('saveBtn');
    
    messageDiv.style.display = 'none';
    
    // التحقق من الحقول
    if (!name) {
        showMessage('❌ يرجى إدخال اسم المنتج', 'danger');
        return;
    }
    
    if (!price || isNaN(price) || price <= 0) {
        showMessage('❌ يرجى إدخال سعر صحيح أكبر من الصفر', 'danger');
        return;
    }
    
    if (!description) {
        showMessage('❌ يرجى إدخال وصف للمنتج', 'danger');
        return;
    }
    
    // تعطيل زر الحفظ أثناء المعالجة
    saveBtn.disabled = true;
    saveBtn.innerHTML = '🔄 جاري الحفظ...';
    
    let imageUrl = `https://via.placeholder.com/300x200/007bff/ffffff?text=${encodeURIComponent(name)}`;
    
    try {
        // رفع الصورة إذا existed
        if (imageFile) {
            imageUrl = await uploadImage(imageFile);
        }
        
        const newProduct = {
            name: name,
            price: parseFloat(price),
            description: description,
            category: category,
            image: imageUrl,
            dateAdded: new Date().toLocaleDateString('ar-EG')
        };
        
        showMessage('🔄 جاري إضافة المنتج إلى قاعدة البيانات...', 'info');
        
        await addProductToFirebase(newProduct);
        showMessage(`✅ تم إضافة "${name}" بنجاح!`, 'success');
        
        setTimeout(() => {
            closeModal();
            displayProductsInAdmin();
            updateProductsCount();
        }, 2000);
        
    } catch (error) {
        showMessage(`❌ ${error.message}`, 'danger');
        console.error('تفاصيل الخطأ:', error);
    } finally {
        // إعادة تمكين زر الحفظ
        saveBtn.disabled = false;
        saveBtn.innerHTML = '💾 حفظ المنتج';
    }
}

function showMessage(text, type) {
    const messageDiv = document.getElementById('formMessage');
    messageDiv.innerHTML = text;
    messageDiv.className = `alert alert-${type} mt-3`;
    messageDiv.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.remove();
    }
}

async function displayProductsInAdmin() {
    const container = document.getElementById('admin-products-container');
    if (!container) return;

    try {
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
                </div>
            </div>
        `;
    }
}

async function deleteProduct(productId) {
    if (!confirm('⚠️ هل أنت متأكد من حذف هذا المنتج؟')) {
        return;
    }
    
    try {
        await deleteProductFromFirebase(productId);
        alert('✅ تم حذف المنتج بنجاح!');
        displayProductsInAdmin();
        updateProductsCount();
    } catch (error) {
        alert('❌ فشل في حذف المنتج: ' + error.message);
    }
}

async function addSampleProduct() {
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
        alert('❌ فشل في الإضافة: ' + error.message);
    }
}

async function updateProductsCount() {
    try {
        const products = await getProductsFromFirebase();
        const countElement = document.getElementById('products-count');
        if (countElement) {
            countElement.textContent = products.length;
        }
    } catch (error) {
        console.error('خطأ في تحديث العدد:', error);
    }
}

// جعل الدوال متاحة globally
window.addProductToFirebase = addProductToFirebase;
window.getProductsFromFirebase = getProductsFromFirebase;
window.deleteProductFromFirebase = deleteProductFromFirebase;
window.uploadImage = uploadImage;
window.addNewProduct = addNewProduct;
window.saveNewProduct = saveNewProduct;
window.closeModal = closeModal;
window.displayProductsInAdmin = displayProductsInAdmin;
window.deleteProduct = deleteProduct;
window.addSampleProduct = addSampleProduct;
window.updateProductsCount = updateProductsCount;

// التهيئة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 لوحة التحكم جاهزة');
    
    // إعادة تهيئة Firebase للتأكد
    setTimeout(() => {
        if (!isFirebaseReady) {
            initializeFirebase();
        }
        updateProductsCount();
        displayProductsInAdmin();
    }, 1000);
});
