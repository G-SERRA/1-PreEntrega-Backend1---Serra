const express = require('express');
const fs = require('fs');
const router = express.Router();

const productsFilePath = './data/productos.json';


const getProducts = () => {
    try {
        const data = fs.readFileSync(productsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};


const saveProducts = (products) => {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
};


router.get('/', (req, res) => {
    const products = getProducts();
    const limit = req.query.limit ? parseInt(req.query.limit) : products.length;
    res.json(products.slice(0, limit));
});


router.get('/:pid', (req, res) => {
    const products = getProducts();
    const product = products.find(p => p.id === req.params.pid);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(product);
});


router.post('/', (req, res) => {
    const products = getProducts();
    const newProduct = {
        id: (products.length + 1).toString(),
        ...req.body,
        status: true,
    };

    products.push(newProduct);
    saveProducts(products);
    res.status(201).json(newProduct);
});


router.put('/:pid', (req, res) => {
    let products = getProducts();
    const index = products.findIndex(p => p.id === req.params.pid);

    if (index === -1) return res.status(404).json({ error: 'Producto no encontrado' });

    products[index] = { ...products[index], ...req.body, id: products[index].id }; 
    saveProducts(products);
    res.json(products[index]);
});


router.delete('/:pid', (req, res) => {
    let products = getProducts();
    const index = products.findIndex(p => p.id === req.params.pid);

    if (index === -1) return res.status(404).json({ error: 'Producto no encontrado' });

    products.splice(index, 1);
    saveProducts(products);
    res.status(204).send();
});

module.exports = router;
