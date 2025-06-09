// DOM Elements
const tabButtons = document.querySelectorAll('.tab-btn');
const subjectSections = document.querySelectorAll('.subject-section');
const unitCards = document.querySelectorAll('.unit-card');
const pdfModal = document.getElementById('pdfModal');
const pdfFrame = document.getElementById('pdfFrame');
const modalTitle = document.getElementById('modalTitle');
const closeModal = document.getElementById('closeModal');

// Subject Tab Functionality
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetSubject = button.dataset.subject;
        
        // Remove active class from all tabs and sections
        tabButtons.forEach(btn => btn.classList.remove('active'));
        subjectSections.forEach(section => section.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding section
        button.classList.add('active');
        document.getElementById(targetSubject).classList.add('active');
        
        // Add subtle animation effect
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
    });
});

// PDF Opening Functionality
unitCards.forEach(card => {
    const openBtn = card.querySelector('.open-btn');
    
    openBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        
        const pdfUrl = card.dataset.url;
        const unitTitle = card.querySelector('h3').textContent;
        const unitDescription = card.querySelector('p').textContent;
        
        // Show loading state
        openBtn.innerHTML = '<span class="loading"></span> Loading...';
        openBtn.disabled = true;
        
        // Set modal title
        modalTitle.textContent = `${unitTitle}: ${unitDescription}`;
        
        // Load PDF in iframe
        pdfFrame.src = pdfUrl;
        
        // Show modal with animation
        pdfModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Reset button after a short delay
        setTimeout(() => {
            openBtn.innerHTML = 'Open PDF';
            openBtn.disabled = false;
        }, 1000);
    });
    
    // Card click functionality
    card.addEventListener('click', () => {
        openBtn.click();
    });
    
    // Hover effects
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Modal Close Functionality
closeModal.addEventListener('click', closePDFModal);

pdfModal.addEventListener('click', (e) => {
    if (e.target === pdfModal) {
        closePDFModal();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && pdfModal.classList.contains('active')) {
        closePDFModal();
    }
    
    // Tab switching with keyboard
    if (e.ctrlKey || e.metaKey) {
        if (e.key === '1') {
            e.preventDefault();
            document.querySelector('[data-subject="mathematics"]').click();
        } else if (e.key === '2') {
            e.preventDefault();
            document.querySelector('[data-subject="science"]').click();
        }
    }
});

function closePDFModal() {
    pdfModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Clear iframe src to stop loading
    setTimeout(() => {
        pdfFrame.src = '';
    }, 300);
}

// Welcome Animation
window.addEventListener('load', () => {
    // Animate header
    const header = document.querySelector('.header');
    header.style.transform = 'translateY(-100%)';
    header.style.opacity = '0';
    
    setTimeout(() => {
        header.style.transition = 'all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        header.style.transform = 'translateY(0)';
        header.style.opacity = '1';
    }, 100);
    
    // Animate tabs
    const tabs = document.querySelector('.subject-tabs');
    tabs.style.transform = 'translateY(50px)';
    tabs.style.opacity = '0';
    
    setTimeout(() => {
        tabs.style.transition = 'all 0.8s ease-out';
        tabs.style.transform = 'translateY(0)';
        tabs.style.opacity = '1';
    }, 300);
    
    // Animate section header
    const sectionHeader = document.querySelector('.section-header');
    sectionHeader.style.transform = 'translateY(30px)';
    sectionHeader.style.opacity = '0';
    
    setTimeout(() => {
        sectionHeader.style.transition = 'all 0.8s ease-out';
        sectionHeader.style.transform = 'translateY(0)';
        sectionHeader.style.opacity = '1';
    }, 500);
});

// Progress Tracking - Updated for Class VIII
const progressTracker = {
    visited: JSON.parse(localStorage.getItem('ncert-class8-progress') || '{}'),
    
    markAsVisited(unitId) {
        this.visited[unitId] = true;
        localStorage.setItem('ncert-class8-progress', JSON.stringify(this.visited));
        this.updateUI();
    },
    
    updateUI() {
        unitCards.forEach((card, index) => {
            const unitId = `unit-${index}`;
            if (this.visited[unitId]) {
                card.classList.add('visited');
                if (!card.querySelector('.progress-badge')) {
                    const badge = document.createElement('div');
                    badge.className = 'progress-badge';
                    badge.innerHTML = '<i class="fas fa-check"></i>';
                    card.appendChild(badge);
                }
            }
        });
    }
};

// Initialize progress tracking
document.addEventListener('DOMContentLoaded', () => {
    progressTracker.updateUI();
    
    // Track when PDFs are opened
    unitCards.forEach((card, index) => {
        const openBtn = card.querySelector('.open-btn');
        openBtn.addEventListener('click', () => {
            setTimeout(() => {
                progressTracker.markAsVisited(`unit-${index}`);
            }, 2000); // Mark as visited after 2 seconds
        });
    });
});

// Search functionality (if needed later)
function initializeSearch() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search units...';
    searchInput.className = 'search-input';
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        unitCards.forEach(card => {
            const unitTitle = card.querySelector('h3').textContent.toLowerCase();
            const unitDescription = card.querySelector('p').textContent.toLowerCase();
            
            if (unitTitle.includes(searchTerm) || unitDescription.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = searchTerm === '' ? 'block' : 'none';
            }
        });
    });
    
    return searchInput;
}

// Performance optimization
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
        }
    });
}, observerOptions);

// Observe all unit cards for animation
unitCards.forEach(card => {
    card.style.animationPlayState = 'paused';
    cardObserver.observe(card);
});

// Theme toggle (optional)
function initializeThemeToggle() {
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
    
    // Apply saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    return themeToggle;
}

// Add smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Error handling for PDF loading
pdfFrame.addEventListener('load', () => {
    console.log('PDF loaded successfully');
});

pdfFrame.addEventListener('error', () => {
    console.error('Failed to load PDF');
    modalTitle.textContent = 'Error loading PDF';
    pdfFrame.innerHTML = '<div class="error-message">Failed to load PDF. Please try again.</div>';
});

// Add loading indicator for PDF
function showPDFLoading() {
    pdfFrame.style.background = 'url("data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'><circle cx=\'50\' cy=\'50\' r=\'20\' fill=\'none\' stroke=\'%23667eea\' stroke-width=\'4\' stroke-dasharray=\'31.416\' stroke-dashoffset=\'31.416\'><animate attributeName=\'stroke-dasharray\' dur=\'2s\' values=\'0 31.416;15.708 15.708;0 31.416\' repeatCount=\'indefinite\'/><animate attributeName=\'stroke-dashoffset\' dur=\'2s\' values=\'0;-15.708;-31.416\' repeatCount=\'indefinite\'/></circle></svg>") center center no-repeat';
}

console.log('NCERT Exemplar Hub loaded successfully! 🎉');
console.log('Designed with ❤️ for Aayush');

// Updated console messages for Class VIII
console.log('%c📚 Welcome to your study companion!', 'color: #667eea; font-size: 16px; font-weight: bold;');
console.log('%c✨ Made specially for Class VIII students', 'color: #764ba2; font-size: 14px;');
console.log('%c🚀 Happy Learning, Aayush!', 'color: #e17055; font-size: 14px; font-weight: bold;');