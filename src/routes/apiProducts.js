const express = require('express');
const apiProductos = express.Router();

const Contenerdor = require("../Contenedor");
const contenedor = new Contenerdor('./db/products.json')

apiProductos.get('/', async (req, resp)=> {
    resp.send(await contenedor.getAll());
});

apiProductos.get('/:id', async (req, resp)=> {
    const user = await contenedor.getById(req.params.id);
    return (user)
        ? resp.status(200).json(user)
        : resp.status(404).json({error: 'product not found'});
});

apiProductos.delete('/:id', async(req, resp) => {
    const deletedId = await contenedor.deleteById(req.params.id);
    return (deletedId !== -1)
        ? resp.status(200).json({ deletedId })
        : resp.status(404).json({ error: 'product not found' });
});

apiProductos.post('/', async( req, resp) => {
    const { title, price, thumbnail } = req.body;
    const priceFloat = parseFloat(price);
    const newProduct = await contenedor.create({title, price:priceFloat, thumbnail});
    return resp.status(201).json(newProduct);
});

apiProductos.put('/:id', async( req, resp) => {
    const { title, price, thumbnail } = req.body;
    const priceFloat = parseFloat(price);
    const updatedProduct = await (contenedor.update({
        id: parseInt(req.params.id),
        title,
        price:priceFloat,
        thumbnail
    }));
    return (updatedProduct !== -1)
        ?  resp.status(200).json(updatedProduct)
        : resp.status(404).json({ error: 'product not found' });
});

module.exports = apiProductos
