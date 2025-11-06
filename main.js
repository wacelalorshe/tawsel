// بيانات نموذجية للقائمة
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

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', function() {
    displayMenuItems();
    updateCartCount();
    setupEventListeners();
});

// عرض عناصر القائمة
function displayMenuItems(filter = 'all') {
    const menuContainer = document.getElementById('menuItems');
    const filteredItems = filter === 'all' ? menuItems : menuItems.filter(item => item.category === filter);
    
    menuContainer.innerHTML = filteredItems.map(item => `
        <div class="menu-item" data-category="${item.category}">
            <div class="item-image">
                <img src="images/${item.image}" alt="${item.name}" onerror="this.style.display='none'">
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
    displayCartItems();
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
        cartContainer.innerHTML = '<p>السلة فارغة</p>';
        totalElement.textContent = '0.00 ر.س';
        return;
    }
    
    cartContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <span class="cart-item-price">${item.price.toFixed(2)} ر.س</span>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">
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
    cart = cart.filter(item => item.id !== itemId);
    updateCart();
}

// إعداد مستمعي الأحداث
function setupEventListeners() {
    // تصفية القائمة
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const category = this.getAttribute('data-category');
            displayMenuItems(category);
        });
    });
    
    // فتح/إغلاق السلة
    document.querySelector('.cart-icon').addEventListener('click', showCart);
    
    // إتمام الطلب
    document.querySelector('.checkout-btn').addEventListener('click', checkout);
}

// إتمام الطلب
function checkout() {
    if (cart.length === 0) {
        alert('السلة فارغة');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderDetails = cart.map(item => 
        `${item.name} (${item.quantity}) - ${(item.price * item.quantity).toFixed(2)} ر.س`
    ).join('\n');
    
    alert(`تفاصيل الطلب:\n${orderDetails}\n\nالمجموع: ${total.toFixed(2)} ر.س\n\nسيتم تأكيد طلبك قريباً`);
    
    // هنا يمكنك إضافة كود إرسال الطلب إلى الخادم
    cart = [];
    updateCart();
    closeCart();
}

// التمرير إلى القائمة
function scrollToMenu() {
    document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
}