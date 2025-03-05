document.addEventListener("DOMContentLoaded", () => {
    const body = document.querySelector("body");
    const modeSwitch = document.querySelector(".toggle-switch"); // Dark mode toggle switch
    const modeText = document.querySelector(".mode-text"); // Text next to toggle

    // ✅ Apply dark mode if it was previously enabled
    if (localStorage.getItem("darkMode") === "enabled") {
        body.classList.add("dark");
        modeText.innerText = "Light Mode";
    }

    // ✅ Toggle dark mode on click
    if (modeSwitch) {
        modeSwitch.addEventListener("click", () => {
            body.classList.toggle("dark");

            if (body.classList.contains("dark")) {
                localStorage.setItem("darkMode", "enabled"); // ✅ Save state
                modeText.innerText = "Light Mode";
            } else {
                localStorage.setItem("darkMode", "disabled"); // ✅ Save state
                modeText.innerText = "Dark Mode";
            }
        });
    } else {
        console.warn("⚠️ Dark mode toggle switch not found on this page.");
    }
});
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.section-header');
    
    sections.forEach(section => {
        section.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            const content = document.getElementById(`section-${sectionId}`);
            
            if (content.classList.contains('active')) {
                content.classList.remove('active');
                content.style.maxHeight = '0';
            } else {
                // Open this section without closing others
                content.classList.add('active');
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });

    // Function to update progress
    function updateProgress(sectionId) {
        const section = document.querySelector(`[data-section="${sectionId}"]`);
        const lessons = document.querySelectorAll(`#section-${sectionId} .lesson`);
        const completedLessons = document.querySelectorAll(`#section-${sectionId} .lesson input:checked`);
        const progressSpan = section.querySelector('.progress');
        
        progressSpan.textContent = `${completedLessons.length}/${lessons.length}`;
    }

    // Add event listeners to checkboxes
    const checkboxes = document.querySelectorAll('.lesson input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const sectionId = this.closest('.section-content').id.split('-')[1];
            updateProgress(sectionId);
        });
    });

    // Initial progress update
    for (let i = 1; i <= 6; i++) {
        updateProgress(i);
    }

    // Open the fourth section by default
    document.querySelector('[data-section="4"]').click();

    // Toggle dark mode

});

const body = document.querySelector("body"),
    sidebar = body.querySelector(".sidebar"),
    toggle = body.querySelector(".toggle"),
    modeSwitch = body.querySelector(".toggle-switch"),
    modeText = body.querySelector(".mode-text");

toggle.addEventListener("click", () => {
    sidebar.classList.toggle("close");
});

modeSwitch.addEventListener("click", () => {
    body.classList.toggle("dark");

    if (body.classList.contains("dark")) {
        modeText.innerText = "Light Mode";
    } else {
        modeText.innerText = "Dark Mode";
    }
});
