document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.main-section').forEach((section) => {
        const subsections = Array.from(section.children).filter((child) => child.classList.contains('subsection'));

        if (!subsections.length) return;

        if (!section.querySelector('.subsections-grid')) {
            const grid = document.createElement('div');
            grid.className = 'subsections-grid';
            subsections.forEach((subsection) => grid.appendChild(subsection));
            section.appendChild(grid);
        }
    });

    document.querySelectorAll('.subsection').forEach((subsection, index) => {
        const title = subsection.querySelector('.subsection-title');
        if (!title) return;

        if (index === 0) {
            subsection.classList.add('is-open');
        }

        title.setAttribute('aria-expanded', String(subsection.classList.contains('is-open')));

        title.addEventListener('click', () => {
            const section = subsection.closest('.main-section');
            if (!section) return;

            const sectionCards = section.querySelectorAll('.subsection');
            sectionCards.forEach((card) => {
                const shouldOpen = card === subsection;
                card.classList.toggle('is-open', shouldOpen);
                const trigger = card.querySelector('.subsection-title');
                if (trigger) {
                    trigger.setAttribute('aria-expanded', String(shouldOpen));
                }
            });
        });
    });

    setupLanguageSwitcher();
    initMap();
});

function scrollSlide(event, direction) {
    if (event) {
        event.preventDefault();
    }

    const trigger = event && event.currentTarget ? event.currentTarget : null;
    const slider = trigger ? trigger.closest('.horizontal-slider')?.querySelector('.slider-container') : null;
    const container = slider || document.querySelector('.slider-container');

    if (!container) return;

    const firstSlide = container.querySelector('.slide');
    const gap = parseFloat(getComputedStyle(container).gap) || 20;
    const slideWidth = firstSlide ? firstSlide.getBoundingClientRect().width : 280;
    const scrollAmount = Math.max(slideWidth + gap, 220);

    container.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
    });
}

function setupLanguageSwitcher() {
    const buttons = document.querySelectorAll('.lang-btn');
    if (!buttons.length) return;

    const applyLanguage = (lang) => {
        document.querySelectorAll('[data-en][data-es]').forEach((element) => {
            const value = element.dataset[lang];
            if (typeof value === 'string' && value.trim()) {
                element.textContent = value;
            }
        });

        buttons.forEach((button) => {
            const isActive = button.dataset.lang === lang;
            button.classList.toggle('active', isActive);
            button.setAttribute('aria-pressed', String(isActive));
        });

        document.documentElement.lang = lang;
    };

    buttons.forEach((button) => {
        button.addEventListener('click', () => applyLanguage(button.dataset.lang));
    });

    applyLanguage('en');
}

function initMap() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer || typeof L === 'undefined') return;

    const map = L.map('map', {
        zoomControl: true,
        scrollWheelZoom: true
    }).setView([3.4516, -76.5320], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);

    const points = [
        { name: 'Monumento a Simón Bolívar', coords: [3.4560, -76.5323], type: 'Edificación' },
        { name: 'La Ermita', coords: [3.4414, -76.5339], type: 'Edificación' },
        { name: 'Plazoleta Jairo Varela', coords: [3.4569, -76.5352], type: 'Parque' },
        { name: 'Parque de los Gatos', coords: [3.4320, -76.5471], type: 'Parque' },
        { name: 'Museo de la Salsa', coords: [3.4476, -76.5388], type: 'Lugar' },
        { name: 'Zoológico de Cali', coords: [3.4610, -76.5450], type: 'Lugar' },
        { name: 'Cristo Rey', coords: [3.4328, -76.5451], type: 'Mirador' },
        { name: 'Mirador Sebastián de Belalcázar', coords: [3.4356, -76.5319], type: 'Mirador' },
        { name: 'Feria de Cali', coords: [3.4479, -76.5408], type: 'Evento' },
        { name: 'Festival Petronio Álvarez', coords: [3.4482, -76.5220], type: 'Festival' },
        { name: 'Chuleta Valluna', coords: [3.4570, -76.5285], type: 'Gastronomía' },
        { name: 'Cholado', coords: [3.4548, -76.5215], type: 'Gastronomía' }
    ];

    const bounds = [];

    points.forEach(({ name, coords, type }) => {
        const marker = L.marker(coords).addTo(map);
        marker.bindPopup(`<strong>${name}</strong><br>${type}`);
        bounds.push(coords);
    });

    if (bounds.length) {
        map.fitBounds(bounds, { padding: [30, 30] });
    }
}
