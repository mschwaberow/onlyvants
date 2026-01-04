// Password Protection for OnlyVants
// Simple client-side protection
// Version: 1.1 - Enhanced mobile support and error handling

document.addEventListener('DOMContentLoaded', function () {
    console.log('OnlyVants: DOM loaded, starting auth check');

    // Configuration
    const PASSWORD_HASH = '60157f96ec93c5b855d8c9624327407881f5cd82dbe228c77444c630f7abf592'; // Rambler2025
    const SESSION_KEY = 'onlyvants_auth';
    const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

    // Check if already authenticated
    function isAuthenticated() {
        try {
            const authData = localStorage.getItem(SESSION_KEY);
            if (!authData) return false;

            const { timestamp } = JSON.parse(authData);
            const now = Date.now();

            if (now - timestamp < SESSION_DURATION) {
                return true;
            } else {
                localStorage.removeItem(SESSION_KEY);
                return false;
            }
        } catch (e) {
            return false;
        }
    }

    // Hash password
    async function hashPassword(password) {
        // Check if crypto.subtle is available
        if (!window.crypto || !window.crypto.subtle) {
            console.error('OnlyVants: Web Crypto API not available. Site must be accessed via HTTPS.');
            throw new Error('Secure context required. Please access this site via HTTPS.');
        }

        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // Verify password
    async function verifyPassword(password) {
        const hash = await hashPassword(password);
        return hash === PASSWORD_HASH;
    }

    // Save auth
    function saveAuth() {
        localStorage.setItem(SESSION_KEY, JSON.stringify({ timestamp: Date.now() }));
    }

    // Show password screen
    function showPasswordScreen() {
        console.log('OnlyVants: Creating password screen');

        // Hide main content
        document.body.style.visibility = 'hidden';

        // Create overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #0F1419 0%, #1A1F26 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            font-family: 'Inter', sans-serif;
            visibility: visible;
        `;

        overlay.innerHTML = `
            <div style="background: #1A1F26; border-radius: 24px; padding: 3rem; max-width: 450px; width: 90%; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8); border: 1px solid rgba(255, 255, 255, 0.1); text-align: center;">
                <div style="margin-bottom: 2rem;">
                    <h1 style="font-size: 2rem; font-weight: 800; background: linear-gradient(135deg, #00AFF0 0%, #0095D1 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0;">OnlyVants</h1>
                </div>
                <div style="font-size: 4rem; margin-bottom: 1rem;">🔒</div>
                <h2 style="font-size: 1.75rem; margin-bottom: 0.5rem; color: #FFFFFF;">Private Content</h2>
                <p style="color: #8899A6; margin-bottom: 1.5rem;">This is a private parody site. Please enter the password to continue.</p>
                <form id="password-form">
                    <input type="password" id="password-input" placeholder="Enter password" required style="width: 100%; padding: 1rem 1.5rem; font-size: 1rem; border: 2px solid rgba(255, 255, 255, 0.1); border-radius: 12px; background: rgba(255, 255, 255, 0.05); color: #FFFFFF; font-family: inherit; margin-bottom: 1rem;">
                    <button type="submit" style="width: 100%; padding: 1rem 2rem; font-size: 1rem; font-weight: 600; background: linear-gradient(135deg, #00AFF0 0%, #0095D1 100%); color: white; border: none; border-radius: 12px; cursor: pointer; font-family: inherit;">Unlock</button>
                    <p id="password-error" style="color: #FF006B; font-size: 0.9rem; margin-top: 1rem; min-height: 1.5rem;"></p>
                </form>
            </div>
        `;

        document.body.appendChild(overlay);
        console.log('OnlyVants: Password screen created');

        // Handle form
        const form = document.getElementById('password-form');
        const input = document.getElementById('password-input');
        const error = document.getElementById('password-error');
        const submitBtn = form.querySelector('button[type="submit"]');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('OnlyVants: Form submitted');

            const password = input.value;

            // Disable button and show loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Verifying...';
            error.textContent = '';

            try {
                console.log('OnlyVants: Verifying password...');
                const isValid = await verifyPassword(password);
                console.log('OnlyVants: Password valid:', isValid);

                if (isValid) {
                    saveAuth();
                    submitBtn.textContent = 'Success!';
                    overlay.style.opacity = '0';
                    overlay.style.transition = 'opacity 0.5s';
                    setTimeout(() => {
                        overlay.remove();
                        document.body.style.visibility = 'visible';
                    }, 500);
                } else {
                    error.textContent = 'Incorrect password. Try again!';
                    input.value = '';
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Unlock';
                }
            } catch (err) {
                console.error('OnlyVants: Error during verification:', err);
                error.textContent = 'Error verifying password. Please try again.';
                submitBtn.disabled = false;
                submitBtn.textContent = 'Unlock';
            }
        });

        input.focus();
    }

    // Main logic
    if (!isAuthenticated()) {
        console.log('OnlyVants: Not authenticated, showing password screen');
        showPasswordScreen();
    } else {
        console.log('OnlyVants: Already authenticated');
    }
});
