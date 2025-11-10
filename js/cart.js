// إدارة عربة التسوق - وسيل ستور
console.log('🛒 تحميل نظام السلة...');

// دالة الحصول على السلة من التخزين المحلي
function getCart() {
    try {
        const cart = localStorage.getItem('waseelStoreCart');
        return cart ? JSON.parse(cart) : [];
    } catch (error) {
        console.error('خطأ في جلب السلة:', error);
        return [];
    }
}

// دالة حفظ السلة في التخزين المحلي
function saveCart(cart) {
    try {
        localStorage.setItem('waseelStoreCart', JSON.stringify(cart));
    } catch (error) {
        console.error('خطأ في حفظ السلة:', error);
    }
}

// دالة إضافة منتج إلى السلة
window.addToCart = function(productId, productName, productPrice, productImage) {
    try {
        const cart = getCart();
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: productId,
                name: productName,
                price: parseFloat(productPrice),
                image: productImage,
                quantity: 1
            });
        }
        
        saveCart(cart);
        updateCartCount();
        showNotification(`تم إضافة "${productName}" إلى السلة`);
    } catch (error) {
        console.error('خطأ في إضافة المنتج للسلة:', error);
        showNotification('حدث خطأ في إضافة المنتج', 'error');
    }
}

// دالة إزالة منتج من السلة
window.removeFromCart = function(productId) {
    try {
        const cart = getCart();
        const updatedCart = cart.filter(item => item.id !== productId);
        saveCart(updatedCart);
        updateCartCount();
        
        if (window.location.pathname.includes('cart.html')) {
            displayCartItems();
        }
        
        showNotification('تم إزالة المنتج من السلة');
    } catch (error) {
        console.error('خطأ في إزالة المنتج:', error);
    }
}

// دالة تحديث كمية المنتج في السلة
window.updateCartQuantity = function(productId, newQuantity) {
    try {
        if (newQuantity < 1) {
            removeFromCart(productId);
            return;
        }
        
        const cart = getCart();
        const item = cart.find(item => item.id === productId);
        
        if (item) {
            item.quantity = parseInt(newQuantity);
            saveCart(cart);
            updateCartCount();
            
            if (window.location.pathname.includes('cart.html')) {
                displayCartItems();
            }
        }
    } catch (error) {
        console.error('خطأ في تحديث الكمية:', error);
    }
}

// دالة تحديث عدد العناصر في السلة
function updateCartCount() {
    try {
        const cart = getCart();
        const cartCountElements = document.querySelectorAll('#cart-count');
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        
        cartCountElements.forEach(element => {
            element.textContent = totalItems;
        });
    } catch (error) {
        console.error('خطأ في تحديث العداد:', error);
    }
}

// دالة عرض عناصر السلة
window.displayCartItems = function() {
    try {
        const cartContainer = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
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
        
        let itemsHTML = '';
        let subtotal = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            itemsHTML += `
                <div class="cart-item border-bottom pb-3 mb-3">
                    <div class="row align-items-center">
                        <div class="col-md-2">
                            <img src="${item.image}" alt="${item.name}" class="img-fluid rounded" style="height: 80px; object-fit: cover;"
                                 onerror="this.src='https://via.placeholder.com/300x200/cccccc/ffffff?text=صورة+غير+متاحة'">
                        </div>
                        <div class="col-md-4">
                            <h5 class="mb-1">${item.name}</h5>
                            <p class="text-muted mb-0">$${item.price}</p>
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
        
        const shipping = 5.00;
        const tax = subtotal * 0.05;
        const total = subtotal + shipping + tax;
        
        cartContainer.innerHTML = itemsHTML;
        if (cartTotal) cartTotal.textContent = total.toFixed(2);
        
        updateOrderSummary(subtotal, shipping, tax, total);
        
    } catch (error) {
        console.error('خطأ في عرض عناصر السلة:', error);
    }
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

// دالة إتمام الطلب وإرساله عبر واتساب
window.proceedToCheckout = function() {
    try {
        const cart = getCart();
        
        if (cart.length === 0) {
            showNotification('❌ سلة التسوق فارغة. أضف منتجات قبل إتمام الشراء.', 'error');
            return;
        }
        
        // حفظ السلة للاستخدام في صفحة الدفع
        localStorage.setItem('checkoutCart', JSON.stringify(cart));
        
        // الانتقال لصفحة الدفع
        window.location.href = 'checkout.html';
        
    } catch (error) {
        console.error('خطأ في إتمام الطلب:', error);
        showNotification('حدث خطأ في إتمام الطلب', 'error');
    }
}

// دالة إظهار إشعار
function showNotification(message, type = 'success') {
    try {
        // استخدام alert بسيط بدلاً من الإشعارات المعقدة
        if (type === 'error') {
            alert('❌ ' + message);
        } else {
            alert('✅ ' + message);
        }
    } catch (error) {
        console.error('خطأ في عرض الإشعار:', error);
    }
}

// دالة إفراغ السلة
window.clearCart = function() {
    try {
        if (confirm('هل أنت متأكد من أنك تريد إفراغ سلة التسوق؟')) {
            localStorage.removeItem('waseelStoreCart');
            updateCartCount();
            if (window.displayCartItems) {
                displayCartItems();
            }
            showNotification('تم إفراغ سلة التسوق');
        }
    } catch (error) {
        console.error('خطأ في إفراغ السلة:', error);
    }
}

// تهيئة السلة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    
    if (window.location.pathname.includes('cart.html') && window.displayCartItems) {
        displayCartItems();
    }
});
