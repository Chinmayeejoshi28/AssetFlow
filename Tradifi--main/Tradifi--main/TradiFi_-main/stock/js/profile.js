document.addEventListener('DOMContentLoaded', function() {
    const profileBtn = document.getElementById('profileBtn');
    const profilePanel = document.getElementById('profilePanel');
    const closeProfileBtn = document.getElementById('closeProfileBtn');
    
    // Open profile panel
    profileBtn.addEventListener('click', function() {
        profilePanel.classList.add('active');
    });
    
    // Close profile panel
    closeProfileBtn.addEventListener('click', function() {
        profilePanel.classList.remove('active');
    });
    
    // Tab navigation
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.profile-tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // Remove active class from all tabs
            tabBtns.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to selected tab
            this.classList.add('active');
            document.getElementById(`${tabName}Tab`).classList.add('active');
        });
    });
    
    // Portfolio section navigation
    const portfolioNavBtns = document.querySelectorAll('.portfolio-nav-btn');
    const portfolioSections = document.querySelectorAll('.portfolio-section');
    
    portfolioNavBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Remove active class from all sections
            portfolioNavBtns.forEach(btn => btn.classList.remove('active'));
            portfolioSections.forEach(section => section.classList.remove('active'));
            
            // Add active class to selected section
            this.classList.add('active');
            document.getElementById(`${category}Portfolio`).classList.add('active');
        });
    });
    
    // Close panel when clicking outside
    document.addEventListener('click', function(event) {
        if (!profilePanel.contains(event.target) && event.target !== profileBtn) {
            profilePanel.classList.remove('active');
        }
    });
    
    // Prevent closing when clicking inside panel
    profilePanel.addEventListener('click', function(event) {
        event.stopPropagation();
    });
}); 