function addPasswordToggleListeners() {
    // Select all toggle password buttons
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');

    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Locate the input field within the same input-container
            const inputContainer = btn.closest('.input-container');
            const input = inputContainer.querySelector('input[type="password"], input[type="text"]');
            const icon = btn.querySelector('.toggle-password-icon');

            // Toggle the input type and icon class
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.replace('bi-eye', 'bi-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.replace('bi-eye-slash', 'bi-eye');
            }
        });
    });
}

// Initialize password toggle listeners
addPasswordToggleListeners();