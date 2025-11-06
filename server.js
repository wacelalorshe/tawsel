const express = require('express');
const app = express();
const PORT = 3000;

// middleware
app.use(express.json());
app.use(express.static('../frontend'));

// بيانات مؤقتة
let products = [
    { id: 1, name: "منتج 1", price: 100, description: "وصف المنتج 1" },
    { id: 2, name: "منتج 2", price: 200, description: "وصف المنتج 2" }
];

// routes
app.get('/api/products', (req, res) => {
    res.json(products);
});

app.post('/api/products', (req, res) => {
    const newProduct = { id: products.length + 1, ...req.body };
    products.push(newProduct);
    res.json(newProduct);
});

app.listen(PORT, () => {
    console.log(`الخادم يعمل على http://localhost:${PORT}`);
});
