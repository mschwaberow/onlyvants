// Password Protection for OnlyVants
// This is client-side protection - suitable for keeping casual visitors out

(function () {
    'use strict';

    // Configuration
    const CONFIG = {
        // SHA-256 hash of the password "jimvant2024"
        // To change password, generate new hash at: https://emn178.github.io/online-tools/sha256.html
        passwordHash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
        sessionDuration: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
        storageKey: 'onlyvants_auth'
    };

    // Check if user is already authenticated
    function isAuthenticated() {
        const authData = localStorage.getItem(CONFIG.storageKey);
        if (!authData) return false;

        try {
            const { timestamp } = JSON.parse(authData);
            const now = Date.now();

            // Check if session is still valid
            if (now - timestamp < CONFIG.sessionDuration) {
                return true;
            } else {
                // Session expired
                localStorage.removeItem(CONFIG.storageKey);
                return false;
            }
        } catch (e) {
            return false;
        }
    }

    // Hash password using SHA-256
    async function hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }

    // Verify password
    async function verifyPassword(password) {
        const hash = await hashPassword(password);
        return hash === CONFIG.passwordHash;
    }

    // Save authentication
    function saveAuth() {
        const authData = {
            timestamp: Date.now()
        };
        localStorage.setItem(CONFIG.storageKey, JSON.stringify(authData));
    }

    // Show password prompt
    function showPasswordPrompt() {
        // Hide main content
        document.body.style.display = 'none';

        // Create password overlay
        const overlay = document.createElement('div');
        overlay.id = 'password-overlay';
        overlay.innerHTML = `
            <div class="password-container">
                <div class="password-header">
                    <h1>OnlyVants</h1>
                    <span class="logo-badge">Premium</span>
                </div>
                <div class="password-content">
                    <div class="lock-icon-big">🔒</div>
                    <h2>Private Content</h2>
                    <p>This is a private parody site. Please enter the password to continue.</p>
                    <form id="password-form">
                        <input 
                            type="password" 
                            id="password-input" 
                            placeholder="Enter password"
                            autocomplete="off"
                            required
                        >
                        <button type="submit" class="password-submit">Unlock</button>
                        <p class="password-error" id="password-error"></p>
                    </form>
                    <p class="password-hint">Hint: It's Jim's name + the year 2024</p>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            #password-overlay {
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
                animation: fadeIn 0.5s ease;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            .password-container {
                background: #1A1F26;
                border-radius: 24px;
                padding: 3rem;
                max-width: 450px;
                width: 90%;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
                border: 1px solid rgba(255, 255, 255, 0.1);
                text-align: center;
            }
            
            .password-header {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 1rem;
                margin-bottom: 2rem;
            }
            
            .password-header h1 {
                font-size: 2rem;
                font-weight: 800;
                background: linear-gradient(135deg, #00AFF0 0%, #0095D1 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                margin: 0;
            }
            
            .password-header .logo-badge {
                background: linear-gradient(135deg, #FF006B 0%, #9B59B6 100%);
                color: white;
                padding: 0.25rem 0.75rem;
                border-radius: 20px;
                font-size: 0.75rem;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .lock-icon-big {
                font-size: 4rem;
                margin-bottom: 1rem;
                filter: drop-shadow(0 4px 12px rgba(0, 175, 240, 0.3));
            }
            
            .password-content h2 {
                font-size: 1.75rem;
                margin-bottom: 0.5rem;
                color: #FFFFFF;
            }
            
            .password-content p {
                color: #8899A6;
                margin-bottom: 1.5rem;
                line-height: 1.6;
            }
            
            #password-form {
                margin-top: 2rem;
            }
            
            #password-input {
                width: 100%;
                padding: 1rem 1.5rem;
                font-size: 1rem;
                border: 2px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                background: rgba(255, 255, 255, 0.05);
                color: #FFFFFF;
                font-family: inherit;
                transition: all 0.3s ease;
                margin-bottom: 1rem;
            }
            
            #password-input:focus {
                outline: none;
                border-color: #00AFF0;
                background: rgba(255, 255, 255, 0.08);
                box-shadow: 0 0 20px rgba(0, 175, 240, 0.2);
            }
            
            .password-submit {
                width: 100%;
                padding: 1rem 2rem;
                font-size: 1rem;
                font-weight: 600;
                background: linear-gradient(135deg, #00AFF0 0%, #0095D1 100%);
                color: white;
                border: none;
                border-radius: 12px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-family: inherit;
            }
            
            .password-submit:hover {
                transform: translateY(-2px);
                box-shadow: 0 0 20px rgba(0, 175, 240, 0.4);
            }
            
            .password-submit:active {
                transform: translateY(0);
            }
            
            .password-error {
                color: #FF006B;
                font-size: 0.9rem;
                margin-top: 1rem;
                min-height: 1.5rem;
            }
            
            .password-hint {
                font-size: 0.85rem;
                color: #5B6B7A;
                margin-top: 1.5rem;
                font-style: italic;
            }
            
            .shake {
                animation: shake 0.5s;
            }
            
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-10px); }
                75% { transform: translateX(10px); }
            }
        `;
        document.head.appendChild(style);

        // Handle form submission
        const form = document.getElementById('password-form');
        const input = document.getElementById('password-input');
        const error = document.getElementById('password-error');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const password = input.value;

            if (await verifyPassword(password)) {
                saveAuth();
                overlay.style.animation = 'fadeOut 0.5s ease';
                setTimeout(() => {
                    overlay.remove();
                    document.body.style.display = '';
                }, 500);
            } else {
                error.textContent = 'Incorrect password. Try again!';
                input.value = '';
                input.classList.add('shake');
                setTimeout(() => input.classList.remove('shake'), 500);
            }
        });

        // Focus input
        setTimeout(() => input.focus(), 100);
    }

    // Add fadeOut animation
    const fadeOutStyle = document.createElement('style');
    fadeOutStyle.textContent = `
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(fadeOutStyle);

    // Check authentication on page load
    if (!isAuthenticated()) {
        showPasswordPrompt();
    }
})();
