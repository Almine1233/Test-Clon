document.addEventListener("DOMContentLoaded", () => {
  mostrarProductos(productos);
  actualizarCarrito();

  document.getElementById("search-btn").addEventListener("click", () => {
    const query = document.getElementById("search-input").value.toLowerCase();
    const filtrados = productos.filter(p => p.nombre.toLowerCase().includes(query));
    mostrarProductos(filtrados);
  });
});

function mostrarProductos(lista) {
  const container = document.getElementById("productos-container");
  container.innerHTML = "";
  lista.forEach(producto => {
    const card = document.createElement("div");
    card.className = "producto-card";
    card.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}">
      <h3>${producto.nombre}</h3>
      <p>$${producto.precio}</p>
      <button onclick="agregarAlCarrito(${producto.id})">Añadir al carrito</button>
    `;
    container.appendChild(card);
  });
}

function agregarAlCarrito(id) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const producto = productos.find(p => p.id === id);
  carrito.push(producto);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarCarrito();
}

function actualizarCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  document.getElementById("cart-count").textContent = carrito.length;
}
