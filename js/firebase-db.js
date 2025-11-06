// 🔥 قاعدة البيانات Firebase للمتجر
console.log('📦 تم تحميل Firebase Database');

// جلب جميع المنتجات من Firebase
async function getProductsFromFirebase() {
    try {
        console.log('🔄 جلب المنتجات من Firebase...');
        const snapshot = await db.collection('products').get();
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
        console.error('❌ خطأ في جلب المنتجات:', error);
        alert('حدث خطأ في تحميل المنتجات');
        return [];
    }
}

// إضافة منتج جديد إلى Firebase
async function addProductToFirebase(product) {
    try {
        console.log('🔄 إضافة منتج جديد:', product.name);
        const docRef = await db.collection('products').add({
            ...product,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        console.log('✅ تم إضافة المنتج بـ ID:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('❌ خطأ في إضافة المنتج:', error);
        alert('حدث خطأ في إضافة المنتج');
        throw error;
    }
}

// حذف منتج من Firebase
async function deleteProductFromFirebase(productId) {
    try {
        console.log('🔄 حذف المنتج:', productId);
        await db.collection('products').doc(productId).delete();
        console.log('✅ تم حذف المنتج بنجاح');
        return true;
    } catch (error) {
        console.error('❌ خطأ في حذف المنتج:', error);
        alert('حدث خطأ في حذف المنتج');
        throw error;
    }
}

// الاستماع للتحديثات الفورية
function setupProductsListener(callback) {
    console.log('🎯 بدء الاستماع للتحديثات...');
    return db.collection('products').onSnapshot(snapshot => {
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
