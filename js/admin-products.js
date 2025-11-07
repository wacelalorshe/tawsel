// إدارة المنتجات
console.log('🛠️ تحميل إدارة المنتجات');

// دالة الإضافة
window.addNewProduct = async function() {
    if (!db) {
        alert('❌ قاعدة البيانات غير جاهزة');
        return;
    }
    
    const productName = prompt('📝 أدخل اسم المنتج:');
    if (!productName) return;

    const productPrice = prompt('💰 أدخل سعر المنتج:');
    if (!productPrice || isNaN(productPrice)) {
        alert('❌ يرجى إدخال سعر صحيح');
        return;
    }

    const productDescription = prompt('📄 أدخل وصف المنتج:') || 'لا يوجد وصف';
    const productCategory = prompt('📂 أدخل فئة المنتج:') || 'عام';

    const newProduct = {
        name: productName,
        price: parseFloat(productPrice),
        description: productDescription,
        category: productCategory,
        image: `https://via.placeholder.com/300x200/007bff/ffffff?text=${encodeURIComponent(productName)}`,
        dateAdded: new Date().toLocaleDateString('ar-EG')
    };

    try {
        await addProductToFirebase(newProduct);
        alert(`✅ تم إضافة "${productName}" بنجاح!`);
        displayProductsInAdmin();
        updateProductsCount();
    } catch (error) {
        alert('❌ فشل في الإضافة');
    }
}

// دالة العرض
window.displayProductsInAdmin = async function() {
    const container = document.getElementById('admin-products-container');
    if (!container) return;

    try {
        const products = await getProductsFromFirebase();
        container.innerHTML = '';

        if (products.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-4">
                    <div class="text-muted">
                        <h5>📦 لا توجد منتجات</h5>
                        <p>استخدم "إضافة منتج جديد" لبدء إضافة منتجاتك</p>
                    </div>
                </div>
            `;
            return;
        }

        products.forEach(product => {
            container.innerHTML += `
                <div class="col-lg-4 col-md-6 mb-3">
                    <div class="card h-100">
                        <img src="${product.image}" class="card-img-top" alt="${product.name}" style="height: 200px; object-fit: cover;">
                        <div class="card-body">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text text-muted">${product.description}</p>
                            <p class="card-text"><strong>السعر: $${product.price}</strong></p>
                            <p class="card-text"><small class="text-muted">${product.category}</small></p>
                        </div>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        container.innerHTML = `<div class="alert alert-danger">خطأ في تحميل المنتجات</div>`;
    }
}

// دالة الإضافة التجريبية
window.addSampleProduct = async function() {
    const sampleProduct = {
        name: "منتج تجريبي",
        price: 149.99,
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
