// Enhanced JavaScript for Dynamic Portfolio Website

// Theme Management
class ThemeManager {
  constructor() {
    this.themeToggle = document.getElementById('theme-toggle');
    this.body = document.body;
    this.themeIcon = this.themeToggle?.querySelector('i');
    this.init();
  }

  init() {
    // Load saved theme or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.setTheme(savedTheme);
    
    if (this.themeToggle) {
      this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }
  }

  setTheme(theme) {
    this.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    this.updateThemeIcon(theme);
  }

  toggleTheme() {
    const currentTheme = this.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  updateThemeIcon(theme) {
    if (this.themeIcon) {
      this.themeIcon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    }
  }
}

// Navigation Manager
class NavigationManager {
  constructor() {
    this.navbar = document.getElementById('navbar');
    this.hamburger = document.getElementById('hamburger');
    this.navMenu = document.getElementById('nav-menu');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.lastScrollTop = 0;
    this.init();
  }

  init() {
    this.setupMobileMenu();
    this.setupScrollEffects();
    this.setupSmoothScrolling();
    this.setupActiveNavHighlighting();
  }

  setupMobileMenu() {
    if (this.hamburger && this.navMenu) {
      this.hamburger.addEventListener('click', () => {
        this.hamburger.classList.toggle('active');
        this.navMenu.classList.toggle('active');
      });

      // Close mobile menu when clicking on a link
      this.navLinks.forEach(link => {
        link.addEventListener('click', () => {
          this.hamburger.classList.remove('active');
          this.navMenu.classList.remove('active');
        });
      });
    }
  }

  setupScrollEffects() {
    if (!this.navbar) return;

    const handleScroll = this.debounce(() => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // Hide/show navbar on scroll
      if (scrollTop > this.lastScrollTop && scrollTop > 100) {
        this.navbar.style.transform = 'translateY(-100%)';
      } else {
        this.navbar.style.transform = 'translateY(0)';
      }
      
      // Add/remove background on scroll
      const isDark = document.body.getAttribute('data-theme') === 'dark';
      if (scrollTop > 50) {
        this.navbar.style.background = isDark 
          ? 'rgba(15, 23, 42, 0.98)' 
          : 'rgba(255, 255, 255, 0.98)';
      } else {
        this.navbar.style.background = isDark 
          ? 'rgba(15, 23, 42, 0.95)' 
          : 'rgba(255, 255, 255, 0.95)';
      }
      
      this.lastScrollTop = scrollTop;
    }, 10);

    window.addEventListener('scroll', handleScroll);
  }

  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        
        if (target) {
          const offsetTop = target.offsetTop - 80; // Account for fixed navbar
          
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  setupActiveNavHighlighting() {
    const sections = document.querySelectorAll('section');
    
    const handleScroll = this.debounce(() => {
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop && 
            window.pageYOffset < sectionTop + sectionHeight) {
          current = section.getAttribute('id');
        }
      });
      
      this.navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
          link.classList.add('active');
        }
      });
    }, 50);

    window.addEventListener('scroll', handleScroll);
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

// Animation Manager
class AnimationManager {
  constructor() {
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    this.init();
  }

  init() {
    this.setupIntersectionObserver();
    this.setupAnimationClasses();
  }

  setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, this.observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
      '.portfolio-item, .service-card, .insight-card, .timeline-item, .sector-card'
    );
    
    animatedElements.forEach((element, index) => {
      element.classList.add('fade-in');
      element.style.transitionDelay = `${index * 0.1}s`;
      observer.observe(element);
    });
  }

  setupAnimationClasses() {
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
      .fade-in {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .fade-in.visible {
        opacity: 1;
        transform: translateY(0);
      }
      
      .slide-in-left {
        opacity: 0;
        transform: translateX(-30px);
        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .slide-in-left.visible {
        opacity: 1;
        transform: translateX(0);
      }
      
      .slide-in-right {
        opacity: 0;
        transform: translateX(30px);
        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .slide-in-right.visible {
        opacity: 1;
        transform: translateX(0);
      }
    `;
    document.head.appendChild(style);
  }
}

// Portfolio Filter Manager
class PortfolioManager {
  constructor() {
    this.filterButtons = document.querySelectorAll('.filter-btn');
    this.portfolioItems = document.querySelectorAll('.portfolio-item');
    this.init();
  }

  init() {
    this.setupFiltering();
  }

  setupFiltering() {
    this.filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Remove active class from all buttons
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        const filterValue = button.getAttribute('data-filter');
        this.filterItems(filterValue);
      });
    });
  }

  filterItems(filterValue) {
    this.portfolioItems.forEach(item => {
      const category = item.getAttribute('data-category');
      
      if (filterValue === 'all' || category === filterValue) {
        item.style.display = 'block';
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
        }, 100);
      } else {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.8)';
        setTimeout(() => {
          item.style.display = 'none';
        }, 300);
      }
    });
  }
}

// Modal Manager
class ModalManager {
  constructor() {
    this.modalOverlay = document.getElementById('modal-overlay');
    this.projectModal = document.getElementById('project-modal');
    this.modalBody = document.getElementById('modal-body');
    this.init();
  }

  init() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Close modal when clicking overlay
    if (this.modalOverlay) {
      this.modalOverlay.addEventListener('click', () => this.closeModal());
    }

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeModal();
      }
    });
  }

  openModal(content) {
    if (this.modalBody) {
      this.modalBody.innerHTML = content;
    }
    
    if (this.modalOverlay && this.projectModal) {
      this.modalOverlay.classList.add('active');
      this.projectModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal() {
    if (this.modalOverlay && this.projectModal) {
      this.modalOverlay.classList.remove('active');
      this.projectModal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  }
}

// Contact Form Manager
class ContactFormManager {
  constructor() {
    this.contactForm = document.getElementById('contact-form');
    this.init();
  }

  init() {
    if (this.contactForm) {
      this.setupFormSubmission();
      this.setupFormValidation();
    }
  }

  setupFormSubmission() {
    this.contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const formData = new FormData(this.contactForm);
      const submitButton = this.contactForm.querySelector('button[type="submit"]');
      const buttonText = submitButton.querySelector('span');
      const buttonIcon = submitButton.querySelector('i');
      
      // Show loading state
      buttonText.textContent = 'Preparing Email...';
      buttonIcon.className = 'loading';
      submitButton.disabled = true;
      
      // Extract form data
      const firstName = formData.get('firstName');
      const lastName = formData.get('lastName');
      const email = formData.get('email');
      const phone = formData.get('phone');
      const projectType = formData.get('projectType');
      const budget = formData.get('budget');
      const message = formData.get('message');
      
      // Create custom message
      let customBody = `New Booking/Reservation Request\n\n`;
      customBody += `Name: ${firstName} ${lastName}\n`;
      customBody += `Email: ${email}\n`;
      customBody += `Phone: ${phone || 'Not provided'}\n`;
      customBody += `Project Type: ${projectType}\n`;
      customBody += `Budget Range: ${budget || 'Not specified'}\n\n`;
      customBody += `Project Details:\n${message}\n\n`;
      
      // Customize based on project type
      let subject = 'New Project Inquiry';
      if (projectType === 'photography' || projectType === 'videography') {
        subject = `New ${projectType.charAt(0).toUpperCase() + projectType.slice(1)} Booking Request`;
        customBody = `Reservation Details for ${projectType.toUpperCase()} Service:\n\n` + customBody;
        customBody += `\nPlease provide available dates and any specific requirements for the session.`;
      } else if (projectType === 'other') {
        subject = 'Custom Project Request';
      }
      
      // Encode for mailto
      const encodedSubject = encodeURIComponent(subject);
      const encodedBody = encodeURIComponent(customBody);
      
      // Open mail client
      window.open(`mailto:auravexonflow@gmail.com?subject=${encodedSubject}&body=${encodedBody}`, '_blank');
      
      // Open WhatsApp
      const whatsappNumber = '94788927453';
      window.open(`https://wa.me/${whatsappNumber}?text=${encodedBody}`, '_blank');
      
      // Show success message
      buttonText.textContent = 'Messages Prepared!';
      buttonIcon.className = 'fas fa-check';
      
      // Reset form
      this.contactForm.reset();
      
      // Reset button after 3 seconds
      setTimeout(() => {
        buttonText.textContent = 'Send Message';
        buttonIcon.className = 'fas fa-paper-plane';
        submitButton.disabled = false;
      }, 3000);
    });
  }

  setupFormValidation() {
    const formGroups = this.contactForm.querySelectorAll('.form-group');
    
    formGroups.forEach(group => {
      const input = group.querySelector('input, textarea, select');
      const label = group.querySelector('label');
      
      if (input && label) {
        // Handle initial state if field has value
        if (input.value) {
          this.activateLabel(label);
        }
        
        input.addEventListener('focus', () => this.activateLabel(label));
        input.addEventListener('blur', () => {
          if (!input.value) {
            this.deactivateLabel(label);
          }
        });
      }
    });
  }

  activateLabel(label) {
    label.style.top = '-0.5rem';
    label.style.left = '0.75rem';
    label.style.fontSize = 'var(--font-size-sm)';
    label.style.color = 'var(--primary-color)';
  }

  deactivateLabel(label) {
    label.style.top = '1rem';
    label.style.left = '1rem';
    label.style.fontSize = 'var(--font-size-base)';
    label.style.color = 'var(--text-light)';
  }
}

