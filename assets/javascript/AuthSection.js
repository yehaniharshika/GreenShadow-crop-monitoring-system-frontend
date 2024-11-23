let authToken = ""; // To store the JWT token after sign-in

$(document).ready(function () {
    // Handle signup
    $("#btn_SignUp").on("click", function (e) {
        e.preventDefault();

        const name = $("#name").val();
        const email = $("#email").val();
        const password = $("#password").val();
        const confirmPassword = $("#password1").val();
        const role = $("#role").val();

        if (password !== confirmPassword) {
            Swal.fire("Error", "Passwords do not match!", "error");
            return;
        }

        const userData = { name, email, password, role };

        $.ajax({
            url: `http://localhost:8080/GreenShadow/api/v1/auth/signup`,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(userData),
            success: function (response) {
                localStorage.setItem('token',response.token)
                console.log(response.token)
                Swal.fire("Success", "Signup successful!", "success");
            },
            error: function (xhr) {
                Swal.fire("Error", xhr.responseJSON.message || "Signup failed!", "error");
            },
        });
    });

    // Handle signin
    $("#btn_SignIn").on("click", function (e) {
        e.preventDefault();

        const email = $("#mail").val();
        const password = $("#pass").val();

        if (!email || !password) {
            Swal.fire("Error", "Email and password are required!", "error");
            return;
        }

        const data = { email, password };

        $.ajax({
            url: `http://localhost:8080/GreenShadow/api/v1/auth/signin`,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (response) {
                authToken = response.token; // Store the token
                localStorage.setItem("authToken", authToken); // Save token to localStorage
                console.log(authToken)
                Swal.fire("Success", "Logged in successfully!", "success").then(() => {
                    window.location.href = "index.html"; // Redirect to dashboard
                });
            },
            error: function (xhr) {
                Swal.fire("Error", xhr.responseJSON.message || "Sign-in failed!", "error");
            },
        });
    });
});
