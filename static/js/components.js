const baseURL = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '');
const componentsDir = `${baseURL}/static/components`;

function includeHTML(component, elementId) {
    fetch(`${componentsDir}/${component}.html`)
        .then(response => {
            if (!response.ok) throw new Error(`Failed to load ${component}`);
            return response.text();
        })
        .then(html => {
            document.getElementById(elementId).innerHTML = html;
        })
        .catch(err => console.error(err));
}

includeHTML('navbar', 'navbar');
includeHTML('sidebar', 'sidebar');