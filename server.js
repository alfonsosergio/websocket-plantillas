import express from "express";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import viewsRouter from "./routes/views.router.js";
import { ProductManager } from "./app.js";
import { CartsManager } from "./app.js";
const app = express();
const productsManager = new ProductManager();
const cartsManager = new CartsManager();

// dirname
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// archivos estaticos en public
app.use(express.static(__dirname + '/public'))

//configuracion handlebars
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

// routes
app.use("/", viewsRouter);


// Rutas

/*
//Llamado del puerto
app.listen(PORT, () => {
  console.log("Escuchando express");
});
*/


const httpServer = app.listen(8080, () => {
  console.log("Escuchando al puerto 8080");
});

// socket
const socketServer = new Server(httpServer);

socketServer.on('connection', (socket) => {

    console.log('usuario conectado ', socket.id)
    socket.on('disconnect', () => {
      console.log('usuario desconectado')
    })

    socket.on('mensaje1',async (obj)=>{
        await productsManager.addProduct(obj);
        const products = await productsManager.getProducts();
        socketServer.emit('respuesta1', products)
    })

    socket.on('prodDelete',async (productIdDelete)=>{
      //console.log(productIdDelete);
      await productsManager.deleteProduct(parseInt(productIdDelete));
      const products = await productsManager.getProducts();
      socketServer.emit('respuesta1', products)
  })
    
})