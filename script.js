document.addEventListener('DOMContentLoaded', function () {
    const subsectionImageCaptions = [
        'Cali tower – Torre de Cali',
        'Tejada Cat, Cat park – Gato de Tejada, Parque del Gato',
        'Cali Zoo – Zoológico de Cali',
        'Christ the King Monument – Monumento a Cristo Rey',
        'Cali Fair (2025) – Feria de Cali (2025)',
        'World Salsa Festival (2025) – Festival Mundial de la Salsa (2025)',
        'Empanadas, typical Cali food – Empanadas, comida típica de Cali',
        'Cocada, typical Cali sweet – Cocada, dulce típico de Cali'
    ];

    const captionStyle = document.createElement('style');
    captionStyle.textContent = `
        .subsection-image-caption {
            margin: -8px 20px 16px;
            color: #b0b0b0;
            font-size: 0.875rem;
            line-height: 1.4;
            text-align: center;
        }
    `;
    document.head.appendChild(captionStyle);

    document.querySelectorAll('.subsection-image').forEach((image, index) => {
        const captionText = subsectionImageCaptions[index];
        if (!captionText) return;

        const caption = document.createElement('p');
        caption.className = 'subsection-image-caption';
        caption.textContent = captionText;
        image.insertAdjacentElement('afterend', caption);
    });

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
            const isAlreadyOpen = subsection.classList.contains('is-open');

            sectionCards.forEach((card) => {
                const shouldOpen = !isAlreadyOpen && card === subsection;
                card.classList.toggle('is-open', shouldOpen);
                const trigger = card.querySelector('.subsection-title');
                if (trigger) {
                    trigger.setAttribute('aria-expanded', String(shouldOpen));
                }
            });
        });
    });

    const imageModal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const modalCaption = document.getElementById('modal-title');

    function openImageModal(imageElement) {
        if (!imageModal || !modalImage || !modalCaption || !imageElement) return;

        const slide = imageElement.closest('.slide');
        const title = slide?.querySelector('h4')?.textContent || imageElement.alt || 'Experience image';

        modalImage.src = imageElement.src;
        modalImage.alt = imageElement.alt;
        modalCaption.textContent = title;
        imageModal.classList.add('is-open');
        imageModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
    }

    function closeImageModal() {
        if (!imageModal || !modalImage) return;

        imageModal.classList.remove('is-open');
        imageModal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
        modalImage.src = '';
        modalImage.alt = '';
        if (modalCaption) modalCaption.textContent = '';
    }

    document.querySelectorAll('.slide').forEach((slide) => {
        const content = slide.querySelector('.slide-content');
        if (!content) return;

        slide.setAttribute('tabindex', '0');
        slide.setAttribute('role', 'button');
        slide.setAttribute('aria-expanded', 'false');
        content.setAttribute('aria-hidden', 'true');

        slide.addEventListener('click', (event) => {
            if (event.target.closest('.slide-btn')) return;

            const clickedImage = event.target.closest('img');
            if (clickedImage) {
                openImageModal(clickedImage);
            }
        });

        slide.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                const clickedImage = slide.querySelector('img');
                if (clickedImage) {
                    openImageModal(clickedImage);
                }
            }
        });
    });

    if (imageModal) {
        imageModal.addEventListener('click', (event) => {
            if (event.target === imageModal) closeImageModal();
        });

        const closeButton = imageModal.querySelector('.image-modal-close');
        if (closeButton) {
            closeButton.addEventListener('click', closeImageModal);
        }
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && imageModal?.classList.contains('is-open')) {
            closeImageModal();
        }
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

    const experienceDescriptions = [
        {
            en: 'The monument to Simón Bolívar is a pedestrian sculpture located in the plaza of the Municipal Administrative Center (CAM) at 12th Street with 3rd North Avenue, Bolívar Promenade, Cali.',
            es: 'El monumento a Simón Bolívar es una escultura peatonal ubicada en la plaza del Centro Administrativo Municipal (CAM) en la calle 12 con avenida 3 Norte, Paseo Bolívar, Cali.'
        },
        {
            en: 'La Ermita Church is a Catholic temple built near the Cali River, dedicated to the Lord of the Cane and Our Lady of the Conception. You can find it on 13th Street with 4th Avenue, Cali.',
            es: 'La iglesia La Ermita es un templo católico construido cerca del río Cali, dedicado al Señor de la Caña y a Nuestra Señora de la Concepción. Se encuentra en la calle 13 con avenida 4, Cali.'
        },
        {
            en: 'The Solidarity Monument is a sculpture inaugurated in 1995, symbolizing unity and collective spirit. You can find it on 3rd North Avenue with 34th Street, Cali.',
            es: 'El Monumento a la Solidaridad es una escultura inaugurada en 1995 que simboliza la unidad y el espíritu colectivo. Se encuentra en la avenida 3 Norte con calle 34, Cali.'
        },
        {
            en: "Jairo Varela Plaza is an urban space enriched with gastronomy and tribute to the city's music culture. You can find it on Avenue 2 North, #10 North-1 to 10 North-75, Cali.",
            es: 'La Plazoleta Jairo Varela es un espacio urbano enriquecido con gastronomía y un homenaje a la cultura musical de la ciudad. Se encuentra en la avenida 2 Norte, #10 Norte-1 a 10 Norte-75, Cali.'
        },
        {
            en: "Cat Park's main attraction is the Tejada Cat, with cats throughout the park and urban art around the area. The address of Cat Park in Cali is 3 West-2 to 3, Av. 4 West #West-190.",
            es: 'La principal atracción del Parque del Gato es el Gato de Tejada, junto con esculturas de gatos por todo el parque y arte urbano en los alrededores. La dirección del Parque del Gato en Cali es 3 Oeste-2 a 3, av. 4 Oeste #Oeste-190.'
        },
        {
            en: 'At Parque Artesanal Loma de La Cruz, you can enjoy cultural shows weekly and artisan crafts. You can find it on 5th Street, between 16th and 16A Avenues, in commune 3, Cali.',
            es: 'En el Parque Artesanal Loma de La Cruz puedes disfrutar de espectáculos culturales semanales y artesanías. Se encuentra en la calle 5, entre las carreras 16 y 16A, en la comuna 3 de Cali.'
        },
        {
            en: 'The Salsa Museum gathers and displays the musical culture and history of salsa both globally and in Cali. You can find it on 11b Street #24 - 44, Cali.',
            es: 'El Museo de la Salsa reúne y exhibe la cultura musical y la historia de la salsa, tanto a nivel mundial como en Cali. Se encuentra en la calle 11B #24-44, Cali.'
        },
        {
            en: 'At the Cali Zoo, you can explore trails full of nature and reconnect with biodiversity. You can find the entrance on 2nd West Avenue with 14th Street, in the Santa Teresita neighborhood, Cali.',
            es: 'En el Zoológico de Cali puedes recorrer senderos llenos de naturaleza y reconectar con la biodiversidad. La entrada está en la avenida 2 Oeste con calle 14, en el barrio Santa Teresita, Cali.'
        },
        {
            en: "Caliwood is the first Museum of Cinematography in Colombia's history, founded in 2008. You can find it on 2 West Street #5a 55, Cali.",
            es: 'Caliwood es el primer museo de cinematografía de la historia de Colombia, fundado en 2008. Se encuentra en la calle 2 Oeste #5A-55, Cali.'
        },
        {
            en: "The Christ the King Monument was inaugurated in 1953 and is one of the city's most iconic landmarks. You can find it in Santa Rita, Cali.",
            es: 'El Monumento a Cristo Rey fue inaugurado en 1953 y es uno de los lugares más emblemáticos de la ciudad. Se encuentra en Santa Rita, Cali.'
        },
        {
            en: 'This viewpoint offers panoramic views of the city and a historic monument of Belalcázar. You can find it on 3rd West Avenue with 9th West Street, Cali.',
            es: 'Este mirador ofrece vistas panorámicas de la ciudad y un monumento histórico a Belalcázar. Se encuentra en la avenida 3 Oeste con calle 9 Oeste, Cali.'
        },
        {
            en: 'The Hill of the Three Crosses is a landmark with three crosses and a broad city overlook. You can find it on 9th North Avenue at 12th North Street, Cali.',
            es: 'El Cerro de las Tres Cruces es un lugar emblemático con tres cruces y una amplia vista de la ciudad. Se encuentra en la avenida 9 Norte con calle 12 Norte, Cali.'
        },
        {
            en: 'The International Book Fair is held annually between October and November in Cali and brings together readers and authors from across the region.',
            es: 'La Feria Internacional del Libro se celebra anualmente entre octubre y noviembre en Cali y reúne a lectores y autores de toda la región.'
        },
        {
            en: 'The Cali Fair is an annual event held between December 25 and 30, celebrating culture, music, and tradition in the city.',
            es: 'La Feria de Cali es un evento anual que se celebra entre el 25 y el 30 de diciembre para celebrar la cultura, la música y la tradición de la ciudad.'
        },
        {
            en: 'At the Cali International Film Fair, cultural and cinematic diversity is celebrated. This event is held annually between October and December.',
            es: 'En el Festival Internacional de Cine de Cali se celebra la diversidad cultural y cinematográfica. Este evento se realiza anualmente entre octubre y diciembre.'
        },
        {
            en: "At the Petronio Álvarez Festival, many artists gather to celebrate the region's musical heritage. This event is held annually in August.",
            es: 'En el Festival Petronio Álvarez se reúnen numerosos artistas para celebrar el patrimonio musical de la región. Este evento se celebra anualmente en agosto.'
        },
        {
            en: 'The World Salsa Festival is celebrated annually in Cali, bringing dance and music to the city. This event is usually held between September and December.',
            es: 'El Festival Mundial de Salsa se celebra anualmente en Cali, llevando baile y música a la ciudad. Este evento suele realizarse entre septiembre y diciembre.'
        },
        {
            en: "The Cali International Theater Festival brings performing arts to different neighborhoods in the city. Check when it will be held, as it can take place in various months.",
            es: 'El Festival Internacional de Teatro de Cali lleva las artes escénicas a diferentes barrios de la ciudad. Consulta cuándo se realizará, ya que puede tener lugar en distintos meses.'
        }
    ];

    const experienceSections = ['#iconic-places', '#experiences', '#events'];
    const experienceParagraphs = experienceSections.flatMap((sectionSelector) =>
        Array.from(document.querySelectorAll(`${sectionSelector} .slide-content p`))
    );
    experienceParagraphs.forEach((paragraph, index) => {
        const description = experienceDescriptions[index];
        if (!description) return;
        paragraph.dataset.en = description.en;
        paragraph.dataset.es = description.es;
    });

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
        attributionControl: true,
        minZoom: 10,
        maxZoom: 14
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

    map.setMinZoom(10);
    map.setMaxZoom(14);
    applyMapFilter('all');
}
