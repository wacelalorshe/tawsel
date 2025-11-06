// لوحة تحكم المطعم
class AdminPanel {
    constructor() {
        this.orders = [];
        this.init();
    }

    init() {
        this.loadOrders();
        this.setupEventListeners();
    }

    // تحميل الطلبات
    async loadOrders() {
        try {
            // بيانات تجريبية للعرض
            this.orders = [
                {
                    id: 1,
                    name: "أحمد محمد",
                    phone: "0512345678",
                    address: "حي الرياض، شارع الملك فهد",
                    items: "شاورما لحم x2, برجر x1",
                    total: "80.00 ر.س",
                    timestamp: new Date().toLocaleString('ar-SA'),
                    status: "pending"
                },
                {
                    id: 2,
                    name: "فاطمة عبدالله",
                    phone: "0555555555",
                    address: "حي النخيل",
                    items: "سلطة سيزر x1, عصير برتقال x2",
                    total: "34.00 ر.س",
                    timestamp: new Date().toLocaleString('ar-SA'),
                    status: "confirmed"
                }
            ];
            
            this.renderDashboard();
            this.renderOrders();
            
        } catch (error) {
            console.error('Error loading orders:', error);
        }
    }

    renderDashboard() {
        const todayOrders = this.orders;

        const totalRevenue = todayOrders.reduce((sum, order) => {
            const amount = parseFloat(order.total) || 0;
            return sum + amount;
        }, 0);

        document.getElementById('todayOrders').textContent = todayOrders.length;
        document.getElementById('todayRevenue').textContent = totalRevenue.toFixed(2) + ' ر.س';
        document.getElementById('todayReservations').textContent = '0';
    }

    renderOrders() {
        const ordersList = document.getElementById('ordersList');
        
        if (this.orders.length === 0) {
            ordersList.innerHTML = '<p>لا توجد طلبات حالياً</p>';
            return;
        }

        ordersList.innerHTML = this.orders.map(order => `
            <div class="order-card">
                <div class="order-header">
                    <h3>طلب #${order.id}</h3>
                    <span class="order-status status-${order.status || 'pending'}">
                        ${this.getStatusText(order.status || 'pending')}
                    </span>
                </div>
                <p><strong>العميل:</strong> ${order.name}</p>
                <p><strong>الهاتف:</strong> ${order.phone}</p>
                <p><strong>العنوان:</strong> ${order.address}</p>
                <p><strong>الطلبات:</strong> ${order.items}</p>
                <p><strong>المجموع:</strong> ${order.total}</p>
                <p><strong>الوقت:</strong> ${order.timestamp}</p>
                <div class="order-actions">
                    <button class="btn small success" onclick="adminPanel.updateOrder(${order.id}, 'confirmed')">
                        ✓ تأكيد
                    </button>
                    <button class="btn small warning" onclick="adminPanel.updateOrder(${order.id}, 'preparing')">
                        🍳 تحضير
                    </button>
                    <button class="btn small danger" onclick="adminPanel.updateOrder(${order.id}, 'cancelled')">
                        ✗ إلغاء
                    </button>
                    <button class="btn small primary" onclick="adminPanel.callCustomer('${order.phone}')">
                        📞 اتصل
                    </button>
                </div>
            </div>
        `).join('');
    }

    getStatusText(status) {
        const statusMap = {
            'pending': 'قيد الانتظار',
            'confirmed': 'تم التأكيد',
            'preparing': 'قيد التحضير',
            'ready': 'جاهز للتوصيل',
            'delivered': 'تم التوصيل',
            'cancelled': 'ملغي'
        };
        return statusMap[status] || status;
    }

    updateOrder(orderId, status) {
        const order = this.orders.find(o => o.id === orderId);
        if (order) {
            order.status = status;
            this.renderOrders();
            alert('تم تحديث حالة الطلب: ' + this.getStatusText(status));
        }
    }

    callCustomer(phone) {
        if (phone && phone !== 'غير محدد') {
            window.open('tel:' + phone, '_blank');
        } else {
            alert('رقم الهاتف غير متوفر');
        }
    }

    setupEventListeners() {
        // تحديث تلقائي كل دقيقة
        setInterval(() => {
            this.loadOrders();
        }, 60000);
    }
}

// تهيئة لوحة التحكم
const adminPanel = new AdminPanel();

// دالة التحديث العامة
function loadOrders() {
    adminPanel.loadOrders();
    alert('تم تحديث الطلبات');
}
