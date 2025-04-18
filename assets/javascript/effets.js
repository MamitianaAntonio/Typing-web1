document.addEventListener("DOMContentLoaded", () => {
    // Code for dark mode toggle
    const toggleDark = document.getElementById("toggle-dark");
    const iconContainer = document.querySelector(".toggle-label .icon");
    
    // Replace the icon initially
    iconContainer.innerHTML = '<i class="fas fa-sun"></i>';
    
    // Handle theme change
    toggleDark.addEventListener("change", () => {
        // Toggle dark mode on the body
        document.body.classList.toggle("dark-mode");
        
        // Switch the icon every time the theme changes
        if (iconContainer.innerHTML.includes("fa-sun")) {
            iconContainer.innerHTML = '<i class="fas fa-moon"></i>';
        } else {
            iconContainer.innerHTML = '<i class="fas fa-sun"></i>';
        }
    });
    
    // Code for dropdown - FIXED
    // Use a more robust method to select the icon
    const dropdownToggle = document.querySelector(".dropdown-toggle");
    const dropdownMenu = document.querySelector(".dropdown-menu");
    const overlay = document.querySelector(".overlay");
    
    console.log("Elements found:", {
        dropdownToggle,
        dropdownMenu,
        overlay
    });
    
    // Handle click on the settings icon
    if (dropdownToggle) {
        dropdownToggle.addEventListener("click", function(e) {
            console.log("Clicked on the settings icon");
            e.preventDefault();
            e.stopPropagation();
            
            // Toggle dropdown visibility
            dropdownMenu.classList.toggle("active");
            overlay.classList.toggle("active");
        });
    }
    
    // Close dropdown when clicking on the overlay
    if (overlay) {
        overlay.addEventListener("click", function() {
            console.log("Clicked on the overlay");
            dropdownMenu.classList.remove("active");
            overlay.classList.remove("active");
        });
    }
    
    // Close dropdown when clicking outside
    document.addEventListener("click", function(e) {
        if (dropdownMenu && !dropdownMenu.contains(e.target) && e.target !== dropdownToggle) {
            console.log("Clicked elsewhere");
            dropdownMenu.classList.remove("active");
            overlay.classList.remove("active");
        }
    });
    
    // Handle time option change
    const timeOptions = document.querySelectorAll('input[name="time"]');
    const timeDisplay = document.querySelector(".typing-status_time");
    
    timeOptions.forEach(option => {
        option.addEventListener("change", () => {
            // Update time display
            let timeText;
            switch(option.value) {
                case "30s":
                    timeText = "Time : 00:30";
                    break;
                case "1min":
                    timeText = "Time : 01:00";
                    break;
                case "1min30s":
                    timeText = "Time : 01:30";
                    break;
            }
            timeDisplay.textContent = timeText;
            
            // Close dropdown after selection
            dropdownMenu.classList.remove("active");
            overlay.classList.remove("active");
        });
    });
});
