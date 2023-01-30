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

export default router