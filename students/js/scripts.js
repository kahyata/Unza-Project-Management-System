/**
 * scripts.js
 * Main JavaScript file for UNZA Project Management System
 * Handles sidebar functionality, project management, and form processing
 */

// Get references to elements
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

// Import Firestore from root/firebase.js
import { db } from '../../root/firebase.js';
import { collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Project management state
let projects = [];
let currentStep = 1;
const totalSteps = 3;

// Function to set up or remove hover events based on sidebar state
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

// Project management functions
async function createProject(formData) {
    console.log('Creating project with data:', formData);
    const project = {
        participantType: formData.participantType,
        firstName: formData.firstName,
        middleName: formData.middleName || 'Not specified',
        lastName: formData.lastName,
        email: formData.email,
        program: formData.program,
        computerNumber: formData.computerNumber || 'Not specified',
        title: formData.title,
        category: formData.category,
        projectBrief: formData.projectBrief,
        supervisor: formData.supervisor || 'Not specified',
        createdAt: new Date().toLocaleDateString(),
        status: 'waiting'
    };
    try {
        // Save to Firestore
    // Fetch projects from Firestore and update the UI
    async function fetchProjects() {
        try {
            const querySnapshot = await getDocs(collection(db, "projects"));
            projects = [];
            querySnapshot.forEach((doc) => {
                projects.push({ id: doc.id, ...doc.data() });
            });
            updateProjectsList();
        } catch (error) {
            console.error('Error fetching projects from Firestore:', error);
        }
    }
        const docRef = await addDoc(collection(db, "projects"), project);
        project.id = docRef.id;
        projects.push(project);
        updateProjectsList();
        console.log('Project saved to Firestore with ID:', docRef.id);
    } catch (error) {
        console.error('Error saving project to Firestore:', error);
        alert('Failed to save project. Please try again.');
    }
}

function updateProjectsList() {
    const projectsList = document.getElementById('projectsList');
    const noProjectsMsg = document.getElementById('noProjectsMsg');
    
    if (!projectsList || !noProjectsMsg) {
        console.error('projectsList or noProjectsMsg not found');
        return;
    }
    
    if (projects.length === 0) {
        projectsList.style.display = 'none';
        noProjectsMsg.style.display = 'block';
    } else {
        noProjectsMsg.style.display = 'none';
        projectsList.style.display = 'block';
        
        projectsList.innerHTML = projects.map(project => `
            <div class="project-item" data-id="${project.id}">
                <div class="project-title">${escapeHtml(project.title)}</div>
                <div class="project-description">${escapeHtml(project.projectBrief)}</div>
                <div class="project-details">
                    <span class="detail-badge">${escapeHtml(project.category)}</span>
                    <span class="detail-badge">${escapeHtml(project.program)}</span>
                    <span class="detail-badge">${escapeHtml(project.supervisor)}</span>
                </div>
                <div class="project-meta">
                    <span class="project-status ${project.status.toLowerCase()}">${project.status}</span>
                    <span class="project-date">Created: ${project.createdAt}</span>
                </div>
            </div>
        `).join('');
    }
}

function showNewProjectForm() {
    console.log('Showing new project form');
    const newProjectCard = document.getElementById('newProjectCard');
    if (newProjectCard) {
        newProjectCard.style.display = 'block';
        resetFormSteps();
        const firstNameInput = document.getElementById('firstName');
        if (firstNameInput) {
            firstNameInput.focus();
        } else {
            console.error('firstName input not found');
        }
    } else {
        console.error('newProjectCard element not found');
    }
}

function hideNewProjectForm() {
    console.log('Hiding new project form');
    const newProjectCard = document.getElementById('newProjectCard');
    const newProjectForm = document.getElementById('newProjectForm');
    if (newProjectCard) newProjectCard.style.display = 'none';
    else console.error('newProjectCard not found');
    if (newProjectForm) newProjectForm.reset();
    else console.error('newProjectForm not found');
    resetFormSteps();
    clearErrorMessages();
}

function resetFormSteps() {
    console.log('Resetting form steps');
    currentStep = 1;
    updateStepDisplay();
}

function clearErrorMessages() {
    console.log('Clearing error messages');
    document.querySelectorAll('.error-message').forEach(el => el.remove());
}

function showErrorMessage(field, message) {
    console.log(`Showing error message for ${field.id || field.className}: ${message}`);
    clearErrorMessages();
    const error = document.createElement('div');
    error.className = 'error-message';
    error.style.color = '#dc3545';
    error.style.fontSize = '0.9em';
    error.style.marginTop = '5px';
    error.textContent = message;
    field.parentNode.appendChild(error);
}

function validateCurrentStep() {
    console.log(`Validating step ${currentStep}`);
    const step1Required = ['participantType', 'firstName', 'lastName', 'email', 'program'];
    const step2Required = ['title', 'category', 'projectBrief'];
    
    let requiredFields = [];
    if (currentStep === 1) requiredFields = step1Required;
    if (currentStep === 2) requiredFields = step2Required;
    
    for (let fieldId of requiredFields) {
        const field = document.getElementById(fieldId);
        if (!field) {
            console.error(`Field with ID ${fieldId} not found`);
            return false;
        }
        if (!field.value.trim()) {
            console.log(`Validation failed: ${fieldId} is empty`);
            showErrorMessage(field, `Please enter a valid ${fieldId.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
            field.focus();
            field.style.borderColor = '#dc3545';
            setTimeout(() => {
                field.style.borderColor = '#e1e5e9';
            }, 3000);
            return false;
        }
    }
    
    if (currentStep === 1) {
        const email = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value.trim())) {
            console.log('Validation failed: Invalid email format');
            showErrorMessage(email, 'Please enter a valid email address');
            email.focus();
            email.style.borderColor = '#dc3545';
            setTimeout(() => {
                email.style.borderColor = '#e1e5e9';
            }, 3000);
            return false;
        }
    }
    
    if (currentStep === 3) {
        const selectedSupervisor = document.querySelector('input[name="supervisor"]:checked');
        const supervisorContainer = document.querySelector('.supervisor-profiles');
        if (!selectedSupervisor) {
            console.log('Validation failed: No supervisor selected');
            if (supervisorContainer) {
                showErrorMessage(supervisorContainer, 'Please select a supervisor');
            } else {
                console.error('supervisor-profiles container not found');
            }
            return false;
        }
    }
    
    console.log(`Validation passed for step ${currentStep}`);
    clearErrorMessages();
    return true;
}

function updateStepDisplay() {
    console.log(`Updating step display to step ${currentStep}`);
    const steps = document.querySelectorAll('.step');
    if (steps.length === 0) {
        console.error('No step indicators found with class .step');
    }
    steps.forEach((step, index) => {
        const stepNum = index + 1;
        step.classList.remove('active', 'completed');
        if (stepNum === currentStep) {
            step.classList.add('active');
        } else if (stepNum < currentStep) {
            step.classList.add('completed');
        }
    });
    
    const formSections = document.querySelectorAll('.form-section');
    if (formSections.length === 0) {
        console.error('No form sections found with class .form-section');
    }
    formSections.forEach((step, index) => {
        step.classList.toggle('active', index + 1 === currentStep);
    });
    
    // No need to set button display, as buttons are inside the sections and visibility is handled by section toggle
    
    if (currentStep === 3) {
        updateReviewSection();
    }
}

function updateReviewSection() {
    console.log('Updating review section');
    const reviewMappings = {
        'reviewParticipantType': 'participantType',
        'reviewFirstName': 'firstName',
        'reviewMiddleName': 'middleName',
        'reviewLastName': 'lastName',
        'reviewEmail': 'email',
        'reviewProgram': 'program',
        'reviewComputerNumber': 'computerNumber',
        'reviewTitle': 'title',
        'reviewCategory': 'category',
        'reviewProjectBrief': 'projectBrief',
        'reviewSupervisor': 'supervisor'
    };
    
    Object.entries(reviewMappings).forEach(([reviewId, inputId]) => {
        const reviewElement = document.getElementById(reviewId);
        if (!reviewElement) {
            console.error(`Review element with ID ${reviewId} not found`);
            return;
        }
        
        let value;
        if (inputId === 'supervisor') {
            const selectedSupervisor = document.querySelector('input[name="supervisor"]:checked');
            value = selectedSupervisor ? selectedSupervisor.value : 'Not specified';
        } else {
            const inputElement = document.getElementById(inputId);
            if (!inputElement) {
                console.error(`Input element with ID ${inputId} not found`);
                return;
            }
            value = inputElement.value.trim();
            if (inputId === 'program' || inputId === 'category') {
                value = inputElement.options[inputElement.selectedIndex]?.text || value;
            }
        }
        
        reviewElement.textContent = value || 'Not specified';
        reviewElement.className = value ? 'review-value' : 'review-value empty';
    });
}

function nextStep() {
    console.log('Attempting to move to next step');
    if (validateCurrentStep()) {
        if (currentStep < totalSteps) {
            currentStep++;
            console.log(`Advancing to step ${currentStep}`);
            updateStepDisplay();
        } else {
            console.log('Already at the last step');
        }
    } else {
        console.log('Validation failed, cannot advance');
    }
}

function prevStep() {
    console.log('Moving to previous step');
    if (currentStep > 1) {
        currentStep--;
        updateStepDisplay();
    }
}

function submitProject() {
    console.log('Submitting project');
    const formData = {
        participantType: document.getElementById('participantType')?.value || '',
        firstName: document.getElementById('firstName')?.value.trim() || '',
        middleName: document.getElementById('middleName')?.value.trim() || '',
        lastName: document.getElementById('lastName')?.value.trim() || '',
        email: document.getElementById('email')?.value.trim() || '',
        program: document.getElementById('program')?.value || '',
        computerNumber: document.getElementById('computerNumber')?.value.trim() || '',
        title: document.getElementById('title')?.value.trim() || '',
        category: document.getElementById('category')?.value || '',
        projectBrief: document.getElementById('projectBrief')?.value.trim() || '',
        supervisor: document.querySelector('input[name="supervisor"]:checked')?.value || ''
    };
    
    createProject(formData);
    hideNewProjectForm();
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Event delegation for dynamically loaded content
document.addEventListener('click', function(e) {
    const target = e.target;
    if (target.classList.contains('new-project-btn') || target.closest('.new-project-btn')) {
        e.preventDefault();
        console.log('New Project button clicked');
        showNewProjectForm();
    }
    
    if (target.id === 'cancelBtn') {
        e.preventDefault();
        console.log('Cancel button clicked');
        hideNewProjectForm();
    }
    
    if (target.classList.contains('next-button')) {
        e.preventDefault();
        console.log('Next button clicked');
        nextStep();
    }
    
    if (target.classList.contains('previous-button')) {
        e.preventDefault();
        console.log('Previous button clicked');
        prevStep();
    }
    
    if (target.classList.contains('submit-button')) {
        e.preventDefault();
        console.log('Submit button clicked');
        submitProject();
    }
});
    // Fetch projects from Firestore
    fetchProjects();


// Handle form submissions
document.addEventListener('submit', function(e) {
    if (e.target.id === 'newProjectForm') {
        e.preventDefault();
        console.log('Form submission prevented');
    }
});

// Initialize page-specific functionality
function initializePageFunctionality(page) {
    if (page === 'projects.html') {
        console.log('Initializing projects.html');
        setTimeout(() => {
            updateProjectsList();
        }, 100);
    } else if (page === 'dashboard.html') {
        console.log('Initializing dashboard.html');
        // Initialize charts for dashboard
        setTimeout(() => {
            if (window.chartUtils && typeof window.chartUtils.initializeCharts === 'function') {
                window.chartUtils.initializeCharts();
            } else {
                console.error('Chart utils not available');
            }
        }, 150);
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