// Innovation Section Manager
class InnovationManager {
  constructor() {
    this.sectorCards = document.querySelectorAll('.sector-card');
    this.init();
  }

  init() {
    this.setupSectorToggling();
  }

  setupSectorToggling() {
    this.sectorCards.forEach(card => {
      const header = card.querySelector('.sector-header');
      
      if (header) {
        header.addEventListener('click', () => {
          // Close all other cards
          this.sectorCards.forEach(otherCard => {
            if (otherCard !== card) {
              otherCard.classList.remove('active');
            }
          });
          
          // Toggle current card
          card.classList.toggle('active');
        });
      }
    });
  }
}

// Typing Animation Manager
class TypingAnimationManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupHeroTypingAnimation();
  }

  setupHeroTypingAnimation() {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
      // Store original content
      const titleLines = heroTitle.querySelectorAll('.title-line');
      
      // Animate each line with delay
      titleLines.forEach((line, index) => {
        line.style.opacity = '0';
        line.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
          line.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
          line.style.opacity = '1';
          line.style.transform = 'translateY(0)';
        }, index * 200);
      });
    }
  }
}

// Performance Manager
class PerformanceManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupImageLazyLoading();
    this.setupPreloader();
  }

  setupImageLazyLoading() {
    const images = document.querySelectorAll('img');
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.style.opacity = '0';
          img.style.transition = 'opacity 0.3s ease';
          
          img.addEventListener('load', () => {
            img.style.opacity = '1';
          });
          
          img.addEventListener('error', () => {
            img.style.display = 'none';
            console.log(`Failed to load image: ${img.src}`);
          });
          
          // If image is already loaded
          if (img.complete) {
            img.style.opacity = '1';
          }
          
          imageObserver.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  }

  setupPreloader() {
    window.addEventListener('load', () => {
      document.body.classList.add('loaded');
      
      // Add preloader styles
      const preloaderStyle = document.createElement('style');
      preloaderStyle.textContent = `
        body:not(.loaded) {
          overflow: hidden;
        }
        
        body:not(.loaded)::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: var(--bg-color);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          opacity: 1;
          transition: opacity 0.5s ease;
        }
        
        body.loaded::before {
          opacity: 0;
          pointer-events: none;
        }
      `;
      document.head.appendChild(preloaderStyle);
    });
  }
}

// Portfolio Background Particle System
class PortfolioParticleSystem {
  constructor() {
    this.portfolioSection = document.getElementById('portfolio');
    if (!this.portfolioSection) return;
    
    this.init();
  }

  init() {
    // Make portfolio section relative positioned
    this.portfolioSection.style.position = 'relative';
    
    // Create canvas as background
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'portfolioParticleCanvas';
    Object.assign(this.canvas.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: '1'
    });
    
    // Insert canvas as first child (behind content)
    this.portfolioSection.insertBefore(this.canvas, this.portfolioSection.firstChild);
    
    // Ensure content has higher z-index
    const container = this.portfolioSection.querySelector('.container');
    if (container) {
      container.style.position = 'relative';
      container.style.zIndex = '2';
    }

    this.ctx = this.canvas.getContext('2d');
    this.particlesArray = [];
    this.maxParticles = 200;

    this.setupCanvas();
    this.setupEvents();
    this.animate();
  }

  setupCanvas() {
    const rect = this.portfolioSection.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }

  setupEvents() {
    // Mouse move event relative to portfolio section
    this.portfolioSection.addEventListener('mousemove', (e) => {
      const rect = this.portfolioSection.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      this.particlesArray.push(new PortfolioParticle(x, y, this.ctx));
      if (this.particlesArray.length > this.maxParticles) {
        this.particlesArray.shift();
      }
    });

    // Resize canvas when window resizes
    window.addEventListener('resize', () => {
      this.setupCanvas();
    });
  }

  connect() {
    for (let a = 0; a < this.particlesArray.length; a++) {
      for (let b = a + 1; b < this.particlesArray.length; b++) {
        const dx = this.particlesArray[a].x - this.particlesArray[b].x;
        const dy = this.particlesArray[a].y - this.particlesArray[b].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 120) {
          this.ctx.strokeStyle = 'rgba(0,255,255,0.2)';
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particlesArray[a].x, this.particlesArray[a].y);
          this.ctx.lineTo(this.particlesArray[b].x, this.particlesArray[b].y);
          this.ctx.stroke();
        }
      }
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw and update particles
    for (let i = this.particlesArray.length - 1; i >= 0; i--) {
      const p = this.particlesArray[i];
      p.draw();
      p.update();
      if (p.life <= 0) {
        this.particlesArray.splice(i, 1);
      }
    }

    this.connect();
    requestAnimationFrame(() => this.animate());
  }
}

// Particle class for portfolio section
class PortfolioParticle {
  constructor(x, y, ctx) {
    this.x = x;
    this.y = y;
    this.size = 2 + Math.random() * 2;
    this.color = `hsl(${Math.random() * 360}, 100%, 70%) `;
    this.vx = (Math.random() - 0.5) * 1.5;
    this.vy = (Math.random() - 0.5) * 1.5;
    this.life = 100 + Math.random() * 50;
    this.ctx = ctx;
  }

  draw() {
    this.ctx.shadowBlur = 15;
    this.ctx.shadowColor = this.color;
    this.ctx.fillStyle = this.color;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    this.ctx.closePath();
    this.ctx.fill();
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life--;
  }
}


function openInsightModal(insightId) {
  const modalManager = window.modalManager;
  if (!modalManager) return;

  const insightContent = getInsightContent(insightId);
  modalManager.openModal(insightContent);
}

function getInsightContent(insightId) {
  const insights = {
    'ai-education': `
      <div class="modal-insight-content">
        <img src="https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="AI in Education" style="width: 100%; height: 300px; object-fit: cover; border-radius: 1rem; margin-bottom: 2rem;">
        <h2 style="font-size: 2rem; font-weight: 600; margin-bottom: 1rem; color: var(--text-color);">The Future of AI in Education</h2>
        <p style="color: var(--text-light); line-height: 1.7; margin-bottom: 2rem;">
          Artificial Intelligence is revolutionizing education by providing personalized learning experiences, 
          automated grading systems, and intelligent tutoring. This insight explores how AI can adapt to individual 
          learning styles, predict student performance, and create more efficient educational environments.
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
          <div style="background: var(--bg-secondary); padding: 1rem; border-radius: 0.5rem;">
            <h4 style="color: var(--primary-color); margin-bottom: 0.5rem;">Key Benefits</h4>
            <p style="color: var(--text-light); font-size: 0.9rem;">Personalized Learning, Automated Assessment, Predictive Analytics</p>
          </div>
          <div style="background: var(--bg-secondary); padding: 1rem; border-radius: 0.5rem;">
            <h4 style="color: var(--primary-color); margin-bottom: 0.5rem;">Challenges</h4>
            <p style="color: var(--text-light); font-size: 0.9rem;">Data Privacy, Implementation Costs, Teacher Training</p>
          </div>
        </div>
      </div>
    `,
    'tech-creativity': `
      <div class="modal-insight-content">
        <img src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Tech and Creativity" style="width: 100%; height: 300px; object-fit: cover; border-radius: 1rem; margin-bottom: 2rem;">
        <h2 style="font-size: 2rem; font-weight: 600; margin-bottom: 1rem; color: var(--text-color);">Balancing Technology and Creativity</h2>
        <p style="color: var(--text-light); line-height: 1.7; margin-bottom: 2rem;">
          In the digital age, technology provides powerful tools for creative expression, but maintaining 
          authenticity is crucial. This article discusses strategies for using tech as an enhancer rather than 
          a replacement for human creativity.
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
          <div style="background: var(--bg-secondary); padding: 1rem; border-radius: 0.5rem;">
            <h4 style="color: var(--primary-color); margin-bottom: 0.5rem;">Key Strategies</h4>
            <p style="color: var(--text-light); font-size: 0.9rem;">Tool Mastery, Creative Constraints, Human Touch</p>
          </div>
          <div style="background: var(--bg-secondary); padding: 1rem; border-radius: 0.5rem;">
            <h4 style="color: var(--primary-color); margin-bottom: 0.5rem;">Best Practices</h4>
            <p style="color: var(--text-light); font-size: 0.9rem;">Iterative Design, Tech Integration, Skill Development</p>
          </div>
        </div>
      </div>
    `,
    'student-innovation': `
      <div class="modal-insight-content">
        <img src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Student Innovation" style="width: 100%; height: 300px; object-fit: cover; border-radius: 1rem; margin-bottom: 2rem;">
        <h2 style="font-size: 2rem; font-weight: 600; margin-bottom: 1rem; color: var(--text-color);">Student-Led Innovation in Sri Lanka</h2>
        <p style="color: var(--text-light); line-height: 1.7; margin-bottom: 2rem;">
          Young innovators in Sri Lanka are driving technological advancement through startups and projects. 
          This insight highlights successful student-led initiatives and their impact on the local tech ecosystem.
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
          <div style="background: var(--bg-secondary); padding: 1rem; border-radius: 0.5rem;">
            <h4 style="color: var(--primary-color); margin-bottom: 0.5rem;">Key Examples</h4>
            <p style="color: var(--text-light); font-size: 0.9rem;">Tech Startups, Innovation Hubs, Student Projects</p>
          </div>
          <div style="background: var(--bg-secondary); padding: 1rem; border-radius: 0.5rem;">
            <h4 style="color: var(--primary-color); margin-bottom: 0.5rem;">Impact Areas</h4>
            <p style="color: var(--text-light); font-size: 0.9rem;">Economy, Education, Technology Adoption</p>
          </div>
        </div>
      </div>
    `,
    'web-development': `
      <div class="modal-insight-content">
        <img src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Web Development" style="width: 100%; height: 300px; object-fit: cover; border-radius: 1rem; margin-bottom: 2rem;">
        <h2 style="font-size: 2rem; font-weight: 600; margin-bottom: 1rem; color: var(--text-color);">Modern Web Development Practices</h2>
        <p style="color: var(--text-light); line-height: 1.7; margin-bottom: 2rem;">
          Exploring current best practices in web development, including progressive web apps, 
          performance optimization, and modern frameworks that are shaping the future of the web.
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
          <div style="background: var(--bg-secondary); padding: 1rem; border-radius: 0.5rem;">
            <h4 style="color: var(--primary-color); margin-bottom: 0.5rem;">Core Practices</h4>
            <p style="color: var(--text-light); font-size: 0.9rem;">Responsive Design, Performance Optimization, Security</p>
          </div>
          <div style="background: var(--bg-secondary); padding: 1rem; border-radius: 0.5rem;">
            <h4 style="color: var(--primary-color); margin-bottom: 0.5rem;">Emerging Trends</h4>
            <p style="color: var(--text-light); font-size: 0.9rem;">PWAs, Jamstack, Web3 Integration</p>
          </div>
        </div>
      </div>
    `
  };

  return insights[insightId] || '<p>Insight details not available.</p>';
}

