const socket = io()
const formulario = document.getElementById('formulario')
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
    socket.emit('mensaje1', { description, price, code, stock, category, thumbnails, title })
}