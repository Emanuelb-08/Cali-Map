// Language switching functionality
document.addEventListener('DOMContentLoaded', function() {
    const langBtns = document.querySelectorAll('.lang-btn');
    let currentLang = localStorage.getItem('language') || 'en';

    // Set initial language
    setLanguage(currentLang);
    updateButtonStates();

    // Add click listeners to language buttons
    langBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            currentLang = this.getAttribute('data-lang');
            localStorage.setItem('language', currentLang);
            setLanguage(currentLang);
            updateButtonStates();
        });
    });

    function setLanguage(lang) {
        document.documentElement.lang = lang;

        // Update all elements with data-en and data-es attributes
        document.querySelectorAll('[data-en][data-es]').forEach(element => {
            if (lang === 'es') {
                element.textContent = element.getAttribute('data-es');
            } else {
                element.textContent = element.getAttribute('data-en');
            }
        });

        // Update map labels and popups if the map has already been initialized
        if (window.mapInstance) {
            renderMapMarkers(lang);
        }
    }

    function updateButtonStates() {
        langBtns.forEach(btn => {
            if (btn.getAttribute('data-lang') === currentLang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
});

// Credits Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    const creditsBtn = document.getElementById('creditsBtn');
    const creditsModal = document.getElementById('creditsModal');
    const closeBtn = document.querySelector('.close-btn');

    // Open modal when button is clicked
    if (creditsBtn) {
        creditsBtn.addEventListener('click', function() {
            creditsModal.classList.add('show');
        });
    }

    // Close modal when close button is clicked
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            creditsModal.classList.remove('show');
        });
    }

    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target === creditsModal) {
            creditsModal.classList.remove('show');
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && creditsModal.classList.contains('show')) {
            creditsModal.classList.remove('show');
        }
    });
});

// Horizontal slider functionality
function scrollSlide(event, direction) {
    const button = event.target;
    const slider = button.closest('.horizontal-slider');
    const container = slider.querySelector('.slider-container');
    const slideWidth = container.querySelector('.slide').offsetWidth + 20; // Including gap

    container.scrollBy({
        left: direction * slideWidth,
        behavior: 'smooth'
    });
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Map initialization with Leaflet
const caliPoints = [
    {
        name: { en: "Simón Bolívar Monument", es: "Monumento a Simón Bolívar" },
        category: { en: "Edifications", es: "Edificaciones" },
        coords: [3.4388, -76.5215],
        description: {
            en: "Historic monument in the CAM plaza.",
            es: "Monumento histórico en la plaza del CAM."
        }
    },
    {
        name: { en: "La Ermita", es: "La Ermita" },
        category: { en: "Edifications", es: "Edificaciones" },
        coords: [3.4313, -76.5273],
        description: {
            en: "Historic church near the Cali River.",
            es: "Iglesia histórica cerca del río Cali."
        }
    },
    {
        name: { en: "Solidarity Monument", es: "Monumento a la Solidaridad" },
        category: { en: "Edifications", es: "Edificaciones" },
        coords: [3.4317, -76.5156],
        description: {
            en: "Cultural sculpture symbolizing Cali's unity.",
            es: "Escultura cultural que simboliza la unidad de Cali."
        }
    },
    {
        name: { en: "Plazoleta Jairo Varela", es: "Plazoleta Jairo Varela" },
        category: { en: "Parks", es: "Parques" },
        coords: [3.4517, -76.5307],
        description: {
            en: "Plaza with music, culture and gastronomy.",
            es: "Plaza con música, cultura y gastronomía."
        }
    },
    {
        name: { en: "Cat Park", es: "Parque de los Gatos" },
        category: { en: "Parks", es: "Parques" },
        coords: [3.4449, -76.5616],
        description: {
            en: "Urban art and feline-themed park.",
            es: "Arte urbano y parque temático felino."
        }
    },
    {
        name: { en: "Parque Artesanal Loma de La Cruz", es: "Parque Artesanal Loma de La Cruz" },
        category: { en: "Parks", es: "Parques" },
        coords: [3.4716, -76.5497],
        description: {
            en: "Crafts, culture and local stories.",
            es: "Artesanías, cultura e historias locales."
        }
    },
    {
        name: { en: "Salsa Museum", es: "Museo de la Salsa" },
        category: { en: "Locations", es: "Ubicaciones" },
        coords: [3.4432, -76.5067],
        description: {
            en: "World-famous museum of salsa culture.",
            es: "Museo mundialmente reconocido de la cultura de la salsa."
        }
    },
    {
        name: { en: "Cali Zoo", es: "Zoológico de Cali" },
        category: { en: "Locations", es: "Ubicaciones" },
        coords: [3.4432, -76.5598],
        description: {
            en: "Nature and biodiversity experience.",
            es: "Experiencia de naturaleza y biodiversidad."
        }
    },
    {
        name: { en: "Caliwood Museum of Cinematography", es: "Museo de Cinematografía Caliwood" },
        category: { en: "Locations", es: "Ubicaciones" },
        coords: [3.4012, -76.5536],
        description: {
            en: "Museum of filmmaking and cinema heritage.",
            es: "Museo del cine y del patrimonio cinematográfico."
        }
    },
    {
        name: { en: "Christ the King Monument", es: "Monumento a Cristo Rey" },
        category: { en: "Viewpoints", es: "Miradores" },
        coords: [3.4367, -76.5662],
        description: {
            en: "Panoramic city viewpoint and monument.",
            es: "Mirador panorámico de la ciudad y monumento."
        }
    },
    {
        name: { en: "Sebastián de Belalcázar Viewpoint", es: "Mirador Sebastián de Belalcázar" },
        category: { en: "Viewpoints", es: "Miradores" },
        coords: [3.4480, -76.5302],
        description: {
            en: "Historical viewpoint with city views.",
            es: "Mirador histórico con vistas de la ciudad."
        }
    },
    {
        name: { en: "Cerro de las Tres Cruces", es: "Cerro de las Tres Cruces" },
        category: { en: "Viewpoints", es: "Miradores" },
        coords: [3.4568, -76.5483],
        description: {
            en: "Iconic monument and broad panoramic view.",
            es: "Monumento icónico con una amplia vista panorámica."
        }
    }
];

const categoryColors = {
    Edifications: "#dc3545",
    Parks: "#28a745",
    Locations: "#ffc107",
    Viewpoints: "#17a2b8"
};

let mapInstance = null;
let mapMarkers = [];

function renderMapMarkers(lang = localStorage.getItem('language') || 'en') {
    if (!mapInstance) return;

    mapMarkers.forEach((marker) => mapInstance.removeLayer(marker));
    mapMarkers = [];

    caliPoints.forEach((place) => {
        const localizedName = place.name[lang] || place.name.en;
        const localizedCategory = place.category[lang] || place.category.en;
        const localizedDescription = place.description[lang] || place.description.en;
        const baseCategoryKey = place.category.en;

        const marker = L.circleMarker(place.coords, {
            radius: 9,
            color: "#ffffff",
            weight: 1.5,
            fillColor: categoryColors[baseCategoryKey] || "#6c757d",
            fillOpacity: 0.9
        }).addTo(mapInstance);

        marker.bindPopup(`
            <strong>${localizedName}</strong><br>
            <em>${localizedCategory}</em><br>
            ${localizedDescription}
        `);

        mapMarkers.push(marker);
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const mapElement = document.getElementById("map");
    if (mapElement) {
        mapInstance = L.map("map").setView([3.4516, -76.5319], 12);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors"
        }).addTo(mapInstance);

        renderMapMarkers(localStorage.getItem('language') || 'en');
    }
});
