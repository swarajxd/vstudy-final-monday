document.addEventListener("DOMContentLoaded", function () {
    const signupForm = document.getElementById("signupForm");
    const loginForm = document.getElementById("loginForm");

    // SIGNUP FORM
    if (signupForm) {
        signupForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const first_name = document.querySelector('input[name="first_name"]').value.trim();
            const last_name = document.querySelector('input[name="last_name"]').value.trim();
            const username = document.querySelector('input[name="username"]').value.trim();
            const email = document.querySelector('input[name="email"]').value.trim();
            const password = document.querySelector('input[name="password"]').value;
            const confirmPassword = document.querySelector('input[name="confirm_password"]').value;

            // Email Validation
            if (!validateEmail(email)) {
                alert("Please enter a valid email address.");
                return;
            }

            // Password Validation
            if (!validatePassword(password)) {
                alert("Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, and one number.");
                return;
            }

            // Confirm Password Validation
            if (password !== confirmPassword) {
                alert("Passwords do not match. Please confirm your password.");
                return;
            }

            const userData = { first_name, last_name, username, email, password };

            try {
                const response = await fetch("http://localhost:5000/auth/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(userData)
                });

                const data = await response.json();
                if (response.ok) {
                    alert("Registration successful! You can now login.");
                    window.location.href = "login.html"; // Redirect to login page
                } else {
                    alert(`Error: ${data.error}`);
                }
            } catch (error) {
                console.error("Error:", error);
                alert("Something went wrong. Please try again.");
            }
        });
    }

    // LOGIN FORM
    if (loginForm) {
        loginForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const email = document.querySelector('input[name="email"]').value.trim();
            const password = document.querySelector('input[name="password"]').value;

            if (!email || !password) {
                alert("Please fill in all fields.");
                return;
            }

            try {
                const response = await fetch("http://localhost:5000/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();
                if (response.ok) {
                    alert("Login successful!");
                    localStorage.setItem("token", data.token);
                    window.location.href = "dashboard.html"; // Redirect to dashboard after login
                } else {
                    alert(`Error: ${data.error}`);
                }
            } catch (error) {
                console.error("Error:", error);
                alert("Something went wrong. Please try again.");
            }
        });
    }

    // Validate Email Format
    function validateEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    // Validate Password Strength
    function validatePassword(password) {
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        return passwordPattern.test(password);
    }
});
