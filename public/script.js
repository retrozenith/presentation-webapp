document.addEventListener("DOMContentLoaded", () => {
    const titleContainer = document.getElementById("page-title");
    const contentContainer = document.getElementById("content-container");
    const splashScreen = document.getElementById("splash-screen");
    const themeToggle = document.getElementById("theme-toggle");
    const body = document.body;

    // Asigurăm că splash-ul este afișat înainte de încărcarea completă a site-ului
    splashScreen.style.display = "flex"; // Arată splash-ul imediat

    // Încarcă fișierul content.txt
    fetch("content.txt")
        .then(response => {
            if (!response.ok) {
                throw new Error("Fișierul nu a fost găsit.");
            }
            return response.text();
        })
        .then(data => {
            // După 1 secundă, splash-ul va dispărea automat
            setTimeout(() => {
                splashScreen.style.display = "none"; // Ascunde splash-ul după 1 secundă
            }, 1000); // Splash-ul dispare după 1 secundă

            const lines = data.split("\n");

            let titleFound = false;
            let markdownContent = "";

            // Procesăm fiecare linie din fișierul content.txt
            lines.forEach(line => {
                if (line.startsWith("###!")) {
                    // Extrage titlul fără '###!'
                    const title = line.replace("###!", "").trim();
                    titleContainer.innerHTML = `<h1>${title}</h1>`; // Titlu mic
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
            splashScreen.style.display = "none"; // Ascunde splash-ul în caz de eroare
            console.error("Eroare la încărcarea fișierului:", error);
            contentContainer.innerHTML = "<p style='color:red;'>Nu s-a putut încărca conținutul proiectului.</p>";
        });

    // Funcționalitate pentru schimbarea temei (dark/light)
    function applyTheme(theme) {
        if (theme === "dark") {
            body.classList.add("dark-mode");
            themeToggle.textContent = "☀️ Mod Luminos";
        } else {
            body.classList.remove("dark-mode");
            themeToggle.textContent = "🌙 Mod Întunecat";
        }
    }

    // Verifică dacă există o temă salvată în localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
        applyTheme(savedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        applyTheme("dark");
    }

    // Schimbă tema când utilizatorul apasă pe butonul de temă
    themeToggle.addEventListener("click", () => {
        const currentTheme = body.classList.contains("dark-mode") ? "light" : "dark";
        applyTheme(currentTheme);
        localStorage.setItem("theme", currentTheme);
    });
});
