document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;
    
    // Sync UI with current theme
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    if (themeIcon) updateThemeIcon(currentTheme);

    if (themeToggle) {
        themeToggle.onclick = function(e) {
            const oldTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = oldTheme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            try {
                localStorage.setItem('theme', newTheme);
            } catch (err) {}
            
            updateThemeIcon(newTheme);
        };
    }

    function updateThemeIcon(theme) {
        if (!themeIcon) return;
        themeIcon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }

    // Navigation Logic
    const navItems = document.querySelectorAll('.nav-item');
    const tabContents = document.querySelectorAll('.tab-content');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            const targetId = item.getAttribute('data-target');
            tabContents.forEach(content => content.classList.remove('active'));

            const targetTab = document.getElementById(targetId);
            if (targetTab) {
                targetTab.classList.add('active');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });

    // Modal / Lightbox Logic
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('full-image');
    const captionText = document.getElementById('modal-caption');
    const closeModal = document.querySelector('.close-modal');

    const galleryImages = document.querySelectorAll('.gallery-grid img');
    galleryImages.forEach(img => {
        img.addEventListener('click', () => {
            modal.style.display = "block";
            modalImg.src = img.src;
            const overlay = img.closest('.gallery-item').querySelector('.overlay');
            captionText.innerHTML = overlay ? overlay.textContent : img.alt;
            document.body.style.overflow = "hidden";
        });
    });

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        });
    }

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        }
    });

    // Initial Status Check
    updateBusinessStatus();
    updateOffersDate();
    // Update every minute
    setInterval(updateBusinessStatus, 60000);
});

// Update Offers Date
function updateOffersDate() {
    const dateElement = document.getElementById('offers-date');
    if (dateElement) {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = now.toLocaleDateString('en-US', options);
    }
}

// Carousel Slide Function
function slideCarousel(btn, direction) {
    const container = btn.parentElement.querySelector('.carousel-container');
    const scrollAmount = container.clientWidth;
    container.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
    });
}

// Business Status Logic
function updateBusinessStatus() {
    const statusBadge = document.getElementById('business-status');
    const headerStatus = document.getElementById('header-status');
    const hoursText = document.getElementById('current-day-hours');
    
    if (!statusBadge || !hoursText) return;

    const now = new Date();
    const day = now.getDay(); // 0 (Sun) to 6 (Sat)
    const hour = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = hour + minutes / 60;

    const schedule = {
        1: { open: 8, close: 24, name: "Monday" },
        2: { open: 8, close: 24, name: "Tuesday" },
        3: { open: 8, close: 24, name: "Wednesday" },
        4: { open: 8, close: 24, name: "Thursday" },
        5: { open: 8, close: 24, name: "Friday" },
        6: { open: 12, close: 20, name: "Saturday" },
        0: { open: 8, close: 12, name: "Sunday" }
    };

    const today = schedule[day];
    let isOpen = false;

    if (currentTime >= today.open && currentTime < today.close) {
        isOpen = true;
    }

    if (isOpen) {
        statusBadge.textContent = "Open Now";
        statusBadge.className = "status-badge open";
        if (headerStatus) {
            headerStatus.textContent = "● Open";
            headerStatus.className = "header-status open";
        }
    } else {
        statusBadge.textContent = "Closed Now";
        statusBadge.className = "status-badge closed";
        if (headerStatus) {
            headerStatus.textContent = "● Closed";
            headerStatus.className = "header-status closed";
        }
    }

    const formatTime = (h) => {
        if (h === 24 || h === 0) return '12:00 AM';
        const period = h >= 12 ? 'PM' : 'AM';
        const displayH = h % 12 || 12;
        return `${displayH}:00 ${period}`;
    };

    hoursText.textContent = `Today (${today.name}): ${formatTime(today.open)} - ${formatTime(today.close)}`;
}

function toggleFullSchedule() {
    const schedule = document.getElementById('full-schedule');
    const btn = document.querySelector('.view-all-times i');
    if (!schedule) return;
    
    schedule.classList.toggle('active');
    if (btn) {
        if (schedule.classList.contains('active')) {
            btn.style.transform = 'rotate(180deg)';
        } else {
            btn.style.transform = 'rotate(0deg)';
        }
    }
}
