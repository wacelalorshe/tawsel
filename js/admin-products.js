// إدارة المنتجات مع Firebase
console.log('✅ تم تحميل إدارة المنتجات');

// جلب المنتجات
function getProducts() {
    return getProductsFromFirebase();
}

// إضافة منتج جديد
async function addNewProduct() {
    console.log('🎯 بدء إضافة منتج جديد');
    
    const productName = prompt('📝 أدخل اسم المنتج:');
    if (!productName) {
        alert('❌ يجب إدخال اسم المنتج');
        return;
    }

    const productPrice = prompt('💰 أدخل سعر المنتج:');
    if (!productPrice || isNaN(productPrice) || productPrice <= 0) {
        alert('❌ يرجى إدخال سعر صحيح أكبر من الصفر');
        return;
    }

    const productDescription = prompt('📄 أدخل وصف المنتج:') || 'لا يوجد وصف مفصل';
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
        alert(`✅ تم إضافة "${productName}" بنجاح للجميع!`);
        displayProductsInAdmin();
        updateProductsCount();
    } catch (error) {
        console.error('❌ فشل إضافة المنتج:', error);
    }
}

// عرض المنتجات في لوحة التحكم
async function displayProductsInAdmin() {
    console.log('🔄 عرض المنتجات في اللوحة...');
    const container = document.getElementById('admin-products-container');
    if (!container) {
        console.log('❌ لم يتم العثور على الحاوية');
        return;
    }

    try {
        const products = await getProductsFromFirebase();
        console.log('📊 عدد المنتجات للعرض:', products.length);

        container.innerHTML = '';

        if (products.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <div class="text-muted">
                        <h4>📦 لا توجد منتجات مضافة بعد</h4>
                        <p>انقر على "إضافة منتج جديد" لبدء إضافة منتجاتك</p>
                    </div>
                </div>
            `;
            return;
        }

        products.forEach(product => {
            const productCard = `
                <div class="col-lg-4 col-md-6 mb-4">
                    <div class="card h-100">
                        <img src="${product.image}" class="card-img-top product-image" alt="${product.name}">
                        <div class="card-body">
                            <h5 class="card-title text-primary">${product.name}</h5>
                            <p class="card-text">${product.description}</p>
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="h5 text-success">$${product.price}</span>
                                <small class="text-muted">${product.category}</small>
                            </div>
                            <div class="mt-3">
                                <button class="btn btn-danger btn-sm" onclick="deleteProduct('${product.id}')">
                                    🗑️ حذف
                                </button>
                                <small class="text-muted d-block mt-2">أضيف في: ${product.dateAdded}</small>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += productCard;
        });
    } catch (error) {
        console.error('❌ خطأ في عرض المنتجات:', error);
    }
}

// حذف المنتج
async function deleteProduct(productId) {
    if (!confirm('⚠️ هل أنت متأكد من حذف هذا المنتج؟')) return;

    try {
        await deleteProductFromFirebase(productId);
        alert('✅ تم حذف المنتج بنجاح!');
        displayProductsInAdmin();
        updateProductsCount();
    } catch (error) {
        console.error('❌ فشل حذف المنتج:', error);
    }
}

// تحديث عدد المنتجات
async function updateProductsCount() {
    try {
        const products = await getProductsFromFirebase();
        const countElement = document.getElementById('products-count');
        if (countElement) {
            countElement.textContent = products.length;
            console.log('🔢 عدد المنتجات:', products.length);
        }
    } catch (error) {
        console.error('❌ خطأ في تحديث العدد:', error);
    }
}

// منتجات تجريبية
async function addSampleProduct() {
    console.log('🧪 إضافة منتجات تجريبية');
    
    const sampleProducts = [
        {
            name: "لابتوب ديل",
            price: 2500,
            description: "لابتوب ممتاز للأعمال والاستخدام اليومي",
            category: "إلكترونيات",
            image: "https://via.placeholder.com/300x200/28a745/ffffff?text=Dell+Laptop",
            dateAdded: new Date().toLocaleDateString('ar-EG')
        },
        {
            name: "هاتف سامسونج",
            price: 1800,
            description: "هاتف ذكي بمواصفات عالية",
            category: "إلكترونيات",
            image: "https://via.placeholder.com/300x200/dc3545/ffffff?text=Samsung+Phone",
            dateAdded: new Date().toLocaleDateString('ar-EG')
        }
    ];

    try {
        for (const product of sampleProducts) {
            await addProductToFirebase(product);
        }
        alert('✅ تم إضافة المنتجات التجريبية بنجاح!');
        displayProductsInAdmin();
        updateProductsCount();
    } catch (error) {
        console.error('❌ فشل إضافة المنتجات التجريبية:', error);
    }
}

// التهيئة
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 لوحة التحكم جاهزة');
    displayProductsInAdmin();
    updateProductsCount();
});
