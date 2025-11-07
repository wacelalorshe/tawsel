// قاعدة البيانات
console.log('📦 تحميل Firebase Database...');

// دالة الإضافة
window.addProductToFirebase = async function(product) {
    if (!db) throw new Error('قاعدة البيانات غير متاحة');
    
    try {
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

// دالة الجلب
window.getProductsFromFirebase = async function() {
    if (!db) return [];
    
    try {
        const snapshot = await db.collection('products').orderBy('createdAt', 'desc').get();
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

// دالة البحث
window.searchProducts = async function(searchTerm) {
    if (!db) return [];
    
    try {
        const snapshot = await db.collection('products').get();
        const products = [];
        snapshot.forEach(doc => {
            const product = { id: doc.id, ...doc.data() };
            // البحث في الاسم والوصف والفئة
            if (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.category.toLowerCase().includes(searchTerm.toLowerCase())) {
                products.push(product);
            }
        });
        return products;
    } catch (error) {
        console.error('❌ فشل البحث:', error);
        return [];
    }
}

// دالة الحذف
window.deleteProductFromFirebase = async function(productId) {
    if (!db) throw new Error('قاعدة البيانات غير متاحة');
    
    try {
        await db.collection('products').doc(productId).delete();
        console.log('✅ تم الحذف بنجاح:', productId);
        return true;
    } catch (error) {
        console.error('❌ فشل الحذف:', error);
        throw error;
    }
}
