// Toggle between Requests, Submissions, Meetings
function showContainer(index) {
    document.getElementById('requests').style.display = (index === 1) ? 'block' : 'none';
    document.getElementById('submissions').style.display = (index === 2) ? 'block' : 'none';
    document.getElementById('meetings').style.display = (index === 3) ? 'block' : 'none';
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
        alert('Show student details here (modal or page).');
        menu.remove();
    };
    accept.onclick = function() {
        // Find the row and update status
        const row = element.closest('tr');
        row.querySelector('.status').textContent = 'Approved';
        row.querySelector('.status').className = 'status approved';
        menu.remove();
    };
    decline.onclick = function() {
        // Remove the row from the table
        const row = element.closest('tr');
        row.parentNode.removeChild(row);
        menu.remove();
    };

    // Remove menu if clicked outside
    setTimeout(() => {
        document.addEventListener('click', function handler(e) {
            if (!menu.contains(e.target) && e.target !== element) {
                menu.remove();
                document.removeEventListener('click', handler);
            }
        });
    }, 10);
}

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
    if (rowsShown >= allRows.length) {
        btn.style.display = 'none';
    } else {
        btn.style.display = 'block';
    }
}

// Initial render
document.addEventListener('DOMContentLoaded', function() {
    renderRows();
    const btn = document.getElementById('showMoreBtn');
    if (btn) {
        btn.onclick = function() {
            rowsShown += 3; // Show 3 more rows each time
            renderRows();
        };
    }
});
