// إدارة عربة التسوق
console.log('🛒 تحميل نظام السلة...');

// دالة الحصول على السلة من التخزين المحلي
function getCart() {
    const cart = localStorage.getItem('wacelStoreCart');
    return cart ? JSON.parse(cart) : [];
}

// دالة حفظ السلة في التخزين المحلي
function saveCart(cart) {
    localStorage.setItem('wacelStoreCart', JSON.stringify(cart));
}

// دالة إضافة منتج إلى السلة
window.addToCart = function(productId, productName, productPrice, productImage) {
    const cart = getCart();
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: 1
        });
    }
    
    saveCart(cart);
    updateCartCount();
    
    // إشعار للمستخدم
    showNotification(`تم إضافة "${productName}" إلى السلة`);
}

// دالة إزالة منتج من السلة
window.removeFromCart = function(productId) {
    const cart = getCart();
    const updatedCart = cart.filter(item => item.id !== productId);
    saveCart(updatedCart);
    updateCartCount();
    
    // إذا كنا في صفحة السلة، قم بتحديث العرض
    if (window.location.pathname.includes('cart.html')) {
        displayCartItems();
    }
}

// دالة تحديث كمية المنتج في السلة
window.updateCartQuantity = function(productId, newQuantity) {
    if (newQuantity < 1) return;
    
    const cart = getCart();
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity = newQuantity;
        saveCart(cart);
        updateCartCount();
        
        // إذا كنا في صفحة السلة، قم بتحديث العرض
        if (window.location.pathname.includes('cart.html')) {
            displayCartItems();
        }
    }
}

// دالة تحديث عدد العناصر في السلة
function updateCartCount() {
    const cart = getCart();
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// دالة عرض عناصر السلة
window.displayCartItems = function() {
    const cartContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartCount = document.getElementById('cart-count');
    
    if (!cartContainer) return;
    
    const cart = getCart();
    
    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="text-muted">
                    <i class="fas fa-shopping-cart display-1 mb-3"></i>
                    <h4>سلة التسوق فارغة</h4>
                    <p class="mb-4">لم تقم بإضافة أي منتجات إلى سلة التسوق بعد</p>
                    <a href="products.html" class="btn btn-primary">
                        <i class="fas fa-shopping-bag me-2"></i>تصفح المنتجات
                    </a>
                </div>
            </div>
        `;
        if (cartTotal) cartTotal.textContent = '0.00';
        return;
    }
    
    let itemsHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        itemsHTML += `
            <div class="cart-item">
                <div class="row align-items-center">
                    <div class="col-md-2">
                        <img src="${item.image}" alt="${item.name}" class="img-fluid rounded" style="height: 80px; object-fit: cover;">
                    </div>
                    <div class="col-md-4">
                        <h5 class="mb-1">${item.name}</h5>
                        <p class="text-muted mb-0">$${item.price}</p>
                    </div>
                    <div class="col-md-3">
                        <div class="input-group">
                            <button class="btn btn-outline-secondary" type="button" onclick="updateCartQuantity('${item.id}', ${item.quantity - 1})">-</button>
                            <input type="number" class="form-control text-center" value="${item.quantity}" min="1" onchange="updateCartQuantity('${item.id}', parseInt(this.value))">
                            <button class="btn btn-outline-secondary" type="button" onclick="updateCartQuantity('${item.id}', ${item.quantity + 1})">+</button>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <h5 class="text-primary">$${itemTotal.toFixed(2)}</h5>
                    </div>
                    <div class="col-md-1">
                        <button class="btn btn-danger btn-sm" onclick="removeFromCart('${item.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    cartContainer.innerHTML = itemsHTML;
    if (cartTotal) cartTotal.textContent = total.toFixed(2);
    if (cartCount) cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

// دالة إظهار إشعار
function showNotification(message) {
    // إنشاء عنصر الإشعار
    const notification = document.createElement('div');
    notification.className = 'alert alert-success position-fixed';
    notification.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    `;
    notification.innerHTML = `
        <i class="fas fa-check-circle me-2"></i>${message}
    `;
    
    // إضافة الإشعار إلى الصفحة
    document.body.appendChild(notification);
    
    // إزالة الإشعار بعد 3 ثوان
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// تهيئة السلة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    
    // إذا كنا في صفحة السلة، قم بعرض العناصر
    if (window.location.pathname.includes('cart.html')) {
        displayCartItems();
    }
});
