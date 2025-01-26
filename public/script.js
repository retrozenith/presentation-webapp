document.addEventListener("DOMContentLoaded", () => {
    const titleContainer = document.getElementById("title");
    const contentContainer = document.getElementById("content-container");
    const splashScreen = document.getElementById("splash-screen");
    const themeToggle = document.getElementById("theme-toggle");
    const body = document.body;
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');

    // Actualizează culoarea barei de adrese în funcție de temă
    const updateThemeColor = (color) => {
        metaThemeColor.setAttribute("content", color);
    };

    // Verificăm tema salvată în localStorage
    const savedTheme = localStorage.getItem("theme");

    // Aplicăm tema salvată sau tema luminoasă implicită
    if (savedTheme) {
        body.classList.add(savedTheme);
        updateThemeColor(savedTheme === "light-mode" ? "#ffffff" : "#000000");
    } else {
        body.classList.add("light-mode");
        updateThemeColor("#ffffff");
    }

    // Actualizează textul butonului în funcție de tema activă
    const updateThemeButtonText = () => {
        if (body.classList.contains("light-mode")) {
            themeToggle.textContent = "🌙";
        } else {
            themeToggle.textContent = "☀️";
        }
    };

    // Schimbăm tema când utilizatorul apasă butonul de comutare
    themeToggle.addEventListener("click", () => {
        if (body.classList.contains("light-mode")) {
            body.classList.remove("light-mode");
            body.classList.add("dark-mode");
            localStorage.setItem("theme", "dark-mode");
            updateThemeColor("#000000");
        } else {
            body.classList.remove("dark-mode");
            body.classList.add("light-mode");
            localStorage.setItem("theme", "light-mode");
            updateThemeColor("#ffffff");
        }
        updateThemeButtonText(); // Actualizează textul butonului
    });

    // Actualizează textul butonului la încărcare
    updateThemeButtonText();

    // Asigurăm că splash-ul este vizibil până când fișierul content.txt este încărcat
    splashScreen.style.display = "flex"; // Arătăm splash-ul imediat

    // Încarcă fișierul content.txt
    fetch("content.txt")
        .then(response => {
            if (!response.ok) {
                throw new Error("Fișierul nu a fost găsit.");
            }
            return response.text();
        })
        .then(data => {
            // După 1 secundă, ascundem splash-ul
            setTimeout(() => {
                splashScreen.style.display = "none"; // Ascunde splash-ul
            }, 1000); // Splash-ul dispare după 1 secundă

            const lines = data.split("\n");

            let titleFound = false;
            let markdownContent = "";

            // Procesăm fiecare linie din fișierul content.txt
            lines.forEach(line => {
                if (line.startsWith("###!")) {
                    const title = line.replace("###!", "").trim();
                    titleContainer.innerHTML = `<h1>${title}</h1>`;
                    titleFound = true;
                } else {
                    markdownContent += line + "\n";
                }
            });

            if (!titleFound) {
                titleContainer.innerHTML = "<h1>Proiect fără Titlu</h1>";
            }

            // Procesăm conținutul Markdown folosind marked.js
            contentContainer.innerHTML = marked.parse(markdownContent);

            // Asigurăm că toate linkurile se deschid într-un tab nou
            const links = contentContainer.querySelectorAll("a");
            links.forEach(link => {
                link.setAttribute("target", "_blank"); // Setează target="_blank pentru toate linkurile
            });

            // Configurăm funcționalitatea pentru imagini
            const images = contentContainer.querySelectorAll("img");
            images.forEach(image => {
                image.addEventListener("click", () => {
                    openImageOverlay(image.src);
                });
            });
        })
        .catch(error => {
            splashScreen.style.display = "none"; // Ascunde splash-ul în caz de eroare
            console.error("Eroare la încărcarea fișierului:", error);
            contentContainer.innerHTML = "<p style='color:red;'>Nu s-a putut încărca conținutul proiectului.</p>";
        });

        const createImageOverlay = () => {
            const overlay = document.createElement("div");
            overlay.id = "image-overlay";
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                visibility: hidden;
                opacity: 0;
                overflow: hidden;
                transition: opacity 0.3s ease;
            `;
    
            const img = document.createElement("img");
            img.id = "overlay-image";
            img.style.cssText = `
                position: absolute;
                max-width: none;
                max-height: none;
                transform-origin: center;
                transition: transform 0.3s ease;
            `;
    
            // Prevenim comportamentul implicit de drag
            img.addEventListener("dragstart", (event) => {
                event.preventDefault();
            });
    
            overlay.appendChild(img);
    
            const controls = document.createElement("div");
            controls.style.cssText = `
                position: absolute;
                bottom: 20px;
                display: flex;
                gap: 10px;
            `;
    
            const zoomInButton = document.createElement("button");
            zoomInButton.textContent = "🔍 Zoom In";
            zoomInButton.addEventListener("click", () => {
                currentScale += 0.2;
                updateTransform();
            });
    
            const zoomOutButton = document.createElement("button");
            zoomOutButton.textContent = "🔎 Zoom Out";
            zoomOutButton.addEventListener("click", () => {
                currentScale = Math.max(1, currentScale - 0.2);
                updateTransform();
            });
    
            const downloadButton = document.createElement("button");
            downloadButton.textContent = "⬇️ Descarcă";
            downloadButton.addEventListener("click", () => {
                const a = document.createElement("a");
                a.href = img.src;
                a.download = img.src.split('/').pop();
                a.click();
            });
    
            const closeButton = document.createElement("button");
            closeButton.textContent = "❌ Închide";
            closeButton.addEventListener("click", () => {
                overlay.style.visibility = "hidden";
                overlay.style.opacity = "0";
                document.body.style.overflow = "auto"; // Reactivăm scroll-ul paginii
            });
    
            controls.appendChild(zoomInButton);
            controls.appendChild(zoomOutButton);
            controls.appendChild(downloadButton);
            controls.appendChild(closeButton);
    
            overlay.appendChild(controls);
            document.body.appendChild(overlay);
    
            let currentX = 0;
            let currentY = 0;
            let currentScale = 1;
    
            const updateTransform = () => {
                img.style.transform = `translate(${currentX}px, ${currentY}px) scale(${currentScale})`;
            };
    
            let isDragging = false;
            let startX, startY;
    
            // Gestionăm mișcarea imaginii cu mouse-ul
            img.addEventListener("mousedown", (event) => {
                isDragging = true;
                startX = event.clientX - currentX;
                startY = event.clientY - currentY;
            });
    
            document.addEventListener("mousemove", (event) => {
                if (!isDragging) return;
                currentX = event.clientX - startX;
                currentY = event.clientY - startY;
                updateTransform();
            });
    
            document.addEventListener("mouseup", () => {
                isDragging = false;
            });
    
            // Scroll pentru zoom
            overlay.addEventListener("wheel", (event) => {
                if (event.deltaY < 0) {
                    currentScale += 0.1; // Zoom In
                } else {
                    currentScale = Math.max(1, currentScale - 0.1); // Zoom Out
                }
                updateTransform();
                event.preventDefault(); // Previne scroll-ul paginii
            });
    
            return overlay;
        };
    
        const overlay = createImageOverlay();
    
        const openImageOverlay = (src) => {
            const img = overlay.querySelector("#overlay-image");
            img.src = src;
            overlay.style.visibility = "visible";
            overlay.style.opacity = "1";
            document.body.style.overflow = "hidden"; // Dezactivăm scroll-ul paginii
            currentX = 0;
            currentY = 0;
            currentScale = 1; // Resetare transformări
            img.style.transform = "scale(1)";
        };
    
        // Exemplu de utilizare (înlocuiește cu imagini din conținutul tău)
        const images = document.querySelectorAll("img");
        images.forEach((image) => {
            image.addEventListener("click", () => {
                openImageOverlay(image.src);
            });
        });
    });