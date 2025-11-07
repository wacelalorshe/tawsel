// قاعدة البيانات
console.log('📦 تحميل Firebase Database...');

// دالة الإضافة
window.addProductToFirebase = async function(product) {
    if (!db) throw new Error('قاعدة البيانات غير متاحة');
    
    try {
        const docRef = await db.collection('products').add(product);
        console.log('✅ تمت الإضافة بنجاح:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('❌ فشل الإضافة:', error);
        throw error;
    }
}

// دالة الجلب
window.getProductsFromFirebase = async function() {
    if (!db) return [];
    
    try {
        const snapshot = await db.collection('products').get();
        const products = [];
        snapshot.forEach(doc => {
            products.push({ id: doc.id, ...doc.data() });
        });
        console.log('✅ عدد المنتجات:', products.length);
        return products;
    } catch (error) {
        console.error('❌ فشل الجلب:', error);
        return [];
    }
}
