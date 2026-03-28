const express = require("express");

// Eğer accounts-router.js aynı klasörde veya alt klasördeyse 
// yolu ona göre yazmalısın. Genelde şu şekildedir:
const accountsRouter = require("./accounts/accounts-router"); 

const server = express();

server.use(express.json());

// Burası kritik, testler buraya istek atıyor
server.use("/api/accounts", accountsRouter);

module.exports = server;