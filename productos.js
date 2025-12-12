// productos.js
// Contenido: lista de productos. Puedes añadir/editar.
const productos = [
  {
    id: 1,
    title: "Auriculares inalámbricos Bluetooth",
    price: 29.99,
    price_old: 59.99,
    img: "https://images.unsplash.com/photo-1518444023775-6e9800b8cfb1?w=800&q=60&auto=format&fit=crop",
    category: "Electrónica",
    rating: 4.6,
    reviews: 152,
    featured: true,
    bestseller: true,
    recommend: true,
    description: "Auriculares cómodos, batería 30h, cancelación de ruido."
  },
  {
    id: 2,
    title: "Smartphone 6.5\" - 128GB",
    price: 189.00,
    price_old: 249.00,
    img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=60&auto=format&fit=crop",
    category: "Telefonía",
    rating: 4.4,
    reviews: 540,
    featured: true,
    bestseller: true,
    recommend: true,
    description: "Pantalla AMOLED, triple cámara, batería 5000mAh."
  },
  {
    id: 3,
    title: "Mochila de viaje resistente al agua",
    price: 39.90,
    price_old: null,
    img: "https://images.unsplash.com/photo-1530188286235-c7ee7d81b0b4?w=800&q=60&auto=format&fit=crop",
    category: "Viaje",
    rating: 4.3,
    reviews: 88,
    featured: false,
    bestseller: true,
    recommend: false,
    description: "Organizadores, puerto USB, resistente."
  },
  {
    id: 4,
    title: "Cafetera espresso compacta",
    price: 79.00,
    price_old: 129.00,
    img: "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=800&q=60&auto=format&fit=crop",
    category: "Hogar",
    rating: 4.7,
    reviews: 220,
    featured: true,
    bestseller: false,
    recommend: true,
    description: "Cafetera rápida, 19 bars, depósito 1.5L."
  },
  {
    id: 5,
    title: "Zapatillas deportivas running",
    price: 49.99,
    price_old: 89.99,
    img: "https://images.unsplash.com/photo-1519744792095-2f2205e87b6f?w=800&q=60&auto=format&fit=crop",
    category: "Deportes",
    rating: 4.2,
    reviews: 410,
    featured: false,
    bestseller: true,
    recommend: true,
    description: "Amortiguación, suela antideslizante."
  },
  {
    id: 6,
    title: "Monitor 24\" Full HD 75Hz",
    price: 119.99,
    price_old: 159.99,
    img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=60&auto=format&fit=crop",
    category: "Informática",
    rating: 4.5,
    reviews: 96,
    featured: false,
    bestseller: false,
    recommend: false,
    description: "Panel IPS, baja latencia, fino."
  }
];

// export for modules — not needed; main.js will read 'productos' global
