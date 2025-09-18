// Contenidos de ejemplo para cada libro
const contenidosLibros = {
  "El Señor de los Anillos": "Una épica aventura de fantasía donde la lucha entre el bien y el mal se decide en la Tierra Media. Frodo y sus amigos deben destruir el Anillo Único para salvar su mundo.",
  "Cien Años de Soledad": "La historia de la familia Buendía en el mítico pueblo de Macondo, una obra maestra del realismo mágico escrita por Gabriel García Márquez.",
  "Harry Potter": "La saga del joven mago Harry Potter y sus amigos en Hogwarts, enfrentando desafíos mágicos y el poder oscuro de Lord Voldemort.",
  "El Principito": "Un cuento filosófico sobre la inocencia, la amistad y el sentido de la vida, narrado por un pequeño príncipe que viaja por distintos planetas.",
  "Física Cuántica": "Introducción a los conceptos fundamentales de la física cuántica, explicando el comportamiento de la materia y la energía a nivel subatómico.",
  "Steve Jobs": "Biografía del fundador de Apple, Steve Jobs, un visionario que revolucionó la tecnología y la forma en que interactuamos con ella.",
  "Cosmos": "Carl Sagan explora el universo, la ciencia y el lugar del ser humano en el cosmos, inspirando curiosidad y asombro por el mundo natural.",
  "Historia del Arte": "Un recorrido por las principales corrientes, obras y artistas que han marcado la historia del arte desde la antigüedad hasta la actualidad."
};

// Función mantenida para compatibilidad
function mostrarContenidoLibro(titulo) {
  // Esta función ahora se maneja en viewBook()
  console.log('mostrarContenidoLibro está deprecada, usar viewBook()');
}

window.mostrarContenidoLibro = mostrarContenidoLibro;

