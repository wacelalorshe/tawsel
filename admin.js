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

    // تحميل الطلبات من جوجل شيتس
    async loadOrders() {
        try {
            // رابط لجوجل شيتس (ستحتاج لإنشائه)
            const sheetURL = "https://docs.google.com/spreadsheets/d/1YOUR_SHEET_ID/gviz/tq?tqx=out:json";
            
            const response = await fetch(sheetURL);
            const text = await response.text();
            const json = JSON.parse(text.substr(47).slice(0, -2));
            
            this.orders = json.table.rows.map((row, index) => ({
                id: index + 1,
                name: row.c[0]?.v || 'غير محدد',
                phone: row.c[1]?.v || 'غير محدد',
                address: row.c[2]?.v || 'لا يوجد',
                items: row.c[3]?.v || 'غير محدد',
                total: row.c[4]?.v || '0',
                timestamp: new Date().toLocaleString('ar-SA')
            }));
            
            this.renderDashboard();
            this.renderOrders();
            
        } catch (error) {
            console.error('Error loading orders:', error);
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
        }
    }

    renderDashboard() {
        const todayOrders = this.orders.filter(order => {
            // افترض أن جميع الطلبات اليومية
            return true;
        });

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
                        <i class="fas fa-check"></i> تأكيد
                    </button>
                    <button class="btn small warning" onclick="adminPanel.updateOrder(${order.id}, 'preparing')">
                        <i class="fas fa-utensils"></i> تحضير
                    </button>
                    <button class="btn small danger" onclick="adminPanel.updateOrder(${order.id}, 'cancelled')">
                        <i class="fas fa-times"></i> إلغاء
                    </button>
                    <button class="btn small" onclick="adminPanel.callCustomer('${order.phone}')">
                        <i class="fas fa-phone"></i> اتصل
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
            
            // هنا يمكنك إضافة كود لحفظ التغييرات
            alert(`تم تحديث الطلب #${orderId} إلى: ${this.getStatusText(status)}`);
        }
    }

    callCustomer(phone) {
        if (phone && phone !== 'غير محدد') {
            window.open(`tel:${phone}`, '_blank');
        } else {
            alert('رقم الهاتف غير متوفر');
        }
    }

    setupEventListeners() {
        // تحديث تلقائي كل دقيقة
        setInterval(() => {
            this.loadOrders();
        }, 60000);
        
        // التنقل بين الأقسام
        document.querySelectorAll('.sidebar-menu a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // إزالة النشاط من جميع الروابط
                document.querySelectorAll('.sidebar-menu a').forEach(l => {
                    l.classList.remove('active');
                });
                
                // إضافة النشاط للرابط المختار
                link.classList.add('active');
            });
        });
    }
}

// تهيئة لوحة التحكم
const adminPanel = new AdminPanel();

// دالة التحديث العامة
function loadOrders() {
    adminPanel.loadOrders();
    alert('تم تحديث الطلبات');
}
