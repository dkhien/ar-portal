const form = document.getElementById("login-form");

form.addEventListener("submit", (event) => {
  event.preventDefault(); // prevent the default form submission

  const usernameInput = document.getElementById("username-input");
  const passwordInput = document.getElementById("password-input");

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  // Check if username and password are "admin"
  if (username === "admin" && password === "admin") {
    // Redirect to "models.html"
    window.location.href = "models.html";
  } else {
    // Show error message
    alert("Invalid username or password!");
  }
});
