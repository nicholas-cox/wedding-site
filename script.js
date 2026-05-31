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
        setupRSVP();
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

    /**
     * RSVP System
     */
    function setupRSVP() {
        // Configuration
        var GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxmXPjOiucchhehlMhbcPMekLjOchz35p6odYzV6Ecx5QIY0PghkrFqwuhbgmIXtH_TBw/exec';

        // DOM Elements
        var lookupSection = document.getElementById('rsvpLookup');
        var formSection = document.getElementById('rsvpForm');
        var successSection = document.getElementById('rsvpSuccess');
        var lookupForm = document.getElementById('rsvpLookupForm');
        var responseForm = document.getElementById('rsvpResponseForm');
        var guestNameInput = document.getElementById('guestNameInput');
        var lookupError = document.getElementById('lookupError');
        var guestListContainer = document.getElementById('rsvpGuestList');
        var plusOneSection = document.getElementById('rsvpPlusOne');
        var bringingPlusOneCheckbox = document.getElementById('bringingPlusOne');
        var plusOneDetails = document.getElementById('plusOneDetails');
        var plusOneNameInput = document.getElementById('plusOneName');
        var emailInput = document.getElementById('rsvpEmail');
        var submitBtn = document.getElementById('rsvpSubmitBtn');
        var formError = document.getElementById('rsvpFormError');
        var backBtn = document.getElementById('rsvpBackBtn');
        var confirmationEmailSpan = document.getElementById('confirmationEmail');
        var rsvpSummary = document.getElementById('rsvpSummary');

        // State
        var currentHousehold = null;

        // Exit if RSVP elements don't exist
        if (!lookupForm || !responseForm) return;

        /**
         * Look up a guest by name (case-insensitive, supports aliases)
         */
        function lookupGuest(name) {
            var searchName = name.toLowerCase().trim();

            for (var i = 0; i < GUESTS.length; i++) {
                var household = GUESTS[i];

                // Check primary member names
                for (var j = 0; j < household.members.length; j++) {
                    if (household.members[j].toLowerCase() === searchName) {
                        return household;
                    }
                }

                // Check aliases
                if (household.aliases && household.aliases[searchName]) {
                    return household;
                }
            }
            return null;
        }

        /**
         * Render the RSVP form for a household
         */
        function renderGuestForm(household) {
            currentHousehold = household;
            guestListContainer.innerHTML = '';

            household.members.forEach(function(memberName, index) {
                var guestDiv = document.createElement('div');
                guestDiv.className = 'rsvp-guest-item';
                guestDiv.innerHTML =
                    '<div class="rsvp-guest-name">' + memberName + '</div>' +
                    '<div class="rsvp-guest-options">' +
                        '<label class="rsvp-radio-label">' +
                            '<input type="radio" name="attending_' + index + '" value="yes" required>' +
                            '<span>Joyfully Accepts</span>' +
                        '</label>' +
                        '<label class="rsvp-radio-label">' +
                            '<input type="radio" name="attending_' + index + '" value="no" required>' +
                            '<span>Regretfully Declines</span>' +
                        '</label>' +
                    '</div>' +
                    '<div class="rsvp-meal-section" data-guest-index="' + index + '" hidden>' +
                        '<div class="rsvp-meal-label">Meal preference:</div>' +
                        '<div class="rsvp-meal-options">' +
                            '<label class="rsvp-radio-label rsvp-meal-option">' +
                                '<input type="radio" name="meal_' + index + '" value="seafood" checked>' +
                                '<span>Happy with Seafood Entrees</span>' +
                            '</label>' +
                            '<label class="rsvp-radio-label rsvp-meal-option">' +
                                '<input type="radio" name="meal_' + index + '" value="vegan">' +
                                '<span>Vegan Entree (Pasta Pomodoro)</span>' +
                            '</label>' +
                        '</div>' +
                    '</div>';
                guestListContainer.appendChild(guestDiv);

                // Add event listeners for attending radio buttons
                var radios = guestDiv.querySelectorAll('input[name="attending_' + index + '"]');
                radios.forEach(function(radio) {
                    radio.addEventListener('change', function() {
                        var mealSection = guestDiv.querySelector('.rsvp-meal-section');
                        if (this.value === 'yes') {
                            mealSection.hidden = false;
                        } else {
                            mealSection.hidden = true;
                            // Reset to seafood when declining
                            var seafoodRadio = mealSection.querySelector('input[value="seafood"]');
                            if (seafoodRadio) seafoodRadio.checked = true;
                        }
                    });
                });
            });

            // Show/hide plus one section
            if (household.plusOneAllowed) {
                plusOneSection.hidden = false;
            } else {
                plusOneSection.hidden = true;
                bringingPlusOneCheckbox.checked = false;
                plusOneDetails.hidden = true;
            }
        }

        /**
         * Collect form data for submission
         */
        function collectFormData() {
            var data = {
                householdId: currentHousehold.id,
                email: emailInput.value.trim(),
                guests: [],
                plusOne: null
            };

            // Collect guest responses
            currentHousehold.members.forEach(function(memberName, index) {
                var attendingRadio = document.querySelector('input[name="attending_' + index + '"]:checked');
                var mealRadio = document.querySelector('input[name="meal_' + index + '"]:checked');

                if (attendingRadio) {
                    data.guests.push({
                        name: memberName,
                        attending: attendingRadio.value === 'yes',
                        vegan: attendingRadio.value === 'yes' && mealRadio && mealRadio.value === 'vegan'
                    });
                }
            });

            // Collect plus one data if applicable
            if (currentHousehold.plusOneAllowed && bringingPlusOneCheckbox.checked) {
                var plusOneMealRadio = document.querySelector('input[name="plusOneMeal"]:checked');
                data.plusOne = {
                    name: plusOneNameInput.value.trim(),
                    vegan: plusOneMealRadio && plusOneMealRadio.value === 'vegan'
                };
            }

            return data;
        }

        /**
         * Validate form data
         */
        function validateForm(data) {
            // Check all guests have responded
            if (data.guests.length !== currentHousehold.members.length) {
                return 'Please respond for all guests in your party.';
            }

            // Check email
            if (!data.email || !data.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                return 'Please enter a valid email address.';
            }

            // Check plus one name if bringing one
            if (data.plusOne && !data.plusOne.name) {
                return 'Please enter your guest\'s name.';
            }

            return null;
        }

        /**
         * Submit RSVP to Google Apps Script
         */
        function submitRSVP(data) {
            if (!GOOGLE_SCRIPT_URL) {
                // For testing without backend
                console.log('RSVP Data:', data);
                showSuccess(data);
                return;
            }

            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';
            formError.hidden = true;

            fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(function() {
                // no-cors mode doesn't return response body, assume success
                showSuccess(data);
            })
            .catch(function(error) {
                console.error('RSVP submission error:', error);
                formError.textContent = 'There was an error submitting your RSVP. Please try again or contact nicholasericcox@gmail.com';
                formError.hidden = false;
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit RSVP';
            });
        }

        /**
         * Show success message
         */
        function showSuccess(data) {
            formSection.hidden = true;
            successSection.hidden = false;
            confirmationEmailSpan.textContent = data.email;

            // Build summary
            var summaryHtml = '<ul>';
            data.guests.forEach(function(guest) {
                var status = guest.attending ? 'Attending' : 'Not attending';
                var meal = guest.attending && guest.vegan ? ' (Vegan)' : '';
                summaryHtml += '<li><strong>' + guest.name + '</strong>: ' + status + meal + '</li>';
            });
            if (data.plusOne) {
                var plusOneMeal = data.plusOne.vegan ? ' (Vegan)' : '';
                summaryHtml += '<li><strong>' + data.plusOne.name + '</strong> (+1): Attending' + plusOneMeal + '</li>';
            }
            summaryHtml += '</ul>';
            rsvpSummary.innerHTML = summaryHtml;
        }

        /**
         * Reset form to lookup state
         */
        function resetToLookup() {
            lookupSection.hidden = false;
            formSection.hidden = true;
            successSection.hidden = true;
            lookupError.hidden = true;
            guestNameInput.value = '';
            currentHousehold = null;
        }

        // Event: Lookup form submit
        lookupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            lookupError.hidden = true;

            var household = lookupGuest(guestNameInput.value);

            if (household) {
                renderGuestForm(household);
                lookupSection.hidden = true;
                formSection.hidden = false;
            } else {
                lookupError.hidden = false;
            }
        });

        // Event: Back button
        backBtn.addEventListener('click', function() {
            resetToLookup();
        });

        // Event: Plus one checkbox toggle
        bringingPlusOneCheckbox.addEventListener('change', function() {
            plusOneDetails.hidden = !this.checked;
            if (!this.checked) {
                plusOneNameInput.value = '';
                plusOneNameInput.classList.remove('input-error');
                // Reset meal to seafood
                var seafoodRadio = document.getElementById('plusOneSeafood');
                if (seafoodRadio) seafoodRadio.checked = true;
            }
        });

        // Clear error states on input
        plusOneNameInput.addEventListener('input', function() {
            this.classList.remove('input-error');
            formError.hidden = true;
        });

        emailInput.addEventListener('input', function() {
            this.classList.remove('input-error');
            formError.hidden = true;
        });

        // Event: Response form submit
        responseForm.addEventListener('submit', function(e) {
            e.preventDefault();
            formError.hidden = true;

            // Clear any previous input errors
            var errorInputs = responseForm.querySelectorAll('.input-error');
            errorInputs.forEach(function(input) {
                input.classList.remove('input-error');
            });

            var data = collectFormData();
            var validationError = validateForm(data);

            if (validationError) {
                formError.textContent = validationError;
                formError.hidden = false;

                // Highlight specific fields
                if (validationError.indexOf('guest\'s name') !== -1) {
                    plusOneNameInput.classList.add('input-error');
                    plusOneNameInput.focus();
                } else if (validationError.indexOf('email') !== -1) {
                    emailInput.classList.add('input-error');
                    emailInput.focus();
                }

                // Scroll error into view
                formError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }

            submitRSVP(data);
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
