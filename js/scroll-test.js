// Simple test to verify scroll is working
document.addEventListener('wheel', function(e) {
    const container = document.querySelector('.horizontal-scroll-container');
    if (!container) return;
    
    if (window.innerWidth <= 768) return; // Mobile
    
    const deltaY = e.deltaY;
    
    if (Math.abs(deltaY) > 0) {
        e.preventDefault();
        container.scrollLeft += deltaY * 2;
        console.log('Scrolling:', deltaY, 'New position:', container.scrollLeft);
    }
}, { passive: false });

