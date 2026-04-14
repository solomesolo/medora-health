/**
 * MEDORA - Horizontal Scroll Engine
 * Implements horizontal scrolling with mouse wheel, trackpad, and keyboard navigation
 */

(function() {
    'use strict';

    // CHECK FOR VERTICAL MODE FIRST - BEFORE ANYTHING ELSE
    // This is the most reliable way to detect vertical scrolling
    const bodyStyles = window.getComputedStyle(document.body);
    const isVerticalMode = bodyStyles.overflowY === 'auto' || 
                          bodyStyles.overflowY === 'scroll' ||
                          document.body.style.overflowY === 'auto';
    
    if (isVerticalMode) {
        console.log('✅ VERTICAL SCROLL MODE - Exiting scroll engine completely');
        console.log('Body overflowY:', bodyStyles.overflowY);
        // Exit immediately - don't run ANY of this code
        return;
    }

    const container = document.querySelector('.horizontal-scroll-container');
    if (!container) {
        console.error('Container not found');
        return;
    }

    // Additional check on container
    const containerStyles = window.getComputedStyle(container);
    if (containerStyles.display === 'block' || 
        container.style.display === 'block' ||
        containerStyles.overflowX === 'hidden') {
        console.log('✅ VERTICAL SCROLL MODE (container check) - Exiting scroll engine');
        return;
    }

    console.log('Horizontal scroll engine initialized, container:', container);

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
        // Re-check vertical mode (in case it changed) - be very thorough
        const containerStyles = window.getComputedStyle(container);
        const bodyStyles = window.getComputedStyle(document.body);
        isVerticalMode = containerStyles.display === 'block' || 
                        container.style.display === 'block' ||
                        containerStyles.overflowX === 'hidden' ||
                        bodyStyles.overflowY === 'auto' ||
                        bodyStyles.overflowY === 'scroll';
        
        // Skip if in vertical scroll mode - return immediately WITHOUT preventing default
        // This is critical - we must return before preventDefault() is called
        if (isVerticalMode) {
            console.log('🚫 handleWheel() - Vertical mode detected, allowing normal scroll');
            return; // Allow normal scroll behavior - DO NOT prevent default
        }
        
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
            const href = item.getAttribute('href') || '';
            const isExternal =
                item.getAttribute('target') === '_blank' || /^https?:\/\//i.test(href);
            const isPageNavigation = href && !href.startsWith('#');
            if (isExternal || isPageNavigation) {
                item.classList.remove('active');
                return;
            }
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
        const anchor = e.currentTarget;
        const href = anchor.getAttribute('href') || '';
        const isExternal =
            anchor.getAttribute('target') === '_blank' || /^https?:\/\//i.test(href);
        const isPageNavigation = href && !href.startsWith('#');
        if (isExternal || isPageNavigation) {
            return;
        }

        e.preventDefault();

        // Get all nav items to find the clicked one's index
        const navItems = Array.from(document.querySelectorAll('.nav-item'));
        const clickedIndex = navItems.indexOf(anchor);

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
        // Re-check vertical mode FIRST before doing anything
        const containerStylesCheck = window.getComputedStyle(container);
        const bodyStylesCheck = window.getComputedStyle(document.body);
        const isVerticalCheck = containerStylesCheck.display === 'block' || 
                               container.style.display === 'block' ||
                               containerStylesCheck.overflowX === 'hidden' ||
                               bodyStylesCheck.overflowY === 'auto' ||
                               bodyStylesCheck.overflowY === 'scroll';
        
        // If vertical mode, exit immediately - don't attach any handlers
        if (isVerticalCheck) {
            console.log('🚫 Vertical mode confirmed in init() - EXITING to allow normal scrolling');
            console.log('Container display:', containerStylesCheck.display);
            console.log('Body overflowY:', bodyStylesCheck.overflowY);
            return; // Exit immediately - no wheel handlers will be attached
        }
        
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

        // Only add wheel handler if NOT in vertical mode (double check)
        if (!isVerticalCheck) {
            window.addEventListener('wheel', handleWheel, { 
                passive: false,
                capture: true
            });
            console.log('Wheel handler attached for horizontal scrolling');
        } else {
            console.log('Vertical scroll mode detected - wheel handler NOT attached');
        }
        
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
        // Re-check vertical mode (in case it changed) - be thorough
        const containerStylesCheck = window.getComputedStyle(container);
        const bodyStylesCheck = window.getComputedStyle(document.body);
        isVerticalMode = containerStylesCheck.display === 'block' || 
                        container.style.display === 'block' ||
                        containerStylesCheck.overflowX === 'hidden' ||
                        bodyStylesCheck.overflowY === 'auto' ||
                        bodyStylesCheck.overflowY === 'scroll';
        
        // If vertical mode, exit immediately - don't attach any wheel handlers
        if (isVerticalMode) {
            console.log('🚫 Hero animation init() - Vertical mode detected, NOT attaching wheel handlers');
            return; // Exit early - allow normal scrolling
        }
        
        // Only add horizontal scroll listeners if not in vertical mode
        if (!isVerticalMode) {
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

    let contactForm = null;

    /**
     * Show confirmation message
     */
    function showConfirmation() {
        console.log('Showing confirmation message...');
        
        // Get form wrapper
        const formWrapper = contactForm.closest('.contact-form-wrapper');
        if (!formWrapper) {
            console.error('Form wrapper not found');
            return;
        }
        
        // Remove existing confirmation if any
        const existingConfirmation = formWrapper.querySelector('.form-confirmation');
        if (existingConfirmation) {
            existingConfirmation.remove();
        }

        // Hide form with smooth transition
        contactForm.style.transition = 'opacity 0.35s ease, visibility 0.35s ease, max-height 0.35s ease';
        contactForm.style.opacity = '0';
        contactForm.style.visibility = 'hidden';
        contactForm.style.maxHeight = '0';
        contactForm.style.overflow = 'hidden';
        contactForm.style.margin = '0';
        contactForm.style.padding = '0';
        contactForm.style.pointerEvents = 'none';

        const confirmation = document.createElement('div');
        confirmation.className = 'form-confirmation';
        confirmation.innerHTML = `
            <div class="form-confirmation-content">
                <p class="form-confirmation-text">Thank you. We have received your message and will reply shortly.</p>
            </div>
        `;
        
        // Insert after form (inside form wrapper)
        contactForm.insertAdjacentElement('afterend', confirmation);
        
        // Reset form
        contactForm.reset();
        
        setTimeout(() => {
            // Scroll to keep confirmation in view, but don't jump
            const formRect = formWrapper.getBoundingClientRect();
            const confirmationRect = confirmation.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
            // Only scroll if confirmation is below viewport
            if (confirmationRect.bottom > viewportHeight) {
                const scrollAmount = confirmationRect.top - (viewportHeight / 2);
                window.scrollBy({
                    top: scrollAmount,
                    behavior: 'smooth'
                });
            }
        }, 50);
    }

    /**
     * Handle form submission
     */
    async function handleSubmit(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }
        
        console.log('Form submitted, preventing default behavior');
        
        // Re-find form in case DOM changed
        if (!contactForm) {
            contactForm = document.getElementById('contactForm');
        }
        
        if (!contactForm) {
            console.error('Contact form not found');
            alert('Form not found. Please refresh the page.');
            return false;
        }
        
        // Save current scroll position
        const scrollY = window.scrollY;
        const scrollX = window.scrollX;
        
        // Get submit button
        const submitButton = contactForm.querySelector('.form-submit');
        if (!submitButton) {
            console.error('Submit button not found');
            return false;
        }
        
        const originalText = submitButton.textContent;
        
        // Disable button and show loading state
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        
        // Keep data accessible for fallback
        let data = {};

        try {
            // Get form data
            const formData = new FormData(contactForm);
            data = Object.fromEntries(formData);
            
            console.log('Sending form data:', data);
            
            // Send to API
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            console.log('API response:', result);

            if (response.ok && result.success) {
                // Maintain scroll position
                window.scrollTo(scrollX, scrollY);
                
                // Show confirmation message
                showConfirmation();
                
                console.log('Form submitted successfully, confirmation shown');
            } else {
                throw new Error(result.error || 'Failed to send message');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            // Restore scroll position
            window.scrollTo(scrollX, scrollY);

            // Static fallback: open mail client if /api/contact is unavailable
            try {
                const d = data || {};
                const subject = encodeURIComponent(`Contact from ${d.name || ''} at ${d.company || ''}`.trim());
                const body = encodeURIComponent(
                    `Name: ${d.name || ''}\n` +
                    `Company: ${d.company || ''}\n` +
                    `Role: ${d.role || ''}\n` +
                    `Email: ${d.email || ''}\n\n` +
                    `Message:\n${d['adoption-breaks'] || ''}`
                );
                window.location.href = `mailto:annasolovyova@gmx.de?subject=${subject}&body=${body}`;
                return;
            } catch (fallbackError) {
                console.error('Mailto fallback failed:', fallbackError);
            }

            alert('Sorry, there was an error sending your message. Please try again or contact us directly at annasolovyova@gmx.de');
        } finally {
            // Re-enable button
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
        
        return false;
    }

    /**
     * Initialize contact form
     */
    function init() {
        // Find form - try multiple times if needed
        contactForm = document.getElementById('contactForm');
        
        if (!contactForm) {
            console.warn('Contact form not found, retrying...');
            // Retry after a short delay
            setTimeout(init, 100);
            return;
        }

        console.log('Contact form found, attaching submit handler');
        
        // Remove any existing listeners
        const newForm = contactForm.cloneNode(true);
        contactForm.parentNode.replaceChild(newForm, contactForm);
        contactForm = newForm;
        
        // Attach submit handler
        contactForm.addEventListener('submit', handleSubmit);
        
        // Also attach click handler to button as backup
        const submitButton = contactForm.querySelector('.form-submit');
        if (submitButton) {
            submitButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                handleSubmit(e);
            });
        }
        
        console.log('Contact form handler initialized');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // Wait a bit for Next.js hydration
        setTimeout(init, 100);
    }
})();

