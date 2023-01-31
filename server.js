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

//configuracion handlebars
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

// routes
app.use("/", viewsRouter);


// Rutas

// ruta
app.get("/", (req, res) => {
  res.render("socket");
});

// Ruta GET de productros
app.get("/api/productos", async (req, res) => {
  const { limit } = req.query;
  const products = await productsManager.getProducts(limit);
  res.json(products);
});

app.get("/api/productos/:pid", async (req, res) => {
  const { pid } = req.params;
  const product = await productsManager.getProductById(pid);
  product
    ? res.send(product)
    : res.send({ error: "Producto no existe en el inventario" });
});

// Ruta POST de productros
app.post("/api/producto", async (req, res) => {
  const obj = req.body;
  const productCreate = await productsManager.addProduct(obj);
  res.json({ message: "Producto creado", productCreate });
});

// Ruta PUT de producto
app.put("/api/producto/:pid", async (req, res) => {
  const { pid } = req.params;
  const obj = req.body;
  const product = await productsManager.updateProduct(parseInt(pid), obj);
  product
    ? res.json({ message: "Usuario actualizado con exito" })
    : res.send({ error: "Producto no existe en el inventario" });
});

// Ruta DELETE de producto
app.delete("/api/producto/:pid", async (req, res) => {
  const { pid } = req.params;
  const product = await productsManager.deleteProduct(parseInt(pid));
  product
    ? res.json({ message: "Usuario eliminado con exito" })
    : res.send({ error: "Producto no existe en el inventario" });
});

// Ruta de carrito

// Ruta GET de carts
app.get("/api/carts/:cid", async (req, res) => {
  const { cid } = req.params;
  const cart = await cartsManager.getCartById(cid);
  cart ? res.send(cart) : res.send({ error: "Carrito no existe" });
});

// Ruta POST de carts
app.post("/api/carts", async (req, res) => {
  const obj = req.body;
  const cartsCreate = await cartsManager.addCarts(obj);
  res.json({ message: "Carrito creado", cartsCreate });
});

app.post("/api/carts/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const obj = req.body;
  const cartsCreate = await cartsManager.addCartsProduct(cid, pid, obj);
  res.json({ message: "Porducto agregado a carrito", cartsCreate });
});
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

    socket.on('mensaje1',(obj)=>{
        console.log(obj)
      })
})