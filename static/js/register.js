const state = {
    currentSection: 1,
    storedData: [],
};

const warning = document.querySelector('#warning');
const inputGroup = document.querySelector('#inputGroup');
const nextBtn = document.querySelector('#nextBtn');
const prevBtn = document.querySelector('#prevBtn');
const submitBtn = document.querySelector('#submitBtn');
const defaultTransitionDuration = 250;

const sections = [
    {
        id: '1',
        name: 'first-section',
        inputs: [
            { id: 'email', type: 'email', icon: 'bi bi-envelope', label: 'Email', placeholder: 'Enter your Email', required: true },
            { id: 'password', type: 'password', icon: 'bi bi-key', label: 'Password', placeholder: 'Enter your Password', required: true },
            { id: 'confirmPassword', type: 'password', icon: 'bi bi-key', label: 'Confirm Password', placeholder: 'Re-enter your Password', required: true },
        ],
    },
    {
        id: '2',
        name: 'second-section',
        inputs: [
            { id: 'firstName', type: 'text', label: 'First Name', placeholder: 'Enter your first name', icon: 'bi bi-person', required: true },
            { id: 'lastName', type: 'text', label: 'Last Name', placeholder: 'Enter your last name', icon: 'bi bi-person', required: true },
            { id: 'username', type: 'text', label: 'Username', placeholder: 'Enter your username', icon: 'bi bi-hash', required: true },
        ],
    },
];

function checkFieldsValidity() {

    warning.innerText = '';

    const section = sections.find(sec => sec.id === `${state.currentSection}`);
    let allValid = true;

    // Email and password fields for extra validation
    const passwordFields = section.inputs.filter(input => input.type === 'password');
    const passwords = [];

    section.inputs.forEach(input => {
        const inputField = document.querySelector(`#${input.id}`);
        inputField.value = inputField.value.trim();

        if (input.required && !inputField.value) {
            inputField.classList.add('invalid');
            allValid = false;
        } else {
            inputField.classList.remove('invalid');
        }

        // Additional validation for email
        if (input.type === 'email') {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(inputField.value)) {
                warning.innerText = `Invalid email format: ${inputField.value}`;
                inputField.classList.add('invalid');
                allValid = false;
            }
        }

        // Collect password values for comparison
        if (input.type === 'password') {
            passwords.push(inputField.value);
        }
    });

    // Check if all password fields matches
    if (passwordFields.length > 1 && new Set(passwords).size !== 1) {
        warning.innerText = 'Passwords do not match!';
        allValid = false;
    }

    return allValid;
}

function createInputHTML({ type, icon, label, placeholder, id, required }) {
    const passwordToggler = type === 'password' ? `
        <div class="icon">
            <button type="button" class="btn outline-transparent toggle-password">
                <i class="bi bi-eye toggle-password-icon"></i>
            </button>
        </div>` : '';

    return `
        <div class="input-wrapper">
            <div class="input-header">
                <p class="phantom-regular">${label}</p>
            </div>
            <div class="input-container">
                <div class="icon">
                    <i class="${icon}"></i>
                </div>  
                <div class="input">
                    <input type="${type}" id="${id}" name="${id}" ${required ? 'required' : ''} 
                           aria-describedby="${id}" placeholder="${placeholder}">
                </div>  
                ${passwordToggler}
            </div>
        </div>`;
}

function injectSection(sectionId, transitionDuration = defaultTransitionDuration) {
    const section = sections.find(sec => sec.id === `${sectionId}`);
    if (!section) return;

    const fragment = document.createDocumentFragment();
    section.inputs.forEach(input => {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = createInputHTML(input);
        fragment.appendChild(wrapper.firstElementChild);
    });

    inputGroup.style.opacity = 0;

    setTimeout(() => {
        inputGroup.innerHTML = '';
        inputGroup.appendChild(fragment);

        state.currentSection = sectionId;
        restoreData(section);

        inputGroup.style.opacity = 1;

        //if (transitionDuration === 0) { // Initial load
        //    addPasswordToggleListeners();
        //}
        addPasswordToggleListeners();

    }, transitionDuration);
}

function restoreData(section) {
    section.inputs.forEach(input => {
        const inputField = document.querySelector(`#${input.id}`);
        const stored = state.storedData.find(data => data.id === input.id);
        if (stored) inputField.value = stored.value;
    });
}

function storeData(section) {
    section.inputs.forEach(input => {
        const inputField = document.querySelector(`#${input.id}`);
        const stored = state.storedData.find(data => data.id === input.id);
        if (stored) {
            stored.value = inputField.value;
        } else {
            state.storedData.push({ id: input.id, value: inputField.value });
        }
    });
}

function toggleSubmitButton() {

    nextBtn.classList.toggle('opacity-0');
    submitBtn.classList.toggle('opacity-0');

    setTimeout(() => {
        nextBtn.classList.toggle('opacity-0');
        submitBtn.classList.toggle('opacity-0');
        nextBtn.classList.toggle('d-none');
        submitBtn.classList.toggle('d-none');
    }, defaultTransitionDuration);
}

function nextSection(e) {
    e.preventDefault();

    if (!checkFieldsValidity()) return;

    const currentSection = sections.find(sec => sec.id === `${state.currentSection}`);
    storeData(currentSection);

    if (state.currentSection < sections.length) {
        state.currentSection += 1;
        injectSection(state.currentSection);
    }

    if (state.currentSection === sections.length) {
        toggleSubmitButton();
    }
}

function prevSection(e) {
    e.preventDefault();

    const currentSection = sections.find(sec => sec.id === `${state.currentSection}`);
    storeData(currentSection);

    if (state.currentSection === sections.length) {
        toggleSubmitButton();
    }

    if (state.currentSection > 1) {
        state.currentSection -= 1;
        injectSection(state.currentSection);
    }
}

injectSection(state.currentSection, 0); // Initial load

// POST all data to /api/register/ endpoint on submitting
async function submitData(e) {
    e.preventDefault();
    if (!checkFieldsValidity()) return;

    const data = {};
    storeData(sections.find(sec => sec.id === `${state.currentSection}`));

    sections.forEach(section => {
        section.inputs.forEach(input => {
            data[input.id] = state.storedData.find(data => data.id === input.id).value;
        });
    })

    const baseUrl = `${window.location.origin}`; // Dynamically gets the base URL

    await fetch(`${baseUrl}/api/register`, { // Use dynamic base URL
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    })
        .then(response => {
            if (!response.ok) {
                return response.body.getReader().read().then(({ value }) => {
                    const message = new TextDecoder().decode(value);

                    // Display error message
                    showToast(
                        'Error',
                        ['bi', 'bi-x-circle'],
                        'Registration failed!',
                        'red-color',
                        10000,
                        message
                    )

                    throw new Error(`Failed to register: ${response.status} ${response.statusText} ${message}`);
                });

            } else {
                // Redirect to login page on successful registration
                if (response.ok) {

                    // Show toast message
                    showToast(
                        'Success',
                        ['bi', 'bi-check-circle'],
                        'Registration successful!',
                        'green-color',
                        2000,
                        'You can now login with your credentials. Redirecting...'
                    );

                    setTimeout(() => {
                        window.location.href = `${baseUrl}/login`; // Use dynamic base URL
                    }, 2000);
                }
            }
        }).catch(
            error => {
                console.error(error);
            }
        )

}


submitBtn.addEventListener('click', submitData);
nextBtn.addEventListener('click', nextSection);
prevBtn.addEventListener('click', prevSection);