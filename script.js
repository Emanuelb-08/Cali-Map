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
        name: "Simón Bolívar Monument",
        category: "Edifications",
        coords: [3.4388, -76.5215],
        description: "Historic monument in the CAM plaza."
    },
    {
        name: "La Ermita",
        category: "Edifications",
        coords: [3.4313, -76.5273],
        description: "Historic church near the Cali River."
    },
    {
        name: "Solidarity Monument",
        category: "Edifications",
        coords: [3.4317, -76.5156],
        description: "Cultural sculpture symbolizing Cali's unity."
    },
    {
        name: "Plazoleta Jairo Varela",
        category: "Parks",
        coords: [3.4517, -76.5307],
        description: "Plaza with music, culture and gastronomy."
    },
    {
        name: "Cat Park",
        category: "Parks",
        coords: [3.4449, -76.5616],
        description: "Urban art and feline-themed park."
    },
    {
        name: "Parque Artesanal Loma de La Cruz",
        category: "Parks",
        coords: [3.4716, -76.5497],
        description: "Crafts, culture and local stories."
    },
    {
        name: "Salsa Museum",
        category: "Locations",
        coords: [3.4432, -76.5067],
        description: "World-famous museum of salsa culture."
    },
    {
        name: "Cali Zoo",
        category: "Locations",
        coords: [3.4432, -76.5598],
        description: "Nature and biodiversity experience."
    },
    {
        name: "Caliwood Museum of Cinematography",
        category: "Locations",
        coords: [3.4012, -76.5536],
        description: "Museum of filmmaking and cinema heritage."
    },
    {
        name: "Monumento a Cristo Rey",
        category: "Viewpoints",
        coords: [3.4367, -76.5662],
        description: "Panoramic city viewpoint and monument."
    },
    {
        name: "Sebastián de Belalcázar Viewpoint",
        category: "Viewpoints",
        coords: [3.4480, -76.5302],
        description: "Historical viewpoint with city views."
    },
    {
        name: "Cerro de las Tres Cruces",
        category: "Viewpoints",
        coords: [3.4568, -76.5483],
        description: "Iconic monument and broad panoramic view."
    }
];

const categoryColors = {
    Edifications: "#dc3545",
    Parks: "#28a745",
    Locations: "#ffc107",
    Viewpoints: "#17a2b8"
};

document.addEventListener("DOMContentLoaded", function () {
    const mapElement = document.getElementById("map");
    if (mapElement) {
        const map = L.map("map").setView([3.4516, -76.5319], 12);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors"
        }).addTo(map);

        caliPoints.forEach((place) => {
            const marker = L.circleMarker(place.coords, {
                radius: 9,
                color: "#ffffff",
                weight: 1.5,
                fillColor: categoryColors[place.category] || "#6c757d",
                fillOpacity: 0.9
            }).addTo(map);

            marker.bindPopup(`
                <strong>${place.name}</strong><br>
                <em>${place.category}</em><br>
                ${place.description}
            `);
        });
    }
});
