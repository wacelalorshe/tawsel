// 🔥 تكوين Firebase - الإصدار المتوافق مع متجرك
const firebaseConfig = {
  apiKey: "AIzaSyBnCeIjj1PHBrDRS-zjw8qLEGc-w4SS1XE",
  authDomain: "tawsel735.firebaseapp.com",
  projectId: "tawsel735",
  storageBucket: "tawsel735.firebasestorage.app",
  messagingSenderId: "723079637443",
  appId: "1:723079637443:web:170f06eec77d25e4647576",
  measurementId: "G-R84FEYXMDJ"
};

// تهيئة Firebase
firebase.initializeApp(firebaseConfig);

// قاعدة البيانات Firestore
const db = firebase.firestore();

console.log('✅ تم تهيئة Firebase بنجاح!');
