const notifications = [
    {
        type: 'user',
        message: '<span class="name">John Mwanza</span> submitted a project proposal.',
        timestamp: '2025-09-07T14:30:00Z',
        avatar: '',
        read: false
    },
    {
        type: 'admin',
        message: 'Admin posted a new announcement.',
        timestamp: '2025-09-07T12:00:00Z',
        avatar: '',
        read: false
    }
];

// Format date and time
function formatDateTime(isoString) {
    const date = new Date(isoString);
    return date.toLocaleString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
}

// Calculate "time ago"
function timeAgo(isoString) {
    const now = new Date();
    const then = new Date(isoString);
    const diff = Math.floor((now - then) / 1000); // seconds

    if (diff < 60) return `${diff} seconds ago`;
    if (diff < 3600) return `${Math.floor(diff/60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff/3600)} hours ago`;
    return `${Math.floor(diff/86400)} days ago`;
}

function renderNotifications() {
    const list = document.getElementById('notifications-list');
    list.innerHTML = '';
    notifications.forEach((not, idx) => {
        list.innerHTML += `
            <div class="current-notifications${not.read ? ' read' : ''}">
                <div class="avatar" style="background:${not.type === 'admin' ? '#ff9800' : '#007bff'}"></div>
                <div class="not-details">
                    <p>${not.message}</p>
                    <span class="time">${formatDateTime(not.timestamp)} &bull; ${timeAgo(not.timestamp)}</span>
                </div>
                <div class="more" onclick="showNotificationActions(${idx})">
                    <svg viewBox="0 0 24 24" fill="none" height="24px" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="18" cy="12" r="1.5" transform="rotate(90 18 12)" fill="#080341"></circle>
                        <circle cx="12" cy="12" r="1.5" transform="rotate(90 12 12)" fill="#080341"></circle>
                        <circle cx="6" cy="12" r="1.5" transform="rotate(90 6 12)" fill="#080341"></circle>
                    </svg>
                </div>
            </div>
        `;
    });
}

function markAllAsRead() {
    notifications.forEach(n => n.read = true);
    renderNotifications();
}

function showNotificationActions(idx) {
    alert('Actions for notification: ' + notifications[idx].message.replace(/<[^>]+>/g, ''));
}

document.addEventListener('DOMContentLoaded', renderNotifications);