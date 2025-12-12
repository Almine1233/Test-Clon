// ------------------------------
// LISTA DE PRODUCTOS (SIMILAR A AMAZON)
// ------------------------------

const productos = [
    {
        id: 1,
        titulo: "Smartphone X100 Pro 256GB",
        precio: 699,
        precioAntes: 899,
        categoria: "Electrónica",
        rating: 4.5,
        imagen: "https://via.placeholder.com/300x300?text=Smartphone"
    },
    {
        id: 2,
        titulo: "Portátil Gamer RTX 4060 16GB RAM",
        precio: 1299,
        precioAntes: 1499,
        categoria: "Computadoras",
        rating: 4.8,
        imagen: "https://via.placeholder.com/300x300?text=Laptop"
    },
    {
        id: 3,
        titulo: "Auriculares inalámbricos Pro Sound",
        precio: 149,
        precioAntes: 199,
        categoria: "Electrónica",
        rating: 4.3,
        imagen: "https://via.placeholder.com/300x300?text=Auriculares"
    },
    {
        id: 4,
        titulo: "Robot Aspirador UltraClean 5000",
        precio: 249,
        precioAntes: 349,
        categoria: "Hogar",
        rating: 4.6,
        imagen: "https://via.placeholder.com/300x300?text=Aspirador"
    },
    {
        id: 5,
        titulo: "Zapatillas Deportivas AirRunner",
        precio: 89,
        precioAntes: 120,
        categoria: "Ropa",
        rating: 4.2,
        imagen: "https://via.placeholder.com/300x300?text=Zapatillas"
    },
    {
        id: 6,
        titulo: "Consola Gamer Ultimate X",
        precio: 499,
        precioAntes: 599,
        categoria: "Juguetes",
        rating: 4.9,
        imagen: "https://via.placeholder.com/300x300?text=Consola"
    },
    {
        id: 7,
        titulo: "Pantalla 4K UltraHD 55” HDR",
        precio: 749,
        precioAntes: 999,
        categoria: "Electrónica",
        rating: 4.7,
        imagen: "https://via.placeholder.com/300x300?text=TV+4K"
    }
];

// ------------------------------
// EXPORT PARA USO GLOBAL
// ------------------------------

window.listaProductos = productos;
