const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()
let carrito = {}

// Eventos
// El evento DOMContentLoaded es disparado cuando el documento HTML ha sido completamente cargado y parseado
document.addEventListener('DOMContentLoaded', e => {
    fetchData()
    if (localStorage.getItem('carrito') !== null) {
        carrito = JSON.parse(localStorage.getItem('carrito'))
        pintarCarrito()
    }
});
cards.addEventListener('click', e => { addCarrito(e) });
items.addEventListener('click', e => { btnAumentarDisminuir(e) })

// Traer productos
const fetchData = async () => {
    const res = await fetch('../js/api.json');
    const data = await res.json()
    // console.log(data)
    pintarCards(data)
}

// Pintar productos
const pintarCards = data => {
    data.forEach(item => {
        templateCard.querySelector('h5').textContent = item.title
        templateCard.querySelector('p').textContent = item.precio
        templateCard.querySelector('img').setAttribute("src", item.thumbnail)
        templateCard.querySelector('button').dataset.id = item.id
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}

// Agregar al carrito
const addCarrito = e => {
    if (e.target.classList.contains('btn-dark')) {
        // console.log(e.target.dataset.id)
        // console.log(e.target.parentElement)
        setCarrito(e.target.parentElement)
        // Se agrega el toastify
        Toastify({
            text: "Producto agregado al carrito",
            duration: 800,
            style: {
                background: "linear-gradient(to right, #FFB2A4, #CD8A96)",
                color: "white",
            }
        }).showToast();
    }
    e.stopPropagation()
}

const setCarrito = item => {
    // console.log(item)
    const producto = {
        title: item.querySelector('h5').textContent,
        precio: item.querySelector('p').textContent,
        id: item.querySelector('button').dataset.id,
        cantidad: 1
    }
    // console.log(producto)
    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1
    }

    carrito[producto.id] = { ...producto }

    pintarCarrito()
}

const pintarCarrito = () => {
    items.innerHTML = ''

    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('span').textContent = producto.precio * producto.cantidad

        //botones
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id

        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)

    pintarFooter()

    localStorage.setItem('carrito', JSON.stringify(carrito))
}

function vaciarCarrito() {

    Swal.fire({
        title: '¿Seguro que quiere vaciar el carrito?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Si',
        denyButtonText: 'No',
        customClass: {
            actions: 'my-actions',
            cancelButton: 'order-1 right-gap',
            confirmButton: 'order-2',
            denyButton: 'order-3',
        },
        allowOutsideClick: () => {
            const popup = Swal.getPopup()
            popup.classList.remove('swal2-show')
            setTimeout(() => {
                popup.classList.add('animate__animated', 'animate__headShake')
            })
            setTimeout(() => {
                popup.classList.remove('animate__animated', 'animate__headShake')
            }, 500)
            return false
        }
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire('Carrito vaciado', '', 'success')
            // Se limpian los productos guardados
            carrito = {};
            // Aca se renderiza de nuevo
            pintarCarrito()
            // Borra LocalStorage
            localStorage.clear();
        } else if (result.isDenied) {
            Swal.fire('Carrito sin modificaciones', '', 'error')
            // Aca se renderiza de nuevo
            pintarCarrito()
        }
    })
}

const pintarFooter = () => {
    footer.innerHTML = ''

    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
        `
        return
    }

    // sumar cantidad y sumar totales
    const nCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0)
    const nPrecio = Object.values(carrito).reduce((acc, { cantidad, precio }) => acc + cantidad * precio, 0)
    // console.log(nPrecio)

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)

    footer.appendChild(fragment)

    const boton = document.querySelector('#vaciar-carrito')
    boton.addEventListener('click', vaciarCarrito);

    const botonComprar = document.querySelector('#comprar-carrito')
    botonComprar.addEventListener('click', () => {

        Swal.fire({
            title: '¿Tienes una cuenta creada?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Si',
            denyButtonText: 'No',
            customClass: {
                actions: 'my-actions',
                cancelButton: 'order-1 right-gap',
                confirmButton: 'order-2',
                denyButton: 'order-3',
            },
            allowOutsideClick: () => {
                const popup = Swal.getPopup()
                popup.classList.remove('swal2-show')
                setTimeout(() => {
                    popup.classList.add('animate__animated', 'animate__headShake')
                })
                setTimeout(() => {
                    popup.classList.remove('animate__animated', 'animate__headShake')
                }, 500)
                return false
            }
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    icon: 'info',
                    title: 'Perfecto, ingresa tu cuenta',
                    html: `<input type="text" id="login" class="swal2-input" placeholder="Correo Electronico">
                    <input type="password" id="password" class="swal2-input" placeholder="Contraseña">`,
                    confirmButtonText: 'Sign in',
                    focusConfirm: false,
                    customClass: "Login",
                    preConfirm: () => {
                        const login = Swal.getPopup().querySelector('#login').value
                        const password = Swal.getPopup().querySelector('#password').value
                        if (!login || !password) {
                            Swal.showValidationMessage(`Please enter login and password`)
                        }
                        return { login: login, password: password }
                    },
                    allowOutsideClick: () => {
                        const popup = Swal.getPopup()
                        popup.classList.remove('swal2-show')
                        setTimeout(() => {
                            popup.classList.add('animate__animated', 'animate__headShake')
                        })
                        setTimeout(() => {
                            popup.classList.remove('animate__animated', 'animate__headShake')
                        }, 500)
                        return false
                    }
                }).then((result) => {
                    Swal.fire(`
                    Login: ${result.value.login}
                    Password: ${result.value.password}
                    `.trim())
                })
            } else if (result.isDenied) {
                Swal.fire({
                    title: 'Create Una',
                    icon: 'warning',
                    confirmButtonText: '<a class="sweetLogin" style="color: white" href="./login.html"> Alla voy! </a>',
                    allowOutsideClick: () => {
                        const popup = Swal.getPopup()
                        popup.classList.remove('swal2-show')
                        setTimeout(() => {
                            popup.classList.add('animate__animated', 'animate__headShake')
                        })
                        setTimeout(() => {
                            popup.classList.remove('animate__animated', 'animate__headShake')
                        }, 500)
                        return false
                    }
                })
            }
        })
    
    })

}

const btnAumentarDisminuir = e => {
    // console.log(e.target.classList.contains('btn-info'))
    if (e.target.classList.contains('btn-info')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = { ...producto }
        Toastify({
            text: "Sumaste una unidad de " + producto.title,
            duration: 800,
            style: {
                background: "#46A2FD",
                color: "white",
            }
        }).showToast();
        pintarCarrito()
    }

    if (e.target.classList.contains('btn-danger')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id]
            Toastify({
                text: "Eliminaste " + producto.title + " del carrito",
                duration: 800,
                style: {
                    background: "black",
                    color: "white",
                }
            }).showToast();
        } else {
            carrito[e.target.dataset.id] = { ...producto }
            Toastify({
                text: "Restaste una unidad de " + producto.title,
                duration: 800,
                style: {
                    background: "#dc3545",
                    color: "white",
                }
            }).showToast();
        }
        pintarCarrito()
    }

    e.stopPropagation()
}