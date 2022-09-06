const express = require('express');
const routerChat = express.Router();


routerChat.get('/', async (req, res) => {
    res.render('chat' )
})

module.exports = routerChat;