// Global Functions for Modal Content
function openProjectModal(projectId) {
  const modalManager = window.modalManager;
  if (!modalManager) return;

  const projectContent = getProjectContent(projectId);
  modalManager.openModal(projectContent);
}

function openCaseStudyModal(caseStudyId) {
  const modalManager = window.modalManager;
  if (!modalManager) return;

  const caseStudyContent = getCaseStudyContent(caseStudyId);
  modalManager.openModal(caseStudyContent);
}

function closeModal() {
  const modalManager = window.modalManager;
  if (modalManager) {
    modalManager.closeModal();
  }
}

function getProjectContent(projectId) {
  const projects = {
    'school-management': `
      <div class="modal-project-content">
        <img src="sms.png" alt="School Management System" style="width: 100%; height: 300px; object-fit: cover; border-radius: 1rem; margin-bottom: 2rem;">
        <h2 style="font-size: 2rem; font-weight: 600; margin-bottom: 1rem; color: var(--text-color);">School Management System</h2>
        <p style="color: var(--text-light); line-height: 1.7; margin-bottom: 2rem;">
          A comprehensive Learning Management System designed to streamline school administration processes. 
          Features include role-based access control, student enrollment management, grade tracking, 
          attendance monitoring, and parent communication portals.
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
          <div style="background: var(--bg-secondary); padding: 1rem; border-radius: 0.5rem;">
            <h4 style="color: var(--primary-color); margin-bottom: 0.5rem;">Technologies Used</h4>
            <p style="color: var(--text-light); font-size: 0.9rem;">PHP, MySQL, HTML5, CSS3, JavaScript</p>
          </div>
          <div style="background: var(--bg-secondary); padding: 1rem; border-radius: 0.5rem;">
            <h4 style="color: var(--primary-color); margin-bottom: 0.5rem;">Key Features</h4>
            <p style="color: var(--text-light); font-size: 0.9rem;">Role-based access, Grade management, Reporting</p>
          </div>
        </div>
      </div>
    `,
    'radio-app': `
      <div class="modal-project-content">
        <img src="radio.png" alt="Sri Lankan Radio" style="width: 100%; height: 300px; object-fit: cover; border-radius: 1rem; margin-bottom: 2rem;">
        <h2 style="font-size: 2rem; font-weight: 600; margin-bottom: 1rem; color: var(--text-color);">Sri Lankan Radio Streaming Platform</h2>
        <p style="color: var(--text-light); line-height: 1.7; margin-bottom: 2rem;">
          An interactive radio streaming platform featuring real-time audio processing and a modern user interface. 
          The application provides seamless streaming of Sri Lankan radio stations with advanced audio controls, 
          station browsing, and responsive design for all devices.
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
          <div style="background: var(--bg-secondary); padding: 1rem; border-radius: 0.5rem;">
            <h4 style="color: var(--primary-color); margin-bottom: 0.5rem;">Technologies Used</h4>
            <p style="color: var(--text-light); font-size: 0.9rem;">HTML5 Audio API, CSS3, JavaScript, Responsive Design</p>
          </div>
          <div style="background: var(--bg-secondary); padding: 1rem; border-radius: 0.5rem;">
            <h4 style="color: var(--primary-color); margin-bottom: 0.5rem;">Key Features</h4>
            <p style="color: var(--text-light); font-size: 0.9rem;">Real-time streaming, Station browser, Audio controls</p>
          </div>
        </div>
        <div style="text-align: center; margin-top: 2rem;">
          <a href="https://srilankanradio.netlify.app/" target="_blank" style="display: inline-flex; align-items: center; gap: 0.5rem; background: var(--primary-color); color: white; padding: 1rem 2rem; border-radius: 0.5rem; text-decoration: none; font-weight: 600; transition: all 0.3s ease;">
            <i class="fas fa-external-link-alt"></i>
            <span>Visit Live Site</span>
          </a>
        </div>
      </div>
    `,
    'tourism-website': `
      <div class="modal-project-content">
        <img src="tourism.png" alt="Tourism Website" style="width: 100%; height: 300px; object-fit: cover; border-radius: 1rem; margin-bottom: 2rem;">
        <h2 style="font-size: 2rem; font-weight: 600; margin-bottom: 1rem; color: var(--text-color);">Tourism Website Design</h2>
        <p style="color: var(--text-light); line-height: 1.7; margin-bottom: 2rem;">
          A modern tourism platform featuring interactive elements and stunning visual design. 
          The website showcases travel destinations with immersive galleries, booking functionality, 
          and responsive design optimized for tourism businesses and travel enthusiasts.
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
          <div style="background: var(--bg-secondary); padding: 1rem; border-radius: 0.5rem;">
            <h4 style="color: var(--primary-color); margin-bottom: 0.5rem;">Technologies Used</h4>
            <p style="color: var(--text-light); font-size: 0.9rem;">Wix Platform, Custom CSS, Interactive Elements</p>
          </div>
          <div style="background: var(--bg-secondary); padding: 1rem; border-radius: 0.5rem;">
            <h4 style="color: var(--primary-color); margin-bottom: 0.5rem;">Key Features</h4>
            <p style="color: var(--text-light); font-size: 0.9rem;">Interactive galleries, Booking system, Mobile responsive</p>
          </div>
        </div>
        <div style="text-align: center; margin-top: 2rem;">
          <a href="https://youravitube2020.wixsite.com/test" target="_blank" style="display: inline-flex; align-items: center; gap: 0.5rem; background: var(--primary-color); color: white; padding: 1rem 2rem; border-radius: 0.5rem; text-decoration: none; font-weight: 600; transition: all 0.3s ease;">
            <i class="fas fa-external-link-alt"></i>
            <span>Visit Live Site</span>
          </a>
        </div>
      </div>
    `,
    'pdf-processing': `
      <div class="modal-project-content">
        <img src="pdf.png" alt="PDF Processing App" style="width: 100%; height: 300px; object-fit: cover; border-radius: 1rem; margin-bottom: 2rem;">
        <h2 style="font-size: 2rem; font-weight: 600; margin-bottom: 1rem; color: var(--text-color);">PDF Processing Web Application</h2>
        <p style="color: var(--text-light); line-height: 1.7; margin-bottom: 2rem;">
          An enterprise-grade web application featuring OCR technology for text extraction from PDFs, 
          advanced security measures, batch processing capabilities, and seamless cloud integration 
          for scalable document management.
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
          <div style="background: var(--bg-secondary); padding: 1rem; border-radius: 0.5rem;">
            <h4 style="color: var(--primary-color); margin-bottom: 0.5rem;">Technologies Used</h4>
            <p style="color: var(--text-light); font-size: 0.9rem;">Python, OCR, Cloud APIs, Security</p>
          </div>
          <div style="background: var(--bg-secondary); padding: 1rem; border-radius: 0.5rem;">
            <h4 style="color: var(--primary-color); margin-bottom: 0.5rem;">Key Features</h4>
            <p style="color: var(--text-light); font-size: 0.9rem;">OCR processing, Batch operations, Cloud storage</p>
          </div>
        </div>
      </div>
    `,
    'video-production': `
      <div class="modal-project-content">
        <img src="https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Video Production" style="width: 100%; height: 300px; object-fit: cover; border-radius: 1rem; margin-bottom: 2rem;">
        <h2 style="font-size: 2rem; font-weight: 600; margin-bottom: 1rem; color: var(--text-color);">Video Production Services</h2>
        <p style="color: var(--text-light); line-height: 1.7; margin-bottom: 2rem;">
          Professional videography and post-production services under the Auravexon Vibes brand. 
          Specializing in video editing, color grading, motion graphics, and creating compelling 
          visual narratives that resonate with audiences.
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
          <div style="background: var(--bg-secondary); padding: 1rem; border-radius: 0.5rem;">
            <h4 style="color: var(--primary-color); margin-bottom: 0.5rem;">Services</h4>
            <p style="color: var(--text-light); font-size: 0.9rem;">Video editing, Color grading, Motion graphics</p>
          </div>
          <div style="background: var(--bg-secondary); padding: 1rem; border-radius: 0.5rem;">
            <h4 style="color: var(--primary-color); margin-bottom: 0.5rem;">Software</h4>
            <p style="color: var(--text-light); font-size: 0.9rem;">Professional editing suites, After Effects</p>
          </div>
        </div>
      </div>
    `
  };

  return projects[projectId] || '<p>Project details not available.</p>';
}

