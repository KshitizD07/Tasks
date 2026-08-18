/**
 * Task 2: Responsive Landing Page (NovaPulse)
 * Interactive UI Logic & State Handlers
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        if (navMenu.classList.contains('active')) {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-xmark');
        } else {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      }
    });

    // Close menu when link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      });
    });
  }

  // 2. Interactive Pricing Toggle (Monthly / Annual)
  const pricingToggle = document.getElementById('pricing-toggle');
  const monthlyLabel = document.getElementById('monthly-label');
  const yearlyLabel = document.getElementById('yearly-label');
  const priceAmounts = document.querySelectorAll('.plan-price .amount');

  let isAnnual = true;

  if (pricingToggle) {
    pricingToggle.addEventListener('click', () => {
      isAnnual = !isAnnual;
      
      if (isAnnual) {
        pricingToggle.classList.remove('monthly');
        yearlyLabel.classList.add('active');
        monthlyLabel.classList.remove('active');
      } else {
        pricingToggle.classList.add('monthly');
        monthlyLabel.classList.add('active');
        yearlyLabel.classList.remove('active');
      }

      priceAmounts.forEach(amountEl => {
        const targetVal = isAnnual 
          ? amountEl.getAttribute('data-yearly') 
          : amountEl.getAttribute('data-monthly');
        
        // Simple numeric animation effect
        if (targetVal) {
          amountEl.style.opacity = '0';
          setTimeout(() => {
            amountEl.textContent = targetVal;
            amountEl.style.opacity = '1';
          }, 150);
        }
      });
    });
  }

  // 3. FAQ Accordion Toggle
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(questionBtn => {
    questionBtn.addEventListener('click', () => {
      const faqItem = questionBtn.parentElement;
      const isActive = faqItem.classList.contains('active');

      // Close all active items first for single accordion behavior
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
      });

      if (!isActive) {
        faqItem.classList.add('active');
      }
    });
  });

  // 4. Hero Email Form Submission Feedback
  const heroForm = document.getElementById('hero-form');
  const heroEmailInput = document.getElementById('hero-email');

  if (heroForm && heroEmailInput) {
    heroForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailValue = heroEmailInput.value.trim();
      
      if (emailValue) {
        // Show lightweight interactive alert/feedback
        const btn = heroForm.querySelector('button');
        const origText = btn.innerHTML;
        btn.innerHTML = `<i class="fa-solid fa-circle-check"></i> Account Created! Redirecting...`;
        btn.style.backgroundColor = '#10b981';
        heroEmailInput.value = '';
        
        setTimeout(() => {
          btn.innerHTML = origText;
          btn.style.backgroundColor = '';
        }, 3000);
      }
    });
  }
});
