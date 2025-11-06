// إدارة المنتجات - الإصدار المبسط
console.log('🛠️ تحميل إدارة المنتجات');

// دالة الإضافة المبسطة
window.addNewProduct = async function() {
    console.log('🎯 بدء إضافة منتج');
    
    // التحقق من Firebase
    if (typeof db === 'undefined') {
        alert('❌ قاعدة البيانات غير جاهزة');
        return;
    }
    
    const productName = prompt('📝 اسم المنتج:');
    if (!productName) return;

    const productPrice = prompt('💰 السعر:');
    if (!productPrice || isNaN(productPrice)) {
        alert('❌ السعر غير صحيح');
        return;
    }

    const productDescription = prompt('📄 الوصف:') || 'لا يوجد وصف';
    const productCategory = prompt('📂 الفئة:') || 'عام';

    const newProduct = {
        name: productName,
        price: parseFloat(productPrice),
        description: productDescription,
        category: productCategory,
        image: `https://via.placeholder.com/300x200/007bff/ffffff?text=${encodeURIComponent(productName)}`,
        dateAdded: new Date().toLocaleDateString('ar-EG')
    };

    try {
        console.log('🔄 جاري الإضافة...', newProduct);
        await addProductToFirebase(newProduct);
        alert(`✅ تم إضافة "${productName}" بنجاح!`);
        location.reload(); // إعادة تحميل الصفحة
    } catch (error) {
        console.error('❌ فشل:', error);
        alert('❌ فشل في الإضافة - راجع الكونسول');
    }
}

// دالة العرض المبسطة
window.displayProductsInAdmin = async function() {
    console.log('🔄 عرض المنتجات...');
    const container = document.getElementById('admin-products-container');
    if (!container) return;

    try {
        const products = await getProductsFromFirebase();
        container.innerHTML = '';

        if (products.length === 0) {
            container.innerHTML = '<div class="alert alert-info">لا توجد منتجات</div>';
            return;
        }

        products.forEach(product => {
            container.innerHTML += `
                <div class="col-md-4 mb-3">
                    <div class="card">
                        <div class="card-body">
                            <h5>${product.name}</h5>
                            <p>السعر: $${product.price}</p>
                            <button class="btn btn-danger btn-sm" onclick="deleteProduct('${product.id}')">حذف</button>
                        </div>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error('❌ خطأ في العرض:', error);
    }
}

// التهيئة
document.addEventListener('DOMContentLoaded', function() {
    console.log('🏁 الصفحة جاهزة');
    displayProductsInAdmin();
});