function getCaseStudyContent(caseStudyId) {
  const caseStudies = {
    'car-records': `
      <div class="modal-casestudy-content">
        <h2 style="font-size: 2rem; font-weight: 600; margin-bottom: 2rem; color: var(--text-color);">Car Records Manager - Case Study</h2>
        
        <div style="margin-bottom: 2rem;">
          <h3 style="color: var(--primary-color); margin-bottom: 1rem;">Project Overview</h3>
          <p style="color: var(--text-light); line-height: 1.7;">
            The Car Records Manager is a Python-based console application designed to demonstrate 
            fundamental programming concepts including CRUD operations, file handling, and 
            object-oriented programming principles.
          </p>
        </div>
        
        <div style="margin-bottom: 2rem;">
          <h3 style="color: var(--primary-color); margin-bottom: 1rem;">Technical Implementation</h3>
          <ul style="color: var(--text-light); line-height: 1.7; padding-left: 1.5rem;">
            <li>Implemented using Python's built-in file I/O operations</li>
            <li>Object-oriented design with Car class and RecordManager class</li>
            <li>Menu-driven interface for user interaction</li>
            <li>Data persistence using CSV file format</li>
          </ul>
        </div>
        
        <div style="margin-bottom: 2rem;">
          <h3 style="color: var(--primary-color); margin-bottom: 1rem;">Learning Outcomes</h3>
          <p style="color: var(--text-light); line-height: 1.7;">
            This project reinforced understanding of file handling, data validation, 
            error handling, and user interface design in console applications.
          </p>
        </div>
      </div>
    `,
    'pdf-processing': `
      <div class="modal-casestudy-content">
        <h2 style="font-size: 2rem; font-weight: 600; margin-bottom: 2rem; color: var(--text-color);">PDF Processing Application - Case Study</h2>
        
        <div style="margin-bottom: 2rem;">
          <h3 style="color: var(--primary-color); margin-bottom: 1rem;">Project Overview</h3>
          <p style="color: var(--text-light); line-height: 1.7;">
            An enterprise-level web application that processes PDF documents using OCR technology, 
            providing text extraction, document analysis, and cloud-based storage solutions.
          </p>
        </div>
        
        <div style="margin-bottom: 2rem;">
          <h3 style="color: var(--primary-color); margin-bottom: 1rem;">Technical Architecture</h3>
          <ul style="color: var(--text-light); line-height: 1.7; padding-left: 1.5rem;">
            <li>Python backend with Flask/Django framework</li>
            <li>OCR integration using Tesseract and OpenCV</li>
            <li>Cloud storage integration (AWS S3/Google Cloud)</li>
            <li>Advanced security measures and user authentication</li>
            <li>Batch processing capabilities for multiple documents</li>
          </ul>
        </div>
        
        <div style="margin-bottom: 2rem;">
          <h3 style="color: var(--primary-color); margin-bottom: 1rem;">Impact & Results</h3>
          <p style="color: var(--text-light); line-height: 1.7;">
            Successfully automated document processing workflows, reducing manual processing time 
            by 80% and improving accuracy through automated text extraction and validation.
          </p>
        </div>
      </div>
    `
  };

  return caseStudies[caseStudyId] || '<p>Case study details not available.</p>';
}

