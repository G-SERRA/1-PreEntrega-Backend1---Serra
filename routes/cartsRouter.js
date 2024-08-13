const express = require('express');
const fs = require('fs');
const router = express.Router();

const cartsFilePath = './data/carrito.json';
const productsFilePath = './data/productos.json';

const getCarts = () => {
    try {
        const data = fs.readFileSync(cartsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};


const saveCarts = (carts) => {
    fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2));
};


router.post('/', (req, res) => {
    const carts = getCarts();
    const newCart = {
        id: (carts.length + 1).toString(),
        products: []
    };

    carts.push(newCart);
    saveCarts(carts);
    res.status(201).json(newCart);
});


router.get('/:cid', (req, res) => {
    const carts = getCarts();
    const cart = carts.find(c => c.id === req.params.cid);

    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

    res.json(cart.products);
});


router.post('/:cid/product/:pid', (req, res) => {
    const carts = getCarts();
    const cart = carts.find(c => c.id === req.params.cid);

    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

    const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
    const product = products.find(p => p.id === req.params.pid);

    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

    const existingProduct = cart.products.find(p => p.product === req.params.pid);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.products.push({ product: req.params.pid, quantity: 1 });
    }

    saveCarts(carts);
    res.status(201).json(cart);
});

module.exports = router;
