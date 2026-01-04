// OnlyVants - Interactive Features

// Smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Tab filtering functionality
const tabs = document.querySelectorAll('.tab');
const contentCards = document.querySelectorAll('.content-card');

tabs.forEach(tab => {
    tab.addEventListener('click', function() {
        // Remove active class from all tabs
        tabs.forEach(t => t.classList.remove('active'));
        
        // Add active class to clicked tab
        this.classList.add('active');
        
        // Add a subtle animation to content cards
        contentCards.forEach((card, index) => {
            card.style.animation = 'none';
            setTimeout(() => {
                card.style.animation = `fadeInUp 0.5s ease-out ${index * 0.1}s backwards`;
            }, 10);
        });
    });
});

// Locked content interaction
contentCards.forEach(card => {
    card.addEventListener('click', function() {
        // Create a fun alert when clicking locked content
        const contentTitle = this.querySelector('.content-title').textContent;
        showSubscribeModal(contentTitle);
    });
});

// Subscribe button interactions
const subscribeButtons = document.querySelectorAll('.btn-subscribe, .btn-cta');

subscribeButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        e.stopPropagation();
        showSubscribeModal();
    });
});

// Fun subscribe modal
function showSubscribeModal(contentTitle = null) {
    const messages = [
        "Nice try! But this is a parody site 😄",
        "Jim Vant's content is priceless... and also fictional!",
        "Subscribe? This is just a joke for Jim! 🎉",
        "The real treasure is the friendship with Jim Vant 💎",
        "Error 404: Jim Vant's premium content not found 😂"
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    // Create custom modal
    const modal = document.createElement('div');
    modal.className = 'custom-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>🔒 Subscription Required</h3>
            </div>
            <div class="modal-body">
                ${contentTitle ? `<p class="modal-content-title">"${contentTitle}"</p>` : ''}
                <p class="modal-message">${randomMessage}</p>
                <p class="modal-subtext">This is a parody website created as a joke for Jim Vant!</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary modal-close">Got it! 😄</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Trigger animation
    setTimeout(() => modal.classList.add('show'), 10);
    
    // Close modal
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    });
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        }
    });
}

// Add hover effects to cards
contentCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        const lockIcon = this.querySelector('.lock-icon-large');
        if (lockIcon) {
            lockIcon.style.transform = 'scale(1.2) rotate(10deg)';
        }
    });
    
    card.addEventListener('mouseleave', function() {
        const lockIcon = this.querySelector('.lock-icon-large');
        if (lockIcon) {
            lockIcon.style.transform = 'scale(1) rotate(0deg)';
        }
    });
});

// Add styles for the modal
const modalStyles = document.createElement('style');
modalStyles.textContent = `
    .custom-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(10px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .custom-modal.show {
        opacity: 1;
    }
    
    .modal-content {
        background: var(--bg-card);
        border-radius: var(--radius-xl);
        padding: 2rem;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
        border: 1px solid rgba(255, 255, 255, 0.1);
        transform: scale(0.9);
        transition: transform 0.3s ease;
    }
    
    .custom-modal.show .modal-content {
        transform: scale(1);
    }
    
    .modal-header h3 {
        font-size: 1.75rem;
        margin-bottom: 1.5rem;
        text-align: center;
    }
    
    .modal-body {
        text-align: center;
        margin-bottom: 1.5rem;
    }
    
    .modal-content-title {
        font-weight: 600;
        color: var(--primary-blue-light);
        margin-bottom: 1rem;
        font-size: 1.1rem;
    }
    
    .modal-message {
        font-size: 1.25rem;
        margin-bottom: 1rem;
        font-weight: 500;
    }
    
    .modal-subtext {
        color: var(--text-secondary);
        font-size: 0.95rem;
    }
    
    .modal-footer {
        display: flex;
        justify-content: center;
    }
    
    .modal-close {
        padding: 0.75rem 2rem;
    }
    
    .lock-icon-large {
        transition: transform 0.3s ease;
    }
`;
document.head.appendChild(modalStyles);

// Add entrance animations on page load
window.addEventListener('load', () => {
    const cards = document.querySelectorAll('.content-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

// Easter egg: Konami code
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        document.body.style.animation = 'rainbow 2s linear infinite';
        setTimeout(() => {
            document.body.style.animation = '';
            alert('🎉 You found the secret! Jim Vant approves! 🎉');
        }, 2000);
    }
});

// Add rainbow animation for easter egg
const rainbowStyle = document.createElement('style');
rainbowStyle.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(rainbowStyle);
