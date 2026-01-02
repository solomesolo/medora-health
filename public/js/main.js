/**
 * MEDORA - Horizontal Scroll Engine
 * Implements horizontal scrolling with mouse wheel, trackpad, and keyboard navigation
 */

(function() {
    'use strict';

    const container = document.querySelector('.horizontal-scroll-container');
    if (!container) {
        console.error('Container not found');
        return;
    }

    console.log('Scroll engine initialized, container:', container);

    /**
     * Check if device is mobile
     */
    function isMobile() {
        return window.innerWidth <= 768;
    }

    // Track scroll state - strict one section at a time
    let isScrolling = false;
    let lastScrollTime = 0;
    const SCROLL_COOLDOWN_TIME = 1500; // 1.5 seconds - longer to prevent double scroll
    let sections = [];
    let currentSectionIndex = 0; // Track current section explicitly
    let scrollTimeout = null;

    /**
     * Get current section index based on scroll position - simple and reliable
     */
    function getCurrentSectionIndex() {
        const scrollLeft = container.scrollLeft;
        const viewportWidth = container.clientWidth;
        
        if (viewportWidth === 0) return 0;
        
        // Simple calculation: divide scroll position by viewport width and round
        const sectionIndex = Math.round(scrollLeft / viewportWidth);
        const index = Math.max(0, Math.min(sectionIndex, sections.length - 1));
        currentSectionIndex = index;
        return index;
    }

    /**
     * Scroll to a specific section index - ensures exact positioning
     */
    function scrollToSection(index) {
        if (index < 0 || index >= sections.length) return;
        
        const viewportWidth = container.clientWidth;
        const targetScroll = index * viewportWidth;
        
        // Use instant scroll first to set position, then smooth if needed
        container.scrollLeft = targetScroll;
        
        // Update tracked index
        currentSectionIndex = index;
        
        // Update navigation immediately and repeatedly to ensure accuracy
        updateActiveNavigation();
        setTimeout(() => {
            updateActiveNavigation();
        }, 50);
        setTimeout(() => {
            updateActiveNavigation();
        }, 150);
    }

    /**
     * Handle wheel events - translate vertical scroll to horizontal
     * STRICT VERSION - One section at a time, no scrolling within sections
     */
    function handleWheel(e) {
        // Only apply on desktop
        if (isMobile()) return;

        const deltaY = e.deltaY;
        
        // If there's vertical scroll, translate it
        if (deltaY !== 0) {
            e.preventDefault();
            e.stopImmediatePropagation();
            
            // Make sure sections are loaded
            if (sections.length === 0) {
                sections = Array.from(container.querySelectorAll('.section'));
            }
            
            // STRICT: Only allow one scroll at a time
            if (isScrolling) {
                return false;
            }
            
            // Check cooldown - prevent scrolling if we just scrolled
            const now = Date.now();
            if ((now - lastScrollTime) < SCROLL_COOLDOWN_TIME) {
                return false;
            }
            
            // Get current section
            const currentIndex = getCurrentSectionIndex();
            
            // Determine direction (positive = down = right = next section)
            const direction = deltaY > 0 ? 1 : -1;
            const nextIndex = currentIndex + direction;
            
            // Only scroll if we have a valid next section and it's different
            if (nextIndex >= 0 && nextIndex < sections.length && nextIndex !== currentIndex) {
                // Mark as scrolling
                isScrolling = true;
                lastScrollTime = now;
                
                // Scroll to next/previous section
                scrollToSection(nextIndex);
                
                // Clear any existing timeout
                clearTimeout(scrollTimeout);
                
                // Reset scrolling flag after cooldown
                scrollTimeout = setTimeout(() => {
                    isScrolling = false;
                }, SCROLL_COOLDOWN_TIME);
            }
            
            return false;
        }
    }

    /**
     * Handle keyboard arrow keys for navigation
     */
    function handleKeydown(e) {
        // Only apply on desktop
        if (isMobile()) return;

        // Ignore if user is typing in an input field
        const activeElement = document.activeElement;
        const isInput = activeElement.tagName === 'INPUT' || 
                       activeElement.tagName === 'TEXTAREA' || 
                       activeElement.isContentEditable;
        
        if (isInput) return;

        // Calculate scroll amount (one viewport width)
        const scrollAmount = container.clientWidth;

        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const scrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';

        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                container.scrollBy({
                    left: -scrollAmount,
                    behavior: scrollBehavior
                });
                break;
            case 'ArrowRight':
                e.preventDefault();
                container.scrollBy({
                    left: scrollAmount,
                    behavior: scrollBehavior
                });
                break;
            case 'Home':
                e.preventDefault();
                container.scrollTo({
                    left: 0,
                    behavior: scrollBehavior
                });
                break;
            case 'End':
                e.preventDefault();
                container.scrollTo({
                    left: container.scrollWidth,
                    behavior: scrollBehavior
                });
                break;
        }
    }


    /**
     * Handle window resize to update mobile/desktop state
     */
    function handleResize() {
        // Resize handled by isMobile() function check
    }

    /**
     * Navigation tracking - ULTRA SIMPLE: Match nav item index to section index
     */
    function updateActiveNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        if (!navItems.length) {
            console.log('No nav items found');
            return;
        }
        
        // Make sure sections are loaded
        if (sections.length === 0) {
            sections = Array.from(container.querySelectorAll('.section'));
        }
        
        if (sections.length === 0) {
            console.log('No sections found');
            return;
        }
        
        const scrollLeft = container.scrollLeft;
        const viewportWidth = container.clientWidth;
        
        if (viewportWidth === 0) {
            console.log('Viewport width is 0, retrying...');
            // Retry after a short delay
            setTimeout(() => updateActiveNavigation(), 100);
            return;
        }
        
        // Calculate which section is visible - ULTRA SIMPLE
        const sectionIndex = Math.floor(scrollLeft / viewportWidth);
        const activeIndex = Math.max(0, Math.min(sectionIndex, sections.length - 1));
        
        console.log('Navigation update:', {
            scrollLeft,
            viewportWidth,
            sectionIndex,
            activeIndex,
            navItemsCount: navItems.length,
            sectionsCount: sections.length
        });
        
        // Match nav item by index position - nav item 0 = section 0, nav item 1 = section 1, etc.
        navItems.forEach((item, index) => {
            if (index === activeIndex) {
                item.classList.add('active');
                console.log(`Activated nav item ${index}`);
            } else {
                item.classList.remove('active');
            }
        });
        
        // Update tracked index
        currentSectionIndex = activeIndex;
    }

    /**
     * Handle navigation item clicks - Match by index position
     */
    function handleNavigationClick(e) {
        e.preventDefault();
        
        // Get all nav items to find the clicked one's index
        const navItems = Array.from(document.querySelectorAll('.nav-item'));
        const clickedIndex = navItems.indexOf(e.target);
        
        if (clickedIndex === -1) return;
        
        // Scroll to section at the same index
        scrollToSection(clickedIndex);
        
        // Update immediately
        updateActiveNavigation();
    }

    /**
     * Initialize horizontal scroll engine
     */
    function init() {
        // Check initial state
        console.log('=== SCROLL ENGINE INIT ===');
        console.log('Container:', container);
        console.log('Container scrollWidth:', container.scrollWidth);
        console.log('Container clientWidth:', container.clientWidth);
        console.log('Container offsetWidth:', container.offsetWidth);
        console.log('Is scrollable:', container.scrollWidth > container.clientWidth);
        console.log('Is mobile:', isMobile());
        
        // Check sections
        const sections = container.querySelectorAll('.section');
        console.log('Number of sections:', sections.length);
        sections.forEach((section, i) => {
            console.log(`Section ${i}:`, {
                offsetWidth: section.offsetWidth,
                scrollWidth: section.scrollWidth,
                computedWidth: window.getComputedStyle(section).width
            });
        });

        // Single listener on window with capture
        window.addEventListener('wheel', handleWheel, { 
            passive: false,
            capture: true
        });
        
        // Get all sections - make sure we use the global variable
        sections = Array.from(container.querySelectorAll('.section'));
        console.log('Number of sections:', sections.length);
        console.log('Sections array populated:', sections.length > 0);
        
        console.log('Wheel listener attached to window');
        console.log('Scroll engine ready - vertical scroll will move horizontally');
        console.log('Current section index:', getCurrentSectionIndex());

        // Keyboard navigation
        document.addEventListener('keydown', handleKeydown);

        // Handle window resize
        window.addEventListener('resize', handleResize);
        
        // Update navigation on scroll - use throttling for performance but ensure accuracy
        let scrollTimeout;
        let lastScrollLeft = -1;
        
        function handleScrollUpdate() {
            const currentScrollLeft = container.scrollLeft;
            
            // Only update if scroll position actually changed
            if (Math.abs(currentScrollLeft - lastScrollLeft) < 1) {
                return;
            }
            
            lastScrollLeft = currentScrollLeft;
            
            // Clear any pending update
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            
            // Update immediately for accuracy
            updateActiveNavigation();
            
            // Also update after a short delay to catch any scroll momentum
            scrollTimeout = setTimeout(() => {
                updateActiveNavigation();
            }, 100);
        }
        
        container.addEventListener('scroll', handleScrollUpdate, { passive: true });
        
        // CRITICAL: Set Hero (index 0) as active on page load
        // Wait for everything to be ready
        function initializeNavigation() {
            console.log('Initializing navigation...');
            console.log('Container:', container);
            console.log('Container scrollLeft:', container.scrollLeft);
            console.log('Container clientWidth:', container.clientWidth);
            
            // Force scroll to 0
            container.scrollLeft = 0;
            
            // Get nav items
            const initialNavItems = document.querySelectorAll('.nav-item');
            console.log('Found nav items:', initialNavItems.length);
            
            // Get sections
            if (sections.length === 0) {
                sections = Array.from(container.querySelectorAll('.section'));
            }
            console.log('Found sections:', sections.length);
            
            // Immediately highlight first nav item (Hero) - ULTRA SIMPLE
            initialNavItems.forEach((item, index) => {
                if (index === 0) {
                    item.classList.add('active');
                    console.log('Manually activated Hero nav item');
                } else {
                    item.classList.remove('active');
                }
            });
            
            // Update navigation
            updateActiveNavigation();
        }
        
        // Initialize immediately
        initializeNavigation();
        
        // Force multiple updates to ensure Hero stays active
        requestAnimationFrame(() => {
            container.scrollLeft = 0;
            initializeNavigation();
        });
        
        setTimeout(() => {
            container.scrollLeft = 0;
            initializeNavigation();
        }, 50);
        
        setTimeout(() => {
            container.scrollLeft = 0;
            initializeNavigation();
        }, 200);
        
        setTimeout(() => {
            container.scrollLeft = 0;
            initializeNavigation();
        }, 500);
        
        // Add click handlers to navigation items
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', handleNavigationClick);
        });

        // Make container focusable for keyboard navigation
        container.setAttribute('tabindex', '0');
        container.setAttribute('role', 'region');
        container.setAttribute('aria-label', 'Main content');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

