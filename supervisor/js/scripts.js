const sidebar = document.getElementById('sidebar');
const profileAvatar = document.getElementById('profileAvatar');
const profileInfo = document.getElementById('profileInfo');
const profileMenu = document.getElementById('profileMenu');
const settings = document.getElementById('settings');
const logout = document.getElementById('logout');
const panelControl = document.getElementById('panelControl');
const panelMenu = document.getElementById('panelMenu');
const panelClosed = document.getElementById('panelClosed');
const panelOpen = document.getElementById('panelOpen');
const panelHover = document.getElementById('panelHover');
const hamburgerMenu = document.getElementById('hamburgerMenu');
const mobileOverlay = document.getElementById('mobileOverlay');
const mobileProfileAvatar = document.getElementById('mobileProfileAvatar');
const mobileProfileMenu = document.getElementById('mobileProfileMenu');
const mobileSettings = document.getElementById('mobileSettings');
const mobileLogout = document.getElementById('mobileLogout');

function setupSidebarHover(enable) {
    sidebar.removeEventListener('mouseenter', handleMouseEnter);
    sidebar.removeEventListener('mouseleave', handleMouseLeave);
    if (enable && window.innerWidth > 768) {
        sidebar.addEventListener('mouseenter', handleMouseEnter);
        sidebar.addEventListener('mouseleave', handleMouseLeave);
    }
}


function handleMouseEnter() {
    sidebar.classList.remove('closed');
    profileMenu.classList.remove('active');
    panelMenu.classList.remove('active');
}

function handleMouseLeave() {
    sidebar.classList.add('closed');
    profileMenu.classList.remove('active');
    panelMenu.classList.remove('active');
}

// Toggle desktop profile menu
function toggleProfileMenu() {
    if (window.innerWidth > 768) {
        profileMenu.classList.toggle('active');
        panelMenu.classList.remove('active');
        mobileProfileMenu.classList.remove('active');
    }
}

profileAvatar.addEventListener('click', toggleProfileMenu);
profileInfo.addEventListener('click', toggleProfileMenu);

// Toggle desktop panel menu
panelControl.addEventListener('click', function() {
    if (window.innerWidth > 768) {
        panelMenu.classList.toggle('active');
        profileMenu.classList.remove('active');
        mobileProfileMenu.classList.remove('active');
    }
});

// Panel control actions
panelClosed.addEventListener('click', function() {
    sidebar.classList.add('closed');
    localStorage.setItem('sidebarState', 'closed');
    setupSidebarHover(false);
    panelMenu.classList.remove('active');
});

panelOpen.addEventListener('click', function() {
    sidebar.classList.remove('closed');
    localStorage.setItem('sidebarState', 'open');
    setupSidebarHover(false);
    panelMenu.classList.remove('active');
});

panelHover.addEventListener('click', function() {
    sidebar.classList.add('closed');
    localStorage.setItem('sidebarState', 'hover');
    setupSidebarHover(true);
    panelMenu.classList.remove('active');
});

// Desktop settings action
settings.addEventListener('click', function() {
    console.log('Settings clicked');
    profileMenu.classList.remove('active');
});

// Desktop logout action
logout.addEventListener('click', function() {
    console.log('Desktop Logout clicked');
    profileMenu.classList.remove('active');
});

// Toggle mobile profile menu
mobileProfileAvatar.addEventListener('click', function() {
    if (window.innerWidth <= 768) {
        mobileProfileMenu.classList.toggle('active');
        profileMenu.classList.remove('active');
        panelMenu.classList.remove('active');
    }
});

// Mobile settings and logout actions
mobileSettings.addEventListener('click', function() {
    console.log('Mobile Settings clicked');
    mobileProfileMenu.classList.remove('active');
});

mobileLogout.addEventListener('click', function() {
    console.log('Mobile Logout clicked');
    mobileProfileMenu.classList.remove('active');
});

// Close menus when clicking outside
document.addEventListener('click', function(e) {
    if (!profileAvatar.contains(e.target) && !profileInfo.contains(e.target) && !profileMenu.contains(e.target)) {
        profileMenu.classList.remove('active');
    }
    if (!panelControl.contains(e.target) && !panelMenu.contains(e.target)) {
        panelMenu.classList.remove('active');
    }
    if (!mobileProfileAvatar.contains(e.target) && !mobileProfileMenu.contains(e.target)) {
        mobileProfileMenu.classList.remove('active');
    }
});

// Mobile hamburger menu functionality
hamburgerMenu.addEventListener('click', function() {
    sidebar.classList.toggle('mobile-open');
    mobileOverlay.classList.toggle('active');
    mobileProfileMenu.classList.remove('active');
    const icon = hamburgerMenu.querySelector('.material-icons');
    icon.textContent = sidebar.classList.contains('mobile-open') ? 'close' : 'menu';
});

