document.addEventListener("DOMContentLoaded", () => {
    const titleContainer = document.getElementById("page-title");
    const contentContainer = document.getElementById("content-container");

    // Încarcă fișierul content.txt
    fetch("content.txt")
        .then(response => {
            if (!response.ok) {
                throw new Error("Fișierul nu a fost găsit.");
            }
            return response.text();
        })
        .then(data => {
            const lines = data.split("\n");

            let titleFound = false;
            let markdownContent = "";

            lines.forEach(line => {
                if (line.startsWith("###!")) {
                    // Extrage titlul fără '###!'
                    const title = line.replace("###!", "").trim();
                    titleContainer.innerHTML = `<h1>${title}</h1>`;
                    titleFound = true;
                } else {
                    // Adaugă linia la conținutul Markdown
                    markdownContent += line + "\n";
                }
            });

            if (!titleFound) {
                titleContainer.innerHTML = "<h1>Proiect fără Titlu</h1>";
            }

            // Procesează conținutul Markdown folosind marked.js
            contentContainer.innerHTML = marked.parse(markdownContent);
        })
        .catch(error => {
            console.error("Eroare la încărcarea fișierului:", error);
            contentContainer.innerHTML = "<p style='color:red;'>Nu s-a putut încărca conținutul proiectului.</p>";
        });
});

document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("theme-toggle");
    const body = document.body;

    // Funcție pentru aplicarea temei
    function applyTheme(theme) {
        if (theme === "dark") {
            body.classList.add("dark-mode");
            themeToggle.textContent = "☀️ Mod Luminos";
        } else {
            body.classList.remove("dark-mode");
            themeToggle.textContent = "🌙 Mod Întunecat";
        }
    }

    // Verifică preferința salvată în localStorage sau tema sistemului
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
        applyTheme(savedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        applyTheme("dark");
    }

    // Eveniment pentru toggle
    themeToggle.addEventListener("click", () => {
        const currentTheme = body.classList.contains("dark-mode") ? "light" : "dark";
        applyTheme(currentTheme);
        localStorage.setItem("theme", currentTheme);
    });
});
