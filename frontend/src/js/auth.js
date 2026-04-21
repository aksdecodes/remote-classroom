// LOGIN
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        // Fake validation (for testing UI)
        if (email && password) {
            alert("Login successful (frontend test)");

            // redirect to dashboard
            window.location.href = "dashboard.html";
        } else {
            alert("Please enter all fields");
        }
    });
}


// REGISTER
const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
        e.preventDefault();

        alert("Registered successfully (frontend test)");
        window.location.href = "login.html";
    });
}