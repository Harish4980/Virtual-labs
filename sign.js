// Toggle between Sign In, Register, and Forgot Password forms
function showForm(formId) {
    document.querySelectorAll(".form-box").forEach(box => box.classList.add("hidden"));
    const target = document.getElementById(formId);
    if (target) {
        target.classList.remove("hidden");
    }
}

// Simulated authentication with localStorage support
function handleLogin() {
    const user = document.getElementById("loginUsername").value.trim();
    const pass = document.getElementById("loginPassword").value.trim();

    if (!user || !pass) {
        alert("Please enter both username and password.");
        return;
    }

    // Check saved users or allow default login
    const savedUsers = JSON.parse(localStorage.getItem("vl_users") || "[]");
    const matchedUser = savedUsers.find(u => (u.username === user || u.email === user) && u.password === pass);

    if (savedUsers.length === 0 || matchedUser || user.length >= 3) {
        localStorage.setItem("vl_currentUser", JSON.stringify({ username: user }));
        alert("Login successful! Redirecting to Labs...");
        window.location.href = "labs.html";
    } else {
        alert("Invalid username or password. Please try again or register.");
    }
}

function handleRegister() {
    const name = document.getElementById("regName").value.trim();
    const mobile = document.getElementById("regMobile").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const gender = document.getElementById("regGender").value;
    const age = document.getElementById("regAge").value.trim();
    const pass = document.getElementById("regPassword").value.trim();

    if (!name || !mobile || !email || !gender || !age || !pass) {
        alert("Please fill in all fields.");
        return;
    }

    const savedUsers = JSON.parse(localStorage.getItem("vl_users") || "[]");
    savedUsers.push({ username: name, mobile, email, gender, age, password: pass });
    localStorage.setItem("vl_users", JSON.stringify(savedUsers));

    alert("Registration successful! Please log in.");
    showForm("signinForm");
}

function handlePasswordReset() {
    const email = document.getElementById("forgotEmail").value.trim();
    const code = document.getElementById("resetCode").value.trim();

    if (!email || !code) {
        alert("Please enter your email and verification code.");
        return;
    }
    alert("Password reset verified! Redirecting to Labs...");
    window.location.href = "labs.html";
}

// Theme handling & persistence
document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("themeToggle");
    const savedTheme = localStorage.getItem("vl_theme") || "light";
    
    if (savedTheme === "dark") {
        document.body.classList.add("dark", "dark-mode");
        if (themeToggle) {
            const icon = themeToggle.querySelector("i");
            if (icon) {
                icon.classList.remove("fa-moon");
                icon.classList.add("fa-sun");
            }
        }
    }

    if (themeToggle) {
        themeToggle.addEventListener("click", function() {
            const isDark = document.body.classList.toggle("dark");
            document.body.classList.toggle("dark-mode", isDark);
            localStorage.setItem("vl_theme", isDark ? "dark" : "light");

            const icon = this.querySelector("i");
            if (icon) {
                if (isDark) {
                    icon.classList.remove("fa-moon");
                    icon.classList.add("fa-sun");
                } else {
                    icon.classList.remove("fa-sun");
                    icon.classList.add("fa-moon");
                }
            }
        });
    }
});

