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
        scrollWheelZoom: true,
        attributionControl: true
    }).setView([3.4516, -76.5320], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);

    const categoryColors = {
        edifications: '#dc3545',
        parks: '#28a745',
        locations: '#ffc107',
        viewpoints: '#17a2b8'
    };

    const points = [
        { name: 'Torre de Cali', coords: [3.4488, -76.5288], category: 'edifications', type: 'Edificación' },
        { name: 'Monumento a Simón Bolívar', coords: [3.4560, -76.5323], category: 'edifications', type: 'Edificación' },
        { name: 'La Ermita', coords: [3.4414, -76.5339], category: 'edifications', type: 'Edificación' },
        { name: 'Monumento a la Solidaridad', coords: [3.4461, -76.5320], category: 'edifications', type: 'Edificación' },
        { name: 'Plazoleta Jairo Varela', coords: [3.4569, -76.5352], category: 'parks', type: 'Parque' },
        { name: 'Parque de los Gatos', coords: [3.4320, -76.5471], category: 'parks', type: 'Parque' },
        { name: 'Parque Artesanal Loma de la Cruz', coords: [3.4705, -76.5480], category: 'parks', type: 'Parque' },
        { name: 'Museo de la Salsa', coords: [3.4476, -76.5388], category: 'locations', type: 'Lugar' },
        { name: 'Zoológico de Cali', coords: [3.4610, -76.5450], category: 'locations', type: 'Lugar' },
        { name: 'Museo Caliwood', coords: [3.4590, -76.5392], category: 'locations', type: 'Lugar' },
        { name: 'Monumento a Cristo Rey', coords: [3.4328, -76.5451], category: 'viewpoints', type: 'Mirador' },
        { name: 'Mirador Sebastián de Belalcázar', coords: [3.4356, -76.5319], category: 'viewpoints', type: 'Mirador' },
        { name: 'Cerro de las Tres Cruces', coords: [3.4487, -76.5317], category: 'viewpoints', type: 'Mirador' }
    ];

    const markers = [];
    const bounds = [];

    points.forEach(({ name, coords, category, type }) => {
        const color = categoryColors[category] || '#ffffff';
        const marker = L.circleMarker(coords, {
            radius: 9,
            color: '#ffffff',
            weight: 2,
            fillColor: color,
            fillOpacity: 0.9,
            category
        }).addTo(map);

        marker.bindPopup(`
            <div class="map-popover">
                <strong>${name}</strong>
                <span>${type}</span>
            </div>
        `, {
            closeButton: true,
            className: 'custom-map-popup',
            offset: [0, -10]
        });

        marker.bindTooltip(type, {
            direction: 'top',
            opacity: 0.9,
            className: 'custom-map-tooltip'
        });

        markers.push(marker);
        bounds.push(coords);
    });

    const applyMapFilter = (filterValue) => {
        markers.forEach((marker) => {
            const shouldShow = filterValue === 'all' || marker.options.category === filterValue;
            const opacity = shouldShow ? 1 : 0.2;
            marker.setStyle({
                opacity,
                fillOpacity: shouldShow ? 0.9 : 0.2,
                weight: shouldShow ? 2 : 1
            });
        });
    };

    document.querySelectorAll('.legend-item').forEach((item) => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.legend-item').forEach((legendItem) => {
                legendItem.classList.toggle('active', legendItem === item);
            });

            applyMapFilter(item.dataset.filter || 'all');
        });
    });

    if (bounds.length) {
        map.fitBounds(bounds, { padding: [30, 30] });
    }

    applyMapFilter('all');
}
