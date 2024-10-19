function go_button_onclick() {
    var country = document.getElementById("country").value;
    var admin_level = document.getElementById("admin level").value;
    var data_type = document.getElementById("data type").value;

    console.log("country: " + country);
    console.log("admin level: " + admin_level);
    console.log("data type: " + data_type);

    // Test data for table display
    const csvData = `Name,Age,City
    John Doe,30,New York
    Jane Smith,25,Los Angeles
    Bob Johnson,35,Chicago`;

    const table = parseCSVToTable(csvData);
    document.getElementById('tableContainer').innerHTML = ""; // Clear the previous content
    document.getElementById('tableContainer').appendChild(table); // Append the new table

    // Initialize Leaflet map
    var map = L.map('mapContainer').setView([51.505, -0.09], 13);

    // Use an alternate tile server that supports subdomains for better performance
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: ['a', 'b', 'c']  // Load from multiple subdomains for faster performance
    }).addTo(map);
}

function parseCSVToTable(csv) {
    // Split the CSV string into rows
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
