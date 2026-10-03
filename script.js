
document.addEventListener("DOMContentLoaded", () => {
    // Highlight active nav link
    const navLinks = document.querySelectorAll(".nav-links a");
    navLinks.forEach(link => {
        if (link.href === window.location.href) {
            link.classList.add("active");
        }
    });
});
  // Dark/Light Mode Toggle
        const toggleBtn = document.getElementById("themeToggle");
        toggleBtn.addEventListener("click", () => {
            document.body.classList.toggle("dark");
            toggleBtn.innerHTML = document.body.classList.contains("dark") 
                ? '<i class="fas fa-sun"></i>' 
                : '<i class="fas fa-moon"></i>';
        });

        // Redirect on Card Click
        document.querySelectorAll(".lang-card").forEach(card => {
            card.addEventListener("click", () => {
                const lang = card.dataset.lang;
                window.location.href = `editor.html?lang=${lang}`;
            });
        });