// بيانات المطعم
const menuItems = [
    {
        id: 1,
        name: "شاورما لحم",
        category: "main",
        price: 25.00,
        description: "شاورما لحم مع خضار طازجة وصوص خاص",
        image: "shawarma.jpg"
    },
    {
        id: 2,
        name: "برجر لحم",
        category: "main",
        price: 30.00,
        description: "برجر لحم مع جبنة وخضار",
        image: "burger.jpg"
    },
    {
        id: 3,
        name: "سلطة سيزر",
        category: "appetizers",
        price: 18.00,
        description: "سلطة سيزر مع دجاج مشوي",
        image: "caesar.jpg"
    },
    {
        id: 4,
        name: "كنافة",
        category: "desserts",
        price: 15.00,
        description: "كنافة نابلسية بالجبن",
        image: "knafeh.jpg"
    },
    {
        id: 5,
        name: "عصير برتقال",
        category: "drinks",
        price: 8.00,
        description: "عصير برتقال طازج",
        image: "orange-juice.jpg"
    }
];

// سلة التسوق
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// رابط نموذج جوجل الخاص بك
const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSeK_WJ9LSAZxYqTq0DCZOGJv-gx4n9mA8x0VacFi0aOHuGiXQ/formResponse";

// IDs حقول النموذج (سيتم اكتشافها تلقائياً)
const FIELD_IDS = {
    name: "entry.1251687736",      // اسم العميل
    phone: "entry.2042799852",     // رقم الهاتف
    address: "entry.1421803937",   // العنوان
    items: "entry.1544069091",     // الطلبات
    total: "entry.1328004331"      // المجموع
};

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', function() {
    displayMenuItems();
    updateCartCount();
    setupEventListeners();
});

// عرض عناصر القائمة
function displayMenuItems() {
    const menuContainer = document.getElementById('menuItems');
    
    menuContainer.innerHTML = menuItems.map(item => `
        <div class="menu-item" data-category="${item.category}">
            <div class="item-image">
                ${item.image ? `<img src="images/${item.image}" alt="${item.name}" onerror="this.style.display='none'">` : ''}
                <span>${item.name}</span>
            </div>
            <div class="item-content">
                <div class="item-header">
                    <h3 class="item-title">${item.name}</h3>
                    <span class="item-price">${item.price.toFixed(2)} ر.س</span>
                </div>
                <p class="item-description">${item.description}</p>
                <button class="add-to-cart" onclick="addToCart(${item.id})">
                    أضف إلى السلة
                </button>
            </div>
        </div>
    `).join('');
}

// إضافة إلى السلة
function addToCart(itemId) {
    const item = menuItems.find(i => i.id === itemId);
    const existingItem = cart.find(i => i.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...item,
            quantity: 1
        });
    }
    
    updateCart();
    showCart();
    showNotification(`تم إضافة ${item.name} إلى السلة`);
}

// تحديث السلة
function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCartItems();
}

// تحديث عداد السلة
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelector('.cart-count').textContent = count;
}

// عرض السلة
function showCart() {
    document.getElementById('cartSidebar').classList.add('active');
}

// إغلاق السلة
function closeCart() {
    document.getElementById('cartSidebar').classList.remove('active');
}

// عرض عناصر السلة
function displayCartItems() {
    const cartContainer = document.getElementById('cartItems');
    const totalElement = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartContainer.innerHTML = '<p style="text-align: center; color: #666;">السلة فارغة</p>';
        totalElement.textContent = '0.00 ر.س';
        return;
    }
    
    cartContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <span class="cart-item-price">${(item.price * item.quantity).toFixed(2)} ر.س</span>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})" title="إزالة">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalElement.textContent = `${total.toFixed(2)} ر.س`;
}

// تحديث الكمية
function updateQuantity(itemId, change) {
    const item = cart.find(i => i.id === itemId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(itemId);
        } else {
            updateCart();
        }
    }
}

// إزالة من السلة
function removeFromCart(itemId) {
    const item = cart.find(i => i.id === itemId);
    cart = cart.filter(item => item.id !== itemId);
    updateCart();
    showNotification(`تم إزالة ${item.name} من السلة`);
}

