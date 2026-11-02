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
