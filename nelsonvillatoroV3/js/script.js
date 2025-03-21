document.addEventListener("DOMContentLoaded", function() {

  // --- 1. Mobile Menu Toggle ---
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector("nav ul");
  // Add click event listener to the menu toggle
if (menuToggle) {
  menuToggle.addEventListener("click", function() {
    console.log("Menu toggle clicked"); // For debugging
    navMenu.classList.toggle("active");
    this.classList.toggle("active");
  });
}

  // --- 2. Smooth Scrolling ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener("click", function(e) {
          e.preventDefault();

          const targetId = this.getAttribute("href");
          const targetElement = document.querySelector(targetId);

          if (targetElement) {
              // Calculate the offset.  We subtract the header height.
              const offset = targetElement.offsetTop - 70; // 70px for header height
              window.scrollTo({
                  top: offset,
                  behavior: "smooth"
              });

              // Close the mobile menu if it's open after clicking a link
              if (navMenu.classList.contains("active")) {
                  navMenu.classList.remove("active");
                  menuToggle.classList.remove("active");
              }
          }
      });
  });

  // --- 3. Dynamic Copyright Year ---
  const currentYearElements = document.querySelectorAll("#current-year, #current-year-footer");
  const currentYear = new Date().getFullYear();
  currentYearElements.forEach(element => {
      if (element) element.textContent = currentYear;
  });

  // --- 4. Form Submission Handling (Placeholder) ---
  const subscribeForm = document.getElementById("subscribe-form");
  const messageContainer = document.getElementById("message-container");

  if (subscribeForm) {
      subscribeForm.addEventListener("submit", function(event) {
          event.preventDefault();

          const nameInput = document.getElementById("name");
          const emailInput = document.getElementById("email");

          // Basic Client-Side Validation
          if (!nameInput.value || !emailInput.value) {
              displayMessage("Please fill in all required fields.", "error");
              return;
          }

          if (!isValidEmail(emailInput.value)) {
              displayMessage("Please enter a valid email address.", "error");
              return;
          }

          // --- Placeholder for AJAX Submission ---
          // In a real application, you would use fetch or Axios here
          // to send the data to your server (subscribe.php).
          // This is just a placeholder to show the success message.

          // Simulate a successful submission.  Replace this with your actual AJAX call.
          setTimeout(() => {
              displayMessage("Thank you for subscribing!", "success");
              subscribeForm.reset(); // Clear the form
          }, 500); // Simulate a small delay
      });
  }

  function displayMessage(message, type) {
      if (messageContainer) {
          messageContainer.textContent = message;
          messageContainer.className = `message ${type}`; // Add classes for styling
          messageContainer.style.display = "block"; // Show the message

          // Hide the message after a few seconds (optional)
          setTimeout(() => {
              messageContainer.style.display = "none";
          }, 5000); // Hide after 5 seconds
      }
  }

  function isValidEmail(email) {
      // Basic email validation regex (you might want a more robust one)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
  }
});