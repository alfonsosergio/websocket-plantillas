import fs from "fs";

export class ProductManager {
  constructor() {
    this.path = "./productoslista/products.json";
  }

  async getProducts(limit) {
    try {
      if (fs.existsSync(this.path)) {
        const infoProducts = await fs.promises.readFile(this.path, "utf-8");
        if (limit === "max") {
          const productJS = JSON.parse(infoProducts);
          return productJS;
        } else {
          return JSON.parse(infoProducts).slice(0, limit);
        }
      } else {
        return [];
      }
    } catch (error) {
      console.log(error);
    }
  }

  async addProduct(obj) {
    const { title, description, price, status, code, stock, category } = obj;
    const productData =
      title && description && price && status && code && stock && category;
    try {
      if (!productData) {
        return console.log({ error: "Error, product incomplete" });
      } else {
        const isCode = await this.#evaluarCode(code);
        if (isCode) {
          console.log("That code already exist, try again");
        } else {
          const product = { id: await this.#generarId(), ...obj };
          const productsArchivo = await this.getProducts();
          productsArchivo.push(product);
          await fs.promises.writeFile(
            this.path,
            JSON.stringify(productsArchivo)
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getProductById(idProduct) {
    const products = await this.getProducts();
    const product = products.find((e) => e.id === parseInt(idProduct));
    return product;
  }

  async updateProduct(idProduct, obj) {
    try {
      const productosArchivo = await this.getProducts();
      const indexProduct = productosArchivo.findIndex(
        (u) => u.id === idProduct
      );
      if (indexProduct === -1) return;
      const productActualizado = { ...productosArchivo[indexProduct], ...obj };
      productosArchivo.splice(indexProduct, 1, productActualizado);
      await fs.promises.writeFile(this.path, JSON.stringify(productosArchivo));
      return productosArchivo;
    } catch (error) {
      return error;
    }
  }

  async deleteProduct(idProduct) {
    try {
      const productosArchivo = await this.getProducts();
      const indexProduct = productosArchivo.findIndex(
        (u) => u.id === idProduct
      );
      if (indexProduct === -1) return;
      productosArchivo.splice(indexProduct, 1);
      await fs.promises.writeFile(this.path, JSON.stringify(productosArchivo));
      return productosArchivo;
    } catch (error) {
      return error;
    }
  }

  async #generarId() {
    const products = await this.getProducts();
    let id = products.length === 0 ? 1 : products[products.length - 1].id + 1;
    return id;
  }

  async #evaluarCode(code) {
    const products = await this.getProducts();
    return products.find((product) => product.code === code);
  }
}

//Clase de Carrito
export class CartsManager {
  constructor() {
    this.path = "./productoslista/carts.json";
  }

  async getCarts(limit) {
    try {
      if (fs.existsSync(this.path)) {
        const infoCarts = await fs.promises.readFile(this.path, "utf-8");
        if (limit === "max") {
          const cartsJS = JSON.parse(infoCarts);
          return cartsJS;
        } else {
          return JSON.parse(infoCarts).slice(0, limit);
        }
      } else {
        return [];
      }
    } catch (error) {
      console.log(error);
    }
  }

  async addCarts(obj) {
    try {
      const carts = { id: await this.#generarId(), ...obj };
      const cartsArchivo = await this.getCarts();
      cartsArchivo.push(carts);
      await fs.promises.writeFile(this.path, JSON.stringify(cartsArchivo));
    } catch (error) {
      console.log(error);
    }
  }

  async getCartById(idCart) {
    const carts = await this.getCarts();
    const cart = carts.find((e) => e.id === parseInt(idCart));
    if (cart) {
      const productCart = cart.products;
      return productCart;
    }
  }

  async addCartsProduct(cid, pid, obj) {
    const carts = await this.getCarts()
    const cartIndex = carts[cid-1].products.find((p) => p.id === parseInt(pid))
    console.log(cartIndex);
    //console.log(obj.quantity);
    
    if (cartIndex) {
      const indexProduct = carts[cid-1].products.indexOf( carts[cid-1].products.find((p) => p.id === parseInt(pid)));
      carts[cid-1].products[indexProduct].quantity += obj.quantity;
      await fs.promises.writeFile(this.path, JSON.stringify(carts));
      return carts[cid-1].products[indexProduct];
    } else {
      const id = parseInt(pid);
      const product = {
        id: id,
        quantity: obj.quantity,
      };
      carts[cid-1].products.push(product);
      await fs.promises.writeFile(this.path, JSON.stringify(carts));
      return product;
    }
  }

  async #generarId() {
    const carts = await this.getCarts();
    let id = carts.length === 0 ? 1 : carts[carts.length - 1].id + 1;
    return id;
  }
}
