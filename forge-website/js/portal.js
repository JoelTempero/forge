/**
 * Forge Aotearoa - Portal JavaScript
 * Handles portal authentication, navigation, and demo functionality
 */

document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const authScreen = document.getElementById('authScreen');
  const portalApp = document.getElementById('portalApp');
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const userSelect = document.getElementById('userSelect');
  const portalSidebar = document.getElementById('portalSidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');

  // Check if we're on the portal page
  if (!authScreen || !portalApp) return;

  // Demo users
  const demoUsers = {
    admin: {
      id: 'admin',
      name: 'Darryl Tempero',
      initials: 'DT',
      role: 'Admin',
      color: 'var(--color-secondary)',
      groups: ['oversight', 'kaitiaki', 'anamchara', 'friends', 'practitioners', 'covenanted']
    },
    host: {
      id: 'host',
      name: 'Stuart Simpson',
      initials: 'SS',
      role: 'Host',
      color: 'var(--color-accent)',
      groups: ['kaitiaki', 'practitioners', 'covenanted']
    },
    member: {
      id: 'member',
      name: 'Sarah Thompson',
      initials: 'ST',
      role: 'Member',
      color: 'var(--color-primary)',
      groups: ['friends', 'practitioners']
    }
  };

  // Demo groups
  const demoGroups = {
    oversight: {
      id: 'oversight',
      name: 'Oversight Team',
      color: '#c9a86c',
      rhythm: 'Monthly | First Monday',
      description: 'The leadership team overseeing the direction and health of Forge Aotearoa.',
      members: 5,
      isPrivate: true
    },
    kaitiaki: {
      id: 'kaitiaki',
      name: 'Kaitiaki',
      color: '#1e3a4f',
      rhythm: 'Fortnightly',
      description: 'Covenanted Guardians holding the Order\'s rhythm, guiding others in discernment, prayer, and leadership.',
      members: 8,
      isPrivate: true
    },
    anamchara: {
      id: 'anamchara',
      name: 'Anamchara',
      color: '#6b9e8f',
      rhythm: 'As needed',
      description: 'Soul friends offering spiritual companionship and direction on the journey.',
      members: 12,
      isPrivate: false
    },
    friends: {
      id: 'friends',
      name: 'Friends',
      color: '#d4a574',
      rhythm: 'Open community',
      description: 'Friends of the Way - connected to Forge Aotearoa; welcome to learn and pray alongside.',
      members: 45,
      isPrivate: false
    },
    practitioners: {
      id: 'practitioners',
      name: 'Practitioners',
      color: '#8b6f4e',
      rhythm: 'Monthly gatherings',
      description: 'Wayfinders-in-Practice exploring the vows and rhythms of prayer and community.',
      members: 22,
      isPrivate: false
    },
    covenanted: {
      id: 'covenanted',
      name: 'Covenanted',
      color: '#4a6741',
      rhythm: 'Weekly rhythm',
      description: 'Covenanted Wayfinders fully embodying the Way of Life; making personal vows and offering spiritual companionship.',
      members: 15,
      isPrivate: true
    }
  };

  // Demo messages for groups
  const demoMessages = {
    oversight: [
      { author: 'Darryl Tempero', initials: 'DT', time: '1 day ago', text: 'Planning meeting scheduled for next Monday to discuss Haerenga Tapu preparations.' },
      { author: 'Anne Overton', initials: 'AO', time: '3 days ago', text: 'Budget report for Q1 has been uploaded to the resources folder.' }
    ],
    kaitiaki: [
      { author: 'Anne Overton', initials: 'AO', time: '2 hours ago', text: 'Reflecting on the vow of Attentive Presence this week. How are you each finding space to listen deeply?' },
      { author: 'Stuart Simpson', initials: 'SS', time: '1 day ago', text: 'Wonderful gathering last night. Thank you all for your presence and wisdom.' }
    ],
    friends: [
      { author: 'Stuart Simpson', initials: 'SS', time: '5 hours ago', text: 'Welcome to all the new Friends joining us! Feel free to introduce yourselves.' },
      { author: 'Sarah Thompson', initials: 'ST', time: '1 day ago', text: 'Just finished reading Living from Love. The waka metaphor really speaks to me.' }
    ],
    practitioners: [
      { author: 'Diane Gilliam-Weeks', initials: 'DG', time: '3 hours ago', text: 'Our next gathering will focus on Sacred Rhythm - balancing solitude, community, and service.' },
      { author: 'Josh Olds', initials: 'JO', time: '2 days ago', text: 'Shared some photos from our community meal last week in the resources section.' }
    ],
    covenanted: [
      { author: 'Darryl Tempero', initials: 'DT', time: '4 hours ago', text: 'Reminder: renewal of vows ceremony coming up at Haerenga Tapu.' },
      { author: 'Abi Trevathan', initials: 'AT', time: '1 day ago', text: 'Beautiful morning prayer time today. Grateful for this community.' }
    ],
    anamchara: [
      { author: 'Diane Gilliam-Weeks', initials: 'DG', time: '6 hours ago', text: 'Available for spiritual direction sessions next month. Please reach out if you\'d like to book.' },
      { author: 'Anne Overton', initials: 'AO', time: '2 days ago', text: 'Article on contemplative listening added to our resources.' }
    ]
  };

  // Current user state
  let currentUser = null;
  let selectedUserId = 'admin';

  // User selection
  if (userSelect) {
    userSelect.querySelectorAll('.auth-user-option').forEach(option => {
      option.addEventListener('click', function() {
        userSelect.querySelectorAll('.auth-user-option').forEach(o => o.classList.remove('selected'));
        this.classList.add('selected');
        selectedUserId = this.getAttribute('data-user');
      });
    });
  }

  // Login
  if (loginBtn) {
    loginBtn.addEventListener('click', function() {
      this.disabled = true;
      this.textContent = 'Signing in...';

      setTimeout(() => {
        currentUser = demoUsers[selectedUserId];
        authScreen.style.display = 'none';
        portalApp.style.display = 'flex';
        initPortal();
      }, 600);
    });
  }

  // Logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      currentUser = null;
      portalApp.style.display = 'none';
      authScreen.style.display = 'grid';
      loginBtn.disabled = false;
      loginBtn.textContent = 'Sign In as Demo User';
    });
  }

  // Initialize portal
  function initPortal() {
    updateUIForUser();
    setupNavigation();
    setupSidebarToggle();
    populateSidebarGroups();
    navigateToPage('home');
  }

  // Update UI based on user role
  function updateUIForUser() {
    // Update sidebar user info
    const sidebarUser = document.getElementById('sidebarUser');
    if (sidebarUser) {
      sidebarUser.innerHTML = `
        <div class="sidebar-user-avatar" style="background: ${currentUser.color};">${currentUser.initials}</div>
        <div class="sidebar-user-info">
          <p class="sidebar-user-name">${currentUser.name}</p>
          <p class="sidebar-user-role">${currentUser.role}</p>
        </div>
      `;
    }

    // Update welcome message
    const welcomeTitle = document.getElementById('welcomeTitle');
    if (welcomeTitle) {
      welcomeTitle.textContent = `Welcome back, ${currentUser.name.split(' ')[0]}!`;
    }

    // Update stats
    const statGroups = document.getElementById('statGroups');
    if (statGroups) {
      statGroups.textContent = currentUser.groups.length;
    }

    // Show/hide admin elements
    document.querySelectorAll('.admin-only').forEach(el => {
      el.style.display = currentUser.role === 'Admin' ? '' : 'none';
    });

    // Show/hide host+admin elements
    document.querySelectorAll('.host-admin-only').forEach(el => {
      el.style.display = (currentUser.role === 'Admin' || currentUser.role === 'Host') ? '' : 'none';
    });
  }

  // Populate sidebar groups
  function populateSidebarGroups() {
    const sidebarGroups = document.getElementById('sidebarGroups');
    if (!sidebarGroups) return;

    sidebarGroups.innerHTML = currentUser.groups.map(groupId => {
      const group = demoGroups[groupId];
      return `
        <li class="sidebar-nav-item">
          <a href="#group-${groupId}" class="sidebar-nav-link" data-page="group-detail" data-group="${groupId}">
            <span style="width: 20px; height: 20px; background: ${group.color}; border-radius: 4px; flex-shrink: 0;"></span>
            ${group.name}
          </a>
        </li>
      `;
    }).join('');

    // Re-attach click handlers
    sidebarGroups.querySelectorAll('[data-page]').forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const page = this.getAttribute('data-page');
        const group = this.getAttribute('data-group');
        navigateToPage(page, group);
        if (window.innerWidth <= 1024) {
          portalSidebar.classList.remove('open');
        }
      });
    });
  }

  // Setup navigation
  function setupNavigation() {
    document.querySelectorAll('[data-page]').forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const page = this.getAttribute('data-page');
        const group = this.getAttribute('data-group');
        navigateToPage(page, group);
        if (window.innerWidth <= 1024) {
          portalSidebar.classList.remove('open');
        }
      });
    });
  }

  // Navigate to page
  function navigateToPage(pageId, groupId = null) {
    // Hide all pages
    document.querySelectorAll('.portal-page').forEach(page => {
      page.style.display = 'none';
    });

    // Remove active class from all nav links
    document.querySelectorAll('.sidebar-nav-link').forEach(link => {
      link.classList.remove('active');
    });

    // Show target page
    const targetPage = document.getElementById(`page-${pageId}`);
    if (targetPage) {
      targetPage.style.display = 'block';
    }

    // Add active class to nav link
    if (groupId) {
      const activeLink = document.querySelector(`[data-page="${pageId}"][data-group="${groupId}"]`);
      if (activeLink) activeLink.classList.add('active');
    } else {
      const activeLink = document.querySelector(`[data-page="${pageId}"]:not([data-group])`);
      if (activeLink) activeLink.classList.add('active');
    }

    // Update URL hash
    window.location.hash = groupId ? `${pageId}-${groupId}` : pageId;

    // Load page-specific content
    if (pageId === 'groups') {
      populateGroupsPage();
    } else if (pageId === 'group-detail' && groupId) {
      populateGroupDetail(groupId);
    }
  }

  // Populate groups page
  function populateGroupsPage() {
    const yourGroupsGrid = document.getElementById('yourGroupsGrid');
    const discoverGroupsGrid = document.getElementById('discoverGroupsGrid');

    if (yourGroupsGrid) {
      yourGroupsGrid.innerHTML = currentUser.groups.map(groupId => {
        const group = demoGroups[groupId];
        return createGroupCard(group, true);
      }).join('');
    }

    if (discoverGroupsGrid) {
      const otherGroups = Object.keys(demoGroups).filter(id => !currentUser.groups.includes(id));
      if (otherGroups.length > 0) {
        discoverGroupsGrid.innerHTML = otherGroups.map(groupId => {
          const group = demoGroups[groupId];
          return createGroupCard(group, false);
        }).join('');
      } else {
        discoverGroupsGrid.innerHTML = '<p style="color: var(--color-gray-500); grid-column: span 2;">You\'re a member of all available groups!</p>';
      }
    }

    // Attach click handlers to group cards
    document.querySelectorAll('.group-card[data-group]').forEach(card => {
      card.addEventListener('click', function() {
        const groupId = this.getAttribute('data-group');
        if (currentUser.groups.includes(groupId)) {
          navigateToPage('group-detail', groupId);
        }
      });
    });

    // Attach join handlers
    document.querySelectorAll('.join-group-btn').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        this.textContent = 'Joined!';
        this.classList.remove('btn-outline');
        this.classList.add('btn-secondary');
        this.disabled = true;
      });
    });
  }

  // Create group card HTML
  function createGroupCard(group, isMember) {
    const canView = isMember || !group.isPrivate;
    return `
      <div class="group-card ${isMember ? 'cursor-pointer' : ''}" data-group="${group.id}" style="${isMember ? 'cursor: pointer;' : ''}">
        <div class="group-card-header">
          <div class="group-card-icon" style="background: ${group.color};">${group.name.charAt(0)}</div>
          <div>
            <h3 class="group-card-title">${group.name}</h3>
            <p class="group-card-rhythm">${group.rhythm}</p>
          </div>
        </div>
        <p style="color: var(--color-gray-600); font-size: var(--text-sm); margin-bottom: var(--space-4);">
          ${group.description}
        </p>
        <div class="group-card-members">
          <span class="member-count">${group.members} members</span>
          ${!isMember && !group.isPrivate ? '<button class="btn btn-sm btn-outline join-group-btn" style="margin-left: auto;">Join</button>' : ''}
          ${!isMember && group.isPrivate ? '<span style="margin-left: auto; font-size: var(--text-xs); color: var(--color-gray-400);">Invite only</span>' : ''}
        </div>
      </div>
    `;
  }

  // Populate group detail
  function populateGroupDetail(groupId) {
    const group = demoGroups[groupId];
    if (!group) return;

    // Update header
    const header = document.getElementById('groupDetailHeader');
    if (header) {
      header.innerHTML = `
        <div class="group-card-icon" style="width: 64px; height: 64px; font-size: var(--text-2xl); background: ${group.color};">${group.name.charAt(0)}</div>
        <div>
          <h1 style="font-size: var(--text-3xl); margin-bottom: var(--space-2);">${group.name}</h1>
          <p style="color: var(--color-gray-500);">${group.description}</p>
          <p style="color: var(--color-gray-400); font-size: var(--text-sm); margin-top: var(--space-2);">${group.members} members | ${group.rhythm}</p>
        </div>
      `;
    }

    // Update messages
    const messagesContainer = document.getElementById('groupMessages');
    if (messagesContainer) {
      const messages = demoMessages[groupId] || [];
      if (messages.length > 0) {
        messagesContainer.innerHTML = messages.map(msg => `
          <div class="message-item">
            <div class="message-avatar">${msg.initials}</div>
            <div class="message-content">
              <div class="message-header">
                <span class="message-author">${msg.author}</span>
                <span class="message-time">${msg.time}</span>
              </div>
              <p class="message-text">${msg.text}</p>
              <div style="margin-top: var(--space-3); display: flex; gap: var(--space-4);">
                <button class="btn btn-ghost btn-sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3z"/>
                    <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                  </svg>
                  Like
                </button>
                <button class="btn btn-ghost btn-sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  Reply
                </button>
              </div>
            </div>
          </div>
        `).join('');
      } else {
        messagesContainer.innerHTML = '<p style="color: var(--color-gray-500); text-align: center; padding: var(--space-8);">No messages yet. Be the first to post!</p>';
      }
    }
  }

  // Setup sidebar toggle
  function setupSidebarToggle() {
    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', function() {
        portalSidebar.classList.toggle('open');
      });
    }

    function checkViewport() {
      if (window.innerWidth <= 1024) {
        sidebarToggle.style.display = 'flex';
      } else {
        sidebarToggle.style.display = 'none';
        portalSidebar.classList.remove('open');
      }
    }

    checkViewport();
    window.addEventListener('resize', checkViewport);
  }

  // Notifications
  const notificationBtn = document.getElementById('notificationBtn');
  if (notificationBtn) {
    notificationBtn.addEventListener('click', function() {
      alert('Demo Mode: You have 3 unread notifications:\n\n1. New post in Kaitiaki group\n2. Event reminder: Wayfinding Gathering\n3. Anne Overton mentioned you in a comment');
    });
  }

  // Demo interactions
  document.addEventListener('click', function(e) {
    // RSVP buttons
    if (e.target.matches('.btn') && e.target.textContent.includes('RSVP')) {
      e.target.textContent = 'Going!';
      e.target.classList.remove('btn-outline', 'btn-primary');
      e.target.classList.add('btn-secondary');
    }

    // Download/Watch buttons
    if (e.target.matches('.btn') && (e.target.textContent === 'Download' || e.target.textContent === 'Watch')) {
      alert('Demo Mode: This would ' + e.target.textContent.toLowerCase() + ' the resource.');
    }

    // New Post button
    if (e.target.matches('.btn') && e.target.textContent === 'New Post') {
      alert('Demo Mode: This would open a dialog to create a new post in the group message board.');
    }

    // Create buttons
    if (e.target.matches('.btn') && (e.target.textContent === 'Create Event' || e.target.textContent === 'Create Group')) {
      alert('Demo Mode: This would open a dialog to create a new ' + (e.target.textContent.includes('Event') ? 'event' : 'group') + '.');
    }

    // Admin buttons
    if (e.target.matches('.btn') && (e.target.textContent === 'Manage Users' || e.target.textContent === 'Manage Groups' || e.target.textContent === 'View Queue' || e.target.textContent === 'Settings')) {
      alert('Demo Mode: This would open the ' + e.target.textContent.toLowerCase() + ' panel.');
    }
  });

  // Search
  const searchInput = document.querySelector('.portal-search input');
  if (searchInput) {
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        alert(`Demo Mode: Searching for "${this.value}"...\n\nIn a live portal, this would search across groups, events, and resources.`);
      }
    });
  }
});
