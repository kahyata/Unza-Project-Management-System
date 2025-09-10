        // Team Management functionality
        document.addEventListener('DOMContentLoaded', function() {
            // DOM elements
            const createTeamBtn = document.getElementById('createTeamBtn');
            const createTeamModal = document.getElementById('createTeamModal');
            const teamSettingsModal = document.getElementById('teamSettingsModal');
            const removeMemberModal = document.getElementById('removeMemberModal');
            const inviteMemberModal = document.getElementById('inviteMemberModal');
            const closeModalBtn = document.getElementById('closeModal');
            const closeSettingsModalBtn = document.getElementById('closeSettingsModal');
            const closeRemoveModalBtn = document.getElementById('closeRemoveModal');
            const closeInviteModalBtn = document.getElementById('closeInviteModal');
            const cancelCreateBtn = document.getElementById('cancelCreate');
            const cancelRemoveBtn = document.getElementById('cancelRemove');
            const cancelInviteBtn = document.getElementById('cancelInvite');
            const createTeamForm = document.getElementById('createTeamForm');
            const inviteMemberForm = document.getElementById('inviteMemberForm');
            const teamsGrid = document.getElementById('teamsGrid');
            const noTeamsMsg = document.getElementById('noTeamsMsg');
            const leaveTeamBtn = document.getElementById('leaveTeamBtn');
            const deleteTeamBtn = document.getElementById('deleteTeamBtn');
            const confirmRemoveBtn = document.getElementById('confirmRemove');
            const notification = document.getElementById('notification');
            const discussionSection = document.getElementById('discussionSection');
            
            // Current user (in a real app, this would come from authentication)
            const currentUser = {
                id: "user1",
                name: "John Doe",
                initials: "JD",
                isLeader: true // Initially set to true for demo purposes
            };
            
            // Team data (initially empty)
            let teams = [];
            let currentTeamId = null;
            let memberToRemove = null;
            
            // Load teams from localStorage
            function loadTeamsFromStorage() {
                const savedTeams = localStorage.getItem('project-teams');
                if (savedTeams) {
                    teams = JSON.parse(savedTeams);
                }
            }
            
            // Save teams to localStorage
            function saveTeamsToStorage() {
                localStorage.setItem('project-teams', JSON.stringify(teams));
            }
            
            // Show notification
            function showNotification(message) {
                notification.textContent = message;
                notification.classList.add('show');
                
                setTimeout(() => {
                    notification.classList.remove('show');
                }, 3000);
            }
            
            // Toggle discussion section visibility
            function toggleDiscussionSection() {
                if (teams.length > 0) {
                    discussionSection.style.display = 'block';
                } else {
                    discussionSection.style.display = 'none';
                }
            }
            
            // Render teams function (moved to top level scope)
            function renderTeams() {
                teamsGrid.innerHTML = ""; // clear old
                
                if (teams.length === 0) {
                    noTeamsMsg.style.display = 'block';
                    toggleDiscussionSection();
                    return;
                }
                
                noTeamsMsg.style.display = 'none';
                
                teams.forEach(team => {
                    const teamCard = document.createElement("div");
                    teamCard.className = "team-card";
                    teamCard.dataset.teamId = team.id;

                    const isLeader = team.leaderId === currentUser.id;

                    teamCard.innerHTML = `
                        <div class="team-card-header">
                            <div class="team-info">
                                <div class="team-name">${team.name}</div>
                                <div class="team-description">${team.description || "No description"}</div>
                            </div>
                            <span class="team-status status-active">Active</span>
                        </div>
                        <div class="team-members">
                            <div class="members-title">Members (${team.members.length})</div>
                            <ul class="member-list">
                                ${team.members.map(member => `
                                    <li class="member-item">
                                        <div class="member-avatar">${member.initials}</div>
                                        <div class="member-info">
                                            <div class="member-name">${member.name} ${member.id === team.leaderId ? "(Leader)" : ""}</div>
                                            <div class="member-role">${member.role || "Team Member"}</div>
                                        </div>
                                    </li>
                                `).join("")}
                            </ul>
                        </div>
                        <div class="team-actions">
                            <button class="team-action-btn view-btn" data-team-id="${team.id}">
                                <span class="material-icons">visibility</span> View
                            </button>
                            <button class="team-action-btn invite-btn" data-team-id="${team.id}">
                                <span class="material-icons">person_add</span> Invite
                            </button>
                            <div class="team-dropdown">
                                <button class="dropdown-toggle">
                                    <span class="material-icons">more_vert</span>
                                </button>
                                <div class="dropdown-menu">
                                    <div class="dropdown-item" data-action="settings" data-team-id="${team.id}">
                                        <span class="material-icons">settings</span>
                                        Team Settings
                                    </div>
                                    ${isLeader ? `
                                    <div class="dropdown-item delete" data-action="delete" data-team-id="${team.id}">
                                        <span class="material-icons">delete</span>
                                        Delete Team
                                    </div>` : `
                                    <div class="dropdown-item delete" data-action="leave" data-team-id="${team.id}">
                                        <span class="material-icons">exit_to_app</span>
                                        Leave Team
                                    </div>`}
                                </div>
                            </div>
                        </div>
                    `;

                    teamsGrid.appendChild(teamCard);
                });

                // re-bind events after rendering
                document.querySelectorAll(".view-btn").forEach(btn => {
                    btn.addEventListener("click", function() {
                        const teamId = this.getAttribute("data-team-id");
                        viewTeam(teamId);
                    });
                });

                document.querySelectorAll(".invite-btn").forEach(btn => {
                    btn.addEventListener("click", function() {
                        const teamId = this.getAttribute("data-team-id");
                        openInviteModal(teamId);
                    });
                });

                // Add event listeners to dropdown toggles
                document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
                    toggle.addEventListener('click', function(e) {
                        e.stopPropagation();
                        const dropdown = this.nextElementSibling;
                        const isShowing = dropdown.classList.contains('show');
                        
                        // Close all other dropdowns
                        document.querySelectorAll('.dropdown-menu').forEach(menu => {
                            menu.classList.remove('show');
                        });
                        
                        // Toggle this dropdown
                        if (!isShowing) {
                            dropdown.classList.add('show');
                        }
                    });
                });
                
                // Add event listeners to dropdown items
                document.querySelectorAll('.dropdown-item').forEach(item => {
                    item.addEventListener('click', function() {
                        const action = this.getAttribute('data-action');
                        const teamId = this.getAttribute('data-team-id');
                        
                        if (action === 'settings') {
                            openSettingsModal(teamId);
                        } else if (action === 'delete') {
                            confirmDeleteTeam(teamId);
                        } else if (action === 'leave') {
                            confirmLeaveTeam(teamId);
                        }
                    });
                });
                
                // Close dropdowns when clicking outside
                document.addEventListener('click', function() {
                    document.querySelectorAll('.dropdown-menu').forEach(menu => {
                        menu.classList.remove('show');
                    });
                });
                
                // Toggle discussion section visibility
                toggleDiscussionSection();
            }
            
            // Load teams
            function loadTeams() {
                loadTeamsFromStorage();
                
                // Clear existing content
                teamsGrid.innerHTML = '';
                
                if (teams.length === 0) {
                    noTeamsMsg.style.display = 'block';
                    toggleDiscussionSection();
                    return;
                }
                
                noTeamsMsg.style.display = 'none';
                renderTeams();
            }
            
            // View team details
            function viewTeam(teamId) {
                const team = teams.find(t => t.id === teamId);
                if (!team) return;
                
                alert(`Viewing team: ${team.name}\nMembers: ${team.members.length}\nDescription: ${team.description || 'No description'}`);
            }
            
            // Open invite modal
            function openInviteModal(teamId) {
                // Set the team ID in the form (hidden field would be better in real app)
                inviteMemberForm.setAttribute('data-team-id', teamId);
                inviteMemberModal.style.display = 'flex';
            }
            
            // Open settings modal
            function openSettingsModal(teamId) {
                currentTeamId = teamId;
                const team = teams.find(t => t.id === teamId);
                
                if (!team) return;
                
                // Update modal title
                document.getElementById('settingsTeamName').textContent = `${team.name} Settings`;
                
                // Check if current user is the team leader
                const isLeader = team.leaderId === currentUser.id;
                
                // Show/hide delete team button based on leadership
                deleteTeamBtn.style.display = isLeader ? 'flex' : 'none';
                leaveTeamBtn.style.display = isLeader ? 'none' : 'flex';
                
                // Update members list
                const membersList = document.getElementById('settingsMembersList');
                membersList.innerHTML = '';
                
                team.members.forEach(member => {
                    const memberItem = document.createElement('div');
                    memberItem.className = 'settings-member-item';
                    memberItem.innerHTML = `
                        <div class="settings-member-info">
                            <div class="member-avatar">${member.initials}</div>
                            <div>
                                <div class="member-name">${member.name} ${member.id === team.leaderId ? '(Leader)' : ''}</div>
                                <div class="member-role">${member.role || 'Team Member'}</div>
                            </div>
                        </div>
                        <div class="settings-member-actions">
                            ${isLeader && member.id !== team.leaderId ? 
                                `<button class="remove-member-btn" data-member-id="${member.id}">
                                    <span class="material-icons">person_remove</span>
                                 </button>` : ''}
                        </div>
                    `;
                    
                    membersList.appendChild(memberItem);
                });
                
                // Add event listeners to remove buttons
                document.querySelectorAll('.remove-member-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const memberId = this.getAttribute('data-member-id');
                        openRemoveMemberModal(memberId);
                    });
                });
                
                // Show settings modal
                teamSettingsModal.style.display = 'flex';
            }
            
            // Confirm leave team
            function confirmLeaveTeam(teamId) {
                currentTeamId = teamId;
                const team = teams.find(t => t.id === teamId);
                
                if (!team) return;
                
                // Check if user is the leader
                if (team.leaderId === currentUser.id) {
                    alert('Team leaders cannot leave the team. Please delete the team or transfer leadership first.');
                    return;
                }
                
                if (confirm(`Are you sure you want to leave the team "${team.name}"?`)) {
                    leaveTeam();
                }
            }
            
            // Confirm delete team
            function confirmDeleteTeam(teamId) {
                currentTeamId = teamId;
                const team = teams.find(t => t.id === teamId);
                
                if (!team) return;
                
                // Check if user is the leader
                if (team.leaderId !== currentUser.id) {
                    alert('Only team leaders can delete the team.');
                    return;
                }
                
                if (confirm(`Are you sure you want to delete the team "${team.name}"? This action cannot be undone.`)) {
                    deleteTeam();
                }
            }
            
            // Open remove member modal
            function openRemoveMemberModal(memberId) {
                const team = teams.find(t => t.id === currentTeamId);
                if (!team) return;
                
                const member = team.members.find(m => m.id === memberId);
                if (!member) return;
                
                memberToRemove = memberId;
                document.getElementById('removeMemberName').textContent = member.name;
                removeMemberModal.style.display = 'flex';
            }
            
            // Remove member from team
            function removeMember() {
                if (!currentTeamId || !memberToRemove) return;
                
                const teamIndex = teams.findIndex(t => t.id === currentTeamId);
                if (teamIndex === -1) return;
                
                // Remove the member
                teams[teamIndex].members = teams[teamIndex].members.filter(m => m.id !== memberToRemove);
                
                // Save to storage
                saveTeamsToStorage();
                
                // Reload teams
                loadTeams();
                
                // Close modals
                removeMemberModal.style.display = 'none';
                teamSettingsModal.style.display = 'none';
                
                // Show confirmation
                showNotification('Member removed from team');
                
                // Reset
                memberToRemove = null;
            }
            
            // Leave team
            function leaveTeam() {
                if (!currentTeamId) return;
                
                const teamIndex = teams.findIndex(t => t.id === currentTeamId);
                if (teamIndex === -1) return;
                
                const team = teams[teamIndex];
                
                // Remove current user from team
                teams[teamIndex].members = teams[teamIndex].members.filter(m => m.id !== currentUser.id);
                
                // If team is empty, remove it
                if (teams[teamIndex].members.length === 0) {
                    teams.splice(teamIndex, 1);
                }
                
                // Save to storage
                saveTeamsToStorage();
                
                // Reload teams
                loadTeams();
                
                // Close modals
                teamSettingsModal.style.display = 'none';
                
                // Show confirmation
                showNotification(`You have left the team "${team.name}"`);
                
                // Reset
                currentTeamId = null;
            }
            
            // Delete team
            function deleteTeam() {
                if (!currentTeamId) return;
                
                const teamIndex = teams.findIndex(t => t.id === currentTeamId);
                if (teamIndex === -1) return;
                
                const teamName = teams[teamIndex].name;
                
                // Remove team
                teams.splice(teamIndex, 1);
                
                // Save to storage
                saveTeamsToStorage();
                
                // Reload teams
                loadTeams();
                
                // Close modals
                teamSettingsModal.style.display = 'none';
                
                // Show confirmation
                showNotification(`Team "${teamName}" has been deleted`);
                
                // Reset
                currentTeamId = null;
            }
            
            // Create new team
            function createNewTeam(teamName, teamDescription) {
                const newTeam = {
                    id: 'team' + Date.now(),
                    name: teamName,
                    description: teamDescription,
                    leaderId: currentUser.id,
                    members: [
                        {
                            id: currentUser.id,
                            name: currentUser.name,
                            initials: currentUser.initials,
                            role: 'Team Leader'
                        }
                    ]
                };
                
                teams.push(newTeam);
                saveTeamsToStorage();
                loadTeams();
                
                showNotification(`Team "${teamName}" created successfully`);
            }
            
            // Invite member to team
            function inviteMemberToTeam(teamId, email, role) {
                const teamIndex = teams.findIndex(t => t.id === teamId);
                if (teamIndex === -1) return;
                
                // In a real app, this would send an invitation email
                // For this demo, we'll just show a notification
                
                showNotification(`Invitation sent to ${email} for ${role} role`);
            }
            
            // Event listeners for modals
            createTeamBtn.addEventListener('click', function() {
                createTeamModal.style.display = 'flex';
            });
            
            closeModalBtn.addEventListener('click', function() {
                createTeamModal.style.display = 'none';
            });
            
            closeSettingsModalBtn.addEventListener('click', function() {
                teamSettingsModal.style.display = 'none';
            });
            
            closeRemoveModalBtn.addEventListener('click', function() {
                removeMemberModal.style.display = 'none';
            });
            
            closeInviteModalBtn.addEventListener('click', function() {
                inviteMemberModal.style.display = 'none';
            });
            
            cancelCreateBtn.addEventListener('click', function() {
                createTeamModal.style.display = 'none';
            });
            
            cancelRemoveBtn.addEventListener('click', function() {
                removeMemberModal.style.display = 'none';
            });
            
            cancelInviteBtn.addEventListener('click', function() {
                inviteMemberModal.style.display = 'none';
            });
            
            createTeamForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const teamName = document.getElementById('teamName').value;
                const teamDescription = document.getElementById('teamDescription').value;
                
                createNewTeam(teamName, teamDescription);
                
                // Reset form and close modal
                createTeamForm.reset();
                createTeamModal.style.display = 'none';
            });
            
            inviteMemberForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const teamId = this.getAttribute('data-team-id');
                const email = document.getElementById('inviteEmail').value;
                const role = document.getElementById('inviteRole').value;
                
                inviteMemberToTeam(teamId, email, role);
                
                // Reset form and close modal
                inviteMemberForm.reset();
                inviteMemberModal.style.display = 'none';
            });
            
            confirmRemoveBtn.addEventListener('click', function() {
                removeMember();
            });
            
            leaveTeamBtn.addEventListener('click', function() {
                confirmLeaveTeam(currentTeamId);
            });
            
            deleteTeamBtn.addEventListener('click', function() {
                confirmDeleteTeam(currentTeamId);
            });
            
            // Close modals when clicking outside
            window.addEventListener('click', function(e) {
                if (e.target === createTeamModal) {
                    createTeamModal.style.display = 'none';
                }
                if (e.target === teamSettingsModal) {
                    teamSettingsModal.style.display = 'none';
                }
                if (e.target === removeMemberModal) {
                    removeMemberModal.style.display = 'none';
                }
                if (e.target === inviteMemberModal) {
                    inviteMemberModal.style.display = 'none';
                }
            });
            
            // Initialize the page
            loadTeams();
            
            // Comments functionality
            const commentsContainer = document.getElementById('comments-container');
            const commentInput = document.getElementById('comment-input');
            const submitCommentBtn = document.getElementById('submit-comment-btn');
            const commentCount = document.getElementById('comment-count');
            
            let comments = [];
            let replyingTo = null;
            
            // Load comments from localStorage
            function loadComments() {
                const savedComments = localStorage.getItem('team-comments');
                if (savedComments) {
                    comments = JSON.parse(savedComments);
                }
                renderComments();
            }
            
            // Save comments to localStorage
            function saveComments() {
                localStorage.setItem('team-comments', JSON.stringify(comments));
            }
            
            // Render comments
            function renderComments() {
                commentsContainer.innerHTML = '';
                
                if (comments.length === 0) {
                    commentsContainer.innerHTML = '<div class="no-comments">No comments yet. Be the first to comment!</div>';
                    commentCount.textContent = '0 Comments';
                    return;
                }
                
                commentCount.textContent = `${comments.length} Comment${comments.length !== 1 ? 's' : ''}`;
                
                comments.forEach(comment => {
                    const commentElement = createCommentElement(comment);
                    commentsContainer.appendChild(commentElement);
                });
                
                // Scroll to bottom
                commentsContainer.scrollTop = commentsContainer.scrollHeight;
            }
            
            // Create comment element
            function createCommentElement(comment, isReply = false) {
                const commentElement = document.createElement('div');
                commentElement.className = 'comment';
                commentElement.dataset.commentId = comment.id;
                
                // Format the timestamp
                const timestamp = new Date(comment.timestamp).toLocaleString();
                
                commentElement.innerHTML = `
                    <div class="comment-avatar">
                        <div class="user-avatar-small">${comment.authorInitials}</div>
                    </div>
                    <div class="comment-content">
                        <div class="comment-header">
                            <span class="comment-author">${comment.authorName}</span>
                            <span class="comment-time">${timestamp}</span>
                        </div>
                        <div class="comment-text">${comment.text}</div>
                        <div class="comment-actions">
                            <span class="comment-like">Like</span>
                            <span class="comment-reply">Reply</span>
                        </div>
                    </div>
                `;
                
                // Add event listeners for like and reply
                const likeBtn = commentElement.querySelector('.comment-like');
                const replyBtn = commentElement.querySelector('.comment-reply');
                
                likeBtn.addEventListener('click', function() {
                    // Toggle like
                    if (!comment.likes) comment.likes = [];
                    
                    const userIndex = comment.likes.indexOf(currentUser.id);
                    if (userIndex === -1) {
                        comment.likes.push(currentUser.id);
                        likeBtn.textContent = `Liked (${comment.likes.length})`;
                    } else {
                        comment.likes.splice(userIndex, 1);
                        likeBtn.textContent = `Like${comment.likes.length > 0 ? ` (${comment.likes.length})` : ''}`;
                    }
                    
                    saveComments();
                });
                
                // Set initial like state
                if (comment.likes && comment.likes.length > 0) {
                    likeBtn.textContent = `Liked (${comment.likes.length})`;
                }
                
                replyBtn.addEventListener('click', function() {
                    replyingTo = comment.id;
                    commentInput.placeholder = `Replying to ${comment.authorName}...`;
                    commentInput.focus();
                });
                
                // Add replies if they exist
                if (comment.replies && comment.replies.length > 0) {
                    const repliesContainer = document.createElement('div');
                    repliesContainer.className = 'replies-container';
                    
                    comment.replies.forEach(reply => {
                        const replyElement = createCommentElement(reply, true);
                        repliesContainer.appendChild(replyElement);
                    });
                    
                    commentElement.appendChild(repliesContainer);
                }
                
                return commentElement;
            }
            
            // Add a new comment or reply
            function addComment(text) {
                if (!text.trim()) return;
                
                const newComment = {
                    id: 'comment' + Date.now(),
                    text: text,
                    authorName: currentUser.name,
                    authorInitials: currentUser.initials,
                    timestamp: new Date().toISOString()
                };
                
                if (replyingTo) {
                    // Find the parent comment
                    const parentComment = findCommentById(comments, replyingTo);
                    if (parentComment) {
                        if (!parentComment.replies) parentComment.replies = [];
                        parentComment.replies.push(newComment);
                    }
                    // Reset reply state
                    replyingTo = null;
                    commentInput.placeholder = 'Add a comment...';
                } else {
                    // Add as a top-level comment
                    comments.push(newComment);
                }
                
                saveComments();
                renderComments();
                
                // Clear input
                commentInput.value = '';
                submitCommentBtn.disabled = true;
            }
            
            // Find comment by ID (including in replies)
            function findCommentById(commentsArray, id) {
                for (const comment of commentsArray) {
                    if (comment.id === id) return comment;
                    
                    if (comment.replies && comment.replies.length > 0) {
                        const foundInReplies = findCommentById(comment.replies, id);
                        if (foundInReplies) return foundInReplies;
                    }
                }
                return null;
            }
            
            // Event listeners for comments
            commentInput.addEventListener('input', function() {
                submitCommentBtn.disabled = !this.value.trim();
            });
            
            commentInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (this.value.trim()) {
                        addComment(this.value);
                    }
                }
            });
            
            submitCommentBtn.addEventListener('click', function() {
                addComment(commentInput.value);
            });
            
            // Cancel reply if user starts typing a new comment
            commentInput.addEventListener('focus', function() {
                if (replyingTo && !this.value) {
                    replyingTo = null;
                    this.placeholder = 'Add a comment...';
                }
            });
            
            // Initialize comments
            loadComments();
        });