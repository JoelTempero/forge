/**
 * Forge Aotearoa - Portal JavaScript
 * Handles portal authentication, navigation, and demo functionality
 */

document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const authScreen = document.getElementById('authScreen');
  const portalApp = document.getElementById('portalApp');
  const loginForm = document.getElementById('loginForm');
  const portalContent = document.getElementById('portalContent');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const portalSidebar = document.getElementById('portalSidebar');

  // Check if we're on the portal page
  if (!authScreen || !portalApp) return;

  // Demo user data
  const demoUser = {
    name: 'Sarah Thompson',
    email: 'demo@forge.nz',
    initials: 'ST',
    role: 'Member',
    groups: ['wayfinders', 'spirituality', 'pioneers']
  };

  // Demo groups data
  const demoGroups = {
    wayfinders: {
      id: 'wayfinders',
      name: 'Wayfinders Network',
      color: '#f59e0b',
      rhythm: 'Monthly | 3rd Tuesday',
      description: 'National network connecting pioneers exploring new ways of being church and participating in God\'s mission.',
      members: 28
    },
    spirituality: {
      id: 'spirituality',
      name: 'Spirituality Circle',
      color: '#06b6d4',
      rhythm: 'Monthly | 1st Tuesday',
      description: 'Exploring 31 spiritual practices together. Currently working through "The Art of Missional Spirituality".',
      members: 15
    },
    pioneers: {
      id: 'pioneers',
      name: 'Christchurch Pioneers',
      color: '#10b981',
      rhythm: 'Fortnightly | Wednesdays',
      description: 'Local pioneer community in Christchurch. Regular gatherings for support, prayer, and collaboration.',
      members: 9
    }
  };

  // Handle login
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Simulate login (demo mode - always succeeds)
    const submitBtn = this.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Signing in...';

    setTimeout(() => {
      authScreen.style.display = 'none';
      portalApp.style.display = 'grid';

      // Initialize portal
      initPortal();
    }, 800);
  });

  // Initialize portal
  function initPortal() {
    // Handle navigation
    setupNavigation();

    // Handle mobile sidebar toggle
    setupSidebarToggle();

    // Check URL hash for initial page
    const hash = window.location.hash.slice(1) || 'home';
    navigateToPage(hash);
  }

  // Setup navigation
  function setupNavigation() {
    // Sidebar navigation links
    document.querySelectorAll('[data-page]').forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const page = this.getAttribute('data-page');
        const group = this.getAttribute('data-group');

        if (page === 'group-detail' && group) {
          navigateToPage(page, group);
        } else {
          navigateToPage(page);
        }

        // Close mobile sidebar
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
    const activeLink = document.querySelector(`[data-page="${pageId}"]${groupId ? `[data-group="${groupId}"]` : ':not([data-group])'}`);
    if (activeLink) {
      activeLink.classList.add('active');
    }

    // Update URL hash
    window.location.hash = groupId ? `${pageId}-${groupId}` : pageId;

    // If it's a group detail page, load group data
    if (pageId === 'group-detail' && groupId) {
      loadGroupDetail(groupId);
    }
  }

  // Load group detail
  function loadGroupDetail(groupId) {
    const group = demoGroups[groupId];
    if (!group) return;

    // Update group detail page with group data
    // This would be more dynamic in a real application
    console.log('Loading group:', group.name);
  }

  // Setup sidebar toggle for mobile
  function setupSidebarToggle() {
    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', function() {
        portalSidebar.classList.toggle('open');
      });
    }

    // Check viewport width and show/hide toggle
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

  // Handle hash changes
  window.addEventListener('hashchange', function() {
    const hash = window.location.hash.slice(1);
    if (hash) {
      const [pageId, groupId] = hash.split('-');
      navigateToPage(pageId, groupId);
    }
  });

  // Demo notification handling
  const notificationBtn = document.querySelector('.portal-notification-btn');
  if (notificationBtn) {
    notificationBtn.addEventListener('click', function() {
      alert('Demo Mode: You have 3 unread notifications:\n\n1. New post in Wayfinders Network\n2. Event reminder: Exploring Wayfinding Session\n3. Stuart Simpson commented on your post');
    });
  }

  // Demo RSVP handling
  document.querySelectorAll('.event-item-action, .event-card .btn').forEach(btn => {
    if (btn.textContent.includes('RSVP')) {
      btn.addEventListener('click', function() {
        this.textContent = 'Going!';
        this.classList.remove('btn-outline');
        this.classList.add('btn-secondary');
      });
    }
  });

  // Demo search
  const searchInput = document.querySelector('.portal-search input');
  if (searchInput) {
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        alert(`Demo Mode: Searching for "${this.value}"...\n\nIn a live portal, this would search across groups, events, resources, and members.`);
      }
    });
  }

  // Demo new post
  document.querySelectorAll('button').forEach(btn => {
    if (btn.textContent.includes('New Post')) {
      btn.addEventListener('click', function() {
        alert('Demo Mode: This would open a dialog to create a new post in the group message board.');
      });
    }
  });

  // Demo Join group
  document.querySelectorAll('button').forEach(btn => {
    if (btn.textContent === 'Join') {
      btn.addEventListener('click', function() {
        this.textContent = 'Joined!';
        this.classList.remove('btn-outline');
        this.classList.add('btn-secondary');
        this.disabled = true;
      });
    }
  });

  // Demo download/watch/visit
  document.querySelectorAll('button').forEach(btn => {
    if (btn.textContent === 'Download' || btn.textContent === 'Watch' || btn.textContent === 'Visit') {
      btn.addEventListener('click', function() {
        const action = this.textContent.toLowerCase();
        alert(`Demo Mode: This would ${action} the resource.`);
      });
    }
  });

  // Demo Register Interest
  document.querySelectorAll('button').forEach(btn => {
    if (btn.textContent.includes('Register Interest')) {
      btn.addEventListener('click', function() {
        this.textContent = 'Registered!';
        this.classList.remove('btn-primary');
        this.classList.add('btn-secondary');
        this.disabled = true;
      });
    }
  });
});
