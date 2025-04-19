document.addEventListener("DOMContentLoaded", () => {
  const currentPage = window.location.pathname;
  console.log("Current page:", currentPage);
  
  // In index.html
  if (currentPage.includes("index.html") || currentPage.endsWith("/")) {
      const loginBtn = document.getElementById("goToLogin");
      if (loginBtn) {
          console.log("Login button found on index page");
          loginBtn.addEventListener("click", () => {
              console.log("Login button clicked, redirecting to login.html");
              setTimeout(() => {
                  window.location.href = "login.html";
              }, 1000);
          });
      }
  }
  
  // In login page
  if (currentPage.includes("login.html")) {
      console.log("On login page");
      // Use the form class instead of ID since there's no ID in your HTML
      const loginForm = document.querySelector(".login-form");
      const loginButton = document.querySelector(".login-form__submit");
      
      if (loginForm && loginButton) {
          console.log("Login form and button found");
          loginButton.addEventListener("click", (e) => {
              e.preventDefault();
              console.log("Login submit button clicked");
              
              const email = document.getElementById("email").value;
              const password = document.getElementById("password").value;
              console.log("Email:", email, "Password:", password);
              
              if (email === "admin@gmail.com" && password === "1234") {
                  console.log("Credentials correct");
                  
                  // Create a temporary timer element if it doesn't exist
                  let timerEl = document.createElement("div");
                  timerEl.id = "timer";
                  timerEl.style.textAlign = "center";
                  timerEl.style.marginTop = "10px";
                  timerEl.style.fontWeight = "bold";
                  
                  // Add the timer element to the form
                  loginForm.appendChild(timerEl);
                  
                  let countdown = 3;
                  timerEl.innerText = countdown + "s";
                  
                  // Show a success message
                  alert("Connexion réussie! Redirection vers le tableau de bord dans 3 secondes.");
                  
                  const intervalId = setInterval(() => {
                      countdown--;
                      timerEl.innerText = countdown + "s";
                      console.log("Countdown:", countdown);
                      
                      if (countdown <= 0) {
                          clearInterval(intervalId);
                          console.log("Countdown finished, redirecting to dashboard.html");
                          // Use absolute path to ensure correct navigation
                          const basePath = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1);
                          window.location.href = basePath + "dashboard.html";
                      }
                  }, 1000);
              } else {
                  console.log("Incorrect credentials");
                  alert("Identifiants incorrects !");
              }
          });
      } else {
          console.log("Login form or button not found");
      }
  }
});

