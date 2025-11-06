// تكوين Firebase
console.log('🚀 تحميل Firebase Config...');

const firebaseConfig = {
    apiKey: "AIzaSyBnCeIjj1PHBrDRS-zjw8qLEGc-w4SS1XE",
    authDomain: "tawsel735.firebaseapp.com",
    projectId: "tawsel735",
    storageBucket: "tawsel735.firebasestorage.app",
    messagingSenderId: "723079637443",
    appId: "1:723079637443:web:170f06eec77d25e4647576",
    measurementId: "G-R84FEYXMDJ"
};

// التحقق و التهيئة
if (typeof firebase !== 'undefined') {
    try {
        firebase.initializeApp(firebaseConfig);
        console.log('✅ تم تهيئة Firebase بنجاح');
    } catch (error) {
        console.error('❌ خطأ في التهيئة:', error);
    }
} else {
    console.error('❌ مكتبة Firebase غير محملة');
}

// كائن قاعدة البيانات
const db = typeof firebase !== 'undefined' ? firebase.firestore() : null;
console.log('🗄️ قاعدة البيانات:', db ? 'جاهزة' : 'غير جاهزة');
