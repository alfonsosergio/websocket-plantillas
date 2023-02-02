const socket = io()
const formulario = document.getElementById('formulario')
const formDelete = document.getElementById('formDelete')
const idProduct = document.getElementById('idProduct')
const inputDescription = document.getElementById('description')
const inputPrice = document.getElementById('price')
const inputStatus = document.getElementById('status')
const inputCode = document.getElementById('code')
const inputStock = document.getElementById('stock')
const inputCategory = document.getElementById('category')
const inputThumbnails = document.getElementById('thumbnails')
const inputTitle = document.getElementById('title')



formulario.onsubmit = (e) => {
    e.preventDefault()
    const description = inputDescription.value
    const price = inputPrice.value
    const code = inputCode.value
    const stock = inputStock.value
    const category = inputCategory.value
    const thumbnails = inputThumbnails.value
    const title = inputTitle.value
    const status = true
    socket.emit('mensaje1', { title, description, price, status, code, stock, category, thumbnails })
}




formDelete.onsubmit = (e) => {
    e.preventDefault()
    const productIdDelete = idProduct.value
    socket.emit('prodDelete', productIdDelete)
}

socket.on('respuesta1', (products) => {
    console.log(products);
    let info = ''
    products.forEach((m) => {
      info += `<div class="card" style="width: 18rem;">
                    <div class="card-body">
                        <h2 class="card-title">Modelo de auto ${m.title}</h2>
                        <h5 class="card-title">Description de auto ${m.description}</h5>
                        <a href="#" class="btn btn-primary">${m.category}</a>
                    </div>
                </div>
                `
    })
    
    parrafo.innerHTML = info
  })