// Gallery Manager
class GalleryManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupVideoGallery();
    this.setupPhotographyGallery();
    this.setupGalleryModals();
  }

  setupPhotographyGallery() {
    const photoFilterButtons = document.querySelectorAll('.photo-filter-btn');
    const photoItems = document.querySelectorAll('.photo-item');

    // Set default filter
    if (photoFilterButtons.length > 0) {
      const defaultFilter = photoFilterButtons[0];
      defaultFilter.classList.add('active');
    }

    photoFilterButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Remove active class from all buttons
        photoFilterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        const filterValue = button.getAttribute('data-filter');
        this.filterPhotoItems(photoItems, filterValue);
      });
    });

    // Setup photo modal triggers
    photoItems.forEach(item => {
      const viewBtn = item.querySelector('.photo-view-btn');
      const img = item.querySelector('.photo-thumbnail img');
      
      if (viewBtn) {
        viewBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.openPhotoModal(item);
        });
      }
      
      if (img) {
        img.addEventListener('click', () => {
          this.openPhotoModal(item);
        });
      }
    });
  }

  setupVideoGallery() {
    const videoFilterButtons = document.querySelectorAll('.video-filter-btn');
    const videoItems = document.querySelectorAll('.video-item');

    videoFilterButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Remove active class from all buttons
        videoFilterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        const filterValue = button.getAttribute('data-filter');
        this.filterVideoItems(videoItems, filterValue);
      });
    });
  }

  filterPhotoItems(items, filterValue) {
    items.forEach(item => {
      const category = item.getAttribute('data-category');
      
      if (filterValue === 'all' || category === filterValue) {
        item.style.display = 'block';
        item.classList.remove('filtering', 'hidden');
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
        }, 100);
      } else {
        item.classList.add('filtering');
        setTimeout(() => {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          setTimeout(() => {
            item.style.display = 'none';
            item.classList.add('hidden');
          }, 300);
        }, 100);
      }
    });
  }

  openPhotoModal(photoItem) {
    const title = photoItem.querySelector('.photo-info-overlay h4')?.textContent || 'Photo';
    const category = photoItem.getAttribute('data-category');
    const img = photoItem.querySelector('.photo-thumbnail img');
    const description = photoItem.querySelector('.photo-info-overlay p')?.textContent || 'Photography work';
    const location = photoItem.querySelector('.photo-meta span[data-location]')?.textContent || '';
    const date = photoItem.querySelector('.photo-meta span[data-date]')?.textContent || '';
    
    const modalContent = this.createPhotoModalContent(img.src, title, description, category, location, date);
    this.openGalleryModal(modalContent, title, description, category, 0, 1);
  }

  createPhotoModalContent(imgSrc, title, description, category, location, date) {
    return `
      <div class="gallery-modal-hero">
        <div class="hero-image">
          <img src="${imgSrc}" alt="${title}" loading="lazy">
          <div class="image-overlay">
            <div class="overlay-content">
              <h3 class="hero-title">${title}</h3>
              <div class="hero-tags">
                <span class="tag">${category.charAt(0).toUpperCase() + category.slice(1)}</span>
                ${location ? `<span class="tag"><i class="fas fa-map-marker-alt"></i> ${location}</span>` : ''}
                ${date ? `<span class="tag"><i class="fas fa-calendar"></i> ${date}</span>` : ''}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="project-info">
        <div class="info-item">
          <i class="fas fa-tag"></i>
          <span>Category: ${category.charAt(0).toUpperCase() + category.slice(1)}</span>
        </div>
        ${location ? `<div class="info-item"><i class="fas fa-map-marker-alt"></i><span>Location: ${location}</span></div>` : ''}
        ${date ? `<div class="info-item"><i class="fas fa-calendar"></i><span>Date: ${date}</span></div>` : ''}
        <div class="info-item">
          <i class="fas fa-camera"></i>
          <span>Photography by Ravindu Madhushan</span>
        </div>
      </div>
      
      <div class="gallery-modal-description">
        <div class="gallery-description">
          <h3><i class="fas fa-info-circle"></i> About This Work</h3>
          <div class="project-overview">
            <p>${description}</p>
          </div>
          <div class="technical-details">
            <h4 style="color: var(--primary-color); margin-bottom: 1rem;">Photography Details</h4>
            <div class="tech-grid">
              <div class="tech-item">
                <i class="fas fa-eye"></i>
                <div>
                  <strong>Style:</strong> Professional photography showcasing creative vision and technical expertise.
                </div>
              </div>
              <div class="tech-item">
                <i class="fas fa-cogs"></i>
                <div>
                  <strong>Equipment:</strong> Professional cameras and lighting equipment for optimal results.
                </div>
              </div>
              <div class="tech-item">
                <i class="fas fa-palette"></i>
                <div>
                  <strong>Post-Processing:</strong> Advanced color grading and editing to enhance visual impact.
                </div>
              </div>
              <div class="tech-item">
                <i class="fas fa-star"></i>
                <div>
                  <strong>Quality:</strong> High-resolution images suitable for print and digital use.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }


  filterVideoItems(items, filterValue) {
    items.forEach(item => {
      const category = item.getAttribute('data-category');
      
      if (filterValue === 'all' || category === filterValue) {
        item.style.display = 'block';
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
        }, 100);
      } else {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.8)';
        setTimeout(() => {
          item.style.display = 'none';
        }, 300);
      }
    });
  }

  setupGalleryModals() {
    // Create gallery modal if it doesn't exist
    if (!document.getElementById('gallery-modal')) {
      const galleryModal = document.createElement('div');
      galleryModal.id = 'gallery-modal';
      galleryModal.className = 'gallery-modal';
      galleryModal.innerHTML = `
        <div class="gallery-modal-content">
          <button class="gallery-modal-close" onclick="closeGalleryModal()">
            <i class="fas fa-times"></i>
          </button>
          <div class="gallery-modal-body"></div>
          <div class="gallery-modal-info">
            <h4></h4>
            <p></p>
          </div>
        </div>
      `;
      document.body.appendChild(galleryModal);
    }

    // Close modal when clicking outside
    document.getElementById('gallery-modal').addEventListener('click', (e) => {
      if (e.target.id === 'gallery-modal') {
        this.closeGalleryModal();
      }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeGalleryModal();
      }
    });
  }

  openGalleryModal(content, title, description) {
    const modal = document.getElementById('gallery-modal');
    const modalBody = modal.querySelector('.gallery-modal-body');
    const modalTitle = modal.querySelector('.gallery-modal-info h4');
    const modalDescription = modal.querySelector('.gallery-modal-info p');

    modalBody.innerHTML = content;
    modalTitle.textContent = title;
    modalDescription.innerHTML = description;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeGalleryModal() {
    const modal = document.getElementById('gallery-modal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

// Global Gallery Functions
function openVideoModal(videoId) {
  const galleryManager = window.galleryManager;
  if (!galleryManager) return;

  const videoContent = getVideoContent(videoId);
  galleryManager.openGalleryModal(videoContent.content, videoContent.title, videoContent.description);
}

function openPhotoModal(photoId, category, index = 0) {
  const galleryManager = window.galleryManager;
  if (!galleryManager) return;

  const photoContent = getPhotoContent(photoId, category, index);
  galleryManager.openGalleryModal(photoContent.content, photoContent.title, photoContent.description, category, index, 1);
}

function closeGalleryModal() {
  const galleryManager = window.galleryManager;
  if (galleryManager) {
    galleryManager.closeGalleryModal();
  }
}

function getPhotoContent(photoId, category, index = 0) {
  const photos = {
    'portrait-1': {
      content: `
        <div class="gallery-modal-hero">
          <div class="hero-image">
            <img src="components/profetional portraits/1.png" alt="Professional Portrait Session" loading="lazy">
            <div class="image-overlay">
              <div class="overlay-content">
                <h3 class="hero-title">Professional Portrait Session</h3>
                <div class="hero-tags">
                  <span class="tag">Portrait</span>
                  <span class="tag">Studio</span>
                  <span class="tag">2024</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="project-info">
          <div class="info-item">
            <i class="fas fa-tag"></i>
            <span>Category: Portrait Photography</span>
          </div>
          <div class="info-item">
            <i class="fas fa-map-marker-alt"></i>
            <span>Location: Professional Studio</span>
          </div>
          <div class="info-item">
            <i class="fas fa-calendar"></i>
            <span>Date: 2024</span>
          </div>
          <div class="info-item">
            <i class="fas fa-camera"></i>
            <span>Photography by Ravindu Madhushan</span>
          </div>
        </div>
        
        <div class="gallery-modal-description">
          <div class="gallery-description">
            <h3><i class="fas fa-info-circle"></i> About This Work</h3>
            <div class="project-overview">
              <p>Professional portrait photography showcasing studio techniques and professional lighting. This image demonstrates the use of dramatic lighting and composition to create compelling portraits that capture personality and professionalism.</p>
            </div>
            <div class="technical-details">
              <h4 style="color: var(--primary-color); margin-bottom: 1rem;">Photography Details</h4>
              <div class="tech-grid">
                <div class="tech-item">
                  <i class="fas fa-lightbulb"></i>
                  <div>
                    <strong>Lighting:</strong> Professional studio lighting with soft boxes and key lighting setup.
                  </div>
                </div>
                <div class="tech-item">
                  <i class="fas fa-cog"></i>
                  <div>
                    <strong>Composition:</strong> Classic portrait composition with careful attention to subject positioning.
                  </div>
                </div>
                <div class="tech-item">
                  <i class="fas fa-palette"></i>
                  <div>
                    <strong>Post-Processing:</strong> Professional color grading and retouching for optimal results.
                  </div>
                </div>
                <div class="tech-item">
                  <i class="fas fa-star"></i>
                  <div>
                    <strong>Quality:</strong> High-resolution output suitable for professional use.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `,
      title: 'Professional Portrait Session',
      description: 'Studio portrait with professional lighting techniques'
    },
    'business-portrait-1': {
      content: `
        <div class="gallery-modal-hero">
          <div class="hero-image">
            <img src="components/profetional portraits/serious-indian-professional-business-man-office-portrait-serious-young-ambitious-indian-businessman-project-leader-dressed-367980912.webp" alt="Executive Business Portrait" loading="lazy">
            <div class="image-overlay">
              <div class="overlay-content">
                <h3 class="hero-title">Executive Business Portrait</h3>
                <div class="hero-tags">
                  <span class="tag">Professional</span>
                  <span class="tag">Corporate</span>
                  <span class="tag">Executive</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="project-info">
          <div class="info-item">
            <i class="fas fa-tag"></i>
            <span>Category: Business Professional</span>
          </div>
          <div class="info-item">
            <i class="fas fa-map-marker-alt"></i>
            <span>Location: Corporate Environment</span>
          </div>
          <div class="info-item">
            <i class="fas fa-calendar"></i>
            <span>Date: 2024</span>
          </div>
          <div class="info-item">
            <i class="fas fa-camera"></i>
            <span>Photography by Ravindu Madhushan</span>
          </div>
        </div>
        
        <div class="gallery-modal-description">
          <div class="gallery-description">
            <h3><i class="fas fa-info-circle"></i> About This Work</h3>
            <div class="project-overview">
              <p>Corporate professional photography capturing leadership qualities and business confidence. This executive portrait is designed for corporate communications, professional profiles, and business marketing materials.</p>
            </div>
            <div class="technical-details">
              <h4 style="color: var(--primary-color); margin-bottom: 1rem;">Photography Details</h4>
              <div class="tech-grid">
                <div class="tech-item">
                  <i class="fas fa-briefcase"></i>
                  <div>
                    <strong>Style:</strong> Corporate professional with attention to business attire and presentation.
                  </div>
                </div>
                <div class="tech-item">
                  <i class="fas fa-cog"></i>
                  <div>
                    <strong>Approach:</strong> Natural lighting combined with professional studio techniques.
                  </div>
                </div>
                <div class="tech-item">
                  <i class="fas fa-palette"></i>
                  <div>
                    <strong>Tone:</strong> Professional color grading emphasizing authority and competence.
                  </div>
                </div>
                <div class="tech-item">
                  <i class="fas fa-star"></i>
                  <div>
                    <strong>Usage:</strong> Ideal for executive profiles, corporate websites, and business presentations.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `,
      title: 'Executive Business Portrait',
      description: 'Corporate professional headshot for business communications'
    },
    'creative-portrait-1': {
      content: `
        <div class="gallery-modal-hero">
          <div class="hero-image">
            <img src="components/profetional portraits/2.webp" alt="Creative Portrait Experience" loading="lazy">
            <div class="image-overlay">
              <div class="overlay-content">
                <h3 class="hero-title">Creative Portrait Experience</h3>
                <div class="hero-tags">
                  <span class="tag">Portrait</span>
                  <span class="tag">Creative</span>
                  <span class="tag">Artistic</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="project-info">
          <div class="info-item">
            <i class="fas fa-tag"></i>
            <span>Category: Creative Portrait</span>
          </div>
          <div class="info-item">
            <i class="fas fa-map-marker-alt"></i>
            <span>Location: Studio Setup</span>
          </div>
          <div class="info-item">
            <i class="fas fa-calendar"></i>
            <span>Date: 2024</span>
          </div>
          <div class="info-item">
            <i class="fas fa-camera"></i>
            <span>Photography by Ravindu Madhushan</span>
          </div>
        </div>
        
        <div class="gallery-modal-description">
          <div class="gallery-description">
            <h3><i class="fas fa-info-circle"></i> About This Work</h3>
            <div class="project-overview">
              <p>Artistic portrait photography showcasing creative composition and innovative lighting techniques. This piece demonstrates the intersection of technical expertise and artistic vision, creating visually compelling imagery.</p>
            </div>
            <div class="technical-details">
              <h4 style="color: var(--primary-color); margin-bottom: 1rem;">Photography Details</h4>
              <div class="tech-grid">
                <div class="tech-item">
                  <i class="fas fa-palette"></i>
                  <div>
                    <strong>Artistic Vision:</strong> Creative approach combining traditional portraiture with artistic expression.
                  </div>
                </div>
                <div class="tech-item">
                  <i class="fas fa-lightbulb"></i>
                  <div>
                    <strong>Lighting:</strong> Innovative lighting setup creating dramatic and moody atmosphere.
                  </div>
                </div>
                <div class="tech-item">
                  <i class="fas fa-cog"></i>
                  <div>
                    <strong>Composition:</strong> Experimental framing and positioning for visual impact.
                  </div>
                </div>
                <div class="tech-item">
                  <i class="fas fa-star"></i>
                  <div>
                    <strong>Style:</strong> Contemporary portrait photography with artistic flair.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `,
      title: 'Creative Portrait Experience',
      description: 'Artistic portrait with creative composition and innovative lighting'
    },
    'studio-portrait-1': {
      content: `
        <div class="gallery-modal-hero">
          <div class="hero-image">
            <img src="components/profetional portraits/3.png" alt="Studio Portrait Collection" loading="lazy">
            <div class="image-overlay">
              <div class="overlay-content">
                <h3 class="hero-title">Studio Portrait Collection</h3>
                <div class="hero-tags">
                  <span class="tag">Portrait</span>
                  <span class="tag">Studio</span>
                  <span class="tag">Professional</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="project-info">
          <div class="info-item">
            <i class="fas fa-tag"></i>
            <span>Category: Studio Portrait</span>
          </div>
          <div class="info-item">
            <i class="fas fa-map-marker-alt"></i>
            <span>Location: Professional Studio</span>
          </div>
          <div class="info-item">
            <i class="fas fa-calendar"></i>
            <span>Date: 2024</span>
          </div>
          <div class="info-item">
            <i class="fas fa-camera"></i>
            <span>Photography by Ravindu Madhushan</span>
          </div>
        </div>
        
        <div class="gallery-modal-description">
          <div class="gallery-description">
            <h3><i class="fas fa-info-circle"></i> About This Work</h3>
            <div class="project-overview">
              <p>Professional studio portrait collection demonstrating mastery of controlled lighting environments. This work showcases the ability to create multiple looks within a single session, each with distinct mood and professional quality.</p>
            </div>
            <div class="technical-details">
              <h4 style="color: var(--primary-color); margin-bottom: 1rem;">Photography Details</h4>
              <div class="tech-grid">
                <div class="tech-item">
                  <i class="fas fa-studio"></i>
                  <div>
                    <strong>Studio Setup:</strong> Professional photography studio with controlled lighting conditions.
                  </div>
                </div>
                <div class="tech-item">
                  <i class="fas fa-lightbulb"></i>
                  <div>
                    <strong>Lighting:</strong> Multi-light setup with key, fill, and accent lighting for depth.
                  </div>
                </div>
                <div class="tech-item">
                  <i class="fas fa-cog"></i>
                  <div>
                    <strong>Technique:</strong> Systematic approach ensuring consistency across multiple shots.
                  </div>
                </div>
                <div class="tech-item">
                  <i class="fas fa-star"></i>
                  <div>
                    <strong>Versatility:</strong> Multiple looks and styles from a single session.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `,
      title: 'Studio Portrait Collection',
      description: 'Professional studio photography session with multiple looks'
    },
    'commercial-1': {
      content: `
        <div class="gallery-modal-hero">
          <div class="hero-image">
            <img src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Commercial Product Photography" loading="lazy">
            <div class="image-overlay">
              <div class="overlay-content">
                <h3 class="hero-title">Commercial Product Photography</h3>
                <div class="hero-tags">
                  <span class="tag">Commercial</span>
                  <span class="tag">Product</span>
                  <span class="tag">Marketing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="project-info">
          <div class="info-item">
            <i class="fas fa-tag"></i>
            <span>Category: Commercial Photography</span>
          </div>
          <div class="info-item">
            <i class="fas fa-map-marker-alt"></i>
            <span>Location: Commercial Studio</span>
          </div>
          <div class="info-item">
            <i class="fas fa-calendar"></i>
            <span>Date: 2024</span>
          </div>
          <div class="info-item">
            <i class="fas fa-camera"></i>
            <span>Photography by Ravindu Madhushan</span>
          </div>
        </div>
        
        <div class="gallery-modal-description">
          <div class="gallery-description">
            <h3><i class="fas fa-info-circle"></i> About This Work</h3>
            <div class="project-overview">
              <p>Professional commercial product photography designed for marketing and promotional use. This work demonstrates the ability to create compelling product imagery that drives sales and brand engagement.</p>
            </div>
            <div class="technical-details">
              <h4 style="color: var(--primary-color); margin-bottom: 1rem;">Photography Details</h4>
              <div class="tech-grid">
                <div class="tech-item">
                  <i class="fas fa-box"></i>
                  <div>
                    <strong>Product Focus:</strong> Specialized techniques for showcasing product features and benefits.
                  </div>
                </div>
                <div class="tech-item">
                  <i class="fas fa-store"></i>
                  <div>
                    <strong>Commercial Use:</strong> Optimized for e-commerce, marketing materials, and advertising.
                  </div>
                </div>
                <div class="tech-item">
                  <i class="fas fa-palette"></i>
                  <div>
                    <strong>Brand Alignment:</strong> Color and styling consistent with brand guidelines.
                  </div>
                </div>
                <div class="tech-item">
                  <i class="fas fa-star"></i>
                  <div>
                    <strong>Quality Standards:</strong> High-resolution output suitable for all media formats.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `,
      title: 'Commercial Product Photography',
      description: 'Professional product photography for marketing and sales'
    },
    'event-1': {
      content: `
        <div class="gallery-modal-hero">
          <div class="hero-image">
            <img src="https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Event Coverage Photography" loading="lazy">
            <div class="image-overlay">
              <div class="overlay-content">
                <h3 class="hero-title">Event Coverage Photography</h3>
                <div class="hero-tags">
                  <span class="tag">Events</span>
                  <span class="tag">Coverage</span>
                  <span class="tag">Documentation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="project-info">
          <div class="info-item">
            <i class="fas fa-tag"></i>
            <span>Category: Event Photography</span>
          </div>
          <div class="info-item">
            <i class="fas fa-map-marker-alt"></i>
            <span>Location: Event Venue</span>
          </div>
          <div class="info-item">
            <i class="fas fa-calendar"></i>
            <span>Date: 2024</span>
          </div>
          <div class="info-item">
            <i class="fas fa-camera"></i>
            <span>Photography by Ravindu Madhushan</span>
          </div>
        </div>
        
        <div class="gallery-modal-description">
          <div class="gallery-description">
            <h3><i class="fas fa-info-circle"></i> About This Work</h3>
            <div class="project-overview">
              <p>Comprehensive event photography capturing key moments, atmosphere, and attendee engagement. This documentation service provides clients with professional imagery for marketing, social media, and historical record keeping.</p>
            </div>
            <div class="technical-details">
              <h4 style="color: var(--primary-color); margin-bottom: 1rem;">Photography Details</h4>
              <div class="tech-grid">
                <div class="tech-item">
                  <i class="fas fa-calendar-check"></i>
                  <div>
                    <strong>Coverage:</strong> Complete event documentation from setup to conclusion.
                  </div>
                </div>
                <div class="tech-item">
                  <i class="fas fa-users"></i>
                  <div>
                    <strong>People Focus:</strong> Capturing candid moments and formal portraits of attendees.
                  </div>
                </div>
                <div class="tech-item">
                  <i class="fas fa-cog"></i>
                  <div>
                    <strong>Adaptability:</strong> Quick adjustment to changing lighting and venue conditions.
                  </div>
                </div>
                <div class="tech-item">
                  <i class="fas fa-star"></i>
                  <div>
                    <strong>Delivery:</strong> Fast turnaround with both individual and gallery formats.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `,
      title: 'Event Coverage Photography',
      description: 'Professional event documentation and coverage services'
    }
  };

  return photos[photoId] || {
    content: '<p>Photo not available.</p>',
    title: 'Photo',
    description: 'Photo description not available.'
  };
}

function getVideoContent(videoId) {
  const videos = {
    'wedding-1': {
      content: `
        <video controls style="width: 100%; max-width: 800px; border-radius: 0.5rem;">
          <source src="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4" type="video/mp4">
          <p>Your browser doesn't support HTML5 video. Here is a <a href="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4">link to the video</a> instead.</p>
        </video>
      `,
      title: 'Romantic Wedding Story',
      description: 'Cinematic wedding videography capturing the love story and special moments of the couple\'s big day.'
    },
    'wedding-2': {
      content: `
        <video controls style="width: 100%; max-width: 800px; border-radius: 0.5rem;">
          <source src="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4" type="video/mp4">
          <p>Your browser doesn't support HTML5 video. Here is a <a href="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4">link to the video</a> instead.</p>
        </video>
      `,
      title: 'Traditional Ceremony',
      description: 'Cultural wedding documentation preserving traditional customs and ceremonial moments.'
    },
    'corporate-1': {
      content: `
        <video controls style="width: 100%; max-width: 800px; border-radius: 0.5rem;">
          <source src="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4" type="video/mp4">
          <p>Your browser doesn't support HTML5 video. Here is a <a href="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4">link to the video</a> instead.</p>
        </video>
      `,
      title: 'Company Profile',
      description: 'Professional corporate video showcasing company values, culture, and business achievements.'
    },
    'corporate-2': {
      content: `
        <video controls style="width: 100%; max-width: 800px; border-radius: 0.5rem;">
          <source src="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4" type="video/mp4">
          <p>Your browser doesn't support HTML5 video. Here is a <a href="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4">link to the video</a> instead.</p>
        </video>
      `,
      title: 'Team Building Event',
      description: 'Corporate event coverage highlighting team collaboration and company culture activities.'
    },
    'music-1': {
      content: `
        <video controls style="width: 100%; max-width: 800px; border-radius: 0.5rem;">
          <source src="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4" type="video/mp4">
          <p>Your browser doesn't support HTML5 video. Here is a <a href="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4">link to the video</a> instead.</p>
        </video>
      `,
      title: 'Music Video Production',
      description: 'Creative music video featuring artistic visuals, dynamic editing, and compelling storytelling.'
    },
    'commercial-1': {
      content: `
        <video controls style="width: 100%; max-width: 800px; border-radius: 0.5rem;">
          <source src="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4" type="video/mp4">
          <p>Your browser doesn't support HTML5 video. Here is a <a href="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4">link to the video</a> instead.</p>
        </video>
      `,
      title: 'Product Advertisement',
      description: 'Commercial video production designed to showcase product features and drive customer engagement.'
    }
  };

  return videos[videoId] || {
    content: '<p>Video not available.</p>',
    title: 'Video',
    description: 'Video description not available.'
  };
}

// Initialize all managers when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all managers
  window.themeManager = new ThemeManager();
  window.navigationManager = new NavigationManager();
  window.animationManager = new AnimationManager();
  window.portfolioManager = new PortfolioManager();
  window.modalManager = new ModalManager();
  window.contactFormManager = new ContactFormManager();
  window.innovationManager = new InnovationManager();
  window.typingAnimationManager = new TypingAnimationManager();
  window.performanceManager = new PerformanceManager();
  window.portfolioParticleSystem = new PortfolioParticleSystem();
  window.galleryManager = new GalleryManager();
    
  // Log successful initialization
  console.log('🚀 Ravindu Madhushan Digital Portfolio loaded successfully!');
  console.log('✨ All interactive features are ready!');
  console.log('🎨 Theme system initialized');
  console.log('📱 Responsive navigation ready');
  console.log('🎭 Animations and transitions active');
  console.log('📸 Gallery systems initialized');
});

// Service Worker Registration (optional)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });



// Global functions
function navigateSlides(direction) {
  const galleryManager = window.galleryManager;
  if (galleryManager && typeof galleryManager.navigateSlides === 'function') {
    galleryManager.navigateSlides(direction);
  }
}

function goToSlide(index) {
  const galleryManager = window.galleryManager;
  if (galleryManager && typeof galleryManager.goToSlide === 'function') {
    galleryManager.goToSlide(index);
  }
}

// Enhanced GalleryManager Class
class GalleryManager {
  constructor() {
    this.currentSlide = 0;
    this.autoPlayInterval = null;
    this.handleKeydown = null;
    this.init();
  }

  init() {
    this.setupVideoGallery();
    this.setupGalleryModals();
  }

  setupVideoGallery() {
    // Unchanged from original
  }


  setupGalleryModals() {
   
    if (!document.getElementById('gallery-modal')) {
      const galleryModal = document.createElement('div');
      galleryModal.id = 'gallery-modal';
      galleryModal.className = 'gallery-modal';
      galleryModal.innerHTML = `
        <div class="gallery-modal-overlay"></div>
        <div class="gallery-modal-content">
          <div class="gallery-modal-header">
            <div class="modal-nav">
              <button class="nav-btn prev-project" onclick="navigateProject(-1)" aria-label="Previous project">
                <i class="fas fa-chevron-left"></i>
              </button>
              <div class="category-badge"></div>
              <button class="nav-btn next-project" onclick="navigateProject(1)" aria-label="Next project">
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
            <div class="modal-actions">
              <button class="action-btn share-btn" onclick="shareProject()" aria-label="Share project">
                <i class="fas fa-share-alt"></i>
              </button>
              <button class="action-btn download-btn" onclick="downloadProject()" aria-label="Download project">
                <i class="fas fa-download"></i>
              </button>
              <button class="gallery-modal-close" onclick="closeGalleryModal()" aria-label="Close modal">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
          <div class="gallery-modal-body">
            <div class="modal-loading">
              <div class="loading-spinner"></div>
              <p>Loading project...</p>
            </div>
          </div>
          <div class="gallery-modal-footer">
            <div class="modal-progress">
              <div class="progress-bar" id="modal-progress-bar"></div>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(galleryModal);
    }

    document.getElementById('gallery-modal').addEventListener('click', (e) => {
      if (e.target.id === 'gallery-modal') {
        this.closeGalleryModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeGalleryModal();
      }
    });
  }

  openGalleryModal(content, title, description, category, startIndex = 0, totalSlides = 0) {
    const modal = document.getElementById('gallery-modal');
    if (!modal) return;

    const modalBody = modal.querySelector('.gallery-modal-body');
    const categoryBadge = modal.querySelector('.category-badge');
    const loadingElement = modal.querySelector('.modal-loading');

    // Show loading state
    loadingElement.style.display = 'flex';
    modalBody.style.opacity = '0';

    // Set category badge
    categoryBadge.innerHTML = `<i class="fas fa-tag"></i> ${category.charAt(0).toUpperCase() + category.slice(1)}`;

    // Simulate loading and then show content
    setTimeout(() => {
      modalBody.innerHTML = content;
      loadingElement.style.display = 'none';
      modalBody.style.opacity = '1';

      // Add entrance animation
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';

      this.initSlideshow(startIndex, totalSlides);
      this.setupModalInteractions();

      // Lazy load images in modal with intersection observer
      this.setupImageLazyLoading(modal);

      // Update progress bar
      this.updateProgressBar(0, totalSlides);
    }, 300);
  }

  setupModalInteractions() {
    const modal = document.getElementById('gallery-modal');
    
    // Add smooth scroll behavior for long content
    const modalBody = modal.querySelector('.gallery-modal-body');
    modalBody.style.scrollBehavior = 'smooth';

    // Add parallax effect to hero image
    const heroImage = modal.querySelector('.hero-image img');
    if (heroImage) {
      modalBody.addEventListener('scroll', () => {
        const scrolled = modalBody.scrollTop;
        const rate = scrolled * -0.5;
        heroImage.style.transform = `translateY(${rate}px)`;
      });
    }
  }

  setupImageLazyLoading(modal) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.add('loaded');
          img.style.opacity = '1';
          imageObserver.unobserve(img);
        }
      });
    }, { rootMargin: '50px' });

    const images = modal.querySelectorAll('img[data-src]');
    images.forEach(img => {
      imageObserver.observe(img);
      
      // Add loading placeholder
      img.addEventListener('load', () => {
        img.classList.add('image-loaded');
      });
    });
  }

  updateProgressBar(current, total) {
    const progressBar = document.getElementById('modal-progress-bar');
    if (progressBar && total > 0) {
      const percentage = ((current + 1) / total) * 100;
      progressBar.style.width = `${percentage}%`;
    }
  }

  initSlideshow(startIndex, totalSlides) {
    this.currentSlide = startIndex;
    
    // Wait for DOM to be ready
    setTimeout(() => {
      const container = document.getElementById('slides-container');
      const dotsContainer = document.getElementById('dots-container');
      
      if (!container || !dotsContainer || totalSlides === 0) {
        console.warn('Slideshow elements not found or no slides available');
        return;
      }

      // Build dots with better accessibility
      dotsContainer.innerHTML = Array.from({ length: totalSlides }, (_, i) => 
        `<span class="dot ${i === startIndex ? 'active' : ''}" 
                onclick="goToSlide(${i})" 
                onkeydown="if(event.key==='Enter') goToSlide(${i})" 
                tabindex="0"
                role="button"
                aria-label="Go to slide ${i + 1}"></span>`
      ).join('');

      // Set initial position
      this.updateSlidePosition(container);

      // Auto-play with better control
      this.startAutoplay();

      // Enhanced touch-swipe with better detection
      this.setupTouchControls(container);

      // Pause on hover with better handling
      this.setupHoverControls(container);

      // Enhanced keyboard support
      this.setupKeyboardControls();

      // Scroll slideshow into view when opened
      const slideshowSection = document.querySelector('.slideshow-section');
      if (slideshowSection) {
        setTimeout(() => {
          slideshowSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'nearest' 
          });
        }, 500);
      }
    }, 100);
  }

  startAutoplay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
    this.autoPlayInterval = setInterval(() => {
      if (document.getElementById('gallery-modal')?.classList.contains('active')) {
        this.navigateSlides(1);
      }
    }, 4000);
  }

  setupTouchControls(container) {
    let startX = 0, startY = 0, moved = false;
    
    const touchStart = (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      moved = false;
    };
    
    const touchMove = (e) => {
      moved = true;
      // Prevent default to avoid scrolling issues
      if (Math.abs(startX - e.touches[0].clientX) > 10) {
        e.preventDefault();
      }
    };
    
    const touchEnd = (e) => {
      if (!moved) return;
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const deltaX = startX - endX;
      const deltaY = Math.abs(startY - endY);
      
      // More sensitive swipe detection
      if (Math.abs(deltaX) > 30 && deltaY < 100) {
        if (deltaX > 0) {
          this.navigateSlides(1); // Swipe left (next)
        } else {
          this.navigateSlides(-1); // Swipe right (previous)
        }
      }
    };
    
    container.addEventListener('touchstart', touchStart, { passive: true });
    container.addEventListener('touchmove', touchMove, { passive: false });
    container.addEventListener('touchend', touchEnd, { passive: true });
  }

  setupHoverControls(container) {
    container.addEventListener('mouseenter', () => {
      if (this.autoPlayInterval) {
        clearInterval(this.autoPlayInterval);
        this.autoPlayInterval = null;
      }
    });
    
    container.addEventListener('mouseleave', () => {
      this.startAutoplay();
    });
  }

  setupKeyboardControls() {
    // Remove existing listener if any
    if (this.handleKeydown) {
      document.removeEventListener('keydown', this.handleKeydown);
    }
    
    this.handleKeydown = (e) => {
      // Only handle keyboard events when modal is active
      if (!document.getElementById('gallery-modal')?.classList.contains('active')) {
        return;
      }
      
      switch(e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          this.navigateSlides(-1);
          break;
        case 'ArrowRight':
          e.preventDefault();
          this.navigateSlides(1);
          break;
        case 'Escape':
          e.preventDefault();
          this.closeGalleryModal();
          break;
        case ' ': // Spacebar to toggle autoplay
          e.preventDefault();
          toggleAutoplay();
          break;
      }
    };
    
    document.addEventListener('keydown', this.handleKeydown);
  }

  navigateSlides(direction) {
    const totalSlides = document.querySelectorAll('.slide').length;
    if (totalSlides === 0) return;
    
    const previousSlide = this.currentSlide;
    this.currentSlide = (this.currentSlide + direction + totalSlides) % totalSlides;
    
    // Add smooth transition
    this.updateSlidePosition(document.getElementById('slides-container'));
    this.updateDots();
  }

  goToSlide(index) {
    const totalSlides = document.querySelectorAll('.slide').length;
    if (index < 0 || index >= totalSlides) return;
    
    this.currentSlide = index;
    this.updateSlidePosition(document.getElementById('slides-container'));
    this.updateDots();
  }

  updateSlidePosition(container) {
    if (!container) return;
    
    // Add smooth transition with CSS transform
    const track = container.querySelector('.slides-track') || container;
    track.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    // Calculate precise offset so each step equals exactly one slide width
    const slides = track.querySelectorAll('.slide');
    const totalSlides = slides.length;
    if (totalSlides > 0) {
      // Total track width including overflow
      const trackWidth = track.scrollWidth;
      const perSlideWidth = trackWidth / totalSlides;
      const offsetPx = this.currentSlide * perSlideWidth;
      track.style.transform = `translateX(-${offsetPx}px)`;
    } else {
      track.style.transform = 'translateX(0)';
    }
    
    // Update active slide
    slides.forEach((slide, index) => {
      slide.classList.toggle('active', index === this.currentSlide);
    });
  }

  updateDots() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === this.currentSlide);
      dot.setAttribute('aria-pressed', i === this.currentSlide);
    });
  }

  updateSlideCounter(current, total) {
    const counters = document.querySelectorAll('.slide-counter');
    counters.forEach(counter => {
      counter.textContent = `${current} / ${total}`;
    });
  }

  closeGalleryModal() {
    const modal = document.getElementById('gallery-modal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
      clearInterval(this.autoPlayInterval);
      if (this.handleKeydown) {
        document.removeEventListener('keydown', this.handleKeydown);
      }
    }
  }
}

