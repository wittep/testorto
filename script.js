document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons (Check if loaded to prevent errors)
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Flip Card Logic
    const businessCard = document.getElementById('business-card');
    if (businessCard) {
        businessCard.addEventListener('click', function(e) {
            // Prevent flipping when clicking on links inside the card
            if (e.target.closest('a')) return;
            
            this.classList.toggle('flipped');
        });
    }

    // Certificate Modal Logic
    const modal = document.getElementById('cert-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalIssuer = document.getElementById('modal-issuer');
    const modalVerifyBtn = document.getElementById('modal-verify-btn');
    const closeBtn = document.getElementById('modal-close-btn');
    const backdrop = document.getElementById('modal-backdrop');
    const modalImage = document.getElementById('modal-image');
    const modalPlaceholder = document.getElementById('modal-placeholder');
    const zoomModal = document.getElementById('zoom-modal');
    const zoomImage = document.getElementById('zoom-image');

    function openModal(title, issuer, date, url, image) {
        if (!modal) return;
        modalTitle.textContent = title;
        modalIssuer.textContent = `Issued by ${issuer} • ${date}`;
        modalVerifyBtn.href = url;
        
        if (image && modalImage) {
            // Reset state before loading new image
            modalImage.classList.add('hidden'); 
            if (modalPlaceholder) modalPlaceholder.classList.remove('hidden');
            
            // Set source
            modalImage.src = image;
        } else if (modalImage) {
            modalImage.src = '';
            modalImage.classList.add('hidden');
            if (modalPlaceholder) modalPlaceholder.classList.remove('hidden');
        }

        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }

    // Attach listeners to View Credential buttons
    document.querySelectorAll('.view-cert-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const { title, issuer, date, url, image } = btn.dataset;
            openModal(title, issuer, date, url, image);
        });
    });

    // Close listeners
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });

    // Active Navigation on Scroll (Scroll Spy)
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    const navIndicators = document.querySelectorAll('.nav-indicator');

    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px', // Trigger when section is in the middle of viewport
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active state from all links
                navLinks.forEach(link => {
                    link.classList.remove('text-slate-900', 'font-semibold');
                    link.classList.add('text-slate-600');
                    // Hide indicator
                    const indicator = link.nextElementSibling;
                    if (indicator) indicator.classList.add('opacity-0');
                });

                // Add active state to current link
                const id = entry.target.getAttribute('id');
                const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
                
                if (activeLink) {
                    activeLink.classList.remove('text-slate-600');
                    activeLink.classList.add('text-slate-900', 'font-semibold');
                    
                    const activeIndicator = activeLink.nextElementSibling;
                    if (activeIndicator) activeIndicator.classList.remove('opacity-0');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    // Image Loading & Error Handling
    if (modalImage) {
        modalImage.addEventListener('load', function() {
            // Show image only when successfully loaded
            this.classList.remove('hidden');
            if (modalPlaceholder) modalPlaceholder.classList.add('hidden');
        });

        modalImage.addEventListener('error', function() {
            // Hide image if failed to load (fallback to placeholder)
            console.warn('Certificate image failed to load:', this.src);
            this.classList.add('hidden');
            if (modalPlaceholder) modalPlaceholder.classList.remove('hidden');
        });

        // Zoom Feature
        modalImage.addEventListener('click', function() {
            if (zoomModal && zoomImage && this.src) {
                zoomImage.src = this.src;
                zoomModal.classList.remove('hidden');
                // Small animation delay
                setTimeout(() => {
                    zoomImage.classList.remove('scale-95', 'opacity-0');
                }, 10);
            }
        });
    }

    // Close Zoom Modal
    if (zoomModal) {
        zoomModal.addEventListener('click', function() {
            if (zoomImage) zoomImage.classList.add('scale-95', 'opacity-0');
            setTimeout(() => {
                this.classList.add('hidden');
            }, 200);
        });
    }
});