/**
 * MEDORA - Cookie consent (static site; opens settings view on first visit)
 */
(function() {
    'use strict';

    try {
        if (typeof localStorage === 'undefined') return;
        if (localStorage.getItem('cookie-consent')) return;
    } catch (e) {
        return;
    }

    let analyticsOn = localStorage.getItem('cookie-analytics') === 'true';

    const wrap = document.createElement('div');
    wrap.className = 'medora-cookie-consent';
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-modal', 'true');
    wrap.setAttribute('aria-labelledby', 'medora-cookie-title');

    wrap.innerHTML =
        '<div class="medora-cookie-consent__backdrop" aria-hidden="true"></div>' +
        '<div class="medora-cookie-consent__panel">' +
        '<h2 id="medora-cookie-title" class="medora-cookie-consent__title">Cookie settings</h2>' +
        '<p class="medora-cookie-consent__intro">We use essential cookies so the site works, and optional analytics cookies if you allow them. You can change this anytime via the footer link.</p>' +
        '<div class="medora-cookie-consent__row">' +
        '<div><div class="medora-cookie-consent__label">Essential</div>' +
        '<p class="medora-cookie-consent__desc">Required for basic site function. Always active.</p></div>' +
        '<span class="medora-cookie-consent__badge">Always on</span></div>' +
        '<div class="medora-cookie-consent__row">' +
        '<div><div class="medora-cookie-consent__label">Analytics</div>' +
        '<p class="medora-cookie-consent__desc">Helps us understand how visitors use the site.</p></div>' +
        '<button type="button" class="medora-cookie-consent__switch" id="medoraCookieAnalytics" role="switch" aria-checked="false" aria-label="Enable analytics cookies"></button></div>' +
        '<div class="medora-cookie-consent__actions">' +
        '<button type="button" class="medora-cookie-consent__btn medora-cookie-consent__btn--primary" id="medoraCookieSave">Save preferences</button>' +
        '<button type="button" class="medora-cookie-consent__btn medora-cookie-consent__btn--ghost" id="medoraCookieReject">Reject all</button>' +
        '<button type="button" class="medora-cookie-consent__btn medora-cookie-consent__btn--ghost" id="medoraCookieAccept">Accept all</button>' +
        '</div></div>';

    function close() {
        wrap.remove();
    }

    function syncSwitch(btn) {
        btn.classList.toggle('is-on', analyticsOn);
        btn.setAttribute('aria-checked', analyticsOn ? 'true' : 'false');
    }

    function init() {
        document.body.appendChild(wrap);
        const btn = wrap.querySelector('#medoraCookieAnalytics');
        syncSwitch(btn);
        btn.addEventListener('click', function() {
            analyticsOn = !analyticsOn;
            syncSwitch(btn);
        });
        wrap.querySelector('#medoraCookieSave').addEventListener('click', function() {
            localStorage.setItem('cookie-consent', 'custom');
            localStorage.setItem('cookie-analytics', analyticsOn ? 'true' : 'false');
            close();
        });
        wrap.querySelector('#medoraCookieReject').addEventListener('click', function() {
            localStorage.setItem('cookie-consent', 'rejected');
            localStorage.setItem('cookie-analytics', 'false');
            close();
        });
        wrap.querySelector('#medoraCookieAccept').addEventListener('click', function() {
            localStorage.setItem('cookie-consent', 'accepted');
            localStorage.setItem('cookie-analytics', 'true');
            close();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
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
 * MEDORA — Section 2: The real problem
 * Word title, intro delay, scroll-reveal bullets, timeline fill, divider
 */
(function() {
    'use strict';

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    function initRealProblemSection() {
        const section = document.getElementById('reality');
        if (!section || !section.classList.contains('real-problem-section')) return;

        const words = section.querySelectorAll('.real-problem-word');
        const intro = section.querySelector('.real-problem-intro');
        const items = section.querySelectorAll('.real-problem-item');
        const fill = section.querySelector('.real-problem-timeline-fill');
        const divider = section.querySelector('.real-problem-divider');
        const reduce = motionQuery.matches;

        const wordStaggerMs = 120;
        const introDelayAfterWordsMs = 300;

        function setTimelineProgress(revealed) {
            if (!fill) return;
            const total = items.length;
            const ratio = total > 0 ? revealed / total : 0;
            fill.style.transform = 'scaleY(' + ratio + ')';
        }

        function revealAllBullets() {
            let n = 0;
            items.forEach((item) => {
                item.classList.add('is-revealed');
                n += 1;
            });
            setTimelineProgress(n);
        }

        function bindBulletObservers() {
            let revealed = 0;

            const onRevealed = () => {
                revealed += 1;
                setTimelineProgress(revealed);
            };

            items.forEach((item) => {
                const io = new IntersectionObserver(
                    (entries) => {
                        entries.forEach((entry) => {
                            if (!entry.isIntersecting || item.classList.contains('is-revealed')) return;
                            item.classList.add('is-revealed');
                            onRevealed();
                            io.unobserve(item);
                        });
                    },
                    { threshold: 0.22, rootMargin: '0px 0px -6% 0px' }
                );
                io.observe(item);
            });
        }

        function runTitleSequence() {
            if (reduce) {
                words.forEach((w) => w.classList.add('is-visible'));
                if (intro) intro.classList.add('is-visible');
                return;
            }
            words.forEach((word, i) => {
                setTimeout(() => {
                    word.classList.add('is-visible');
                }, i * wordStaggerMs);
            });
            if (intro) {
                const introDelay = words.length * wordStaggerMs + introDelayAfterWordsMs;
                setTimeout(() => {
                    intro.classList.add('is-visible');
                }, introDelay);
            }
        }

        if (reduce) {
            runTitleSequence();
            revealAllBullets();
            if (divider) divider.classList.add('is-visible');
            return;
        }

        function scheduleFallbackStagger() {
            if (reduce) return;
            requestAnimationFrame(() => {
                setTimeout(() => {
                    const unrevealed = [...items].filter((li) => !li.classList.contains('is-revealed'));
                    if (unrevealed.length === 0 || unrevealed.length !== items.length) return;
                    const allInViewport = [...items].every((li) => {
                        const r = li.getBoundingClientRect();
                        return r.top >= -4 && r.bottom <= window.innerHeight + 12;
                    });
                    if (!allInViewport) return;
                    items.forEach((item, i) => {
                        setTimeout(() => {
                            item.classList.add('is-revealed');
                            setTimelineProgress(i + 1);
                        }, i * 140);
                    });
                }, 450);
            });
        }

        const sectionIo = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    runTitleSequence();
                    scheduleFallbackStagger();
                    sectionIo.unobserve(entry.target);
                });
            },
            { threshold: 0.2 }
        );
        sectionIo.observe(section);

        bindBulletObservers();

        if (divider) {
            const divIo = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (!entry.isIntersecting) return;
                        divider.classList.add('is-visible');
                        divIo.unobserve(entry.target);
                    });
                },
                { threshold: 0.35, rootMargin: '0px 0px -5% 0px' }
            );
            divIo.observe(divider);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initRealProblemSection);
    } else {
        initRealProblemSection();
    }
})();

