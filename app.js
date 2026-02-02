const products = [
 {id:1,name:"Bolso AURA",price:120},
 {id:2,name:"Reloj Terra",price:180},
 {id:3,name:"Cuaderno Zen",price:35}
];

const grid = document.getElementById("products");
const cartCount = document.getElementById("cartCount");

let cart = [];

products.forEach(p=>{
  grid.innerHTML += `
    <article class="card">
      <img src="https://picsum.photos/500?${p.id}">
      <div class="info">
        <h4>${p.name}</h4>
        <p class="price">€${p.price}</p>
        <button onclick="add(${p.id})">Añadir</button>
      </div>
    </article>
  `;
});

function add(id){
 const prod = products.find(p=>p.id===id);
 cart.push(prod);
 cartCount.textContent = cart.length;
}
