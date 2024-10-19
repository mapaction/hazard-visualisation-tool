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

    // Determine file path based on data type
    const filePath = data_type.toLowerCase() === 'geojson' ? './assets/data/lebanon-draft-01.json' : './assets/data/lebanon-draft-01.csv';

    // Load data from file
    loadDataFromFile(filePath, data_type.toLowerCase());
}

function loadDataFromFile(filePath, dataType) {
    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return dataType === 'geojson' ? response.json() : response.text();
        })
        .then(data => {
            processData(data, dataType);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error.message);
        });
}

function processData(data, dataType) {
    const isGeojson = dataType === 'geojson';
    const tableData = isGeojson ? geojsonToTable(data) : parseCSVToTable(data);
    
    // Display table
    document.getElementById('tableContainer').innerHTML = "";
    document.getElementById('tableContainer').appendChild(tableData);

    // Update map
    initMap(data, isGeojson);
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

    // Create new data layer
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

    // Add the new data layer to the map
    dataLayer.addTo(map);

    // Fit the map bounds to the new data layer
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