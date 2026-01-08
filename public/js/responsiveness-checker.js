/**
 * Responsiveness Checker
 * Tests the site on different device sizes and saves results to localStorage
 */

const deviceBreakpoints = {
    mobile: { width: 375, height: 667, name: 'iPhone SE' },
    mobileLarge: { width: 414, height: 896, name: 'iPhone 11 Pro Max' },
    tablet: { width: 768, height: 1024, name: 'iPad' },
    tabletLandscape: { width: 1024, height: 768, name: 'iPad Landscape' },
    desktop: { width: 1280, height: 720, name: 'Desktop HD' },
    desktopLarge: { width: 1920, height: 1080, name: 'Desktop Full HD' },
    desktopXL: { width: 2560, height: 1440, name: 'Desktop 2K' }
};

const cssBreakpoints = {
    mobile: 768,
    tablet: 1023,
    desktop: 1024
};

class ResponsivenessChecker {
    constructor() {
        this.results = {
            timestamp: new Date().toISOString(),
            viewport: window.innerWidth,
            device: this.detectDevice(),
            tests: [],
            issues: []
        };
    }

    detectDevice() {
        const width = window.innerWidth;
        if (width <= cssBreakpoints.mobile) return 'mobile';
        if (width <= cssBreakpoints.tablet) return 'tablet';
        return 'desktop';
    }

    checkElementVisibility(selector, name) {
        const element = document.querySelector(selector);
        if (!element) {
            this.results.issues.push({
                type: 'missing',
                element: name,
                selector: selector
            });
            return false;
        }

        const rect = element.getBoundingClientRect();
        const isVisible = rect.width > 0 && rect.height > 0 && 
                         window.getComputedStyle(element).display !== 'none' &&
                         window.getComputedStyle(element).visibility !== 'hidden' &&
                         window.getComputedStyle(element).opacity !== '0';

        if (!isVisible) {
            this.results.issues.push({
                type: 'hidden',
                element: name,
                selector: selector
            });
        }

        return isVisible;
    }

    checkTextOverflow(selector, name) {
        const element = document.querySelector(selector);
        if (!element) return false;

        const styles = window.getComputedStyle(element);
        const hasOverflow = element.scrollWidth > element.clientWidth ||
                           element.scrollHeight > element.clientHeight;

        if (hasOverflow) {
            this.results.issues.push({
                type: 'overflow',
                element: name,
                selector: selector,
                scrollWidth: element.scrollWidth,
                clientWidth: element.clientWidth
            });
        }

        return !hasOverflow;
    }

    checkLayoutBreakpoints() {
        const width = window.innerWidth;
        const breakpointStatus = {
            isMobile: width <= cssBreakpoints.mobile,
            isTablet: width > cssBreakpoints.mobile && width <= cssBreakpoints.tablet,
            isDesktop: width >= cssBreakpoints.desktop
        };

        this.results.tests.push({
            name: 'Layout Breakpoints',
            status: 'pass',
            details: breakpointStatus
        });

        return breakpointStatus;
    }

    checkHeroSection() {
        const heroSection = document.querySelector('.hero-section');
        if (!heroSection) {
            this.results.issues.push({
                type: 'missing',
                element: 'Hero Section',
                selector: '.hero-section'
            });
            return false;
        }

        const rect = heroSection.getBoundingClientRect();
        const isVisible = this.checkElementVisibility('.hero-section', 'Hero Section');
        const hasContent = this.checkElementVisibility('.hero-content', 'Hero Content');
        const hasHeadline = this.checkElementVisibility('.hero-headline', 'Hero Headline');
        const hasButtons = this.checkElementVisibility('.hero-ctas', 'Hero Buttons');

        this.results.tests.push({
            name: 'Hero Section',
            status: (isVisible && hasContent && hasHeadline && hasButtons) ? 'pass' : 'fail',
            details: {
                visible: isVisible,
                hasContent: hasContent,
                hasHeadline: hasHeadline,
                hasButtons: hasButtons,
                height: rect.height,
                width: rect.width
            }
        });

        return isVisible && hasContent && hasHeadline && hasButtons;
    }

    checkNavigation() {
        const nav = document.querySelector('.top-navigation');
        if (!nav) {
            this.results.issues.push({
                type: 'missing',
                element: 'Navigation',
                selector: '.top-navigation'
            });
            return false;
        }

        const isVisible = this.checkElementVisibility('.top-navigation', 'Navigation');
        const navItems = document.querySelectorAll('.nav-item');
        const hasItems = navItems.length > 0;

        this.results.tests.push({
            name: 'Navigation',
            status: (isVisible && hasItems) ? 'pass' : 'fail',
            details: {
                visible: isVisible,
                itemCount: navItems.length,
                hasItems: hasItems
            }
        });

        return isVisible && hasItems;
    }

