// Initialize Leaflet map
var map = L.map('mapContainer').setView([51.505, -0.09], 13);
let dataLayer;

// Use an alternate tile server that supports subdomains for better performance
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: ['a', 'b', 'c']  // Load from multiple subdomains for faster performance
}).addTo(map);

function go_button_onclick() {
    var country = document.getElementById("country").value;
    var admin_level = document.getElementById("admin level").value;
    var data_type = document.getElementById("data type").value;
    console.log("country: " + country);
    console.log("admin level: " + admin_level);
    console.log("data type: " + data_type);

    const csvData = `Name,Latitude,Longitude
Big Ben,51.500729,-0.124625
London Eye,51.503399,-0.119519
Tower Bridge,51.505456,-0.075356
Buckingham Palace,51.501364,-0.141890
British Museum,51.519459,-0.126931`;

    const geojsonData = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "properties": {"name": "Big Ben"},
                "geometry": {"type": "Point", "coordinates": [-0.124625, 51.500729]}
            },
            {
                "type": "Feature",
                "properties": {"name": "London Eye"},
                "geometry": {"type": "Point", "coordinates": [-0.119519, 51.503399]}
            },
            {
                "type": "Feature",
                "properties": {"name": "Tower Bridge"},
                "geometry": {"type": "Point", "coordinates": [-0.075356, 51.505456]}
            },
            {
                "type": "Feature",
                "properties": {"name": "Buckingham Palace"},
                "geometry": {"type": "Point", "coordinates": [-0.141890, 51.501364]}
            },
            {
                "type": "Feature",
                "properties": {"name": "British Museum"},
                "geometry": {"type": "Point", "coordinates": [-0.126931, 51.519459]}
            }
        ]
    };

    const isGeojson = data_type.toLowerCase() === 'geojson';
    const tableData = isGeojson ? geojsonToTable(geojsonData) : parseCSVToTable(csvData);
    
    document.getElementById('tableContainer').innerHTML = ""; // Clear the previous content
    document.getElementById('tableContainer').appendChild(tableData); // Append the new table
    initMap(isGeojson ? geojsonData : csvData, isGeojson);
}

function initMap(data, isGeojson) {
    if (!map) {
        map = L.map('mapContainer').setView([51.505, -0.09], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            subdomains: ['a', 'b', 'c']
        }).addTo(map);
    }

    if (dataLayer) {
        map.removeLayer(dataLayer);
    }

    if (isGeojson) {
        dataLayer = L.geoJSON(data, {
            pointToLayer: function(feature, latlng) {
                return L.marker(latlng);
            },
            onEachFeature: function(feature, layer) {
                if (feature.properties && feature.properties.name) {
                    layer.bindPopup(feature.properties.name);
                }
            }
        });
    } else {
        dataLayer = L.layerGroup();
        const rows = data.split('\n');
        for (let i = 1; i < rows.length; i++) {
            let [name, lat, lng] = rows[i].split(',');
            L.marker([parseFloat(lat), parseFloat(lng)])
                .bindPopup(name)
                .addTo(dataLayer);
        }
    }

    dataLayer.addTo(map);

    map.fitBounds(dataLayer.getBounds());
}

function geojsonToTable(geojson) {
    let table = document.createElement('table');
    table.className = 'table table-zebra';

    let headerRow = table.insertRow();
    ['Name', 'Latitude', 'Longitude'].forEach(header => {
        let th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    geojson.features.forEach(feature => {
        let row = table.insertRow();
        let nameCell = row.insertCell();
        nameCell.textContent = feature.properties.name;
        let latCell = row.insertCell();
        latCell.textContent = feature.geometry.coordinates[1];
        let lngCell = row.insertCell();
        lngCell.textContent = feature.geometry.coordinates[0];
    });

    return table;
}

function parseCSVToTable(csv) {
    const rows = csv.split('\n');
    
    // Create a table element
    let table = document.createElement('table');
    table.className = 'table table-zebra'; // Using DaisyUI classes

    // Create table header
    let headerRow = table.insertRow();
    let headers = rows[0].split(',');
    headers.forEach(header => {
        let th = document.createElement('th');
        th.textContent = header.trim();
        headerRow.appendChild(th);
    });

    // Create table body
    for (let i = 1; i < rows.length; i++) {
        let row = table.insertRow();
        let cells = rows[i].split(',');
        cells.forEach(cell => {
            let td = row.insertCell();
            td.textContent = cell.trim();
        });
    }

    return table;
}