function descargarLibroTxt(titulo, contenido) {
  const blob = new Blob([contenido], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${titulo}.txt`;
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }, 100);
}
window.descargarLibroTxt = descargarLibroTxt;
function vaciarCarrito() {
  carrito = [];
  guardarCarrito();
  actualizarCarritoUI();
  mostrarMensaje('Carrito vaciado');
}
window.vaciarCarrito = vaciarCarrito;
// funciones.js - Lógica adicional para la tienda de libros

// Carrito de compras
let carrito = [];

// Persistencia en localStorage
function guardarCarrito() {
  localStorage.setItem('carritoLibros', JSON.stringify(carrito));
}

function cargarCarrito() {
  const data = localStorage.getItem('carritoLibros');
  if (data) {
    carrito = JSON.parse(data);
  }
}

function mostrarMensaje(texto, tipo = 'info') {
  const container = document.getElementById('notification-container');
  if (!container) {
    console.warn('No notification container found');
    return;
  }
  const notification = document.createElement('div');
  notification.className = `notification ${tipo}`;
  notification.textContent = texto;
  container.appendChild(notification);
  setTimeout(() => { notification.style.opacity = '0'; setTimeout(() => notification.remove(), 300); }, CONFIG.notificationDuration || 1800);
}

function agregarAlCarrito(titulo) {
  const libro = window.allBooks.find(b => b.title === titulo);
  if (!libro) return;
  const existe = carrito.find(b => b.title === titulo);
  if (!existe) {
    carrito.push({...libro, cantidad: 1});
    mostrarMensaje('Libro añadido al carrito');
  } else {
    existe.cantidad += 1;
    mostrarMensaje('Cantidad actualizada en el carrito');
  }
  guardarCarrito();
  actualizarCarritoUI();
  // small visual feedback: pop the header cart count
  const menuCount = document.getElementById('carritoContMenu');
  if (menuCount) {
    menuCount.classList.remove('pop');
    // trigger reflow
    void menuCount.offsetWidth;
    menuCount.classList.add('pop');
    setTimeout(() => menuCount.classList.remove('pop'), 260);
  }
}

function quitarDelCarrito(titulo) {
  carrito = carrito.filter(b => b.title !== titulo);
  mostrarMensaje('Libro eliminado del carrito', 'error');
  guardarCarrito();
  actualizarCarritoUI();
}

function updateQuantity(titulo, change) {
  const libro = carrito.find(b => b.title === titulo);
  if (!libro) return;
  
  const newQuantity = libro.cantidad + change;
  
  if (newQuantity <= 0) {
    quitarDelCarrito(titulo);
    return;
  }
  
  libro.cantidad = newQuantity;
  guardarCarrito();
  actualizarCarritoUI();
  
  const message = change > 0 ? 'Cantidad aumentada' : 'Cantidad disminuida';
  mostrarMensaje(message, 'success');
}

function actualizarCarritoUI() {
  const carritoContMenu = document.getElementById('carritoContMenu');
  const cartItemCount = document.getElementById('cartItemCount');
  const cartTotalItems = document.getElementById('cartTotalItems');
  const cartTotalPrice = document.getElementById('cartTotalPrice');
  const cartEmptyState = document.getElementById('cartEmptyState');
  const cartContent = document.getElementById('cartContent');
  const cartModalList = document.getElementById('cartModalList');
  
  const total = carrito.reduce((acc, b) => acc + b.cantidad, 0);
  const totalPrice = carrito.reduce((acc, b) => acc + (b.precio * b.cantidad), 0);
  
  // Actualizar contador del header
  if (carritoContMenu) carritoContMenu.textContent = total;
  if (cartItemCount) cartItemCount.textContent = total;
  if (cartTotalItems) cartTotalItems.textContent = total;
  if (cartTotalPrice) cartTotalPrice.textContent = `$${totalPrice.toFixed(2)}`;
  
  // Mostrar/ocultar estados del modal
  if (cartEmptyState && cartContent) {
    if (carrito.length === 0) {
      cartEmptyState.style.display = 'block';
      cartContent.style.display = 'none';
    } else {
      cartEmptyState.style.display = 'none';
      cartContent.style.display = 'block';
    }
  }
  
  // Renderizar lista de items del carrito
  if (cartModalList) {
    cartModalList.innerHTML = carrito.map(b => `
      <li class="cart-item">
        <div class="cart-item-info">
          <div class="cart-item-title">${b.title}</div>
          <div class="cart-item-price">$${b.precio.toFixed(2)} c/u</div>
          <div class="cart-item-quantity">
            <span>Cantidad:</span>
            <div class="quantity-controls">
              <button class="quantity-btn" onclick="updateQuantity('${b.title}', -1)">-</button>
              <span class="quantity-display">${b.cantidad}</span>
              <button class="quantity-btn" onclick="updateQuantity('${b.title}', 1)">+</button>
            </div>
          </div>
          <div class="cart-item-subtotal">Subtotal: $${(b.precio * b.cantidad).toFixed(2)}</div>
        </div>
        <div class="cart-item-actions">
          <button class="book-btn secondary" onclick="quitarDelCarrito('${b.title}')">
            <i class="fas fa-trash"></i>
            Quitar
          </button>
        </div>
      </li>
    `).join('');
  }
}

// Exponer funciones globalmente
window.agregarAlCarrito = agregarAlCarrito;
window.quitarDelCarrito = quitarDelCarrito;
window.actualizarCarritoUI = actualizarCarritoUI;
window.carrito = carrito;

// Filtro avanzado por categoría
function filtrarPorCategoria(cat) {
  const filtrados = window.allBooks.filter(b => b.category === cat);
  window.loadBooks(filtrados);
}
window.filtrarPorCategoria = filtrarPorCategoria;

// (Inicialización consolidada más abajo)
// ...existing code...
// =============================
// LIBROS DE EJEMPLO Y ESTADO
// =============================
window.allBooks = [
  { id: 1, title: "El Señor de los Anillos", author: "J.R.R. Tolkien", category: "ficcion", rating: 5, downloads: 12000, precio: 25.99, isFavorite: false },
  { id: 2, title: "Cien Años de Soledad", author: "Gabriel García Márquez", category: "ficcion", rating: 5, downloads: 9500, precio: 18.50, isFavorite: false },
  { id: 3, title: "Harry Potter", author: "J.K. Rowling", category: "juvenil", rating: 4, downloads: 18000, precio: 22.99, isFavorite: false },
  { id: 4, title: "El Principito", author: "Antoine de Saint-Exupéry", category: "juvenil", rating: 5, downloads: 8000, precio: 12.99, isFavorite: false },
  { id: 5, title: "Física Cuántica", author: "Stephen Hawking", category: "ciencia", rating: 4, downloads: 4000, precio: 29.99, isFavorite: false },
  { id: 6, title: "Steve Jobs", author: "Walter Isaacson", category: "biografia", rating: 4, downloads: 3500, precio: 19.99, isFavorite: false },
  { id: 7, title: "Cosmos", author: "Carl Sagan", category: "ciencia", rating: 5, downloads: 6000, precio: 24.99, isFavorite: false },
  { id: 8, title: "Historia del Arte", author: "E.H. Gombrich", category: "arte", rating: 4, downloads: 2500, precio: 27.50, isFavorite: false }
];

window.AppState = {
  currentCategory: 'all',
  searchQuery: '',
  loadedBooks: 0,
  booksPerLoad: 20
};

window.CONFIG = {
  scrollAnimationDelay: 80,
  notificationDuration: 1800
};

// Inicializar la aplicación al cargar la página
window.addEventListener('DOMContentLoaded', () => {
  cargarCarrito();
  actualizarCarritoUI();
  initMobileMenu();
  initSmoothScroll();
  initBackToTop();
  initSearch();
  initScrollSpy();
  initTestimonialsCarousel();
  loadBooks(true);
  // Header buttons
  const headerCart = document.getElementById('headerCartBtn');
  if (headerCart) headerCart.addEventListener('click', () => {
    openCartModal();
  });
  // WhatsApp floating button
  initWhatsAppFloat();
});

// =============================
// MODAL DEL CARRITO
// =============================
function openCartModal() {
  const modal = document.getElementById('cartModal');
  if (!modal) return;
  
  // Actualizar UI antes de mostrar
  actualizarCarritoUI();
  
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
  
  // Enfocar el modal para accesibilidad
  modal.focus();
}

function closeCartModal() {
  const modal = document.getElementById('cartModal');
  if (!modal) return;
  
  modal.classList.remove('show');
  document.body.style.overflow = '';
}

function checkoutCart() {
  if (carrito.length === 0) {
    mostrarMensaje('El carrito está vacío', 'error');
    return;
  }
  
  const totalItems = carrito.reduce((acc, b) => acc + b.cantidad, 0);
  const totalPrice = carrito.reduce((acc, b) => acc + (b.precio * b.cantidad), 0);
  const message = `¡Gracias por tu compra! Has adquirido ${totalItems} libro${totalItems > 1 ? 's' : ''} por $${totalPrice.toFixed(2)}.`;
  
  mostrarMensaje(message, 'success');
  
  // Resetear carrito después del pago
  setTimeout(() => {
    carrito = [];
    guardarCarrito();
    actualizarCarritoUI();
    closeCartModal();
    mostrarMensaje('Carrito vaciado después de la compra', 'info');
  }, 2000);
}

// Delegado para botones dentro del modal
document.addEventListener('click', (e) => {
  // Botón vaciar carrito
  if (e.target && e.target.id === 'cartEmptyBtn') {
    vaciarCarrito();
  }
  
  // Botón checkout
  if (e.target && e.target.id === 'cartCheckoutBtn') {
    checkoutCart();
  }
  
  // Botón cerrar modal
  if (e.target && e.target.closest && e.target.closest('#cartModal') && e.target.classList.contains('close-modal')) {
    closeCartModal();
  }
});

// Exponer funciones globalmente
window.updateQuantity = updateQuantity;
window.checkoutCart = checkoutCart;


// =============================
// UTILIDADES
// =============================
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

function generateGradient() {
    const colors = [
        ["#6a11cb", "#2575fc"],
        ["#ff6a00", "#ee0979"],
        ["#00c6ff", "#0072ff"],
        ["#ff416c", "#ff4b2b"],
        ["#11998e", "#38ef7d"]
    ];
    const pair = colors[Math.floor(Math.random() * colors.length)];
    return `linear-gradient(135deg, ${pair[0]}, ${pair[1]})`;
}

function formatNumber(num) {
    return num.toLocaleString('es-ES');
}

function createRatingStars(rating) {
    return Array(5).fill(0).map((_, i) =>
        `<i class="fas fa-star${i < rating ? ' filled' : ''}"></i>`
    ).join('');
}

// =============================
// NOTIFICACIONES
// =============================
function showNotification(message, type = 'info', duration = CONFIG.notificationDuration) {
    const container = document.getElementById('notification-container');
    if (!container) return;

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    container.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

// =============================
// MENÚ RESPONSIVE
// =============================
function initMobileMenu() {
  const hamburger = document.getElementById('mobileMenu');
  const nav = document.getElementById('navMenu');

  if (!hamburger || !nav) return;

  hamburger.addEventListener('click', () => {
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('active');
  });
}

// =============================
// SCROLL SUAVE Y BOTÓN VOLVER
// =============================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });
}

function initBackToTop() {
  const button = document.getElementById('back-to-top');
  if (!button) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) button.classList.add('visible'); else button.classList.remove('visible');
  });

  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// =============================
// BÚSQUEDA
// =============================
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    searchInput.addEventListener('input', debounce(e => {
        AppState.searchQuery = e.target.value.toLowerCase();
        loadBooks(true);
    }, 300));
}

// Helper para el botón de búsqueda en la UI
function searchBooks() {
  const input = document.getElementById('searchInput');
  if (!input) return;
  AppState.searchQuery = input.value.toLowerCase();
  loadBooks(true);
}
window.searchBooks = searchBooks;
// =============================
// CARGA DE LIBROS
// =============================
function loadBooks(reset = false) {
  const container = document.querySelector('.books-grid') || document.getElementById('booksGrid');
    if (!container) return;

    if (reset) {
        container.innerHTML = '';
        AppState.loadedBooks = 0;
    }

  const filteredBooks = window.allBooks.filter(book => {
    const matchesCategory = window.AppState.currentCategory === 'all' || book.category === window.AppState.currentCategory;
    const matchesSearch = !window.AppState.searchQuery ||
      book.title.toLowerCase().includes(window.AppState.searchQuery) ||
      book.author.toLowerCase().includes(window.AppState.searchQuery);
    return matchesCategory && matchesSearch;
  });

  const toLoad = filteredBooks.slice(window.AppState.loadedBooks, window.AppState.loadedBooks + window.AppState.booksPerLoad);

    toLoad.forEach((book, index) => {
        const card = document.createElement('div');
      card.className = 'book-card';
        card.style.background = generateGradient();

    // Asignar imagen de portada según el libro
    let portada = 'img/1.jpg';
    if (book.title === "El Señor de los Anillos") portada = 'img/1.jpg';
    else if (book.title === "Cien Años de Soledad") portada = 'img/2.jpg';
    else if (book.title === "Harry Potter") portada = 'img/3.png';
    else if (book.title === "El Principito") portada = 'img/4.png';
    else if (book.title === "Física Cuántica") portada = 'img/5.jpg';
    else if (book.title === "Steve Jobs") portada = 'img/6.jpg';
    else if (book.title === "Cosmos") portada = 'img/7.jpg';
    else if (book.title === "Historia del Arte") portada = 'img/8.png';

    // badge for top-rated or popular
    const safeTitle = book.title.replace(/'/g, "\\'");
    const badge = (book.rating >= 5 || book.downloads > 10000) ? '<span class="badge">Top</span>' : '';
    card.innerHTML = `
      <div class="card-header">
        ${badge}
        <div class="book-placeholder">
          <img src="${portada}" alt="Portada de ${book.title}" loading="lazy" width="260" height="360" style="width:100%;height:100%;object-fit:cover;border-radius:12px;box-shadow:0 2px 8px #FFD6A5;">
        </div>
      </div>
      <div class="card-body">
        <h3>${book.title}</h3>
        <p class="author">${book.author}</p>
        <div class="book-rating">${createRatingStars(book.rating)}</div>
        <p class="downloads"><i class="fas fa-download"></i> ${formatNumber(book.downloads)}</p>
        <div class="book-price">$${book.precio.toFixed(2)}</div>
      </div>
      <div class="card-actions">
        <button class="book-btn" onclick="viewBook(${book.id})"><i class="fas fa-eye"></i> Ver</button>
        <button class="book-btn add-cart" onclick="agregarAlCarrito('${safeTitle}')"><i class="fas fa-cart-plus"></i> Añadir</button>
      </div>
    `;

        container.appendChild(card);

        setTimeout(() => card.classList.add('visible'), index * CONFIG.scrollAnimationDelay);
    });

  window.AppState.loadedBooks += toLoad.length;
  updateStats(filteredBooks.length);
}

// =============================
// SCROLL SPY - highlight active nav link
// =============================
function initScrollSpy() {
  const links = Array.from(document.querySelectorAll('.nav-menu a'));
  const sections = links.map(l => document.querySelector(l.getAttribute('href'))).filter(Boolean);
  if (!sections.length) return;

  const setActive = (id) => {
    links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
  };

  // IntersectionObserver for modern browsers
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { root: null, threshold: 0.45 });
    sections.forEach(s => obs.observe(s));
  } else {
    // Fallback: onscroll
    window.addEventListener('scroll', () => {
      let current = sections[0];
      for (const s of sections) {
        if (s.getBoundingClientRect().top <= window.innerHeight * 0.45) current = s;
      }
      setActive(current.id);
    });
  }
}
window.initScrollSpy = initScrollSpy;

// Testimonials carousel
function initTestimonialsCarousel() {
  const carousel = document.getElementById('testimonialsCarousel');
  if (!carousel) return;
  const track = carousel.querySelector('.carousel-track');
  const slides = Array.from(carousel.querySelectorAll('.testimonial-slide'));
  const prevBtn = carousel.querySelector('.carousel-btn.prev');
  const nextBtn = carousel.querySelector('.carousel-btn.next');
  const indicators = carousel.querySelector('.carousel-indicators');
  let index = 0;
  let interval = null;

  const goTo = (i) => {
    index = (i + slides.length) % slides.length;
    const slideWidth = slides[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap || 18);
    track.style.transform = `translateX(-${index * slideWidth}px)`;
    updateIndicators();
  };

  const updateIndicators = () => {
    Array.from(indicators.children).forEach((btn, i) => btn.classList.toggle('active', i === index));
  };

  // build indicators
  slides.forEach((s, i) => {
    const btn = document.createElement('button');
    btn.addEventListener('click', () => { goTo(i); resetAutoplay(); });
    indicators.appendChild(btn);
  });

  prevBtn.addEventListener('click', () => { goTo(index - 1); resetAutoplay(); });
  nextBtn.addEventListener('click', () => { goTo(index + 1); resetAutoplay(); });

  function autoplay() { interval = setInterval(() => goTo(index + 1), 4200); }
  function resetAutoplay() { clearInterval(interval); autoplay(); }

  carousel.addEventListener('mouseenter', () => clearInterval(interval));
  carousel.addEventListener('mouseleave', () => autoplay());

  document.addEventListener('keydown', (e) => {
    if (!carousel.contains(document.activeElement)) return;
    if (e.key === 'ArrowLeft') goTo(index - 1);
    if (e.key === 'ArrowRight') goTo(index + 1);
    if (e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); clearInterval(interval); }
  });

  // initial
  goTo(0);
  autoplay();
}

function updateStats(total) {
    const stats = document.querySelector('.stats-container');
    if (!stats) return;

    stats.innerHTML = `
        <div class="stat-card">
            <i class="fas fa-book"></i>
            <h3>${formatNumber(total)}</h3>
            <p>Libros disponibles</p>
        </div>
        <div class="stat-card">
            <i class="fas fa-star"></i>
            <h3>${formatNumber(12800)}</h3>
            <p>Reseñas</p>
        </div>
        <div class="stat-card">
            <i class="fas fa-user-friends"></i>
            <h3>${formatNumber(5400)}</h3>
            <p>Usuarios</p>
        </div>
    `;
}

// =============================
// DETALLES DE LIBRO
// =============================
function viewBook(id) {
  const book = window.allBooks.find(b => b.id === id);
  if (!book) return;

  const modal = document.getElementById('bookModal');
  if (!modal) return;

  // Actualizar información básica
  document.getElementById('modalTitle').textContent = book.title;
  document.getElementById('modalAuthor').textContent = `por ${book.author}`;
  document.getElementById('modalRating').innerHTML = createRatingStars(book.rating);
  document.getElementById('modalDownloads').textContent = formatNumber(book.downloads);

  // Actualizar badges
  document.getElementById('ratingValue').textContent = book.rating;
  document.getElementById('downloadsValue').textContent = formatNumber(book.downloads);

  // Asignar imagen de portada
  const portada = getBookCover(book.title);
  const modalCover = modal.querySelector('.modal-cover');
  if (modalCover) {
    modalCover.src = portada;
    modalCover.alt = `Portada de ${book.title}`;
  }

  // Actualizar categoría
  const categoryNames = {
    'ficcion': 'Ficción',
    'juvenil': 'Juvenil',
    'ciencia': 'Ciencia',
    'biografia': 'Biografía',
    'arte': 'Arte'
  };
  document.getElementById('bookCategory').textContent = categoryNames[book.category] || book.category;
  
  // Actualizar precio
  document.getElementById('bookPriceDisplay').innerHTML = `
    <div class="book-price-large">$${book.precio.toFixed(2)}</div>
  `;

  // Actualizar descripción
  const description = contenidosLibros[book.title] || "Descripción no disponible para este libro.";
  document.getElementById('descriptionContent').innerHTML = `<p>${description}</p>`;

  // Configurar botones
  setupBookModalButtons(book);

  // Mostrar modal
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
  modal.focus();
}

function getBookCover(title) {
  const covers = {
    "El Señor de los Anillos": 'img/1.jpg',
    "Cien Años de Soledad": 'img/2.jpg',
    "Harry Potter": 'img/3.png',
    "El Principito": 'img/4.png',
    "Física Cuántica": 'img/5.jpg',
    "Steve Jobs": 'img/6.jpg',
    "Cosmos": 'img/7.jpg',
    "Historia del Arte": 'img/8.png'
  };
  return covers[title] || 'img/1.jpg';
}

function setupBookModalButtons(book) {
  // Botón leer
  const readBtn = document.getElementById('readBtn');
  if (readBtn) {
    readBtn.onclick = () => {
      mostrarMensaje('¡Función de lectura próximamente!', 'info');
    };
  }

  // Botón descargar
  const downloadBtn = document.getElementById('downloadBtn');
  if (downloadBtn) {
    downloadBtn.onclick = () => {
      const contenido = contenidosLibros[book.title] || "Contenido no disponible para este libro.";
      descargarLibroTxt(book.title, contenido);
    };
  }

  // Botón favorito
  const favoriteBtn = document.getElementById('favoriteBtn');
  if (favoriteBtn) {
    updateFavoriteButton(favoriteBtn, book.isFavorite);
    favoriteBtn.onclick = () => {
      book.isFavorite = !book.isFavorite;
      updateFavoriteButton(favoriteBtn, book.isFavorite);
      const message = book.isFavorite ? 'Añadido a favoritos' : 'Eliminado de favoritos';
      mostrarMensaje(message, 'success');
    };
  }

  // Botón añadir al carrito
  const addToCartBtn = document.getElementById('addToCartBtn');
  if (addToCartBtn) {
    addToCartBtn.onclick = () => {
      agregarAlCarrito(book.title);
    };
  }
}

function updateFavoriteButton(btn, isFavorite) {
  const icon = btn.querySelector('i');
  const span = btn.querySelector('span');
  
  if (isFavorite) {
    icon.className = 'fas fa-heart';
    btn.classList.add('active');
    span.textContent = 'En Favoritos';
  } else {
    icon.className = 'far fa-heart';
    btn.classList.remove('active');
    span.textContent = 'Favorito';
  }
}

function closeModal() {
    const modal = document.getElementById('bookModal');
    if (!modal) return;
    modal.classList.remove('show');
    // Permitir scroll nuevamente
    document.body.style.overflow = '';
}

// Delegados globales para cerrar modales y accesibilidad
document.addEventListener('click', (e) => {
  // Cerrar modal de libro
  if (e.target.matches('.close-modal') || e.target.closest('.close-modal')) {
    const bookModal = document.getElementById('bookModal');
    const cartModal = document.getElementById('cartModal');
    
    if (bookModal && bookModal.classList.contains('show')) {
      closeModal();
    }
    if (cartModal && cartModal.classList.contains('show')) {
      closeCartModal();
    }
  }
  
  // Cerrar modal de libro al hacer clic en el backdrop
  const bookModal = document.getElementById('bookModal');
  if (bookModal && e.target === bookModal) {
    closeModal();
  }
  
  // Cerrar modal de carrito al hacer clic en el backdrop
  const cartModal = document.getElementById('cartModal');
  if (cartModal && e.target === cartModal) {
    closeCartModal();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const bookModal = document.getElementById('bookModal');
    const cartModal = document.getElementById('cartModal');
    
    if (bookModal && bookModal.classList.contains('show')) {
      closeModal();
    }
    if (cartModal && cartModal.classList.contains('show')) {
      closeCartModal();
    }
  }
});

// =============================
// ICONO FLOTANTE DE WHATSAPP
// =============================
function initWhatsAppFloat() {
  const waBtn = document.getElementById('whatsappBtn');
  const whatsappFloat = document.getElementById('whatsapp-float');

  if (!waBtn || !whatsappFloat) return;

  // Mensaje predefinido para WhatsApp
  const prefilledMessage = 'Hola! Estoy interesado en la biblioteca BiblioShey y quisiera más información sobre los libros disponibles.';

  // Evento click para abrir WhatsApp
  waBtn.addEventListener('click', function (e) {
    e.preventDefault();
    const waNumber = waBtn.dataset.wa || '51978110873';
    const text = encodeURIComponent(prefilledMessage);
    const url = `https://wa.me/${waNumber}?text=${text}`;
    
    // Intentar abrir en nueva ventana, fallback a location.href
    const win = window.open(url, '_blank');
    if (!win) {
      try { 
        window.location.href = url; 
      } catch (err) { 
        showNotification('No se pudo abrir WhatsApp automáticamente. Intenta copiar el número.', 'error'); 
      }
    }
    showNotification('Abriendo WhatsApp...', 'success');
  });

  // Animación de pulso periódica para llamar la atención
  setInterval(() => {
    if (!waBtn.classList.contains('pulse')) {
      waBtn.classList.add('pulse');
      setTimeout(() => {
        waBtn.classList.remove('pulse');
      }, 2000);
    }
  }, 10000); // Cada 10 segundos

  // Mostrar tooltip al hacer hover
  whatsappFloat.addEventListener('mouseenter', function() {
    const tooltip = whatsappFloat.querySelector('.whatsapp-tooltip');
    if (tooltip) {
      tooltip.style.opacity = '1';
      tooltip.style.visibility = 'visible';
      tooltip.style.transform = 'translateY(-50%) translateX(0)';
    }
  });

  whatsappFloat.addEventListener('mouseleave', function() {
    const tooltip = whatsappFloat.querySelector('.whatsapp-tooltip');
    if (tooltip) {
      tooltip.style.opacity = '0';
      tooltip.style.visibility = 'hidden';
      tooltip.style.transform = 'translateY(-50%) translateX(20px)';
    }
  });
}


// =============================
// DEBUG
// =============================
window.script = {
  AppState,
  loadBooks,
  viewBook,
  agregarAlCarrito,
  quitarDelCarrito
};