    checkSections() {
        const sections = [
            { selector: '.reality-section', name: 'Reality Section' },
            { selector: '.failure-section', name: 'Why Adoption Fails' },
            { selector: '.medora-does-section', name: 'What Medora Does' },
            { selector: '.engagement-section', name: 'Engagement Section' },
            { selector: '.founder-section', name: 'Founder Section' },
            { selector: '.packages-section', name: 'Packages Section' },
            { selector: '.contact-section', name: 'Contact Section' }
        ];

        const sectionResults = sections.map(section => {
            const isVisible = this.checkElementVisibility(section.selector, section.name);
            return {
                name: section.name,
                visible: isVisible,
                status: isVisible ? 'pass' : 'fail'
            };
        });

        this.results.tests.push({
            name: 'All Sections',
            status: sectionResults.every(s => s.status === 'pass') ? 'pass' : 'fail',
            details: sectionResults
        });

        return sectionResults;
    }

    checkImages() {
        const images = document.querySelectorAll('img');
        const brokenImages = [];
        
        images.forEach((img, index) => {
            if (!img.complete || img.naturalHeight === 0) {
                brokenImages.push({
                    index: index,
                    src: img.src,
                    alt: img.alt || 'No alt text'
                });
            }
        });

        if (brokenImages.length > 0) {
            this.results.issues.push({
                type: 'broken-image',
                count: brokenImages.length,
                images: brokenImages
            });
        }

        this.results.tests.push({
            name: 'Images',
            status: brokenImages.length === 0 ? 'pass' : 'fail',
            details: {
                total: images.length,
                broken: brokenImages.length,
                brokenImages: brokenImages
            }
        });

        return brokenImages.length === 0;
    }

    checkResponsiveGrid() {
        const grids = document.querySelectorAll('.grid, .hero-grid, .reality-editorial-grid');
        const gridIssues = [];

        grids.forEach((grid, index) => {
            const styles = window.getComputedStyle(grid);
            const display = styles.display;
            const gridTemplate = styles.gridTemplateColumns;

            if (display === 'grid' && !gridTemplate || gridTemplate === 'none') {
                gridIssues.push({
                    index: index,
                    selector: grid.className
                });
            }
        });

        this.results.tests.push({
            name: 'Responsive Grids',
            status: gridIssues.length === 0 ? 'pass' : 'fail',
            details: {
                total: grids.length,
                issues: gridIssues.length
            }
        });

        return gridIssues.length === 0;
    }

    runAllTests() {
        console.log('🔍 Running Responsiveness Tests...');
        
        this.checkLayoutBreakpoints();
        this.checkHeroSection();
        this.checkNavigation();
        this.checkSections();
        this.checkImages();
        this.checkResponsiveGrid();

        // Calculate overall status
        const failedTests = this.results.tests.filter(t => t.status === 'fail').length;
        this.results.overallStatus = failedTests === 0 ? 'pass' : 'fail';
        this.results.failedTests = failedTests;
        this.results.totalTests = this.results.tests.length;

        console.log(`✅ Tests Complete: ${this.results.totalTests - failedTests}/${this.results.totalTests} passed`);
        
        if (this.results.issues.length > 0) {
            console.warn(`⚠️  Found ${this.results.issues.length} issues`);
        }

        return this.results;
    }

    saveToLocalStorage() {
        try {
            const key = 'medora_responsiveness_check';
            const existingData = JSON.parse(localStorage.getItem(key) || '[]');
            
            // Keep only last 10 checks
            existingData.push(this.results);
            if (existingData.length > 10) {
                existingData.shift();
            }
            
            localStorage.setItem(key, JSON.stringify(existingData));
            console.log('💾 Results saved to localStorage');
            return true;
        } catch (error) {
            console.error('❌ Failed to save to localStorage:', error);
            return false;
        }
    }

    getStoredResults() {
        try {
            const key = 'medora_responsiveness_check';
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('❌ Failed to read from localStorage:', error);
            return [];
        }
    }

    generateReport() {
        const report = {
            current: this.results,
            stored: this.getStoredResults(),
            summary: {
                currentViewport: window.innerWidth,
                device: this.detectDevice(),
                status: this.results.overallStatus,
                testsPassed: this.results.totalTests - this.results.failedTests,
                testsTotal: this.results.totalTests,
                issuesFound: this.results.issues.length
            }
        };

        return report;
    }
}

// Auto-run on page load if in development
if (typeof window !== 'undefined') {
    // Check if we're in development mode
    const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    if (isDev) {
        // Make checker available globally
        window.ResponsivenessChecker = ResponsivenessChecker;
        
        // Auto-run checker
        window.addEventListener('load', () => {
            setTimeout(() => {
                const checker = new ResponsivenessChecker();
                checker.runAllTests();
                checker.saveToLocalStorage();
                
                // Log summary
                const report = checker.generateReport();
                console.log('📊 Responsiveness Report:', report.summary);
            }, 1000);
        });
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ResponsivenessChecker;
}

