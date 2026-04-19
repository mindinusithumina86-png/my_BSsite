document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');
    const tabContents = document.querySelectorAll('.tab-content');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all nav items
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add active class to clicked item
            item.classList.add('active');

            // Get target tab id
            const targetId = item.getAttribute('data-target');

            // Hide all tabs
            tabContents.forEach(content => {
                content.classList.remove('active');
            });

            // Show target tab
            const targetTab = document.getElementById(targetId);
            if (targetTab) {
                targetTab.classList.add('active');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });
});

// Carousel Slide Function
function slideCarousel(btn, direction) {
    const container = btn.parentElement.querySelector('.carousel-container');
    const scrollAmount = container.clientWidth;
    container.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
    });
}
