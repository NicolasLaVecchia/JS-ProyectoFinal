// Comienza la seccion del carrito

// Variables, se suben los productos que va a vender el emprendimiento

const baseDeDatosProductos = [
    {
        id: 1,
        nombre: 'Señalador MrDarcy',
        precio: 150,
        imagen: '../img/mrdarcy.jpg'
    },
    {
        id: 2,
        nombre: 'Señalador Elizabeth',
        precio: 150,
        imagen: '../img/elizabeth.jpg'
    },
    {
        id: 3,
        nombre: 'World Cup-20cm',
        precio: 2750,
        imagen: '../img/copaDelMundo.jpg'
    },
    {
        id: 4,
        nombre: 'Libertadores-20cm',
        precio: 2100,
        imagen: '../img/libertadores.jpg'
    },
    {
        id: 5,
        nombre: 'Lib. Boca-20cm',
        precio: 2500,
        imagen: '../img/libertadoresBoca.jpg'
    },
    {
        id: 6,
        nombre: 'BustoDeadPool-15cm',
        precio: 3900,
        imagen: '../img/bustoDeadpool.jpg'
    },
    {
        id: 7,
        nombre: 'FiguraExpo #1 -10cm',
        precio: 420,
        imagen: '../img/figura1.jpg'
    },
    {
        id: 8,
        nombre: 'FiguraExpo #2 -10cm',
        precio: 410,
        imagen: '../img/figura2.jpg'
    },
    {
        id: 9,
        nombre: 'Grinder Minecraft',
        precio: 2500,
        imagen: '../img/grinderMinecraft.jpg'
    },
    {
        id: 10,
        nombre: 'Lapicero David - 10cm',
        precio: 1600,
        imagen: '../img/lapiceroDavid.jpg'
    },
    {
        id: 11,
        nombre: 'Maceta Groot - 15cm',
        precio: 2800,
        imagen: '../img/macetaGroot.jpg'
    },
    {
        id: 12,
        nombre: 'Maceta Sonriente - 10cm',
        precio: 2700,
        imagen: '../img/macetaCarita.jpg'
    },

];

let carrito = [];
const divisa = '$';
const flowItems = document.querySelector('#items');
const flowCarrito = document.querySelector('#carrito');
const flowTotal = document.querySelector('#total');
const flowBotonVaciar = document.querySelector('#boton-vaciar');
//const flowBotonComprar = document.querySelector('#boton-comprar');
const miLocalStorage = window.localStorage;

// Funciones

// Se dibujan los productos a partir de lo que esta cargado en la base de datos

function renderizarProductos() {
    baseDeDatosProductos.forEach((info) => {
        // Estructura
        const card = document.createElement('div');
        card.classList.add('card', 'col-sm-3');
        // Body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        // Titulo
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = info.nombre;
        // Imagen
        const cardImg = document.createElement('img');
        cardImg.classList.add('img-fluid');
        cardImg.setAttribute('src', info.imagen);
        // Precio
        const cardPrecio = document.createElement('p');
        cardPrecio.classList.add('card-text');
        cardPrecio.textContent = `${divisa}${info.precio}`;
        // Boton 
        const cardBoton = document.createElement('button');
        cardBoton.classList.add('btn', 'btn-secondary');
        cardBoton.textContent = 'Agregar';
        cardBoton.setAttribute('marcador', info.id);
        cardBoton.addEventListener('click', agregarProductoAlCarrito);
        // Se agregan con append
        cardBody.appendChild(cardImg);
        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardPrecio);
        cardBody.appendChild(cardBoton);
        card.appendChild(cardBody);
        flowItems.appendChild(card);
    });
}

// Evento para agregar un producto al carrito de compra

function agregarProductoAlCarrito(producto) {
    // Agregamos el push al carrito
    carrito.push(producto.target.getAttribute('marcador'))
    // Actualizamos el carrito 
    renderizarCarrito();
    // Actualizamos el LocalStorage
    guardarCarritoEnLocalStorage();
}

// Se dibujan los productos que se seleccionan en el carrito 

function renderizarCarrito() {
    // Se vacia todo el html
    flowCarrito.textContent = '';
    // Se sacan los posibles duplicados
    const carritoSinDuplicados = [...new Set(carrito)];
    // Se generan las entradas a partir del carrito
    carritoSinDuplicados.forEach((item) => {
        // Se obtiene el item que necesitamos de la variable base de datos
        const miItem = baseDeDatosProductos.filter((itemBaseDatosProductos) => {
            // Se fija si coinciden los ID
            return itemBaseDatosProductos.id === parseInt(item);
        });
        // Cuenta el número de veces que se repite el producto
        const numeroUnidadesItem = carrito.reduce((total, itemId) => {
            // Si las ID coinciden se incrementa el contador, en caso contrario no se mantiene
            return itemId === item ? total += 1 : total;
        }, 0);
        // Se crea la lista de producto seleccionado en el carrito
        const productoCargado = document.createElement('li');
        productoCargado.classList.add('list-group-item', 'text-right', 'mx-2');
        productoCargado.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} - ${divisa}${miItem[0].precio}`;
        // Boton de borrar Item
        const botonQuitar = document.createElement('button');
        botonQuitar.classList.add('btn', 'btn-danger', 'mx-5');
        botonQuitar.textContent = 'X';
        botonQuitar.style.marginLeft = '1rem';
        botonQuitar.dataset.item = item;
        botonQuitar.addEventListener('click', borrarItemCarrito);
        // Se mezcla
        productoCargado.appendChild(botonQuitar);
        flowCarrito.appendChild(productoCargado);
    });
    // Renderizamos el precio total en el HTML
    flowTotal.textContent = calcularTotal();
}

// Evento para borrar un elemento del carrito

function borrarItemCarrito(producto) {
    // Se obtiene el producto ID que hay en el boton pulsado
    const id = producto.target.dataset.item;
    // Borramos todos los productos
    carrito = carrito.filter((carritoId) => {
        return carritoId !== id;
    });
    // volvemos a renderizar
    renderizarCarrito();
    // Actualizamos el LocalStorage
    guardarCarritoEnLocalStorage();

}

// En esta funcion se calcula el precio total, contando los productos repetidos

function calcularTotal() {
    // Aca recorre el array del carrito
    return carrito.reduce((total, item) => {
        // Se pone el precio de cada elemento
        const miItem = baseDeDatosProductos.filter((itemBaseDatosProductos) => {
            return itemBaseDatosProductos.id === parseInt(item);
        });
        // Se suman al total
        return total + miItem[0].precio;
    }, 0).toFixed(2);
}

// Vacia el carrito y lo vuelve a renderiza
function vaciarCarrito() {
    // Se limpian los productos guardados
    carrito = [];
    // Aca se renderiza de nuevo
    renderizarCarrito();
    // Borra LocalStorage
    localStorage.clear();
}

// Se guarda el carrito en el LocalStorage
function guardarCarritoEnLocalStorage() {
    miLocalStorage.setItem('carrito', JSON.stringify(carrito));
}

function cargarCarritoDeLocalStorage() {
    // Ver si existe un carrito ya guardado en el localStorage
    if (miLocalStorage.getItem('carrito') !== null) {
        // Carga la información
        carrito = JSON.parse(miLocalStorage.getItem('carrito'));
    }
}

// Eventos
flowBotonVaciar.addEventListener('click', vaciarCarrito);

// Inicio
cargarCarritoDeLocalStorage();
renderizarProductos();
renderizarCarrito();

// Fin la seccion del carrito