const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');

const apiProductos = require("./src/routes/apiProducts");
const routerChat = require("./src/routes/chat");
const Contenerdor = require("./src/Contenedor");

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static(__dirname + '/public'));

app.set('views', path.join(__dirname,'./src/views'));
app.set('view engine', 'hbs');
app.engine('hbs', exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: 'hbs'
}));

app.get('/', async (req, res) => {
    const contenedor = new Contenerdor('./db/products.json')
    const products = await contenedor.getAll();
    res.render('new-product', { products });
});

app.use('/api/productos', apiProductos);
app.use('/chat', routerChat);

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Internal server error!');
});

const PORT = process.env.PORT || 8080;
const server = httpServer.listen(PORT, ()=> {
    console.log(`Running on port ${PORT}`);
});
server.on('error', error => {
    console.error(`Error to execute app ${error}`);
});

io.on('connection', (socket)=>{
    socket.emit('from-server-request-socket-handler');

    socket.on('from-client-chat', async () => {
        const contenedor = new Contenerdor('./db/chat.json');
        const messages = await contenedor.getAll();
        socket.emit('from-server-messages', messages);
    })

    socket.on('from-client-message', async (mensaje) => {
        const contenedor = new Contenerdor('./db/chat.json');
        await contenedor.create({ ...mensaje, date: new Date() });
        const messages = await contenedor.getAll();
        io.sockets.emit('from-server-messages', messages );
    });

    socket.on('from-client-products', () => {
        console.log(`Client is on products`);
    })

    socket.on('from-client-new-product', async (product) => {
        const contenedor = new Contenerdor('./db/products.json');
        const { title, price, thumbnail } = product;
        const priceFloat = parseFloat(price);
        const newProduct= await contenedor.create({title, price:priceFloat, thumbnail});
        io.sockets.emit('from-sever-new-product', newProduct);
    });

});