/**
 * MEDORA - Hero Section Animation
 * Triggers abstract line animation when scrolling begins
 */

(function() {
    'use strict';

    const abstractLine = document.getElementById('abstractLine');
    if (!abstractLine) return;

    const container = document.querySelector('.horizontal-scroll-container');
    if (!container) return;

    let hasScrolled = false;
    let scrollTimeout;

    /**
     * Check if device is mobile
     */
    function isMobile() {
        return window.innerWidth <= 768;
    }

    /**
     * Handle scroll events to trigger animation
     */
    function handleScroll() {
        // Only apply on desktop
        if (isMobile()) return;

        // If this is the first scroll, trigger animation
        if (!hasScrolled) {
            hasScrolled = true;
            abstractLine.classList.add('animate');
        }

        // Reset timeout to keep animation active during scrolling
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            // Keep animation running - don't remove the class
            // Animation will continue indefinitely once started
        }, 100);
    }

    /**
     * Initialize hero animation
     */
    function init() {
        // Listen for scroll events on the container
        container.addEventListener('scroll', handleScroll, { passive: true });

        // Also listen for wheel events to catch initial scroll
        container.addEventListener('wheel', function() {
            if (!hasScrolled && !isMobile()) {
                // Small delay to ensure scroll event fires first
                setTimeout(() => {
                    if (container.scrollLeft > 0) {
                        handleScroll();
                    }
                }, 50);
            }
        }, { passive: true });

        // Listen for keyboard navigation
        document.addEventListener('keydown', function(e) {
            if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && !hasScrolled && !isMobile()) {
                setTimeout(() => {
                    if (container.scrollLeft > 0) {
                        handleScroll();
                    }
                }, 100);
            }
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

/**
 * MEDORA - Reality Section Animation
 * Reveals lines one by one as user scrolls horizontally
 */

(function() {
    'use strict';

    const realitySection = document.getElementById('reality');
    if (!realitySection) return;

    const realityIntro = document.querySelector('.reality-intro');
    const realityLines = document.querySelectorAll('.reality-line');
    const realityClosing = document.querySelector('.reality-closing');
    
    if (realityLines.length === 0) return;

    const container = document.querySelector('.horizontal-scroll-container');
    if (!container) return;

    let activeLineIndex = -1; // Start at -1 (before intro)
    let isInitialized = false;

    /**
     * Check if device is mobile
     */
    function isMobile() {
        return window.innerWidth <= 768;
    }

    /**
     * Calculate scroll progress through the reality section
     */
    function getScrollProgress() {
        const containerRect = container.getBoundingClientRect();
        const sectionRect = realitySection.getBoundingClientRect();
        const containerWidth = containerRect.width;
        
        // Calculate section's position relative to container viewport
        const sectionLeft = sectionRect.left - containerRect.left;
        
        // Progress: 0 when section enters viewport, 1 when section is centered/fully visible
        // As section scrolls from right to center, progress goes from 0 to 1
        const progress = Math.max(0, Math.min(1, (containerWidth - sectionLeft) / containerWidth));
        
        return progress;
    }

    /**
     * Update line visibility based on scroll progress
     */
    function updateLines() {
        if (isMobile()) {
            // On mobile, show all content immediately
            if (realityIntro) realityIntro.classList.add('active');
            realityLines.forEach((line, index) => {
                line.classList.add('active');
                if (index > 0) {
                    line.classList.add('previous');
                }
            });
            if (realityClosing) realityClosing.classList.add('active');
            return;
        }

        const progress = getScrollProgress();
        
        // Calculate which element should be active
        // Structure: intro (0), lines 1-5 (1-5), closing (6)
        // Total: 7 steps (0-6)
        const totalSteps = 1 + realityLines.length + 1; // intro + lines + closing
        const stepSize = 1 / totalSteps;
        
        // Find which step should be active
        let newActiveIndex = -1;
        for (let i = 0; i < totalSteps; i++) {
            if (progress >= i * stepSize) {
                newActiveIndex = i;
            }
        }
        
        // Ensure intro shows when section is visible
        if (progress > 0.05 && newActiveIndex === -1) {
            newActiveIndex = 0;
        }
        
        newActiveIndex = Math.min(newActiveIndex, totalSteps - 1);

        // Update intro
        if (realityIntro) {
            if (newActiveIndex >= 0) {
                realityIntro.classList.add('active');
            } else {
                realityIntro.classList.remove('active');
            }
        }

        // Update list lines
        realityLines.forEach((line, index) => {
            line.classList.remove('active', 'previous');
            
            const lineStep = index + 1; // Lines start at step 1 (after intro)
            
            if (lineStep < newActiveIndex) {
                // Previous lines - faded
                line.classList.add('active', 'previous');
            } else if (lineStep === newActiveIndex) {
                // Current active line
                line.classList.add('active');
            }
            // Future lines remain hidden
        });

        // Update closing
        if (realityClosing) {
            const closingStep = 1 + realityLines.length; // Closing is after all lines
            if (newActiveIndex >= closingStep) {
                realityClosing.classList.add('active');
            } else {
                realityClosing.classList.remove('active');
            }
        }

        activeLineIndex = newActiveIndex;
    }

    /**
     * Handle scroll events
     */
    function handleScroll() {
        updateLines();
    }

    /**
     * Initialize reality section animation
     */
    function init() {
        // Initial state - all content hidden
        if (realityIntro) realityIntro.classList.remove('active');
        realityLines.forEach(line => {
            line.classList.remove('active', 'previous');
        });
        if (realityClosing) realityClosing.classList.remove('active');

        // Listen for scroll events
        container.addEventListener('scroll', handleScroll, { passive: true });

        // Initial update
        updateLines();
        isInitialized = true;

        // Also listen for resize to handle mobile/desktop switch
        window.addEventListener('resize', function() {
            updateLines();
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

/**
 * MEDORA - Engagement Cards Parallax
 * Cards slide slightly as user scrolls horizontally
 */

(function() {
    'use strict';

    const engagementSection = document.getElementById('engagement');
    if (!engagementSection) return;

    const engagementCards = document.querySelectorAll('.engagement-card');
    if (engagementCards.length === 0) return;

    const container = document.querySelector('.horizontal-scroll-container');
    if (!container) return;

    /**
     * Check if device is mobile
     */
    function isMobile() {
        return window.innerWidth <= 768;
    }

    /**
     * Calculate scroll progress through the engagement section
     */
    function getScrollProgress() {
        const containerRect = container.getBoundingClientRect();
        const sectionRect = engagementSection.getBoundingClientRect();
        const containerWidth = containerRect.width;
        
        // Calculate section's position relative to container viewport
        const sectionLeft = sectionRect.left - containerRect.left;
        
        // Progress: 0 when section enters, 1 when section is centered
        const progress = Math.max(0, Math.min(1, (containerWidth - sectionLeft) / containerWidth));
        
        return progress;
    }

    /**
     * Update card positions based on scroll
     */
    function updateCards() {
        if (isMobile()) {
            // Reset transforms on mobile
            engagementCards.forEach(card => {
                card.style.transform = '';
            });
            return;
        }

        const progress = getScrollProgress();
        
        // Only animate when section is in view
        if (progress > 0 && progress < 1.2) {
            engagementCards.forEach((card, index) => {
                // Each card moves slightly differently for parallax effect
                const cardIndex = parseInt(card.dataset.card) || index;
                const offset = (cardIndex - 2) * 20; // Center card stays, others move
                const baseTranslateY = offset * (1 - progress);
                
                // Add hover elevation
                const isHovering = card.matches(':hover');
                const hoverOffset = isHovering ? -4 : 0;
                const finalTranslateY = baseTranslateY + hoverOffset;
                
                card.style.transform = `translateY(${finalTranslateY}px)`;
            });
        } else {
            // Reset when out of view, but preserve hover
            engagementCards.forEach(card => {
                const isHovering = card.matches(':hover');
                const hoverOffset = isHovering ? -4 : 0;
                card.style.transform = hoverOffset !== 0 ? `translateY(${hoverOffset}px)` : '';
            });
        }
    }

    /**
     * Handle scroll events
     */
    function handleScroll() {
        updateCards();
    }

    /**
     * Initialize engagement cards parallax and animations
     */
    function init() {
        // Initialize card animations
        initEngagementAnimations();
        
        // Listen for scroll events
        container.addEventListener('scroll', handleScroll, { passive: true });

        // Initial update
        updateCards();

        // Handle resize
        window.addEventListener('resize', function() {
            updateCards();
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

/**
 * MEDORA - Contact Form Handler
 * Handles form submission
 */

(function() {
    'use strict';

    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    /**
     * Handle form submission
     */
    function handleSubmit(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // In a real implementation, you would send this to a server
        // For now, we'll use mailto as a fallback
        const email = 'annasolovyova@gmx.de';
        const subject = encodeURIComponent(`Contact from ${data.name} at ${data.company}`);
        const body = encodeURIComponent(
            `Name: ${data.name}\n` +
            `Company: ${data.company}\n` +
            `Role: ${data.role}\n` +
            `Email: ${data.email}\n` +
            `Product Stage: ${data['product-stage']}\n` +
            `Where Adoption Breaks: ${data['adoption-breaks']}\n\n` +
            `Message:\n${data.message}`
        );
        
        // Open mailto link
        window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    }

    /**
     * Initialize contact form
     */
    function init() {
        contactForm.addEventListener('submit', handleSubmit);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

/**
 * MEDORA - Premium Cursor
 * Custom cursor with magnetic hover effects
 */
(function() {
    'use strict';

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        return; // Don't initialize custom cursor
    }

    const dot = document.createElement('div');
    const ring = document.createElement('div');
    dot.className = 'cursor-dot';
    ring.className = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let x = 0, y = 0;
    let rx = 0, ry = 0;

    const onMove = (e) => {
        x = e.clientX;
        y = e.clientY;
    };

    const tick = () => {
        // Smooth follow for ring
        rx += (x - rx) * 0.14;
        ry += (y - ry) * 0.14;
        
        dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
        ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
        
        requestAnimationFrame(tick);
    };

    const setHover = (isHover) => {
        ring.classList.toggle('is-hover', isHover);
        dot.classList.toggle('is-hover', isHover);
    };

    const onOver = (e) => {
        const el = e.target?.closest?.('a, button, .magnetic');
        if (el) setHover(true);
    };

    const onOut = () => {
        setHover(false);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver, true);
    document.addEventListener('mouseout', onOut, true);
    tick();
})();

/**
 * MEDORA - Hero Section Animations
 * Staggered fade-in animations for hero content
 */
(function() {
    'use strict';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    function initHeroAnimations() {
        const heroSection = document.getElementById('hero');
        if (!heroSection) return;

        const animatedElements = heroSection.querySelectorAll('[data-animate]');
        const heroCard = document.getElementById('heroCard');

        // Check if section is in viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animate elements with stagger
                    animatedElements.forEach(el => {
                        setTimeout(() => {
                            el.classList.add('animate');
                        }, 50);
                    });

                    // Animate card
                    if (heroCard) {
                        setTimeout(() => {
                            heroCard.classList.add('animate');
                        }, 300);
                    }

                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        observer.observe(heroSection);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHeroAnimations);
    } else {
        initHeroAnimations();
    }
})();

/**
 * MEDORA - Reality Section Animations
 * Premium staggered animations with blur effects
 */
(function() {
    'use strict';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    function initRealityAnimations() {
        const realitySection = document.getElementById('reality');
        if (!realitySection) return;

        const header = realitySection.querySelector('[data-animate="header"]');
        const items = realitySection.querySelectorAll('[data-animate="item"]');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animate header
                    if (header) {
                        setTimeout(() => {
                            header.classList.add('animate');
                        }, 100);
                    }

                    // Animate items with stagger
                    items.forEach((item, i) => {
                        const delay = prefersReducedMotion ? 0 : i * 60;
                        setTimeout(() => {
                            item.classList.add('animate');
                        }, 300 + delay);
                    });

                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        observer.observe(realitySection);
        
        // Set up stage rail interactions
        setupRealityStageRail(realitySection, items);
    }
    
    // Set up stage rail indicator for Reality section
    function setupRealityStageRail(realitySection, items) {
        const railIndicator = document.getElementById('railIndicator');
        const railLabels = realitySection.querySelectorAll('.rail-label');
        
        if (!railIndicator || !railLabels.length || !items.length) return;
        
        // Default stage (PILOT)
        let activeStage = 'PILOT';
        let activeIndex = null;
        
        // Map item index to stage
        const indexToStage = {
            0: 'DEMO',
            1: 'PILOT',
            2: 'PILOT',
            3: 'USAGE',
            4: 'USAGE'
        };
        
        function updateRail(stage) {
            // Update indicator position
            railIndicator.setAttribute('data-stage', stage);
            
            // Update label states
            railLabels.forEach(label => {
                if (label.getAttribute('data-stage') === stage) {
                    label.classList.add('active');
                } else {
                    label.classList.remove('active');
                }
            });
            
            activeStage = stage;
        }
        
        // Set default state (PILOT)
        updateRail('PILOT');
        
        // Handle left item interactions
        items.forEach((item, index) => {
            const handleEnter = () => {
                const stage = item.getAttribute('data-stage') || indexToStage[index];
                if (stage) {
                    item.classList.add('active');
                    updateRail(stage);
                    activeIndex = index;
                }
            };
            
            const handleLeave = () => {
                item.classList.remove('active');
                // Reset to default stage
                updateRail('PILOT');
                activeIndex = null;
            };
            
            item.addEventListener('mouseenter', handleEnter);
            item.addEventListener('mouseleave', handleLeave);
            item.addEventListener('focus', handleEnter);
            item.addEventListener('blur', handleLeave);
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initRealityAnimations);
    } else {
        initRealityAnimations();
    }
})();

/**
 * MEDORA - What Medora Does Section
 * Simple fade-in animations for explanation blocks
 */
(function() {
    'use strict';

    function initMedoraDoesAnimations() {
        const solutionSection = document.getElementById('solution');
        if (!solutionSection) return;

        const blocks = solutionSection.querySelectorAll('[data-animate="block"]');
        if (!blocks.length) return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = prefersReducedMotion ? 0 : 100;
                    setTimeout(() => {
                        entry.target.classList.add('animate');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        blocks.forEach(block => {
            observer.observe(block);
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMedoraDoesAnimations);
    } else {
        initMedoraDoesAnimations();
    }
})();

/**
 * MEDORA - Engagement Model Section
 * Staggered fade-in animations for engagement cards
 */
(function() {
    'use strict';

    function initEngagementAnimations() {
        const engagementSection = document.getElementById('engagement');
        if (!engagementSection) return;

        const cards = engagementSection.querySelectorAll('[data-animate="card"]');
        if (!cards.length) return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Stagger animations
                    cards.forEach((card, index) => {
                        const delay = prefersReducedMotion ? 0 : index * 100;
                        setTimeout(() => {
                            card.classList.add('animate');
                        }, 200 + delay);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        observer.observe(engagementSection);
    }

    // Make function available globally for engagement parallax
    window.initEngagementAnimations = initEngagementAnimations;

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initEngagementAnimations);
    } else {
        initEngagementAnimations();
    }
})();

/**
 * MEDORA - Who Section (Audience)
 * Fade-in animations for premium panels
 */
(function() {
    'use strict';

    function initWhoAnimations() {
        const whoSection = document.getElementById('audience');
        if (!whoSection) return;

        const panels = whoSection.querySelectorAll('[data-animate="panel"]');
        if (!panels.length) return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Stagger animations
                    panels.forEach((panel, index) => {
                        const delay = prefersReducedMotion ? 0 : index * 100;
                        setTimeout(() => {
                            const panelCard = panel.querySelector('.who-panel');
                            if (panelCard) {
                                panelCard.classList.add('animate');
                            }
                        }, 200 + delay);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        observer.observe(whoSection);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWhoAnimations);
    } else {
        initWhoAnimations();
    }
})();

/**
 * MEDORA - Founder Section
 * Fade-in animations for profile card and content
 */
(function() {
    'use strict';

    function initFounderAnimations() {
        const founderSection = document.getElementById('founder');
        if (!founderSection) return;

        const card = founderSection.querySelector('[data-animate="card"]');
        const content = founderSection.querySelector('[data-animate="content"]');
        
        if (!card || !content) return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animate card first
                    setTimeout(() => {
                        card.querySelector('.founder-profile-card')?.classList.add('animate');
                    }, prefersReducedMotion ? 0 : 100);
                    
                    // Animate content slightly after
                    setTimeout(() => {
                        content.classList.add('animate');
                    }, prefersReducedMotion ? 0 : 200);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        observer.observe(founderSection);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFounderAnimations);
    } else {
        initFounderAnimations();
    }
})();

/**
 * MEDORA - Engagement Packages Section
 * Staggered fade-in animations for package cards
 */
(function() {
    'use strict';

    function initPackagesAnimations() {
        const packagesSection = document.getElementById('packages');
        if (!packagesSection) return;

        const cards = packagesSection.querySelectorAll('[data-animate="card"]');
        if (!cards.length) return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Stagger animations
                    cards.forEach((card, index) => {
                        const delay = prefersReducedMotion ? 0 : index * 100;
                        setTimeout(() => {
                            card.classList.add('animate');
                        }, 200 + delay);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        observer.observe(packagesSection);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPackagesAnimations);
    } else {
        initPackagesAnimations();
    }
})();

/**
 * MEDORA - Why Adoption Fails Section
 * Premium animations with scroll-linked step highlighting
 */
(function() {
    'use strict';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    function initFailureSection() {
        const failureSection = document.getElementById('failure');
        if (!failureSection) return;

        const header = failureSection.querySelector('.failure-header');
        const reasonCards = failureSection.querySelectorAll('.failure-reason-card');
        const closingTexts = failureSection.querySelectorAll('.failure-closing-text');
        const railSteps = failureSection.querySelectorAll('.rail-step');
        const railBeam = failureSection.querySelector('.rail-beam');
        
        // Set up hover interactions immediately (not dependent on scroll)
        setupHoverInteractions(failureSection, reasonCards);

        // Animate header and cards
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animate header
                    if (header) {
                        setTimeout(() => {
                            header.classList.add('animate');
                        }, 100);
                    }

                    // Animate reason cards with stagger
                    reasonCards.forEach((card, i) => {
                        const delay = prefersReducedMotion ? 0 : i * 50;
                        setTimeout(() => {
                            card.classList.add('animate');
                        }, 200 + delay);
                    });

                    // Animate closing texts
                    closingTexts.forEach((text, i) => {
                        const delay = prefersReducedMotion ? 0 : i * 50;
                        setTimeout(() => {
                            text.classList.add('animate');
                        }, 500 + delay);
                    });

                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        observer.observe(failureSection);

        // Scroll-linked step highlighting
        const reasonObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const step = entry.target.getAttribute('data-step');
                    if (step) {
                        // Update active step
                        railSteps.forEach(railStep => {
                            if (railStep.getAttribute('data-step') === step) {
                                railStep.classList.add('active');
                            } else {
                                railStep.classList.remove('active');
                            }
                        });
                    }
                }
            });
        }, { threshold: 0.5 });

        reasonCards.forEach(card => {
            reasonObserver.observe(card);
        });

        // Scroll-linked beam opacity
        if (railBeam && !prefersReducedMotion) {
            const container = document.querySelector('.horizontal-scroll-container');
            if (container) {
                const updateBeamOpacity = () => {
                    const rect = failureSection.getBoundingClientRect();
                    const containerRect = container.getBoundingClientRect();
                    const containerWidth = containerRect.width;
                    
                    // Calculate section's position relative to container
                    const sectionLeft = rect.left - containerRect.left;
                    const sectionWidth = rect.width;
                    
                    // Progress: 0 when section enters, 1 when centered
                    const progress = Math.max(0, Math.min(1, 
                        (containerWidth - sectionLeft) / (containerWidth + sectionWidth)
                    ));
                    
                    // Opacity peaks at middle (0.5), fades at edges
                    const opacity = progress < 0.5 
                        ? 0.14 + (progress * 0.16) 
                        : 0.22 - ((progress - 0.5) * 0.16);
                    
                    railBeam.style.opacity = Math.max(0.14, Math.min(0.22, opacity));
                };
                
                container.addEventListener('scroll', updateBeamOpacity, { passive: true });
                updateBeamOpacity(); // Initial update
            }
        }

    }
    
    // Set up hover interactions separately (runs immediately)
    function setupHoverInteractions(failureSection, reasonCards) {
        const contextText = document.getElementById('contextText');
        const railCard = document.getElementById('failureRailCard');
        const threadOverlay = document.getElementById('threadOverlay');
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (!contextText || !railCard || reasonCards.length === 0) return;
        
        const defaultText = "Hover a breakdown on the left to see the underlying adoption failure.";

        reasonCards.forEach((card) => {
            const handleMouseEnter = () => {
                const takeaway = card.getAttribute('data-takeaway');
                if (!takeaway) return;

                // Exit animation
                contextText.classList.add('exiting');
                
                // Update text after exit animation
                setTimeout(() => {
                    contextText.textContent = takeaway;
                    contextText.classList.remove('exiting');
                    contextText.classList.add('entering');
                    
                    // Enter animation
                    setTimeout(() => {
                        contextText.classList.remove('entering');
                    }, 50);
                }, 175);

                // Show gradient thread
                if (threadOverlay && !prefersReducedMotion) {
                    const leftRect = card.getBoundingClientRect();
                    const rightRect = railCard.getBoundingClientRect();
                    const sectionRect = failureSection.getBoundingClientRect();

                    // Calculate relative positions
                    const x1 = leftRect.right - sectionRect.left;
                    const y1 = leftRect.top + (leftRect.height / 2) - sectionRect.top;
                    const x2 = rightRect.left - sectionRect.left;
                    const y2 = rightRect.top + (rightRect.height / 2) - sectionRect.top;

                    // Create SVG with gradient thread
                    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                    svg.setAttribute('width', '100%');
                    svg.setAttribute('height', '100%');
                    svg.setAttribute('viewBox', `0 0 ${sectionRect.width} ${sectionRect.height}`);
                    svg.setAttribute('preserveAspectRatio', 'none');
                    svg.style.position = 'absolute';
                    svg.style.left = '0';
                    svg.style.top = '0';

                    // Define gradient
                    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
                    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
                    gradient.setAttribute('id', 'threadGradient');
                    gradient.setAttribute('x1', '0%');
                    gradient.setAttribute('y1', '0%');
                    gradient.setAttribute('x2', '100%');
                    gradient.setAttribute('y2', '0%');
                    
                    const stops = [
                        { offset: '0%', color: 'rgba(255,255,255,0.0)' },
                        { offset: '35%', color: 'rgba(255,255,255,0.28)' },
                        { offset: '65%', color: 'rgba(255,255,255,0.28)' },
                        { offset: '100%', color: 'rgba(255,255,255,0.0)' }
                    ];
                    
                    stops.forEach(stop => {
                        const stopEl = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
                        stopEl.setAttribute('offset', stop.offset);
                        stopEl.setAttribute('stop-color', stop.color);
                        gradient.appendChild(stopEl);
                    });

                    // Define blur filter
                    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
                    filter.setAttribute('id', 'softBlur');
                    const blur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
                    blur.setAttribute('stdDeviation', '1.6');
                    filter.appendChild(blur);

                    defs.appendChild(gradient);
                    defs.appendChild(filter);
                    svg.appendChild(defs);

                    // Create path with curve
                    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                    const midX = (x1 + x2) / 2;
                    const controlY1 = y1 - 18;
                    const controlY2 = y2 + 18;
                    const d = `M ${x1} ${y1} C ${midX} ${controlY1}, ${midX} ${controlY2}, ${x2} ${y2}`;
                    path.setAttribute('d', d);
                    path.setAttribute('fill', 'none');
                    path.setAttribute('stroke', 'url(#threadGradient)');
                    path.setAttribute('stroke-width', '2.2');
                    path.setAttribute('filter', 'url(#softBlur)');
                    path.classList.add('thread-path');
                    svg.appendChild(path);

                    // Create spark element
                    const spark = document.createElement('div');
                    spark.classList.add('thread-spark');
                    spark.style.left = `${x1 + 30}px`;
                    spark.style.top = `${y1 - 6}px`;
                    spark.style.width = `${Math.abs(x2 - x1) * 0.3}px`;

                    threadOverlay.innerHTML = '';
                    threadOverlay.appendChild(svg);
                    threadOverlay.appendChild(spark);
                    threadOverlay.classList.add('visible');
                }
            };

            const handleMouseLeave = () => {
                // Exit animation
                contextText.classList.add('exiting');
                
                // Reset to default text
                setTimeout(() => {
                    contextText.textContent = defaultText;
                    contextText.classList.remove('exiting');
                    contextText.classList.add('entering');
                    
                    setTimeout(() => {
                        contextText.classList.remove('entering');
                    }, 50);
                }, 175);

                // Hide gradient thread
                if (threadOverlay) {
                    threadOverlay.classList.remove('visible');
                    setTimeout(() => {
                        threadOverlay.innerHTML = '';
                    }, 250);
                }
            };

            card.addEventListener('mouseenter', handleMouseEnter);
            card.addEventListener('mouseleave', handleMouseLeave);
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFailureSection);
    } else {
        initFailureSection();
    }
})();

