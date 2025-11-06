// js/firebase-db.js - الكود الكامل المحدث
console.log('📦 تحميل Firebase Database...');

// تكوين Firebase
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
if (typeof firebase !== 'undefined') {
    try {
        // إذا كان Firebase مثبتاً مسبقاً، استخدمه
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        console.log('✅ تم تهيئة Firebase بنجاح');
    } catch (error) {
        console.error('❌ خطأ في التهيئة:', error);
    }
} else {
    console.error('❌ مكتبة Firebase غير محملة');
}

// كائن قاعدة البيانات
const db = typeof firebase !== 'undefined' ? firebase.firestore() : null;
console.log('🗄️ قاعدة البيانات:', db ? 'جاهزة' : 'غير جاهزة');

// دالة الإضافة إلى Firebase
window.addProductToFirebase = async function(product) {
    if (!db) {
        console.error('❌ قاعدة البيانات غير متاحة');
        throw new Error('قاعدة البيانات غير متاحة');
    }
    
    try {
        console.log('🔄 محاولة إضافة منتج:', product.name);
        const docRef = await db.collection('products').add({
            ...product,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        console.log('✅ تمت الإضافة بنجاح:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('❌ فشل الإضافة:', error);
        throw error;
    }
}

// دالة جلب المنتجات من Firebase
window.getProductsFromFirebase = async function() {
    if (!db) {
        console.error('❌ قاعدة البيانات غير متاحة');
        return [];
    }
    
    try {
        console.log('🔄 جلب المنتجات من Firebase...');
        const snapshot = await db.collection('products').orderBy('createdAt', 'desc').get();
        const products = [];
        snapshot.forEach(doc => {
            products.push({ 
                id: doc.id, 
                ...doc.data() 
            });
        });
        console.log('✅ تم جلب المنتجات:', products.length);
        return products;
    } catch (error) {
        console.error('❌ فشل الجلب:', error);
        return [];
    }
}

// دالة حذف المنتج من Firebase
window.deleteProductFromFirebase = async function(productId) {
    if (!db) {
        console.error('❌ قاعدة البيانات غير متاحة');
        throw new Error('قاعدة البيانات غير متاحة');
    }
    
    try {
        console.log('🔄 محاولة حذف المنتج:', productId);
        await db.collection('products').doc(productId).delete();
        console.log('✅ تم حذف المنتج بنجاح');
        return true;
    } catch (error) {
        console.error('❌ فشل الحذف:', error);
        throw error;
    }
}

// دالة تحديث المنتج في Firebase
window.updateProductInFirebase = async function(productId, updatedData) {
    if (!db) {
        console.error('❌ قاعدة البيانات غير متاحة');
        throw new Error('قاعدة البيانات غير متاحة');
    }
    
    try {
        console.log('🔄 محاولة تحديث المنتج:', productId);
        await db.collection('products').doc(productId).update(updatedData);
        console.log('✅ تم تحديث المنتج بنجاح');
        return true;
    } catch (error) {
        console.error('❌ فشل التحديث:', error);
        throw error;
    }
}

// دالة الاستماع للتحديثات الفورية
window.setupProductsListener = function(callback) {
    if (!db) {
        console.error('❌ قاعدة البيانات غير متاحة');
        return null;
    }
    
    console.log('🎯 بدء الاستماع للتحديثات...');
    return db.collection('products').orderBy('createdAt', 'desc').onSnapshot(snapshot => {
        const products = [];
        snapshot.forEach(doc => {
            products.push({ 
                id: doc.id, 
                ...doc.data() 
            });
        });
        console.log('🔄 تحديث المنتجات:', products.length);
        callback(products);
    }, error => {
        console.error('❌ خطأ في الاستماع:', error);
    });
}

// دالة تحويل الصورة إلى Base64
window.uploadImage = function(file) {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject(new Error('لم يتم اختيار ملف'));
            return;
        }
        
        // التحقق من نوع الملف
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            reject(new Error('نوع الملف غير مدعوم. الرجاء اختيار صورة (JPG, PNG, GIF, WebP)'));
            return;
        }
        
        // التحقق من حجم الملف (5MB كحد أقصى)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            reject(new Error('حجم الملف كبير جداً. الحد الأقصى 5MB'));
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            console.log('✅ تم تحميل الصورة بنجاح');
            resolve(e.target.result);
        };
        reader.onerror = function() {
            reject(new Error('فشل في قراءة الملف'));
        };
        reader.readAsDataURL(file);
    });
}

// دالة للحصول على إحصائيات
window.getStoreStats = async function() {
    if (!db) return null;
    
    try {
        const productsSnapshot = await db.collection('products').get();
        const totalProducts = productsSnapshot.size;
        
        // يمكن إضافة المزيد من الإحصائيات هنا لاحقاً
        return {
            totalProducts: totalProducts,
            totalSales: 0, // يمكن إضافته لاحقاً
            totalCustomers: 0 // يمكن إضافته لاحقاً
        };
    } catch (error) {
        console.error('❌ خطأ في جلب الإحصائيات:', error);
        return null;
    }
}
