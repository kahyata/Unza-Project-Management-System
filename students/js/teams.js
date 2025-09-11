 // Current user simulation (in a real app, this would come from authentication)
        const currentUser = {
            id: 'user-1',
            name: 'John Doe',
            email: 'john.doe@example.com',
            avatar: 'JD'
        };

        // Sample initial data
        let teams = [
           
        ];

        // DOM Elements
        const teamsGrid = document.getElementById('teamsGrid');
        const noTeamsMsg = document.getElementById('noTeamsMsg');
        const createTeamBtn = document.getElementById('createTeamBtn');
        const createTeamModal = document.getElementById('createTeamModal');
        const closeModal = document.getElementById('closeModal');
        const cancelCreate = document.getElementById('cancelCreate');
        const createTeamForm = document.getElementById('createTeamForm');
        const teamSettingsModal = document.getElementById('teamSettingsModal');
        const closeSettingsModal = document.getElementById('closeSettingsModal');
        const settingsMembersList = document.getElementById('settingsMembersList');
        const leaveTeamBtn = document.getElementById('leaveTeamBtn');
        const deleteTeamBtn = document.getElementById('deleteTeamBtn');
        const removeMemberModal = document.getElementById('removeMemberModal');
        const closeRemoveModal = document.getElementById('closeRemoveModal');
        const cancelRemove = document.getElementById('cancelRemove');
        const confirmRemove = document.getElementById('confirmRemove');
        const removeMemberName = document.getElementById('removeMemberName');
        const inviteMemberModal = document.getElementById('inviteMemberModal');
    const closeInviteModalBtn = document.getElementById('closeInviteModal');
        const cancelInvite = document.getElementById('cancelInvite');
        const inviteMemberForm = document.getElementById('inviteMemberForm');
    const teamCollabRow = document.getElementById('teamCollabRow');
    const githubLinkCard = document.getElementById('githubLinkCard');
    const todoListContainer = document.getElementById('todo-list-container');
    const addTodoForm = document.getElementById('add-todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoDueDate = document.getElementById('todo-due-date');
    const githubLinkForm = document.getElementById('github-link-form');
    const githubLinkInput = document.getElementById('github-link-input');
    const githubLinkDisplay = document.getElementById('github-link-display');
        const commentsContainer = document.getElementById('comments-container');
        const commentInput = document.getElementById('comment-input');
        const submitCommentBtn = document.getElementById('submit-comment-btn');
        const commentCount = document.getElementById('comment-count');
        const notification = document.getElementById('notification');

        // State variables
        let currentTeamId = null;
        let memberToRemove = null;
        let teamToRemoveFrom = null;

        // Initialize the application
        function init() {
            renderTeams();
            setupEventListeners();
        }

        // Render all teams
        function renderTeams() {
            teamsGrid.innerHTML = '';
            
            if (teams.length === 0) {
                noTeamsMsg.style.display = 'block';
                return;
            }
            
            noTeamsMsg.style.display = 'none';
            
            teams.forEach(team => {
                const teamCard = createTeamCard(team);
                teamsGrid.appendChild(teamCard);
            });
        }

        // Create a team card element
        function createTeamCard(team) {
            const teamCard = document.createElement('div');
            teamCard.className = 'team-card';
            teamCard.dataset.teamId = team.id;
            
            const isAdmin = team.members.find(m => m.id === currentUser.id)?.role === 'admin';
            const isCreator = team.createdBy === currentUser.id;
            
            teamCard.innerHTML = `
                <div class="team-card-header">
                    <div class="team-info">
                        <h3 class="team-name">${team.name}</h3>
                        <p class="team-description">${team.description}</p>
                    </div>
                    <span class="team-status status-${team.status}">${team.status}</span>
                </div>
                
                <div class="team-members">
                    <h4 class="members-title">Members (${team.members.length})</h4>
                    <ul class="member-list">
                        ${team.members.slice(0, 3).map(member => `
                            <li class="member-item">
                                <div class="member-avatar">${member.avatar}</div>
                                <div class="member-info">
                                    <div class="member-name">${member.name} ${member.id === currentUser.id ? '(You)' : ''}</div>
                                    <div class="member-role">${member.role}</div>
                                </div>
                            </li>
                        `).join('')}
                        ${team.members.length > 3 ? `
                            <li class="member-item">
                                <div class="member-avatar">+${team.members.length - 3}</div>
                                <div class="member-info">
                                    <div class="member-name">and ${team.members.length - 3} more</div>
                                </div>
                            </li>
                        ` : ''}
                    </ul>
                </div>
                
                <div class="team-actions">
                    <button class="team-action-btn view-btn" data-action="view">
                        <span class="material-icons">visibility</span> View
                    </button>
                    <button class="team-action-btn invite-btn" data-action="invite">
                        <span class="material-icons">person_add</span> Invite
                    </button>
                    <div class="team-dropdown">
                        <button class="dropdown-toggle">
                            <span class="material-icons">more_vert</span>
                        </button>
                        <div class="dropdown-menu">
                            <div class="dropdown-item" data-action="settings">
                                <span class="material-icons">settings</span> Settings
                            </div>
                            ${isAdmin || isCreator ? `
                                <div class="dropdown-item delete" data-action="delete">
                                    <span class="material-icons">delete</span> Delete Team
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;
            
            // Add event listeners to the buttons
            teamCard.querySelector('[data-action="view"]').addEventListener('click', () => {
                viewTeamDiscussion(team.id);
            });
            
            teamCard.querySelector('[data-action="invite"]').addEventListener('click', () => {
                openInviteModal(team.id);
            });
            
            teamCard.querySelector('[data-action="settings"]').addEventListener('click', () => {
                openTeamSettings(team.id);
            });
            
            if (isAdmin || isCreator) {
                teamCard.querySelector('[data-action="delete"]').addEventListener('click', () => {
                    deleteTeam(team.id);
                });
            }
            
            // Toggle dropdown menu
            const dropdownToggle = teamCard.querySelector('.dropdown-toggle');
            const dropdownMenu = teamCard.querySelector('.dropdown-menu');
            
            dropdownToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdownMenu.classList.toggle('show');
            });
            
            // Close dropdown when clicking elsewhere
            document.addEventListener('click', () => {
                dropdownMenu.classList.remove('show');
            });
            
            return teamCard;
        }

        // Setup event listeners
        function setupEventListeners() {
            // Create team modal
            createTeamBtn.addEventListener('click', () => {
                createTeamModal.style.display = 'flex';
            });
            
            closeModal.addEventListener('click', closeCreateTeamModal);
            cancelCreate.addEventListener('click', closeCreateTeamModal);
            
            createTeamForm.addEventListener('submit', (e) => {
                e.preventDefault();
                createNewTeam();
            });
            
            // Team settings modal
            closeSettingsModal.addEventListener('click', closeTeamSettingsModal);
            
            leaveTeamBtn.addEventListener('click', () => {
                leaveTeam(currentTeamId);
            });
            
            deleteTeamBtn.addEventListener('click', () => {
                deleteTeam(currentTeamId);
            });
            
            // Remove member modal
            closeRemoveModal.addEventListener('click', closeRemoveMemberModal);
            cancelRemove.addEventListener('click', closeRemoveMemberModal);
            confirmRemove.addEventListener('click', removeMember);
            
            // Invite member modal
            closeInviteModalBtn.addEventListener('click', closeInviteModal);
            cancelInvite.addEventListener('click', closeInviteModal);
            
            inviteMemberForm.addEventListener('submit', (e) => {
                e.preventDefault();
                inviteMember();
            });
            
            // Comments
            commentInput.addEventListener('input', () => {
                submitCommentBtn.disabled = commentInput.value.trim() === '';
            });
            
            submitCommentBtn.addEventListener('click', addComment);
            
            // Close modals when clicking outside
            window.addEventListener('click', (e) => {
                if (e.target === createTeamModal) closeCreateTeamModal();
                if (e.target === teamSettingsModal) closeTeamSettingsModal();
                if (e.target === removeMemberModal) closeRemoveMemberModal();
                if (e.target === inviteMemberModal) closeInviteModal();
            });
        }

        // Create a new team
        function createNewTeam() {
            const teamName = document.getElementById('teamName').value;
            const teamDescription = document.getElementById('teamDescription').value;
            
            const newTeam = {
                id: 'team-' + Date.now(),
                name: teamName,
                description: teamDescription,
                status: 'active',
                createdBy: currentUser.id,
                members: [
                    { 
                        id: currentUser.id, 
                        name: currentUser.name, 
                        email: currentUser.email, 
                        role: 'admin',
                        avatar: currentUser.avatar
                    }
                ],
                comments: []
            };
            
            teams.push(newTeam);
            renderTeams();
            closeCreateTeamModal();
            createTeamForm.reset();
            showNotification('Team created successfully!');
        }

        // Open team settings
        function openTeamSettings(teamId) {
            currentTeamId = teamId;
            const team = teams.find(t => t.id === teamId);
            
            if (!team) return;
            
            document.getElementById('settingsTeamName').textContent = `${team.name} Settings`;
            renderTeamMembers(team);
            
            // Show delete button only for team creator
            deleteTeamBtn.style.display = team.createdBy === currentUser.id ? 'block' : 'none';
            
            teamSettingsModal.style.display = 'flex';
        }

        // Render team members in settings
        function renderTeamMembers(team) {
            settingsMembersList.innerHTML = '';
            
            team.members.forEach(member => {
                const memberItem = document.createElement('div');
                memberItem.className = 'settings-member-item';
                
                const isCurrentUser = member.id === currentUser.id;
                const isAdmin = member.role === 'admin';
                const isCreator = team.createdBy === member.id;
                const canRemove = !isCurrentUser && !isCreator && 
                                 (team.members.find(m => m.id === currentUser.id)?.role === 'admin' || 
                                  team.createdBy === currentUser.id);
                
                memberItem.innerHTML = `
                    <div class="settings-member-info">
                        <div class="member-avatar">${member.avatar}</div>
                        <div>
                            <div class="member-name">${member.name} ${isCurrentUser ? '(You)' : ''}</div>
                            <div class="member-role">${member.role} ${isCreator ? ' (Creator)' : ''}</div>
                        </div>
                    </div>
                    <div class="settings-member-actions">
                        ${canRemove ? `
                            <button class="remove-member-btn" data-member-id="${member.id}">
                                <span class="material-icons">person_remove</span>
                            </button>
                        ` : ''}
                    </div>
                `;
                
                if (canRemove) {
                    memberItem.querySelector('.remove-member-btn').addEventListener('click', () => {
                        openRemoveMemberModal(member, team.id);
                    });
                }
                
                settingsMembersList.appendChild(memberItem);
            });
        }

        // Open remove member modal
        function openRemoveMemberModal(member, teamId) {
            memberToRemove = member;
            teamToRemoveFrom = teamId;
            removeMemberName.textContent = member.name;
            removeMemberModal.style.display = 'flex';
        }

        // Remove member from team
        function removeMember() {
            if (!memberToRemove || !teamToRemoveFrom) return;
            
            const teamIndex = teams.findIndex(t => t.id === teamToRemoveFrom);
            if (teamIndex === -1) return;
            
            teams[teamIndex].members = teams[teamIndex].members.filter(m => m.id !== memberToRemove.id);
            
            renderTeams();
            renderTeamMembers(teams[teamIndex]);
            closeRemoveMemberModal();
            showNotification('Member removed successfully');
        }

        // Leave team
        function leaveTeam(teamId) {
            const teamIndex = teams.findIndex(t => t.id === teamId);
            if (teamIndex === -1) return;
            
            // Check if user is the creator
            if (teams[teamIndex].createdBy === currentUser.id) {
                showNotification('You cannot leave a team you created. You must delete it instead.', 'error');
                return;
            }
            
            teams[teamIndex].members = teams[teamIndex].members.filter(m => m.id !== currentUser.id);
            
            // If no members left, delete the team
            if (teams[teamIndex].members.length === 0) {
                teams.splice(teamIndex, 1);
            }
            
            renderTeams();
            closeTeamSettingsModal();
            hideDiscussionSection();
            showNotification('You have left the team');
        }

        // Delete team
        function deleteTeam(teamId) {
            const teamIndex = teams.findIndex(t => t.id === teamId);
            if (teamIndex === -1) return;
            
            // Check if user is the creator
            if (teams[teamIndex].createdBy !== currentUser.id) {
                showNotification('Only the team creator can delete the team', 'error');
                return;
            }
            
            teams.splice(teamIndex, 1);
            
            renderTeams();
            closeTeamSettingsModal();
            hideDiscussionSection();
            showNotification('Team deleted successfully');
        }

        // Open invite modal
        function openInviteModal(teamId) {
            currentTeamId = teamId;
            inviteMemberForm.reset();
            inviteMemberModal.style.display = 'flex';
        }

        // Invite member to team
        function inviteMember() {
            const email = document.getElementById('inviteEmail').value;
            const role = document.getElementById('inviteRole').value;
            
            const teamIndex = teams.findIndex(t => t.id === currentTeamId);
            if (teamIndex === -1) return;
            
            // Check if user is already a member
            const isAlreadyMember = teams[teamIndex].members.some(m => m.email === email);
            if (isAlreadyMember) {
                showNotification('This user is already a team member', 'error');
                return;
            }
            
            // Generate a mock user (in a real app, this would be fetched from the server)
            const name = email.split('@')[0];
            const avatar = name.substring(0, 2).toUpperCase();
            
            teams[teamIndex].members.push({
                id: 'user-' + Date.now(),
                name: name,
                email: email,
                role: role,
                avatar: avatar
            });
            
            renderTeams();
            closeInviteModal();
            showNotification('Invitation sent successfully');
        }

        // View team discussion
        function viewTeamDiscussion(teamId) {
            currentTeamId = teamId;
            const team = teams.find(t => t.id === teamId);
            if (!team) return;

            // Show the new layout, hide others
            if (teamCollabRow) teamCollabRow.style.display = 'flex';
            if (githubLinkCard) githubLinkCard.style.display = 'block';

            // Render to-do list
            renderTodoList(team);

            // Render GitHub link
            renderGithubLink(team);

            // Render comments/discussion
            renderComments(team.comments);

            // Scroll to team collab section
            if (teamCollabRow) teamCollabRow.scrollIntoView({ behavior: 'smooth' });
        }

        function renderTodoList(team) {
            todoListContainer.innerHTML = '';
            if (!team.todoList) team.todoList = [];
            if (team.todoList.length === 0) {
                todoListContainer.innerHTML = '<div class="no-tasks">No objectives yet.</div>';
                return;
            }
            const ul = document.createElement('ul');
            ul.className = 'todo-list';
            team.todoList.forEach((item, idx) => {
                const li = document.createElement('li');
                li.className = 'todo-item' + (item.completed ? ' completed' : '');
                li.innerHTML = `
                    <input type="checkbox" ${item.completed ? 'checked' : ''} data-idx="${idx}" />
                    <span class="todo-task" style="${item.completed ? 'text-decoration: line-through; color: #888;' : ''}">${item.task}</span>
                    <span class="todo-due">${item.dueDate ? 'Due: ' + item.dueDate : ''}</span>
                `;
                ul.appendChild(li);
            });
            todoListContainer.appendChild(ul);

            // Checkbox event
            ul.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                cb.addEventListener('change', function() {
                    const idx = this.getAttribute('data-idx');
                    team.todoList[idx].completed = this.checked;
                    renderTodoList(team);
                });
            });
        }

        if (addTodoForm) {
            addTodoForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const team = teams.find(t => t.id === currentTeamId);
                if (!team) return;
                if (!team.todoList) team.todoList = [];
                const task = todoInput.value.trim();
                const dueDate = todoDueDate.value;
                if (task) {
                    team.todoList.push({ task, dueDate, completed: false });
                    renderTodoList(team);
                    todoInput.value = '';
                    todoDueDate.value = '';
                }
            });
        }

        function renderGithubLink(team) {
            if (!team.githubLink) {
                githubLinkDisplay.innerHTML = '<span style="color: #888;">No GitHub link saved yet.</span>';
            } else {
                githubLinkDisplay.innerHTML = `<a href="${team.githubLink}" target="_blank">${team.githubLink}</a>`;
            }
            githubLinkInput.value = team.githubLink || '';
        }

        if (githubLinkForm) {
            githubLinkForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const team = teams.find(t => t.id === currentTeamId);
                if (!team) return;
                const link = githubLinkInput.value.trim();
                if (link) {
                    team.githubLink = link;
                    renderGithubLink(team);
                }
            });
        }

    // Render comments (discussion)
        function renderComments(comments) {
            commentsContainer.innerHTML = '';
            
            if (comments.length === 0) {
                commentsContainer.innerHTML = '<div class="no-comments">No comments yet. Be the first to comment!</div>';
                commentCount.textContent = '0 Comments';
                return;
            }
            
            commentCount.textContent = `${comments.length} Comment${comments.length !== 1 ? 's' : ''}`;
            
            comments.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)).forEach(comment => {
                const commentElement = document.createElement('div');
                commentElement.className = 'comment';
                
                const timeAgo = getTimeAgo(comment.timestamp);
                
                commentElement.innerHTML = `
                    <div class="comment-avatar">
                        <div class="user-avatar-small">${comment.author.substring(0, 2)}</div>
                    </div>
                    <div class="comment-content">
                        <div class="comment-header">
                            <span class="comment-author">${comment.author}</span>
                            <span class="comment-time">${timeAgo}</span>
                        </div>
                        <div class="comment-text">${comment.content}</div>
                        <div class="comment-actions">
                            <span class="comment-like">Like (${comment.likes || 0})</span>
                            <span class="comment-reply">Reply</span>
                        </div>
                    </div>
                `;
                
                commentsContainer.appendChild(commentElement);
            });
        }


        // Add a new comment
        function addComment() {
            const content = commentInput.value.trim();
            if (!content) return;
            
            const teamIndex = teams.findIndex(t => t.id === currentTeamId);
            if (teamIndex === -1) return;
            
            const newComment = {
                id: 'comment-' + Date.now(),
                author: currentUser.name,
                authorId: currentUser.id,
                content: content,
                timestamp: new Date().toISOString(),
                likes: 0
            };
            
            teams[teamIndex].comments.push(newComment);
            renderComments(teams[teamIndex].comments);
            
            commentInput.value = '';
            submitCommentBtn.disabled = true;
            
            showNotification('Comment added');
        }

        // Helper function to get time ago string
        function getTimeAgo(timestamp) {
            const now = new Date();
            const commentDate = new Date(timestamp);
            const diffInSeconds = Math.floor((now - commentDate) / 1000);
            
            if (diffInSeconds < 60) {
                return 'just now';
            }
            
            const diffInMinutes = Math.floor(diffInSeconds / 60);
            if (diffInMinutes < 60) {
                return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
            }
            
            const diffInHours = Math.floor(diffInMinutes / 60);
            if (diffInHours < 24) {
                return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
            }
            
            const diffInDays = Math.floor(diffInHours / 24);
            if (diffInDays < 30) {
                return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
            }
            
            return commentDate.toLocaleDateString();
        }

        // Show notification
        function showNotification(message, type = 'success') {
            notification.textContent = message;
            notification.className = `notification ${type === 'error' ? 'error' : ''}`;
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }

        // Close modals
        function closeCreateTeamModal() {
            createTeamModal.style.display = 'none';
        }
        
        function closeTeamSettingsModal() {
            teamSettingsModal.style.display = 'none';
        }
        
        function closeRemoveMemberModal() {
            removeMemberModal.style.display = 'none';
            memberToRemove = null;
            teamToRemoveFrom = null;
        }
        
        function closeInviteModal() {
            inviteMemberModal.style.display = 'none';
        }
        
        function hideDiscussionSection() {
            discussionSection.style.display = 'none';
        }

        // Initialize the app
        document.addEventListener('DOMContentLoaded', init);S