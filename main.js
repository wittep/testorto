// Initialize Lucide Icons
lucide.createIcons();

// Flip Card Logic
const businessCard = document.getElementById('business-card');
if (businessCard) {
    businessCard.addEventListener('click', function() {
        this.classList.toggle('flipped');
    });
}