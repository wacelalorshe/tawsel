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
try {
    if (typeof firebase !== 'undefined') {
        // تهيئة Firebase
        const app = firebase.initializeApp(firebaseConfig);
        console.log('✅ تم تهيئة Firebase بنجاح');
        
        // كائن قاعدة البيانات
        window.db = firebase.firestore();
        console.log('🗄️ قاعدة البيانات جاهزة');
        
        // تمكين التخزين المحلي
        window.db.enablePersistence()
            .then(() => console.log('💾 تم تمكين التخزين المحلي'))
            .catch(err => console.log('❌ خطأ في التخزين المحلي:', err));
    } else {
        console.error('❌ مكتبة Firebase غير محملة');
    }
} catch (error) {
    console.error('❌ خطأ في التهيئة:', error);
}
