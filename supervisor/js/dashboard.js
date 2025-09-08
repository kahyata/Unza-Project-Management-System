// Generic popup modal functions
function showCustomPopup(html) {
    const modal = document.getElementById('custom-popup-modal');
    const body = document.getElementById('custom-popup-body');
    if (modal && body) {
        body.innerHTML = html;
        modal.classList.add('active');
    }
}

function closeCustomPopup() {
    const modal = document.getElementById('custom-popup-modal');
    if (modal) modal.classList.remove('active');
}
// Accept all selected requests
function acceptAllSelected() {
    const table = document.querySelector('#requests table');
    if (!table) return;
    const checkboxes = table.querySelectorAll('.rowCheckbox:checked');
    checkboxes.forEach(cb => {
        const row = cb.closest('tr');
        if (row) {
            const statusElement = row.querySelector('.status');
            if (statusElement) {
                statusElement.textContent = 'Approved';
                statusElement.className = 'status approved';
            }
        }
    });
    closeBulkActionModal();
}

// Decline all selected requests
function declineAllSelected() {
    const table = document.querySelector('#requests table');
    if (!table) return;
    const checkboxes = table.querySelectorAll('.rowCheckbox:checked');
    checkboxes.forEach(cb => {
        const row = cb.closest('tr');
        if (row && row.parentNode) {
            row.parentNode.removeChild(row);
        }
    });
    closeBulkActionModal();
}

function closeBulkActionModal() {
    document.getElementById('bulk-action-modal').classList.remove('active');
    // Uncheck selectAll if modal is closed without action
    const selectAll = document.getElementById('selectAll');
    if (selectAll) selectAll.checked = false;
}

// Show modal when selectAll is checked
document.addEventListener('DOMContentLoaded', function() {
    const selectAll = document.getElementById('selectAll');
    if (selectAll) {
        selectAll.addEventListener('change', function() {
            if (this.checked) {
                document.getElementById('bulk-action-modal').classList.add('active');
            } else {
                document.getElementById('bulk-action-modal').classList.remove('active');
            }
        });
    }
});
// dashboard.js
// Toggle between Requests, Submissions, Projects, Groups
function showContainer(index) {
    const containers = [
        document.getElementById('requests'),
        document.getElementById('submissions'),
        document.getElementById('meetings'),
        document.querySelector('.teams')
    ];
    containers.forEach((c, i) => {
        if (c) c.classList.toggle('active', i === index - 1);
    });
    // Toggle active button
    const btns = document.querySelectorAll('.project-attributes button');
    btns.forEach((btn, i) => {
        btn.classList.toggle('active', i === index - 1);
    });
}

// Select/Deselect all checkboxes
function toggleSelectAll(source) {
    const checkboxes = document.querySelectorAll('.rowCheckbox');
    checkboxes.forEach(cb => cb.checked = source.checked);
}

// Show more options for a row (dropdown or modal)
function showMoreOptions(element) {
    // Remove any existing option menu
    let existing = document.getElementById('more-options-menu');
    if (existing) existing.remove();

    // Create menu
    const menu = document.createElement('div');
    menu.id = 'more-options-menu';
    menu.style.position = 'absolute';
    menu.style.background = '#fff';
    menu.style.border = '1px solid #ddd';
    menu.style.borderRadius = '6px';
    menu.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
    menu.style.padding = '8px 0';
    menu.style.zIndex = 1000;
    menu.innerHTML = `
        <div class="more-option-item" style="padding:8px 18px;cursor:pointer;">View Details</div>
        <div class="more-option-item" style="padding:8px 18px;cursor:pointer;">Accept</div>
        <div class="more-option-item" style="padding:8px 18px;cursor:pointer;">Decline</div>
    `;

    // Position menu
    const rect = element.getBoundingClientRect();
    menu.style.top = (window.scrollY + rect.bottom + 2) + 'px';
    menu.style.left = (window.scrollX + rect.left - 80) + 'px';

    document.body.appendChild(menu);

    // Handle menu actions
    const [view, accept, decline] = menu.querySelectorAll('.more-option-item');
    view.onclick = function() {
        // Find the row and extract student info
        const row = element.closest('tr');
        if (row) {
            const tds = row.querySelectorAll('td');
            const student = {
                name: tds[1]?.textContent || '',
                program: tds[2]?.textContent || '',
                project: tds[3]?.textContent || '',
                status: tds[4]?.textContent || '',
                category: tds[5]?.textContent || ''
            };
            showStudentModal(student);
        }
        menu.remove();
    };
    accept.onclick = function() {
        // Find the row and update status
        const row = element.closest('tr');
        if (row) {
            const statusElement = row.querySelector('.status');
            if (statusElement) {
                statusElement.textContent = 'Approved';
                statusElement.className = 'status approved';
            }
        }
        menu.remove();
    };
    decline.onclick = function() {
        // Remove the row from the table
        const row = element.closest('tr');
        if (row && row.parentNode) {
            row.parentNode.removeChild(row);
        }
        menu.remove();
    };

    // Remove menu if clicked outside
    setTimeout(() => {
        document.addEventListener('click', function handler(e) {
            if (menu && (!menu.contains(e.target) && e.target !== element)) {
                menu.remove();
                document.removeEventListener('click', handler);
            }
        });
    }, 10);
}

