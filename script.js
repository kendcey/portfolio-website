// Smooth scrolling for navigation links
function normalizePath(pathname) {
    let path = pathname.replace('/kendceyportfolio', '');
    if (path.endsWith('/index.html')) {
        path = path.slice(0, -('/index.html'.length)) || '/';
    }
    if (path.endsWith('/') && path.length > 1) {
        path = path.slice(0, -1);
    }
    return path || '/';
}

function isIndexPath(path) {
    return path === '/' || path === '';
}

function pathsReferToSamePage(currentPath, linkPath) {
    return currentPath === linkPath || (isIndexPath(currentPath) && isIndexPath(linkPath));
}

function updateNavActiveState() {
    const currentPath = normalizePath(window.location.pathname);
    const currentHash = window.location.hash;
    const currentFile = window.location.pathname.split('/').pop() || 'index.html';
    const dropdownTrigger = document.querySelector('.dropdown-trigger');
    const onIndex = isIndexPath(currentPath);

    document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active-link'));

    let projectsActive = false;

    document.querySelectorAll('.nav-links a').forEach(link => {
        const url = new URL(link.href, window.location.origin);
        const linkPath = normalizePath(url.pathname);
        const linkHash = url.hash;
        const linkFile = url.pathname.split('/').pop();

        if (link.closest('.dropdown-menu')) {
            if (linkHash) {
                if (onIndex && currentHash === linkHash) {
                    link.classList.add('active-link');
                    if (linkHash === '#projects') {
                        projectsActive = true;
                    }
                }
            } else if (linkFile && linkFile === currentFile && linkFile !== 'index.html') {
                link.classList.add('active-link');
                projectsActive = true;
            }
            return;
        }

        if (linkHash && pathsReferToSamePage(currentPath, linkPath) && currentHash === linkHash) {
            link.classList.add('active-link');
            if (link.classList.contains('dropdown-trigger')) {
                projectsActive = true;
            }
        }
    });

    if (projectsActive && dropdownTrigger) {
        dropdownTrigger.classList.add('active-link');
    }
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = targetElement.offsetTop - navbarHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            history.pushState(null, '', targetId);
            updateNavActiveState();
        }
    });
});

// Add animation to timeline items when they come into view
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.timeline-item').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'all 0.5s ease-out';
    observer.observe(item);
});

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navbar = document.querySelector('.navbar'); // Get reference to the navbar

if (hamburger && navLinks && navbar) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active'); // Toggle active class on hamburger
        document.body.classList.toggle('no-scroll'); // Toggle no-scroll class on body
        navbar.classList.toggle('sidebar-open'); // Toggle sidebar-open class on navbar

        // Explicitly set text based on whether the active class is now present
        if (hamburger.classList.contains('active')) {
            hamburger.textContent = 'Exit';
        } else {
            hamburger.textContent = 'Menu';
        }
    });
}

updateNavActiveState();
window.addEventListener('hashchange', updateNavActiveState);
window.addEventListener('popstate', updateNavActiveState);

// Handle dropdown hover/tap in mobile sidebar
const dropdownTrigger = document.querySelector('.dropdown-trigger');
const navDropdown = document.querySelector('.nav-dropdown');

if (dropdownTrigger && navDropdown) {
    let hoverTimeout = null;
    
    // For hover: open dropdown on mouseenter
    navDropdown.addEventListener('mouseenter', function() {
        if (window.innerWidth <= 650) {
            // Clear any pending timeout
            if (hoverTimeout) {
                clearTimeout(hoverTimeout);
                hoverTimeout = null;
            }
            navDropdown.classList.add('active');
        }
    });
    
    // For hover: close dropdown on mouseleave with small delay to prevent glitch
    navDropdown.addEventListener('mouseleave', function() {
        if (window.innerWidth <= 650) {
            // Small delay to prevent glitch when moving between trigger and menu
            hoverTimeout = setTimeout(function() {
                navDropdown.classList.remove('active');
            }, 100);
        }
    });
    
    // For click/tap: toggle dropdown
    dropdownTrigger.addEventListener('click', function(e) {
        if (window.innerWidth <= 650) {
            e.preventDefault();
            e.stopPropagation();
            // Toggle dropdown
            navDropdown.classList.toggle('active');
        }
    });
    
    // Close dropdown when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 650 && navDropdown && !navDropdown.contains(e.target)) {
            navDropdown.classList.remove('active');
        }
    });
}

// Close menu when clicking a link & Handle active link on click
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function(e) {
        // Don't close menu if clicking dropdown trigger on mobile (let dropdown toggle handle it)
        if (this.classList.contains('dropdown-trigger') && window.innerWidth <= 650) {
            return;
        }
        
        navLinks.classList.remove('active');
        hamburger.textContent = 'Menu';
        hamburger.classList.remove('active');
        document.body.classList.remove('no-scroll');
        navbar.classList.remove('sidebar-open');

        if (!this.getAttribute('href')?.startsWith('#')) {
            setTimeout(updateNavActiveState, 0);
        }
    });
});