/**
 * MEDORA — Section 3: What we do (typewriter, rejects, core card + phrase highlights)
 */
(function() {
    'use strict';

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    function initWhatWeDoSection() {
        const section = document.getElementById('solution');
        if (!section || !section.classList.contains('what-we-do-section')) return;

        const typeEl = section.querySelector('.what-we-do-type');
        const cursor = section.querySelector('.what-we-do-cursor');
        const rejectLines = section.querySelectorAll('.what-we-do-reject-line');
        const coreCard = section.querySelector('[data-wwd-core]');
        const phrases = section.querySelectorAll('[data-wwd-phrase]');

        const FULL_TITLE = 'We make your product work in Germany.';
        const TYPE_MS = 36;
        const reduce = motionQuery.matches;

        function runPhraseSequence() {
            if (!phrases.length || reduce) return;
            const holdMs = 520;
            const gapMs = 260;
            let i = 0;

            function step() {
                phrases.forEach((p) => p.classList.remove('is-highlight'));
                if (i >= phrases.length) return;
                phrases[i].classList.add('is-highlight');
                setTimeout(() => {
                    phrases[i].classList.remove('is-highlight');
                    i += 1;
                    setTimeout(step, gapMs);
                }, holdMs);
            }

            step();
        }

        function finishCursor() {
            if (!cursor) return;
            cursor.classList.remove('is-typing');
            cursor.classList.add('is-blinking');
            const hide = () => {
                cursor.classList.add('is-off');
                cursor.classList.remove('is-blinking');
            };
            cursor.addEventListener('animationend', hide, { once: true });
            setTimeout(hide, 1300);
        }

        function runTypewriter() {
            if (!typeEl) return;
            if (reduce) {
                typeEl.textContent = FULL_TITLE;
                return;
            }
            if (cursor) cursor.classList.add('is-typing');
            let i = 0;

            function tick() {
                if (i < FULL_TITLE.length) {
                    typeEl.textContent = FULL_TITLE.slice(0, i + 1);
                    i += 1;
                    setTimeout(tick, TYPE_MS);
                } else {
                    finishCursor();
                }
            }

            tick();
        }

        if (reduce) {
            if (typeEl) typeEl.textContent = FULL_TITLE;
            rejectLines.forEach((line) => line.classList.add('is-visible'));
            if (coreCard) coreCard.classList.add('is-visible');
            return;
        }

        let sectionStarted = false;
        const sectionIo = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting || sectionStarted) return;
                    sectionStarted = true;
                    runTypewriter();
                    rejectLines.forEach((line, idx) => {
                        setTimeout(() => line.classList.add('is-visible'), 200 + idx * 95);
                    });
                    sectionIo.unobserve(section);
                });
            },
            { threshold: 0.18 }
        );
        sectionIo.observe(section);

        let coreDone = false;
        if (coreCard) {
            const cardIo = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (!entry.isIntersecting || coreDone) return;
                        coreDone = true;
                        coreCard.classList.add('is-visible');
                        setTimeout(runPhraseSequence, 450);
                        cardIo.unobserve(coreCard);
                    });
                },
                { threshold: 0.32, rootMargin: '0px 0px -6% 0px' }
            );
            cardIo.observe(coreCard);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWhatWeDoSection);
    } else {
        initWhatWeDoSection();
    }
})();