function showStudentModal(student) {
    const modal = document.getElementById('student-modal');
    const body = document.getElementById('student-modal-body');
    if (modal && body) {
        body.innerHTML = `
            <div class="profile-detail">
                <div class="profile-avatar-large">${student.name.split(' ').map(n => n[0]).join('')}</div>
                <div class="profile-name">${student.name}</div>
                <div class="profile-email">${student.program}</div>
                <dl class="profile-info-list">
                    <dt>Project Title</dt><dd>${student.project}</dd>
                    <dt>Status</dt><dd>${student.status}</dd>
                    <dt>Category</dt><dd>${student.category}</dd>
                </dl>
            </div>
        `;
        modal.style.display = 'flex';
    }
}

// Close student modal on close button, click outside, or Escape
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('student-modal');
    const closeBtn = modal ? modal.querySelector('.student-modal-close') : null;
    if (closeBtn && modal) {
        closeBtn.onclick = function() {
            modal.style.display = 'none';
        };
        // Click outside modal content
        modal.addEventListener('mousedown', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
        // Escape key
        document.addEventListener('keydown', function(e) {
            if (modal.style.display === 'flex' && (e.key === 'Escape' || e.key === 'Esc')) {
                modal.style.display = 'none';
            }
        });
    }
});

// Simulated data for demonstration (replace with real fetch in production)
const allRows = [
    ["John Mwanza", "Computer Systems Engineering", "Online Examination System", "Pending", "Group"],
    ["Mary Banda", "Information Systems", "E-Learning Platform", "Approved", "Individual"],
    ["Attress Tembo", "Software Engineering", "Mobile Health App", "Rejected", "Group"],
    ["Chanda Mulenga", "Network Engineering", "Network Monitoring Tool", "Pending", "Group"],
    ["Grace Zulu", "Computer Science", "Library Management", "Pending", "Individual"],
    ["Peter Phiri", "Software Engineering", "Inventory System", "Pending", "Group"],
    // ...add as many as you want
];

let rowsShown = 3; // Show 3 rows initially

function renderRows() {
    const table = document.querySelector('#requests table');
    if (!table) return;
    
    // Remove all rows except the header
    while (table.rows.length > 1) table.deleteRow(1);

    for (let i = 0; i < rowsShown && i < allRows.length; i++) {
        const row = table.insertRow();
        row.innerHTML = `
            <td><input type="checkbox" class="rowCheckbox"></td>
            <td>${allRows[i][0]}</td>
            <td>${allRows[i][1]}</td>
            <td>${allRows[i][2]}</td>
            <td><span class="status ${allRows[i][3].toLowerCase()}">${allRows[i][3]}</span></td>
            <td>${allRows[i][4]}</td>
            <td>
                <span class="more-ic" onclick="showMoreOptions(this)">
                    <svg viewBox="0 0 24 24" fill="none" height="24px" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="18" cy="12" r="1.5" transform="rotate(90 18 12)" fill="#080341"></circle>
                        <circle cx="12" cy="12" r="1.5" transform="rotate(90 12 12)" fill="#080341"></circle>
                        <circle cx="6" cy="12" r="1.5" transform="rotate(90 6 12)" fill="#080341"></circle>
                    </svg>
                </span>
            </td>
        `;
    }

    // Hide button if all rows are shown
    const btn = document.getElementById('showMoreBtn');
    if (btn) {
        if (rowsShown >= allRows.length) {
            btn.style.display = 'none';
        } else {
            btn.style.display = 'block';
        }
    }
}

// Initial render
document.addEventListener('DOMContentLoaded', function() {
    // Only run dashboard code if we're on the dashboard page
    const dashboardContainer = document.querySelector('.dashboard-container');
    
    if (dashboardContainer) {
        renderRows();
        const btn = document.getElementById('showMoreBtn');
        if (btn) {
            btn.onclick = function() {
                rowsShown += 3; // Show 3 more rows each time
                renderRows();
            };
        }
    }
});