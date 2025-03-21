// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('nav ul');
    const menuOverlay = document.querySelector('.menu-overlay');
    let isMenuOpen = false;
    
    // Function to toggle menu state
    const toggleMenu = (open) => {
        isMenuOpen = open;
        navMenu.classList.toggle('show', open);
        menuOverlay.classList.toggle('show', open);
        menuToggle.classList.toggle('active', open);
        document.body.style.overflow = open ? 'hidden' : '';
    };

    // Smooth scrolling
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Close menu if open
                if (isMenuOpen) {
                    toggleMenu(false);
                }

                // Account for fixed header height
                const headerHeight = document.querySelector('#header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mobile menu toggle
    menuToggle.addEventListener('click', () => {
        toggleMenu(!isMenuOpen);
    });

    // Close menu when clicking overlay
    menuOverlay.addEventListener('click', () => {
        toggleMenu(false);
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) {
            toggleMenu(false);
        }
    });

    // Close menu when resizing to desktop view
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && isMenuOpen) {
            toggleMenu(false);
        }
    });
});

// Animation for AI Engineer title
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const charWrappers = document.querySelectorAll('.char-wrapper');
    charWrappers.forEach((wrapper, index) => {
      setTimeout(() => {
        wrapper.classList.add('flipped');
      }, index * 100 + 3200); // Start after name types out
    });
  }, 100);
});