function closeGalleryModal() {
  window.galleryManager?.closeGalleryModal();
}

function toggleAutoplay() {
  const galleryManager = window.galleryManager;
  const autoplayIcon = document.getElementById('autoplay-icon');
  
  if (galleryManager) {
    if (galleryManager.autoPlayInterval) {
      clearInterval(galleryManager.autoPlayInterval);
      galleryManager.autoPlayInterval = null;
      autoplayIcon.className = 'fas fa-play';
    } else {
      galleryManager.autoPlayInterval = setInterval(() => galleryManager.navigateSlides(1), 4000);
      autoplayIcon.className = 'fas fa-pause';
    }
  }
}

function toggleFullscreen() {
  const modal = document.getElementById('gallery-modal');
}

  
  if (!document.fullscreenElement) {
    modal.requestFullscreen().catch(err => {
      console.log(`Error attempting to enable fullscreen: ${err.message}`);
    });
  } else {
    document.exitFullscreen();
  }
}

function navigateProject(direction) {
  // This would navigate between different projects in the same category
  console.log(`Navigate project ${direction > 0 ? 'next' : 'previous'}`);
  // Implementation depends on your project navigation requirements
}

function shareProject() {
  const modal = document.getElementById('gallery-modal');
  const title = modal.querySelector('.hero-title')?.textContent || 'Portfolio Project';
  
  if (navigator.share) {
    navigator.share({
      title: title,
      text: 'Check out this amazing portfolio project!',
      url: window.location.href
    }).catch(err => console.log('Error sharing:', err));
  } else {
    // Fallback: copy to clipboard
    navigator.clipboard.writeText(window.location.href).then(() => {
      showNotification('Link copied to clipboard!');
    });
  }
}

