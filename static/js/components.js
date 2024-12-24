
const componentsDir = '../static/components';

function includeHTML(component, elementId) {
    fetch(`${componentsDir}/${component}.html`)
        .then(response => {
            if (!response.ok) throw new Error(`Failed to load ${file}`);
            return response.text();
        })
        .then(html => {
            document.getElementById(elementId).innerHTML = html;
        })
        .catch(err => console.error(err));
}

includeHTML('navbar', 'navbar');
includeHTML('sidebar', 'sidebar');