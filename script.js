/**
 * Sarah & Nick Wedding Website - JavaScript
 * Handles navigation, parallax film strips, and smooth interactions
 */

(function() {
    'use strict';

    // DOM Elements
    const mainNav = document.getElementById('mainNav');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const photoboothGrid = document.getElementById('photoboothGrid');
    const photoboothSection = document.getElementById('photobooth');
    const photoboothDimmer = document.getElementById('photoboothDimmer');
    const hero = document.querySelector('.hero');

    // State
    let lastScrollY = 0;
    let ticking = false;

    /**
     * Initialize all functionality
     */
    function init() {
        setupNavigation();
        setupPhotoboothRandomizer();
        setupPhotoboothDimmer();
        setupMarquee();
        setupSmoothScroll();
        setupParallax();
        setupScrollAnimations();
        setupCountdown();
    }

    /**
     * Setup seamless photo marquee with JS-based animation
     */
    function setupMarquee() {
        const marqueeInner = document.getElementById('marqueeInner');
        if (!marqueeInner) return;

        const originalImages = marqueeInner.querySelectorAll('img');
        const gap = 16; // 1rem in pixels
        let imagesLoaded = 0;

        function onAllLoaded() {
            // Calculate width of original set
            let oneSetWidth = 0;
            originalImages.forEach(function(img) {
                oneSetWidth += img.offsetWidth + gap;
            });

            // Clone enough to fill screen plus extra
            const clonesNeeded = Math.ceil(window.innerWidth / oneSetWidth) + 2;
            for (let i = 0; i < clonesNeeded; i++) {
                originalImages.forEach(function(img) {
                    const clone = img.cloneNode(true);
                    marqueeInner.appendChild(clone);
                });
            }

            // Start animation
            let position = 0;
            const speed = 0.5;

            function animate() {
                position -= speed;
                if (position <= -oneSetWidth) {
                    position += oneSetWidth;
                }
                marqueeInner.style.transform = 'translateX(' + position + 'px)';
                requestAnimationFrame(animate);
            }

            animate();
        }

        // Wait for all images to load
        originalImages.forEach(function(img) {
            if (img.complete) {
                imagesLoaded++;
                if (imagesLoaded === originalImages.length) {
                    onAllLoaded();
                }
            } else {
                img.addEventListener('load', function() {
                    imagesLoaded++;
                    if (imagesLoaded === originalImages.length) {
                        onAllLoaded();
                    }
                });
            }
        });
    }

    /**
     * Setup dimming effect when photobooth section is in view
     */
    function setupPhotoboothDimmer() {
        if (!photoboothSection || !photoboothDimmer) return;

        function updateDimmer() {
            const rect = photoboothSection.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Check if section is coming into view or in view
            // Activate when top of section is within bottom 80% of screen
            // Deactivate when bottom of section has passed top 20% of screen
            const isInView = rect.top < windowHeight * 0.8 && rect.bottom > windowHeight * 0.2;

            if (isInView) {
                photoboothDimmer.classList.add('active');
            } else {
                photoboothDimmer.classList.remove('active');
            }
        }

        // Throttled scroll handler
        let dimmerTicking = false;
        window.addEventListener('scroll', function() {
            if (!dimmerTicking) {
                window.requestAnimationFrame(function() {
                    updateDimmer();
                    dimmerTicking = false;
                });
                dimmerTicking = true;
            }
        });

        // Initial check
        updateDimmer();
    }

    /**
     * Wedding countdown timer
     */
    function setupCountdown() {
        const weddingDate = new Date('September 19, 2026 17:00:00').getTime();

        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

        function updateCountdown() {
            const now = new Date().getTime();
            const distance = weddingDate - now;

            if (distance < 0) {
                daysEl.textContent = '0';
                hoursEl.textContent = '0';
                minutesEl.textContent = '0';
                secondsEl.textContent = '0';
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            daysEl.textContent = days;
            hoursEl.textContent = hours.toString().padStart(2, '0');
            minutesEl.textContent = minutes.toString().padStart(2, '0');
            secondsEl.textContent = seconds.toString().padStart(2, '0');
        }

        // Initial update
        updateCountdown();

        // Update every second
        setInterval(updateCountdown, 1000);
    }

    /**
     * Navigation functionality
     */
    function setupNavigation() {
        // Mobile menu toggle
        if (navToggle && navLinks) {
            navToggle.addEventListener('click', function() {
                navLinks.classList.toggle('active');
                navToggle.classList.toggle('active');
            });

            // Close mobile menu when clicking a link
            navLinks.querySelectorAll('a').forEach(function(link) {
                link.addEventListener('click', function() {
                    navLinks.classList.remove('active');
                    navToggle.classList.remove('active');
                });
            });
        }

        // Update nav on scroll
        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    updateNavigation();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    /**
     * Update navigation appearance based on scroll position
     */
    function updateNavigation() {
        const scrollY = window.scrollY;

        if (scrollY > 100) {
            mainNav.classList.add('scrolled');
        } else {
            mainNav.classList.remove('scrolled');
        }
    }

    /**
     * Setup photobooth grid randomizer
     * Each cell has its own independent timer for more organic swapping
     */
    function setupPhotoboothRandomizer() {
        if (!photoboothGrid) return;

        // All available photos
        const allPhotos = [
            'assets/images/photos/v2_v1.png', 'assets/images/photos/v2_v2.png', 'assets/images/photos/v2_v3.png', 'assets/images/photos/v2_v4.png', 'assets/images/photos/v2_v5.png',
            'assets/images/photos/v2_v6.png', 'assets/images/photos/v2_v7.png', 'assets/images/photos/v2_v8.png', 'assets/images/photos/v2_v9.png', 'assets/images/photos/v2_v10.png',
            'assets/images/photos/v2_v11.png', 'assets/images/photos/v2_v12.png', 'assets/images/photos/v2_v13.png', 'assets/images/photos/v2_v14.png', 'assets/images/photos/v2_v15.png',
            'assets/images/photos/v2_v16.png', 'assets/images/photos/v2_v17.png', 'assets/images/photos/v2_v18.png', 'assets/images/photos/v2_v19.png', 'assets/images/photos/v2_v20.png'
        ];

        const cells = photoboothGrid.querySelectorAll('.photobooth-cell');
        const currentPhotos = []; // Track which photos are currently displayed

        // Initialize current photos array
        cells.forEach(function(cell) {
            const img = cell.querySelector('.photobooth-photo') || cell.querySelector('img');
            const src = img.getAttribute('src');
            currentPhotos.push(src);
        });

        // Get a random photo that's not currently displayed
        function getRandomPhoto() {
            const available = allPhotos.filter(function(photo) {
                return currentPhotos.indexOf(photo) === -1;
            });
            return available[Math.floor(Math.random() * available.length)];
        }

        // Swap a single cell's photo
        function swapPhoto(cellIndex) {
            const cell = cells[cellIndex];
            const img = cell.querySelector('.photobooth-photo') || cell.querySelector('img');
            const newPhoto = getRandomPhoto();

            // Fade out
            img.classList.add('fading');

            setTimeout(function() {
                // Swap image
                img.src = newPhoto;
                currentPhotos[cellIndex] = newPhoto;

                // Fade in
                img.classList.remove('fading');
            }, 150);
        }

        // Each cell runs its own independent timer
        function startCellTimer(cellIndex) {
            function scheduleNext() {
                // Random delay between 1000ms and 2500ms per cell
                const delay = 1000 + Math.random() * 1500;

                setTimeout(function() {
                    swapPhoto(cellIndex);
                    scheduleNext();
                }, delay);
            }

            // Stagger the initial start times
            const initialDelay = Math.random() * 1000;
            setTimeout(scheduleNext, initialDelay);
        }

        // Start independent timer for each cell
        cells.forEach(function(cell, index) {
            startCellTimer(index);
        });
    }

    /**
     * Smooth scroll for anchor links
     */
    function setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');

                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const navHeight = mainNav ? mainNav.offsetHeight : 70;
                    const targetPosition = targetElement.offsetTop - navHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    /**
     * Parallax effect placeholder (painting is now fixed background)
     */
    function setupParallax() {
        // Painting background is now fixed, no parallax needed
    }

    /**
     * Scroll-triggered animations for content sections
     */
    function setupScrollAnimations() {
        // Elements to animate on scroll
        const animatedElements = document.querySelectorAll(
            '.section-title, .schedule-item, .story-photo, .registry-card, .venue-content'
        );

        if (!animatedElements.length) return;

        // Add initial hidden state
        animatedElements.forEach(function(el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });

        // Intersection Observer for scroll animations
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedElements.forEach(function(el) {
            observer.observe(el);
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