function downloadProject() {
  const modal = document.getElementById('gallery-modal');
  const mainImage = modal.querySelector('.hero-image img');
  
  if (mainImage) {
    const link = document.createElement('a');
    link.href = mainImage.src;
    link.download = `portfolio-project-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Download started!');
  }
}

function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--primary-color);
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    z-index: 10001;
    opacity: 0;
    transform: translateY(-20px);
    transition: all 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateY(0)';
  }, 100);
  
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(-20px)';
    setTimeout(() => document.body.removeChild(notification), 300);
  }, 3000);
}

// Lazy Loading (integrate with PerformanceManager)
// Lazy Loading (integrate with PerformanceManager)
document.addEventListener('DOMContentLoaded', () => {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        img.classList.add('loaded');
        img.style.opacity = '1';
        imageObserver.unobserve(img);
      }
    });
  }, { rootMargin: '0px 0px 100px 0px' });

  document.querySelectorAll('.slide img, .gallery-modal-main img').forEach(img => imageObserver.observe(img));
});

// Export managers for global access
window.PortfolioApp = {
  themeManager: null,
  navigationManager: null,
  animationManager: null,
  portfolioManager: null,
  modalManager: null,
  contactFormManager: null,
  innovationManager: null,
  typingAnimationManager: null,
  performanceManager: null
};
