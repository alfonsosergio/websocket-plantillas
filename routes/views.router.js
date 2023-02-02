import { Router } from 'express'
const router = Router()
import { ProductManager } from '../app.js'
const productsManager = new ProductManager()

router.get('/', async (req, res) => {
  const products = await productsManager.getProducts()
  res.render('home', { products })
})

router.get('/realtimeproducts', async (req, res) => {
  const products = await productsManager.getProducts()
  res.render('realTimeProducts', { products })
})

// ruta
router.get("/", (req, res) => {
  res.render("socket");
});

// Ruta GET de productros
router.get("/api/productos", async (req, res) => {
  const { limit } = req.query;
  const products = await productsManager.getProducts(limit);
  res.json(products);
});

router.get("/api/productos/:pid", async (req, res) => {
  const { pid } = req.params;
  const product = await productsManager.getProductById(pid);
  product
    ? res.send(product)
    : res.send({ error: "Producto no existe en el inventario" });
});

// Ruta POST de productros
router.post("/api/producto", async (req, res) => {
  const obj = req.body;
  console.log(obj);
  const productCreate = await productsManager.addProduct(obj);
  res.json({ message: "Producto creado", productCreate });
});

// Ruta PUT de producto
router.put("/api/producto/:pid", async (req, res) => {
  const { pid } = req.params;
  const obj = req.body;
  const product = await productsManager.updateProduct(parseInt(pid), obj);
  product
    ? res.json({ message: "Usuario actualizado con exito" })
    : res.send({ error: "Producto no existe en el inventario" });
});

// Ruta DELETE de producto
router.delete("/api/producto/:pid", async (req, res) => {
  const { pid } = req.params;
  console.log(pid);
  const product = await productsManager.deleteProduct(parseInt(pid));
  product
    ? res.json({ message: "Usuario eliminado con exito" })
    : res.send({ error: "Producto no existe en el inventario" });
});

// Ruta de carrito

// Ruta GET de carts
router.get("/api/carts/:cid", async (req, res) => {
  const { cid } = req.params;
  const cart = await cartsManager.getCartById(cid);
  cart ? res.send(cart) : res.send({ error: "Carrito no existe" });
});

// Ruta POST de carts
router.post("/api/carts", async (req, res) => {
  const obj = req.body;
  const cartsCreate = await cartsManager.addCarts(obj);
  res.json({ message: "Carrito creado", cartsCreate });
});

router.post("/api/carts/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const obj = req.body;
  const cartsCreate = await cartsManager.addCartsProduct(cid, pid, obj);
  res.json({ message: "Porducto agregado a carrito", cartsCreate });
});

export default router