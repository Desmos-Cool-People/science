document.addEventListener('DOMContentLoaded', () => {
    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.add(currentTheme);

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        document.body.classList.toggle('light');
        const newTheme = document.body.classList.contains('dark') ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
    });

    // Handle form submission
    const form = document.getElementById('json-form');
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const days = form.elements['days'].value.split(',').map(day => day.trim());
        const resistance = {
            a: form.elements['resistance-a'].value,
            b: form.elements['resistance-b'].value,
            c: form.elements['resistance-c'].value
        };
        const result = () => {
            rv = form.elements['result'].value.toLowerCase().trim()
            possibilities = {
                'large increase': 1,
                'increase': 2,
                'large decrease': 3,
                'decrease': 4,
                'no change': 0
            }
            return possibilities[rv];
        };

        const jsonData = {
            days,
            resistance,
            result: result()
        };
        fetch ('/data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonData)
        })
    });
});