// Close menu when clicking outside
if (hamburger && navLinks && navbar) {
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('active');
            hamburger.textContent = 'Menu'; // Reset hamburger text to 'Menu'
            hamburger.classList.remove('active'); // Remove active class from hamburger
            document.body.classList.remove('no-scroll'); // Remove no-scroll class from body
            navbar.classList.remove('sidebar-open'); // Remove sidebar-open class from navbar
        }
    });
}


// Handle contact form submission with FormSubmit
const contactForm = document.querySelector('.contact-form');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        // Clear any existing messages
        successMessage.classList.remove('show');
        successMessage.textContent = '';
        errorMessage.classList.remove('show');
        errorMessage.textContent = '';

        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();

        // Basic validation
        if (!name || !email || !message || !validateEmail(email)) {
            e.preventDefault();
            errorMessage.textContent = 'Please fill in all fields correctly.';
            errorMessage.classList.add('show');

            // Hide message after 5 seconds
            setTimeout(() => {
                errorMessage.classList.remove('show');
                errorMessage.textContent = '';
            }, 5000);
            return;
        }

        // Show loading state
        const sendButton = contactForm.querySelector('.send-button');
        const originalButtonText = sendButton.textContent;
        sendButton.textContent = 'Sending...';
        sendButton.disabled = true;

        // FormSubmit will handle the submission
        // Set up success redirect to show message on same page
        const currentUrl = window.location.href.split('#')[0];
        const nextInput = contactForm.querySelector('input[name="_next"]');
        if (nextInput) {
            nextInput.value = currentUrl + '#contact?success=true';
        }

        // Allow form to submit naturally
        // FormSubmit will redirect back, so we'll check for success parameter
        setTimeout(() => {
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('success') === 'true') {
                successMessage.textContent = 'Message sent successfully!';
                successMessage.classList.add('show');
                
                // Clear form fields
                nameInput.value = '';
                emailInput.value = '';
                messageInput.value = '';
                
                // Reset button
                sendButton.textContent = originalButtonText;
                sendButton.disabled = false;
                
                // Clean URL
                window.history.replaceState({}, document.title, window.location.pathname + '#contact');
                
                // Hide message after 5 seconds
                setTimeout(() => {
                    successMessage.classList.remove('show');
                    successMessage.textContent = '';
                }, 5000);
            }
        }, 100);
    });
    
    // Check for success parameter on page load
    window.addEventListener('load', () => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('success') === 'true' && successMessage) {
            successMessage.textContent = 'Message sent successfully!';
            successMessage.classList.add('show');
            
            // Clear form if it exists
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            if (nameInput) nameInput.value = '';
            if (emailInput) emailInput.value = '';
            if (messageInput) messageInput.value = '';
            
            // Clean URL
            window.history.replaceState({}, document.title, window.location.pathname + '#contact');
            
            // Hide message after 5 seconds
            setTimeout(() => {
                successMessage.classList.remove('show');
                successMessage.textContent = '';
            }, 5000);
        }
    });
}

// Basic email validation function
function validateEmail(email) {
    const re = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return re.test(String(email).toLowerCase());
}

// Removed duplicated sections outside DOMContentLoaded
// Close menu when clicking a link
// document.querySelectorAll('.nav-links a').forEach(link => {
//     link.addEventListener('click', () => {
//         hamburger.classList.remove('active');
//         navLinks.classList.remove('active');
//     });
// });

// Close menu when clicking outside
// document.addEventListener('click', (e) => {
//     if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
//         hamburger.classList.remove('active');
//         navLinks.classList.remove('active');
//     }
// });

// Add active class to clicked nav link (consolidated into existing click listener)

// Particle Effect
const canvas = document.getElementById('particles-js');

if (canvas) {
    const ctx = canvas.getContext('2d');

    let particles = [];
    const particleCount = 150;

    function Particle(x, y) {
        this.x = x;
        this.y = y
        this.size = Math.random() * 2 + 0.5; // Smaller particles
        this.speedX = Math.random() * 0.8 - 0.4; // Increased speed
        this.speedY = Math.random() * 0.8 - 0.4; // Increased speed
        
        // Define a set of slightly darker, subtle colors for particles
        const colors = [
            'rgba(220, 20, 60, ', // Medium grey
            'rgba(216, 129, 67, ', // Medium blue-grey
            'rgba(220, 20, 60, ', // Medium beige
            'rgba(216, 129, 67, '  // Medium greenish-grey
        ];
        // Randomly select a base color and append a slightly higher random alpha value for more opacity
        this.color = colors[Math.floor(Math.random() * colors.length)] + (Math.random() * 0.4 + 0.3) + ')'; // Alpha from 0.3 to 0.7
    }

    Particle.prototype.update = function() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap particles around the screen
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
    };

    Particle.prototype.draw = function() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    };

    function initParticles() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height));
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        requestAnimationFrame(animateParticles);
    }

    // Initialize and animate on load
    window.addEventListener('load', () => {
        initParticles();
        animateParticles();
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        initParticles();
    });
}

