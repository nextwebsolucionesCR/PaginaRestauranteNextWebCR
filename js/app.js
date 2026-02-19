document.addEventListener('DOMContentLoaded', () => {
    // 0. Branding Watermark Injection (Priority)
    const createBranding = () => {
        try {
            const branding = document.createElement('a');
            branding.href = '#';
            branding.className = 'branding-watermark';
            branding.innerHTML = `
                <img src="img/logo.png" alt="NextWeb CR" class="branding-logo">
                <span class="branding-text">Desarrollado por <strong>NextWeb CR</strong></span>
            `;
            document.body.appendChild(branding);
            console.log("Branding injected successfully.");
        } catch (e) {
            console.error("Branding injection failed:", e);
        }
    };
    createBranding();

    // 1. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    const links = document.querySelectorAll('.nav-link');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');

            // Animate Toggle Button
            const bars = mobileMenuBtn.querySelectorAll('.bar');
            if (navLinks.classList.contains('active')) {
                // Simple transformation logic can go here if CSS transition isn't enough, 
                // but usually better handled in CSS. We'll rely on CSS for now or add simple class.
            }
        });
    }

    // Close menu when clicking a link
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // 2. Sticky Navbar on Scroll
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Scroll Reveal Animations (Intersection Observer)
    const observerOptions = {
        threshold: 0.15, // Trigger when 15% of the element is visible
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.scroll-reveal');
    revealElements.forEach(el => observer.observe(el));

    // 4. Parallax Effect for Backgrounds
    const parallaxSections = document.querySelectorAll('.parallax-bg');

    window.addEventListener('scroll', () => {
        parallaxSections.forEach(bg => {
            // Speed factor: 0.5 means it moves at half the scroll speed
            const speed = 0.5;
            const yPos = -(window.scrollY * speed);
            // We apply this only if the section is in view? 
            // Simpler generic parallax for the hero or background
            // Note: Since we used 'background-attachment: fixed' in CSS, 
            // we might not need JS for simple parallax. 
            // But for a smoother custom effect without 'fixed' issues on mobile:

            // Let's stick to CSS 'background-attachment: fixed' for now as it's robust,
            // but if we wanted JS control we'd do it here. 
            // In style.css we used fixed, which is good.
        });
    });

    // 5. Smooth Scroll for Anchor Links (polillfill if needed, but CSS scroll-behavior usually works)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Adjust for sticky header height
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });
    // 6. Hero Slider
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length > 0) {
        let currentSlide = 0;
        const slideInterval = 6000; // 6 seconds

        setInterval(() => {
            // Remove active from current
            slides[currentSlide].classList.remove('active');

            // Calculate next
            currentSlide = (currentSlide + 1) % slides.length;

            // Add active to next
            slides[currentSlide].classList.add('active');
        }, slideInterval);
    }

    // 7. Reviews Auto-Scroll (True Infinite Loop)
    const reviewsContainer = document.querySelector('.reviews-scroller');
    if (reviewsContainer) {
        // Clone items for infinite effect
        const items = Array.from(reviewsContainer.children);
        items.forEach(item => {
            const clone = item.cloneNode(true);
            reviewsContainer.appendChild(clone);
        });

        let scrollAmount = 0;
        let scrollSpeed = 0.5; // Adjust for speed
        let isHovered = false;

        const loop = () => {
            if (!isHovered) {
                scrollAmount += scrollSpeed;
                reviewsContainer.scrollLeft = scrollAmount;

                // Reset when halfway (since we duplicated content)
                if (scrollAmount >= reviewsContainer.scrollWidth / 2) {
                    scrollAmount = 0;
                    reviewsContainer.scrollLeft = 0;
                }
            }
            requestAnimationFrame(loop);
        };

        // Pause on hover
        reviewsContainer.addEventListener('mouseenter', () => isHovered = true);
        reviewsContainer.addEventListener('mouseleave', () => isHovered = false);

        // Touch Interaction (Pause on touch)
        reviewsContainer.addEventListener('touchstart', () => isHovered = true);
        reviewsContainer.addEventListener('touchend', () => {
            setTimeout(() => isHovered = false, 2000); // Resume after a delay
        });

        // Start loop
        loop();
    }



    // WhatsApp Logic
    const openWhatsApp = (dishName) => {
        const phone = "50622222222"; // Replace with actual number
        const message = `Hola, me gustaría consultar más detalles sobre el platillo: ${dishName}`;
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };



    // 9. Legacy Section Parallax
    const legacySection = document.querySelector('.legacy-section');
    if (legacySection) {
        const layers = document.querySelectorAll('.legacy-layer');
        window.addEventListener('scroll', () => {
            const sectionTop = legacySection.offsetTop;
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;

            // active specifically when in view
            if (scrollY + windowHeight > sectionTop && scrollY < sectionTop + legacySection.offsetHeight) {
                const distance = scrollY - sectionTop;

                layers.forEach(layer => {
                    const speed = layer.getAttribute('data-speed');
                    const yPos = distance * speed;
                    layer.style.transform = `translateY(${yPos}px)`;
                });
            }
        });
    }

    // 10. Hero Video Handling (Mobile Performance)
    const heroVideo = document.getElementById('hero-video');
    if (heroVideo) {
        // Only autoplay on desktop/tablet > 768px
        if (window.innerWidth > 768) {
            heroVideo.play().catch(error => {
                console.log("Autoplay prevented by browser policy:", error);
            });
        }
    }

    // 11. Dynamic 3D Tilt Effect for Bento Grid (Desktop Only)
    // Guideline: "No heavy animations on mobile"
    if (window.matchMedia("(min-width: 769px)").matches) {
        const bentoItems = document.querySelectorAll('.bento-item');

        bentoItems.forEach(item => {
            item.addEventListener('mousemove', (e) => {
                const rect = item.getBoundingClientRect();
                const x = e.clientX - rect.left; // x position within the element
                const y = e.clientY - rect.top;  // y position within the element

                // Calculate percentage
                const xPct = x / rect.width;
                const yPct = y / rect.height;

                // Calculate rotation (max 12 degrees for dynamic feel)
                const xRot = (0.5 - yPct) * 24;
                const yRot = (xPct - 0.5) * 24;

                // Apply transformation
                item.style.transform = `perspective(1000px) rotateX(${xRot}deg) rotateY(${yRot}deg) scale3d(1.05, 1.05, 1.05)`;

                // Parallax effect for inner content (Image moves slightly opposite)
                const img = item.querySelector('img');
                if (img) {
                    img.style.transform = `scale(1.15) translateX(${-yRot * 0.8}px) translateY(${-xRot * 0.8}px)`;
                }
            });

            item.addEventListener('mouseleave', () => {
                // Reset to CSS state
                item.style.transform = '';
                const img = item.querySelector('img');
                if (img) {
                    img.style.transform = '';
                }
            });
        });
    }

    // 12. Favorites Accordion Interaction
    const favPanels = document.querySelectorAll('.fav-panel');
    if (favPanels.length > 0) {
        favPanels.forEach(panel => {
            panel.addEventListener('click', () => {
                // Remove active from all
                favPanels.forEach(p => p.classList.remove('active'));
                // Add to clicked
                panel.classList.add('active');
            });
        });
    }


    // 13. Map Facade Pattern (Performance Optimization)
    // Only load iframes when user explicitly requests it
    const mapTriggers = document.querySelectorAll('.btn-map-trigger');

    if (mapTriggers.length > 0) {
        mapTriggers.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = btn.getAttribute('data-target');
                const mapSrc = btn.getAttribute('data-src');
                const mapContainer = document.getElementById(targetId);

                if (mapContainer && mapSrc) {
                    // Update active state of buttons in this group
                    const siblingBtns = btn.parentElement.querySelectorAll('.btn-map-trigger');
                    siblingBtns.forEach(b => b.classList.remove('active', 'btn-primary'));
                    siblingBtns.forEach(b => b.classList.add('btn-outline'));

                    // Highlight clicked button
                    btn.classList.remove('btn-outline');
                    btn.classList.add('btn-primary', 'active');

                    // Inject Iframe
                    mapContainer.innerHTML = `<iframe src="${mapSrc}" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
                }
            });
        });
    }

    // 14. Dish Detail Modal & Consult Actions (Event Delegation)
    const dishModal = document.getElementById('dish-modal');
    console.log("Modal Logic Init. Dish Modal found:", dishModal);

    if (dishModal) {
        const modalImg = document.getElementById('modal-dish-img');
        const modalTitle = document.getElementById('modal-dish-title');
        const modalPrice = document.getElementById('modal-dish-price');
        const modalDesc = document.getElementById('modal-dish-desc');
        const modalConsultBtn = document.getElementById('modal-consult-btn');
        const closeBtn = document.getElementById('close-dish-modal');

        // Close Modal Function
        const closeDishModal = () => {
            dishModal.classList.remove('active');
        };

        closeBtn.addEventListener('click', closeDishModal);
        dishModal.addEventListener('click', (e) => {
            if (e.target === dishModal) closeDishModal();
        });

        // Global Click Listener for Buttons (Delegation)
        document.addEventListener('click', (e) => {
            // Find closest button if clicked on icon/inner text
            const detailBtn = e.target.closest('.btn-details');
            const consultBtn = e.target.closest('.btn-consult');

            // Handle "Detalles" Click
            if (detailBtn) {
                e.preventDefault(); // Prevent jump
                e.stopPropagation();

                console.log("Details Clicked:", detailBtn.dataset.title);

                const title = detailBtn.getAttribute('data-title');
                const desc = detailBtn.getAttribute('data-desc');
                const price = detailBtn.getAttribute('data-price');
                const img = detailBtn.getAttribute('data-img');

                modalImg.src = img;
                modalTitle.textContent = title;
                modalPrice.textContent = price;
                modalDesc.textContent = desc;

                // Setup internal consult button
                modalConsultBtn.onclick = () => openWhatsApp(title);

                dishModal.classList.add('active');
                return;
            }

            // Handle "Consultar" Click
            if (consultBtn) {
                e.preventDefault();
                e.stopPropagation();
                const dish = consultBtn.getAttribute('data-dish');
                openWhatsApp(dish);
            }
        });
    }

    // 16. Security: Anti-Inspect & Right Click Disable
    document.addEventListener('contextmenu', (e) => e.preventDefault());

    document.onkeydown = (e) => {
        // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
        if (
            e.keyCode === 123 ||
            (e.ctrlKey && e.shiftKey && e.keyCode === 73) ||
            (e.ctrlKey && e.shiftKey && e.keyCode === 74) ||
            (e.ctrlKey && e.keyCode === 85)
        ) {
            return false;
        }
    };
});
