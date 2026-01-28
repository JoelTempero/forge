/**
 * Forge Aotearoa - Main JavaScript
 * Handles navigation, interactions, and animations
 */

document.addEventListener('DOMContentLoaded', function() {
  // Navigation toggle for mobile
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function() {
      navLinks.classList.toggle('open');
      this.classList.toggle('active');
    });

    // Close mobile nav when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
      });
    });
  }

  // Navbar scroll effect
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = nav ? nav.offsetHeight : 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Intersection Observer for fade-in animations
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements with animation classes
  document.querySelectorAll('.feature-card, .team-card, .event-card, .timeline-item').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });

  // Add staggered delays to grid items
  document.querySelectorAll('.grid').forEach(grid => {
    const items = grid.querySelectorAll('.feature-card, .team-card');
    items.forEach((item, index) => {
      item.style.animationDelay = `${index * 0.1}s`;
    });
  });
});

// Helper function to format dates
function formatDate(date) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('en-NZ', options);
}

// Helper function to format time
function formatTime(time) {
  return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-NZ', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

// Export for use in other scripts
window.ForgeUtils = {
  formatDate,
  formatTime
};