// Image Carousel functionality
const carouselImages = document.querySelectorAll('.carousel-container img');
let currentImageIndex = 0;

function showNextImage() {
    // Remove active class from current image
    carouselImages[currentImageIndex].classList.remove('active');
    
    // Move to next image
    currentImageIndex = (currentImageIndex + 1) % carouselImages.length;
    
    // Add active class to new current image
    carouselImages[currentImageIndex].classList.add('active');
}

// Show first image initially
if (carouselImages.length > 0) {
    carouselImages[0].classList.add('active');
    // Start the carousel
    setInterval(showNextImage, 2500); // Change image every 3 seconds
}

// Back to top button functionality
const backToTopBtn = document.getElementById('back-to-top');
if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// All Logos preview — random logos with fade in/out rotation
const logoSlots = document.querySelectorAll('.logos-preview-grid .logo-slot img');

if (logoSlots.length > 0) {
    const logoSources = [
        'logos/clozure.png',
        'logos/rollin-rich/rollin-rich-logo.png',
        'logos/le-mon/le-mon-logo.png',
        'logos/kulminated/kulminated1.png',
        'logos/kulminated/kulminated2.png',
        'logos/dark/dark-logo1.png',
        'logos/dark/dark-logo2.png',
        'logos/delete/delete-logo1.png',
        'logos/delete/delete-logo2.png',
        'logos/u-pod/u-pod-logo2.png',
        'logos/u-pod/u-pod-logo2png.png',
        'logos/french-prints/french-prints-logo1.png',
        'logos/french-prints/french-prints-logo2.png',
        'logos/HADO-logo.png',
        'logos/don-robie-logo.svg',
        'logos/child-of-god/logo.png'
    ];

    const currentLogos = [];

    function pickUnusedLogo() {
        const available = logoSources.filter(src => !currentLogos.includes(src));
        return available[Math.floor(Math.random() * available.length)];
    }

    // Initial fill with 4 unique random logos
    logoSlots.forEach((img, i) => {
        const src = pickUnusedLogo();
        currentLogos[i] = src;
        img.src = src;
        // Stagger the initial fade-in
        setTimeout(() => img.classList.add('visible'), 150 * i + 100);
    });

    // Every interval, swap one random slot to a new random logo
    setInterval(() => {
        const slotIndex = Math.floor(Math.random() * logoSlots.length);
        const img = logoSlots[slotIndex];
        const nextSrc = pickUnusedLogo();

        img.classList.remove('visible');
        setTimeout(() => {
            currentLogos[slotIndex] = nextSrc;
            img.src = nextSrc;
            img.classList.add('visible');
        }, 250); // wait for fade-out to finish
    }, 900);
}

// Looping roll-up animation for about images
const aboutImageSquare = document.querySelector('.about-image-square');
const aboutImagesSlider = document.querySelector('.about-images-slider');

if (aboutImageSquare && aboutImagesSlider) {
    const imageSlides = document.querySelectorAll('.image-slide');
    const numImages = imageSlides.length;
    
    // Clone the first image and append it at the end for seamless loop
    if (imageSlides.length > 0) {
        const firstSlide = imageSlides[0].cloneNode(true);
        const firstDivider = document.querySelector('.image-divider');
        if (firstDivider) {
            const dividerClone = firstDivider.cloneNode(true);
            aboutImagesSlider.appendChild(dividerClone);
        }
        aboutImagesSlider.appendChild(firstSlide);
    }
    
    let animationId = null;
    const animationDuration = 3000; // 3 seconds per image
    let startTime = null;
    
    function getSlideHeight() {
        return aboutImageSquare.offsetHeight;
    }
    
    function getTotalHeight() {
        const slideHeight = getSlideHeight();
        // Now we have numImages + 1 slides (including duplicate first)
        return slideHeight * (numImages + 1) + numImages - 7;
    }
    
    function updateSlider(progress) {
        const slideHeight = getSlideHeight();
        const totalHeight = getTotalHeight();
        const maxTranslate = totalHeight - slideHeight;
        const translateY = progress * maxTranslate;
        aboutImagesSlider.style.transform = `translateY(-${translateY}px)`;
    }
    
    function animate(timestamp) {
        if (!startTime) startTime = timestamp;
        let elapsed = timestamp - startTime;
        
        // Total duration for one complete loop (all images + duplicate first)
        const totalLoopDuration = animationDuration * (numImages + 1);
        
        // Check if we've completed a full loop
        if (elapsed >= totalLoopDuration) {
            // Reset to start seamlessly (duplicate first = real first, so no jump)
            elapsed = elapsed % totalLoopDuration;
            startTime = timestamp - elapsed;
        }
        
        // Calculate progress through the loop (0 to 1)
        const loopProgress = elapsed / totalLoopDuration;
        
        updateSlider(loopProgress);
        
        animationId = requestAnimationFrame(animate);
    }
    
    // Start animation
    animationId = requestAnimationFrame(animate);
    
    // Handle window resize
    window.addEventListener('resize', () => {
        // Animation will recalculate on next frame
    });
}

