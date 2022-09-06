const express = require('express');
const routerProducts = express.Router();
const Contenerdor = require("../Contenedor");

const contenedor = new Contenerdor('./db/products.json')

routerProducts.get('/', async (req, res) => {
    const products = await contenedor.getAll();
    res.render('products', { products })
})

routerProducts.post('/', async (req, res) => {
    const { title, price, thumbnail } = req.body;
    const priceFloat = parseFloat(price);
    await contenedor.create({title, price:priceFloat, thumbnail});
    res.redirect('/')
});


module.exports = routerProducts
