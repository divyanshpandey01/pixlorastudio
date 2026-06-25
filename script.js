import { db, isConfigured } from "./firebase-config.js";
    import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

    const hasGsap = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
    if (hasGsap) {
      gsap.registerPlugin(ScrollTrigger);
    }

    document.addEventListener('DOMContentLoaded', () => {

      // ─── NAVBAR SCROLL ───
      const navbar = document.querySelector('.navbar');
      const handleScroll = () => { navbar.classList.toggle('scrolled', window.scrollY > 50); };
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();

      // ─── MOBILE NAV ───
      const hamburger = document.querySelector('.hamburger');
      const mobileNav = document.querySelector('.mobile-nav');
      hamburger?.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileNav.classList.toggle('open');
        document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
      });
      mobileNav?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          hamburger.classList.remove('active');
          mobileNav.classList.remove('open');
          document.body.style.overflow = '';
        });
      });

      // ─── SMOOTH SCROLL ───
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
          e.preventDefault();
          const target = document.querySelector(anchor.getAttribute('href'));
          if (target) {
            const offset = navbar.offsetHeight + 20;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
          }
        });
      });

      // ─── COUNTER ANIMATION ───
      const animateCounters = () => {
        document.querySelectorAll('[data-count]').forEach(counter => {
          if (counter.dataset.animated) return;
          const target = parseInt(counter.dataset.count, 10);
          const suffix = counter.dataset.suffix || '';
          const duration = 2000;
          const start = performance.now();
          const update = now => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            counter.textContent = Math.floor(target * eased) + suffix;
            if (progress < 1) requestAnimationFrame(update);
          };
          counter.dataset.animated = 'true';
          requestAnimationFrame(update);
        });
      };

      // ─── AI DEMO AUTO-PLAY ───
      let demoInterval = null;
      let currentStep = 0;
      const totalSteps = 4;

      const updateDemo = (step) => {
        document.querySelectorAll('.demo-step').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.demo-dot').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.demo-list-item').forEach(el => el.classList.remove('active'));

        const activeStep = document.querySelector(`.demo-step[data-step="${step}"]`);
        const activeDot = document.querySelectorAll('.demo-dot')[step];
        const activeItem = document.querySelector(`.demo-list-item[data-list="${step}"]`);

        if (activeStep) activeStep.classList.add('active');
        if (activeDot) activeDot.classList.add('active');
        if (activeItem) activeItem.classList.add('active');
      };

      const startDemo = () => {
        if (demoInterval) return;
        demoInterval = setInterval(() => {
          currentStep = (currentStep + 1) % totalSteps;
          updateDemo(currentStep);
        }, 2500);
      };

      // ─── GSAP SCROLL ANIMATIONS ───
      if (hasGsap) {
        // Hero Content
        gsap.fromTo('.hero-content.gs-hidden', 
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.2, delay: .3, ease: 'power3.out',
            onComplete: function() { this.targets()[0].classList.remove('gs-hidden'); }
          }
        );
        
        // Hero Visual Phone
        gsap.fromTo('.hero-visual.gs-hidden', 
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.2, delay: .6, ease: 'power3.out',
            onComplete: function() { this.targets()[0].classList.remove('gs-hidden'); }
          }
        );

        // Generic fade-up for sections (excluding staggered elements)
        gsap.utils.toArray('.gs-hidden').forEach(el => {
          if (el.closest('.hero')) return; // skip hero (handled above)
          
          // Skip elements that are handled by staggered group triggers
          if (el.classList.contains('bento-card') || 
              el.classList.contains('step-card') || 
              el.classList.contains('perfect-card') || 
              el.classList.contains('counter-card')) return;

          gsap.fromTo(el,
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: .8, ease: 'power3.out',
              scrollTrigger: { trigger: el, start: 'top 85%', once: true },
              onComplete: () => el.classList.remove('gs-hidden')
            }
          );
        });

        // Stagger for bento cards
        ScrollTrigger.create({
          trigger: '.bento-grid',
          start: 'top 80%',
          once: true,
          onEnter: () => {
            gsap.fromTo('.bento-card', 
              { y: 40, opacity: 0 },
              { y: 0, opacity: 1, duration: .7, stagger: .15, ease: 'power3.out',
                onComplete: function() { this.targets().forEach(el => el.classList.remove('gs-hidden')); }
              }
            );
          }
        });

        // Stagger for step cards
        ScrollTrigger.create({
          trigger: '.steps-track',
          start: 'top 80%',
          once: true,
          onEnter: () => {
            gsap.fromTo('.step-card', 
              { y: 40, opacity: 0 },
              { y: 0, opacity: 1, duration: .7, stagger: .12, ease: 'power3.out',
                onComplete: function() { this.targets().forEach(el => el.classList.remove('gs-hidden')); }
              }
            );
          }
        });

        // Animate connecting line on scroll
        gsap.to('.steps-line', {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '.steps-track',
            start: 'top 70%',
            end: 'bottom 60%',
            scrub: true
          }
        });

        // Stagger for perfect-for cards
        ScrollTrigger.create({
          trigger: '.perfect-grid',
          start: 'top 80%',
          once: true,
          onEnter: () => {
            gsap.fromTo('.perfect-card', 
              { y: 30, opacity: 0 },
              { y: 0, opacity: 1, duration: .6, stagger: .1, ease: 'power3.out',
                onComplete: function() { this.targets().forEach(el => el.classList.remove('gs-hidden')); }
              }
            );
          }
        });

        // Counter cards stagger
        ScrollTrigger.create({
          trigger: '.counters-grid',
          start: 'top 80%',
          once: true,
          onEnter: () => {
            gsap.fromTo('.counter-card', 
              { y: 30, opacity: 0 },
              { y: 0, opacity: 1, duration: .6, stagger: .15, ease: 'power3.out',
                onComplete: function() { this.targets().forEach(el => el.classList.remove('gs-hidden')); }
              }
            );
          }
        });

        // Count-up numbers trigger
        ScrollTrigger.create({
          trigger: '.counters-grid',
          start: 'top 75%',
          once: true,
          onEnter: animateCounters
        });

        // AI demo auto-play trigger
        ScrollTrigger.create({
          trigger: '#ai-demo',
          start: 'top 70%',
          once: true,
          onEnter: startDemo
        });
      } else {
        // Safe fallback: immediately reveal all content
        document.querySelectorAll('.gs-hidden').forEach(el => el.classList.remove('gs-hidden'));
        animateCounters();
        startDemo();
      }

      // ─── HERO PARALLAX ───
      const heroVisual = document.querySelector('.hero-visual');
      if (heroVisual && window.innerWidth > 768) {
        window.addEventListener('mousemove', e => {
          const x = (e.clientX / window.innerWidth - 0.5) * 15;
          const y = (e.clientY / window.innerHeight - 0.5) * 15;
          heroVisual.style.transform = `translate(${x}px, ${y}px)`;
        }, { passive: true });
      }

      // Hero background parallax
      const heroBg = document.querySelector('.hero-bg img');
      if (heroBg) {
        window.addEventListener('scroll', () => {
          const scroll = window.scrollY;
          heroBg.style.transform = `translateY(${scroll * 0.15}px) scale(1.05)`;
        }, { passive: true });
      }

      // ─── LEAD FORM ───
      const form = document.getElementById('lead-form');
      form?.addEventListener('submit', async e => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const studio = document.getElementById('studio').value;
        const events = document.getElementById('events').value;
        const btn = form.querySelector('.btn');
        const original = btn.innerHTML;

        if (!isConfigured) {
          alert("Firebase is not configured yet. Please add your credentials inside firebase-config.js first.");
          return;
        }

        btn.innerHTML = 'Sending...';
        btn.style.pointerEvents = 'none';
        btn.style.opacity = '.8';

        try {
          await addDoc(collection(db, "leads"), {
            name, email, studio, eventsRange: events, timestamp: serverTimestamp()
          });
          btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Request Sent!';
          setTimeout(() => {
            btn.innerHTML = original;
            btn.style.pointerEvents = '';
            btn.style.opacity = '';
            form.reset();
          }, 3000);
        } catch (error) {
          console.error("Firebase Firestore Error:", error);
          alert("Failed to submit request: " + error.message);
          btn.innerHTML = original;
          btn.style.pointerEvents = '';
          btn.style.opacity = '';
        }
      });

    });