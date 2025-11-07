// إدارة عربة التسوق - وسيل ستور
console.log('🛒 تحميل نظام السلة...');

// دالة الحصول على السلة من التخزين المحلي
function getCart() {
    const cart = localStorage.getItem('waseelStoreCart');
    return cart ? JSON.parse(cart) : [];
}

// دالة حفظ السلة في التخزين المحلي
function saveCart(cart) {
    localStorage.setItem('waseelStoreCart', JSON.stringify(cart));
}

// دالة إضافة منتج إلى السلة
window.addToCart = function(productId, productName, productPrice, productImage, restaurantId = '', restaurantName = '') {
    const cart = getCart();
    
    // في نظام المتجر العادي، لا نتحقق من المطاعم
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage,
            restaurantId: restaurantId,
            restaurantName: restaurantName,
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
    
    showNotification('تم إزالة المنتج من السلة');
}

// دالة تحديث كمية المنتج في السلة
window.updateCartQuantity = function(productId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    
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
    const restaurantInfo = document.getElementById('restaurant-info');
    const emptyCart = document.getElementById('empty-cart');
    const cartContent = document.getElementById('cart-content');
    
    if (!cartContainer) return;
    
    const cart = getCart();
    
    if (cart.length === 0) {
        if (emptyCart) emptyCart.classList.remove('d-none');
        if (cartContent) cartContent.classList.add('d-none');
        if (cartTotal) cartTotal.textContent = '0.00';
        return;
    }
    
    if (emptyCart) emptyCart.classList.add('d-none');
    if (cartContent) cartContent.classList.remove('d-none');
    
    // عرض معلومات المطعم إذا كانت متاحة
    if (restaurantInfo && cart.length > 0 && cart[0].restaurantName) {
        restaurantInfo.innerHTML = `
            <div class="alert alert-info d-flex align-items-center">
                <i class="fas fa-utensils me-2"></i>
                <div>
                    <strong>الطلبات من:</strong> ${cart[0].restaurantName}
                    <br>
                    <small class="text-muted">لا يمكن إضافة منتجات من مطاعم مختلفة في طلب واحد</small>
                </div>
            </div>
        `;
    } else if (restaurantInfo) {
        restaurantInfo.innerHTML = '';
    }
    
    let itemsHTML = '';
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        itemsHTML += `
            <div class="cart-item">
                <div class="row align-items-center">
                    <div class="col-md-2">
                        <img src="${item.image}" alt="${item.name}" class="img-fluid rounded" style="height: 80px; object-fit: cover;"
                             onerror="this.src='https://via.placeholder.com/300x200/cccccc/ffffff?text=صورة+غير+متاحة'">
                    </div>
                    <div class="col-md-4">
                        <h5 class="mb-1">${item.name}</h5>
                        <p class="text-muted mb-0">$${item.price}</p>
                        ${item.restaurantName ? `<small class="text-info"><i class="fas fa-store me-1"></i>${item.restaurantName}</small>` : ''}
                    </div>
                    <div class="col-md-3">
                        <div class="input-group" style="max-width: 150px;">
                            <button class="btn btn-outline-secondary" type="button" onclick="updateCartQuantity('${item.id}', ${item.quantity - 1})">
                                <i class="fas fa-minus"></i>
                            </button>
                            <input type="number" class="form-control text-center" value="${item.quantity}" min="1" 
                                   onchange="updateCartQuantity('${item.id}', parseInt(this.value))">
                            <button class="btn btn-outline-secondary" type="button" onclick="updateCartQuantity('${item.id}', ${item.quantity + 1})">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <h5 class="text-primary">$${itemTotal.toFixed(2)}</h5>
                    </div>
                    <div class="col-md-1">
                        <button class="btn btn-danger btn-sm" onclick="removeFromCart('${item.id}')" title="حذف المنتج">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    // حساب التكاليف الإضافية
    const shipping = 5.00; // رسوم الشحن
    const tax = subtotal * 0.05; // ضريبة 5%
    const total = subtotal + shipping + tax;
    
    cartContainer.innerHTML = itemsHTML;
    if (cartTotal) cartTotal.textContent = total.toFixed(2);
    if (cartCount) cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // تحديث ملخص الطلب
    updateOrderSummary(subtotal, shipping, tax, total);
}

// تحديث ملخص الطلب
function updateOrderSummary(subtotal, shipping, tax, total) {
    const summaryHTML = `
        <div class="d-flex justify-content-between mb-3">
            <span>المجموع الفرعي:</span>
            <span>$${subtotal.toFixed(2)}</span>
        </div>
        <div class="d-flex justify-content-between mb-3">
            <span>رسوم الشحن:</span>
            <span>$${shipping.toFixed(2)}</span>
        </div>
        <div class="d-flex justify-content-between mb-3">
            <span>الضريبة (5%):</span>
            <span>$${tax.toFixed(2)}</span>
        </div>
        <hr>
        <div class="d-flex justify-content-between mb-4">
            <strong>المجموع الكلي:</strong>
            <strong class="text-primary">$${total.toFixed(2)}</strong>
        </div>
    `;
    
    const orderSummary = document.getElementById('order-summary');
    if (orderSummary) {
        orderSummary.innerHTML = summaryHTML;
    }
}

// دالة إتمام الطلب والانتقال إلى صفحة الشراء
window.proceedToCheckout = function() {
    const cart = getCart();
    
    if (cart.length === 0) {
        showNotification('❌ سلة التسوق فارغة. أضف منتجات قبل إتمام الشراء.', 'error');
        return;
    }
    
    // الانتقال إلى صفحة الشراء
    window.location.href = 'checkout.html';
}

// دالة الشراء المباشر
window.buyNow = function(productId, productName, productPrice, productImage, restaurantId = '', restaurantName = '') {
    // إضافة المنتج إلى السلة
    addToCart(productId, productName, productPrice, productImage, restaurantId, restaurantName);
    
    // الانتقال المباشر إلى صفحة الشراء بعد تأخير بسيط
    setTimeout(() => {
        window.location.href = 'checkout.html';
    }, 800);
}

// دالة إفراغ السلة
window.clearCart = function() {
    if (confirm('هل أنت متأكد من أنك تريد إفراغ سلة التسوق؟')) {
        localStorage.removeItem('waseelStoreCart');
        updateCartCount();
        displayCartItems();
        showNotification('تم إفراغ سلة التسوق');
    }
}

// دالة إظهار إشعار
function showNotification(message, type = 'success') {
    // إنشاء عنصر الإشعار
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} position-fixed`;
    notification.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        border-radius: 8px;
    `;
    
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle';
    notification.innerHTML = `
        <i class="fas ${icon} me-2"></i>${message}
    `;
    
    // إضافة الإشعار إلى الصفحة
    document.body.appendChild(notification);
    
    // إزالة الإشعار بعد 3 ثوان
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// دالة التحقق من توفر المنتج في السلة
window.isInCart = function(productId) {
    const cart = getCart();
    return cart.some(item => item.id === productId);
}

// دالة الحصول على كمية المنتج في السلة
window.getCartQuantity = function(productId) {
    const cart = getCart();
    const item = cart.find(item => item.id === productId);
    return item ? item.quantity : 0;
}

// تهيئة السلة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    
    // إذا كنا في صفحة السلة، قم بعرض العناصر
    if (window.location.pathname.includes('cart.html')) {
        displayCartItems();
    }
    
    // إضافة مستمع لحدث تخزين السلة (للتحديث بين التبويبات)
    window.addEventListener('storage', function(e) {
        if (e.key === 'waseelStoreCart') {
            updateCartCount();
            if (window.location.pathname.includes('cart.html')) {
                displayCartItems();
            }
        }
    });
});
