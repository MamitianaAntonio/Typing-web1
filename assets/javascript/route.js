document.addEventListener("DOMContentLoaded", () => {
    const currentPage = window.location.pathname;
  
    // In index.html
    if (currentPage.includes("index.html")) {
      const loginBtn = document.getElementById("goToLogin");
      if (loginBtn) {
        loginBtn.addEventListener("click", () => {
            setTimeout(() => {
                window.location.href = "login.html";
            }, 1000)
        });
      }
    }
  
    // In login page
    if (currentPage.includes("login.html")) {
        const loginForm = document.getElementById("loginForm");
        const loginButton = document.querySelector(".login-form__submit");
    
        if (loginForm && loginButton) {
          loginButton.addEventListener("click", (e) => {
            e.preventDefault();
    
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
    
            if (email === "admin@gmail.com" && password === "1234") {
              let countdown = 3;
              const timerEl = document.getElementById("timer");
              
              const intervalId = setInterval(() => {
                timerEl.innerText = countdown + "s";
                countdown--;
    
                if (countdown < 0) {
                  clearInterval(intervalId);
                  window.location.href = "dashboard.html";
                }
              }, 1000);
            } else {
              alert("Identifiants incorrects !");
            }
          });
        }
      }
  });
  