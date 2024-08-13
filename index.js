// index.js
const express = require('express');
const app = express();
const PORT = 8080;
const productsRouter = require('./routes/productsRouter');
const cartsRouter = require('./routes/cartsRouter');

app.use(express.json()); 



app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);