// إعداد مستمعي الأحداث
function setupEventListeners() {
    // إرسال نموذج الطلب
    document.getElementById('orderForm').addEventListener('submit', function(e) {
        e.preventDefault();
        submitOrder();
    });
    
    // إغلاق النموذج عند النقر خارج المحتوى
    document.getElementById('orderModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeOrderModal();
        }
    });
}

// عرض نموذج الطلب
function showOrderModal() {
    if (cart.length === 0) {
        showNotification('السلة فارغة. أضف بعض العناصر أولاً.');
        return;
    }
    
    const modal = document.getElementById('orderModal');
    const orderSummary = document.getElementById('orderSummary');
    const modalTotal = document.getElementById('modalTotal');
    
    // عرض ملخص الطلب
    orderSummary.innerHTML = cart.map(item => `
        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span>${item.name} x${item.quantity}</span>
            <span>${(item.price * item.quantity).toFixed(2)} ر.س</span>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    modalTotal.textContent = total.toFixed(2);
    
    modal.classList.add('active');
}

// إغلاق نموذج الطلب
function closeOrderModal() {
    document.getElementById('orderModal').classList.remove('active');
}

// إرسال الطلب
async function submitOrder() {
    const form = document.getElementById('orderForm');
    const submitBtn = form.querySelector('.submit-order');
    
    // جمع بيانات الطلب
    const orderData = {
        name: document.getElementById('customerName').value,
        phone: document.getElementById('customerPhone').value,
        address: document.getElementById('customerAddress').value,
        items: cart.map(item => `${item.name} x${item.quantity}`).join('، '),
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)
    };
    
    // تعطيل الزر أثناء الإرسال
    submitBtn.disabled = true;
    submitBtn.textContent = 'جاري إرسال الطلب...';
    
    try {
        // إرسال إلى جوجل فورم
        await sendToGoogleForm(orderData);
        
        // إرسال إلى واتساب
        sendToWhatsApp(orderData);
        
        // إظهار رسالة نجاح
        showNotification('تم إرسال طلبك بنجاح! سنتصل بك قريباً.', 'success');
        
        // إغلاق النموذج وتفريغ السلة
        closeOrderModal();
        resetCart();
        
    } catch (error) {
        showNotification('حدث خطأ في إرسال الطلب. يرجى المحاولة مرة أخرى.', 'error');
        console.error('Error submitting order:', error);
    } finally {
        // إعادة تفعيل الزر
        submitBtn.disabled = false;
        submitBtn.textContent = 'تأكيد الطلب';
    }
}

// إرسال إلى جوجل فورم
async function sendToGoogleForm(orderData) {
    const formData = new FormData();
    
    // إضافة البيانات للحقول الصحيحة
    formData.append(FIELD_IDS.name, orderData.name);
    formData.append(FIELD_IDS.phone, orderData.phone);
    formData.append(FIELD_IDS.address, orderData.address || 'لا يوجد عنوان');
    formData.append(FIELD_IDS.items, orderData.items);
    formData.append(FIELD_IDS.total, orderData.total + ' ر.س');
    
    // إرسال البيانات
    const response = await fetch(GOOGLE_FORM_URL, {
        method: 'POST',
        body: formData,
        mode: 'no-cors'
    });
    
    return response;
}

// إرسال إلى واتساب
function sendToWhatsApp(orderData) {
    const phoneNumber = "966500000000"; // ضع رقم واتسابك هنا
    
    const message = `🎉 طلب جديد! 
    
العميل: ${orderData.name}
الهاتف: ${orderData.phone}
العنوان: ${orderData.address || 'لا يوجد عنوان'}

الطلبات:
${orderData.items}

المجموع: ${orderData.total} ر.س

شكراً لاستخدامكم مطعمنا! 🍔`;
    
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    // فتح واتساب في نافذة جديدة
    window.open(whatsappURL, '_blank');
}

// تفريغ السلة
function resetCart() {
    cart = [];
    updateCart();
    closeCart();
}

// إظهار إشعار
function showNotification(message, type = 'info') {
    // إنصراف عنصر الإشعار
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1003;
        max-width: 300px;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // إزالة الإشعار بعد 5 ثوانٍ
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// التمرير إلى القائمة
function scrollToMenu() {
    document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
}

// إضافة أنيميشن للإشعارات
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
