const toggleDark = document.getElementById("toggle-dark");
        const icon = document.querySelector(".icon i");

        toggleDark.addEventListener("change", () => {
            document.body.classList.toggle("dark-mode");

            if (document.body.classList.contains("dark-mode")) {
                icon.classList.replace("fa-sun", "fa-moon");
            } else {
                icon.classList.replace("fa-moon", "fa-sun");
            }
        });