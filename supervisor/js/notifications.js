// notifications.js
document.addEventListener('DOMContentLoaded', function() {
    // Only run notification-related code if we're on the notifications page
    function initNotificationsPage() {
        const notificationsContainer = document.querySelector('.notifications');
        if (!notificationsContainer) return;
    // Sample notification data for Supervisors
    const notificationsData = [
            {
                id: 1,
                title: "New Proposal Submission",
                subtitle: "A new project proposal has been submitted by John Doe. Please review it.",
                time: "10:30 AM",
                read: false,
                avatarText: "JD",
                type: "proposal"
            },
            {
                id: 2,
                title: "Progress Report Submitted",
                subtitle: "Jane Smith has submitted her weekly progress report for 'Dynamic Website Project'.",
                time: "9:45 AM",
                read: false,
                avatarText: "JS",
                type: "report"
            },
            {
                id: 3,
                title: "Final Project Submitted",
                subtitle: "The final report for 'E-commerce Platform' has been submitted by David Chen.",
                time: "9:15 AM",
                read: false,
                avatarText: "DC",
                type: "final"
            },
            {
                id: 4,
                title: "Student Project Update",
                subtitle: "Alex Johnson updated the project plan for 'Mobile App for UNZA'.",
                time: "Yesterday",
                read: true,
                avatarText: "AJ",
                type: "update"
            },
            {
                id: 5,
                title: "Proposal Rejected",
                subtitle: "You have rejected the proposal submitted by Sarah Lee.",
                time: "Yesterday",
                read: true,
                avatarText: "SL",
                type: "proposal_action"
            }
        ];
        
    // DOM elements
    const notificationsList = document.getElementById('notifications-list');
    const settingsToggle = document.getElementById('settings-toggle');
    const settingsDropdown = document.getElementById('settings-dropdown');
    const filterButtons = document.querySelectorAll('.filter-btn');
        
    // Current filter state
    let currentFilter = 'all';
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(event) {
            if (settingsDropdown && settingsToggle && 
                !settingsToggle.contains(event.target) && 
                !settingsDropdown.contains(event.target)) {
                settingsDropdown.style.display = 'none';
            }
        });
        
        // Toggle settings dropdown
        if (settingsToggle && settingsDropdown) {
            settingsToggle.addEventListener('click', function(event) {
                event.stopPropagation();
                settingsDropdown.style.display = 
                    settingsDropdown.style.display === 'block' ? 'none' : 'block';
            });
        }
        
        // Function to render notifications based on current filter
        function renderNotifications() {
            if (!notificationsList) return;
            
            // Clear the list
            notificationsList.innerHTML = '';
            
            // Filter notifications based on current filter
            const filteredNotifications = currentFilter === 'all' 
                ? notificationsData 
                : notificationsData.filter(notif => !notif.read);
            
            // Show empty state if no notifications match the filter
            if (filteredNotifications.length === 0) {
                const emptyState = document.createElement('li');
                emptyState.className = 'empty-state';
                emptyState.textContent = currentFilter === 'all' 
                    ? 'No notifications yet' 
                    : 'No unread notifications';
                notificationsList.appendChild(emptyState);
                return;
            }
            
            // Render each notification
            filteredNotifications.forEach(notification => {
                const notifElement = document.createElement('li');
                notifElement.className = `not-item ${notification.read ? '' : 'unread'}`;
                notifElement.dataset.id = notification.id;
                
                notifElement.innerHTML = `
                    <div class="avatar">${notification.avatarText}</div>
                    <div class="not-body">
                        <div class="not-item-title">${notification.title}</div>
                        <div class="not-item-subtitle">${notification.subtitle}</div>
                    </div>
                    <div class="not-time">${notification.time}</div>
                `;
                
                notificationsList.appendChild(notifElement);
            });
            
            // Add click event to mark as read when clicking notification
            document.querySelectorAll('.not-item').forEach(item => {
                item.addEventListener('click', function() {
                    const id = parseInt(this.dataset.id);
                    const notification = notificationsData.find(notif => notif.id === id);
                    if (notification && !notification.read) {
                        notification.read = true;
                        this.classList.remove('unread');
                        renderNotifications();
                    }
                });
            });
        }
        
        // Set up filter buttons
        if (filterButtons) {
            filterButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const filter = this.dataset.filter;
                    
                    // Update active state
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Update current filter and re-render
                    currentFilter = filter;
                    renderNotifications();
                });
            });
        }
        
        // Initial render
        renderNotifications();
    }
    // Expose to window so it can be called after dynamic page load
    window.initNotificationsPage = initNotificationsPage;
    // If notifications are present on initial load, run it
    if (document.querySelector('.notifications')) {
        initNotificationsPage();
    }
});
