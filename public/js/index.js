document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.add(currentTheme);

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        document.body.classList.toggle('light');
        const newTheme = document.body.classList.contains('dark') ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
    });

    fetch('/data')
        .then(response => response.json())
        .then(data => {
            const { days, cost, resistance, result, timestamp } = data;
            const dataDisplay = document.getElementById('data-display');

            const formatData = () => {
                const possiblePils = {
                    'a1': 'A - Large',
                    'a2': 'A - Small',
                    'b1': 'B - Large',
                    'b2': 'B - Small',
                    'c1': 'C - Large',
                    'c2': 'C - Small'
                };
                const week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                const possibleResults = ['No Change', 'Large Increase', 'Increase', 'Large Decrease', 'Decrease'];
                const submitTime = timestamp.toLocaleString('en-US', {timeZone: 'America/Los_Angeles'})
                return { possiblePils, week, possibleResults, submitTime };
            }

            const { possiblePils, week, possibleResults, submitTime } = formatData();

            const daysList = days.map((day, index) => `<li>${week[index]}: ${possiblePils[day]}</li>`).join('');
            const resistanceList = Object.entries(resistance).map(([key, value]) => `<li>${key}: ${value}</li>`).join('');

            const updateDisplay = (cost, sideEffectLevel, result) => {
                dataDisplay.innerHTML = `
                    <div class="card">
                        <h2>Treatment Regimen:</h2>
                        <ul>${daysList}</ul>
                    </div>
                    <div class="card">
                        <h2>Cost:</h2>
                        <p>$${cost}</p>
                    </div>
                    <div class="card">
                        <h2>Resistance:</h2>
                        <ul>${resistanceList}</ul>
                    </div>
                    <div class="card">
                        <h2>Result:</h2>
                        <p>${possibleResults[result]}</p>
                    </div>
                    <div class="card">
                        <h2>Time submitted:</h2>
                        <p>${submitTime}</p>
                    </div>
                `;
            };

            updateDisplay(cost, days.length - 1, result);

            // Populate the table with data
            const tableBody = document.querySelector('#sortable-table tbody');
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${cost}</td>
                <td>${days.length - 1}</td>
                <td>${possibleResults[result]}</td>
                <td>${submitTime}</td>
            `;
            tableBody.appendChild(row);

            // Initialize tablesorter
            $.tablesorter.addParser({
                id: 'sideEffect',
                is: function(s) {
                    return false;
                },
                format: function(s) {
                    return parseInt(s, 10);
                },
                type: 'numeric'
            });

            $.tablesorter.addParser({
                id: 'endingResult',
                is: function(s) {
                    return false;
                },
                format: function(s) {
                    const mapping = {
                        'No Change': 0,
                        'Large Increase': 1,
                        'Increase': 2,
                        'Decrease': 3,
                        'Large Decrease': 4
                    };
                    return mapping[s] !== undefined ? mapping[s] : s;
                },
                type: 'numeric'
            });

            $("#sortable-table").tablesorter({
                headers: {
                    1: { sorter: 'sideEffect' },
                    2: { sorter: 'endingResult' }
                }
            });

            // Add click event listener to rows
            $('#sortable-table tbody').on('click', 'tr', function() {
                const rowData = $(this).children('td').map(function() {
                    return $(this).text();
                }).get();
                updateDisplay(rowData[0], rowData[1], possibleResults.indexOf(rowData[2]));
            });
        })
        .catch(error => console.error('Error fetching data:', error));
});
