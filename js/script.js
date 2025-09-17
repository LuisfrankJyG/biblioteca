
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
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav ul');

    if (!hamburger || !nav) return;

    hamburger.addEventListener('click', () => {
        nav.classList.toggle('active');
        hamburger.classList.toggle('active');
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
        button.classList.toggle('show', window.scrollY > 300);
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
// =============================
// CARGA DE LIBROS
// =============================
function loadBooks(reset = false) {
    const container = document.querySelector('.books-container');
    if (!container) return;

    if (reset) {
        container.innerHTML = '';
        AppState.loadedBooks = 0;
    }

    const filteredBooks = sampleBooks.filter(book => {
        const matchesCategory = AppState.currentCategory === 'all' || book.category === AppState.currentCategory;
        const matchesSearch = !AppState.searchQuery ||
            book.title.toLowerCase().includes(AppState.searchQuery) ||
            book.author.toLowerCase().includes(AppState.searchQuery);
        return matchesCategory && matchesSearch;
    });

    const toLoad = filteredBooks.slice(AppState.loadedBooks, AppState.loadedBooks + AppState.booksPerLoad);

    toLoad.forEach((book, index) => {
        const card = document.createElement('div');
        card.className = 'book-card';
        card.style.background = generateGradient();

        card.innerHTML = `
            <div class="book-placeholder">
                <i class="fas fa-book"></i>
            </div>
            <h3>${book.title}</h3>
            <p>${book.author}</p>
            <div class="book-rating">${createRatingStars(book.rating)}</div>
            <p class="downloads"><i class="fas fa-download"></i> ${formatNumber(book.downloads)}</p>
            <button class="book-btn" onclick="viewBook(${book.id})">
                <i class="fas fa-eye"></i> Ver
            </button>
            <button class="favorite-btn" onclick="toggleFavorite(${book.id})">
                <i class="${book.isFavorite ? 'fas' : 'far'} fa-heart" style="color:${book.isFavorite ? '#ff4757' : '#666'}"></i>
            </button>
        `;

        container.appendChild(card);

        setTimeout(() => card.classList.add('visible'), index * CONFIG.scrollAnimationDelay);
    });

    AppState.loadedBooks += toLoad.length;
    updateStats(filteredBooks.length);
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
    const book = sampleBooks.find(b => b.id === id);
    if (!book) return;

    const modal = document.getElementById('bookModal');
    if (!modal) return;

    modal.querySelector('.modal-title').textContent = book.title;
    modal.querySelector('.modal-author').textContent = `por ${book.author}`;
    modal.querySelector('.modal-rating').innerHTML = createRatingStars(book.rating);
    modal.querySelector('.modal-downloads').textContent = `${formatNumber(book.downloads)} descargas`;

    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('bookModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

// =============================
// CONTACTO
// =============================
function initContact() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const message = document.getElementById('message').value;
        const url = `https://wa.me/1234567890?text=Hola, soy ${encodeURIComponent(name)}: ${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    });
}

function copyEmail() {
    navigator.clipboard.writeText('contacto@biblioshey.com').then(() => {
        showNotification('Email copiado al portapapeles', 'success');
    });
}


// =============================
// DEBUG
// =============================
window.script = {
    AppState,
    sampleBooks,
    toggleFavorite,
    loadBooks,
    viewBook
};