/**
 * MEDORA — Services section (always-visible cards; scroll-linked progress dots)
 */
(function() {
    'use strict';

    function initServicesSection() {
        const grid = document.querySelector('[data-services-grid]');
        if (!grid) return;

        const cards = grid.querySelectorAll('[data-service-card]');
        if (!cards.length) return;

        function updateDots(scrollEl, dotsWrap) {
            if (!scrollEl || !dotsWrap) return;
            const dots = dotsWrap.querySelectorAll('.service-card__dot');
            if (!dots.length) return;
            const max = scrollEl.scrollHeight - scrollEl.clientHeight;
            if (max <= 2) {
                dots.forEach((dot) => dot.classList.add('is-filled'));
                return;
            }
            const pct = Math.max(0, Math.min(1, scrollEl.scrollTop / max));
            const n = dots.length;
            const filledCount = pct >= 0.995 ? n : Math.floor(pct * n);
            dots.forEach((dot, i) => {
                dot.classList.toggle('is-filled', i < filledCount);
            });
        }

        cards.forEach((card) => {
            const scrollEl = card.querySelector('[data-service-scroll]');
            const dotsWrap = card.querySelector('[data-service-dots]');
            if (!scrollEl || !dotsWrap) return;
            const run = () => updateDots(scrollEl, dotsWrap);
            run();
            scrollEl.addEventListener('scroll', run, { passive: true });
            window.addEventListener('resize', run, { passive: true });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initServicesSection);
    } else {
        initServicesSection();
    }

    window.initEngagementAnimations = function() {};
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
 * MEDORA — Final close (pre-contact): staggered lines, CTA ripple, micro delay, bg drift
 */
(function() {
    'use strict';

    const STAGGER_MS = 200;
    const MICRO_DELAY_MS = 2000;
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    function initFinalCloseSection() {
        const section = document.getElementById('final-close');
        if (!section) return;

        const lines = section.querySelectorAll('[data-final-close-line]');
        const cta = section.querySelector('[data-final-close-cta]');
        const micro = section.querySelector('[data-final-close-micro]');
        let played = false;

        function revealAll() {
            lines.forEach((el) => el.classList.add('is-visible'));
            if (cta) cta.classList.add('is-visible');
            if (micro) micro.classList.add('is-visible');
        }

        function playSequence() {
            if (played) return;
            played = true;

            if (motionQuery.matches) {
                revealAll();
                return;
            }

            lines.forEach((el, i) => {
                window.setTimeout(() => el.classList.add('is-visible'), i * STAGGER_MS);
            });

            const ctaDelay = lines.length * STAGGER_MS;
            if (cta) {
                window.setTimeout(() => cta.classList.add('is-visible'), ctaDelay);
            }

            if (micro) {
                window.setTimeout(() => micro.classList.add('is-visible'), MICRO_DELAY_MS);
            }
        }

        if (cta) {
            cta.addEventListener('click', (e) => {
                if (motionQuery.matches) return;
                const rect = cta.getBoundingClientRect();
                const hasPointer =
                    typeof e.clientX === 'number' &&
                    typeof e.clientY === 'number' &&
                    (e.clientX !== 0 || e.clientY !== 0);
                const x = hasPointer ? e.clientX - rect.left : rect.width / 2;
                const y = hasPointer ? e.clientY - rect.top : rect.height / 2;
                const size = Math.max(rect.width, rect.height) * 2.2;
                const ripple = document.createElement('span');
                ripple.className = 'final-close__cta-ripple';
                ripple.style.width = `${size}px`;
                ripple.style.height = `${size}px`;
                ripple.style.left = `${x - size / 2}px`;
                ripple.style.top = `${y - size / 2}px`;
                cta.appendChild(ripple);
                ripple.addEventListener('animationend', () => ripple.remove());
            });
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    playSequence();
                    observer.unobserve(entry.target);
                });
            },
            { threshold: 0.25, rootMargin: '0px 0px -8% 0px' }
        );

        observer.observe(section);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFinalCloseSection);
    } else {
        initFinalCloseSection();
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

