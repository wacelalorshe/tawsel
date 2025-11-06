// تحديث عدد المنتجات
function updateProductsCount() {
    const products = JSON.parse(localStorage.getItem('storeProducts')) || [];
    const countElement = document.getElementById('products-count');
    if (countElement) {
        countElement.textContent = products.length;
    }
}

// إضافة منتج تجريبي
function addSampleProduct() {
    const products = JSON.parse(localStorage.getItem('storeProducts')) || [];
    
    const newProduct = {
        id: products.length + 1,
        name: `منتج تجريبي ${products.length + 1}`,
        price: Math.floor(Math.random() * 1000) + 100,
        description: "وصف المنتج التجريبي",
        image: "https://via.placeholder.com/300x200?text=Product",
        category: "عام"
    };

    products.push(newProduct);
    localStorage.setItem('storeProducts', JSON.stringify(products));
    
    updateProductsCount();
    alert('تم إضافة المنتج التجريبي بنجاح!');
}

// التهيئة
document.addEventListener('DOMContentLoaded', function() {
    updateProductsCount();
});
