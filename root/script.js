        // JavaScript for handling the modal and form submission
        function showModal(title, message) {
            const modal = document.getElementById('message-modal');
            const modalTitle = document.getElementById('modal-title');
            const modalMessage = document.getElementById('modal-message');

            modalTitle.textContent = title;
            modalMessage.textContent = message;
            modal.classList.remove('hidden');
            setTimeout(() => {
                modal.firstElementChild.classList.remove('scale-95', 'opacity-0');
                modal.firstElementChild.classList.add('scale-100', 'opacity-100');
            }, 10);
        }

        function closeModal() {
            const modal = document.getElementById('message-modal');
            modal.firstElementChild.classList.remove('scale-100', 'opacity-100');
            modal.firstElementChild.classList.add('scale-95', 'opacity-0');
            setTimeout(() => {
                modal.classList.add('hidden');
            }, 300);
        }

        // Toggles between the sign-up and login forms
        function showLogin() {
            document.getElementById('signup-container').classList.add('hidden');
            document.getElementById('login-container').classList.remove('hidden');
        }

        function showSignup() {
            document.getElementById('login-container').classList.add('hidden');
            document.getElementById('signup-container').classList.remove('hidden');
        }

        // Handle the Sign Up form submission
        document.getElementById('signup-form').addEventListener('submit', function(event) {
            event.preventDefault();
            const role = document.getElementById('signup-role').value;
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            if (password !== confirmPassword) {
                showModal('Password Mismatch', 'The passwords you entered do not match. Please try again.');
                return;
            }

            console.log('Sign Up Form submitted:', { role, username, email });
            showModal('Success!', `Sign up successful for role: ${role}. (This is a demo, no data was sent).`);
        });

        // Handle the Login form submission
        document.getElementById('login-form').addEventListener('submit', function(event) {
            event.preventDefault();
            const role = document.getElementById('login-role').value;
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            console.log('Login Form submitted:', { role, email });
            showModal('Success!', `Login successful for role: ${role}. (This is a demo, no data was sent).`);
        });

        // Handle the Google Sign In button click
        document.getElementById('google-signin').addEventListener('click', function() {
            console.log('Google Sign In button clicked.');
            showModal('Google Sign In', 'This feature is a placeholder. In a real app, a Google sign-in window would pop up.');
        });