// Close mobile menu when clicking overlay
mobileOverlay.addEventListener('click', function() {
    sidebar.classList.remove('mobile-open');
    mobileOverlay.classList.remove('active');
    mobileProfileMenu.classList.remove('active');
    hamburgerMenu.querySelector('.material-icons').textContent = 'menu';
});

// Handle window resize
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        sidebar.classList.remove('mobile-open');
        mobileOverlay.classList.remove('active');
        mobileProfileMenu.classList.remove('active');
        hamburgerMenu.querySelector('.material-icons').textContent = 'menu';
        const savedState = localStorage.getItem('sidebarState') || 'open';
        sidebar.classList.toggle('closed', savedState === 'closed' || savedState === 'hover');
        setupSidebarHover(savedState === 'hover');
        profileMenu.classList.remove('active');
        panelMenu.classList.remove('active');
    } else {
        sidebar.classList.remove('closed');
        if (!sidebar.classList.contains('mobile-open')) {
            sidebar.classList.add('closed');
        }
        profileMenu.classList.remove('active');
        panelMenu.classList.remove('active');
        mobileProfileMenu.classList.remove('active');
        setupSidebarHover(false);
    }
});

// Restore sidebar state on page load
window.addEventListener('load', function() {
    if (window.innerWidth > 768) {
        const savedState = localStorage.getItem('sidebarState') || 'open';
        sidebar.classList.toggle('closed', savedState === 'closed' || savedState === 'hover');
        setupSidebarHover(savedState === 'hover');
    } else {
        sidebar.classList.add('closed');
        setupSidebarHover(false);
    }
});

// Keyboard support
profileAvatar.addEventListener('keydown', function(e) {
    if ((e.key === 'Enter' || e.key === ' ') && window.innerWidth > 768) {
        e.preventDefault();
        toggleProfileMenu();
    }
});

profileInfo.addEventListener('keydown', function(e) {
    if ((e.key === 'Enter' || e.key === ' ') && window.innerWidth > 768) {
        e.preventDefault();
        toggleProfileMenu();
    }
});

panelControl.addEventListener('keydown', function(e) {
    if ((e.key === 'Enter' || e.key === ' ') && window.innerWidth > 768) {
        e.preventDefault();
        panelMenu.classList.toggle('active');
        profileMenu.classList.remove('active');
    }
});

settings.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        settings.click();
    }
});

logout.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        logout.click();
    }
});

panelClosed.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        panelClosed.click();
    }
});

panelOpen.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        panelOpen.click();
    }
});

panelHover.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        panelHover.click();
    }
});

mobileProfileAvatar.addEventListener('keydown', function(e) {
    if ((e.key === 'Enter' || e.key === ' ') && window.innerWidth <= 768) {
        e.preventDefault();
        mobileProfileAvatar.click();
    }
});

mobileSettings.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        mobileSettings.click();
    }
});

mobileLogout.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        mobileLogout.click();
    }
});

// Escape key to close menus
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        if (window.innerWidth <= 768) {
            if (sidebar.classList.contains('mobile-open')) {
                sidebar.classList.remove('mobile-open');
                mobileOverlay.classList.remove('active');
                hamburgerMenu.querySelector('.material-icons').textContent = 'menu';
            }
            mobileProfileMenu.classList.remove('active');
        } else {
            profileMenu.classList.remove('active');
            panelMenu.classList.remove('active');
        }
    }
});

// Initialize page-specific functionality
function initializePageFunctionality(page) {
    if (page === 'projects.html') {
        console.log('Initializing projects.html');
    } else if (page === 'dashboard.html') {
        console.log('Initializing dashboard.html');
    }
}

// SPA navigation for sidebar menu
document.querySelectorAll('.menu-item').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelectorAll('.menu-item').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        const page = this.getAttribute('data-page');
        if (page) {
            fetch('pages/' + page)
                .then(res => res.text())
                .then(html => {
                    document.querySelector('.main-content').innerHTML = html;
                    initializePageFunctionality(page);
                })
                .catch(error => {
                    console.error('Error loading page:', error);
                    document.querySelector('.main-content').innerHTML = '<div class="content-card"><h2>Error</h2><p>Failed to load page content.</p></div>';
                });
        }
    });
});

// Load default page
window.addEventListener('DOMContentLoaded', function() {
    const active = document.querySelector('.menu-item.active');
    if (active && active.getAttribute('data-page')) {
        const page = active.getAttribute('data-page');
        fetch('pages/' + page)
            .then(res => res.text())
            .then(html => {
                document.querySelector('.main-content').innerHTML = html;
                initializePageFunctionality(page);
            })
            .catch(error => {
                console.error('Error loading page:', error);
            });
    }
});