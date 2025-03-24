# Documentație Website "Fenomenul Pitești: Reeducare prin Tortură"

## Prezentare Generală
Acest website este o aplicație web modernă, dezvoltată folosind tehnologii de ultimă generație, dedicată prezentării informațiilor despre Fenomenul Pitești. Aplicația oferă o experiență de utilizare optimă, fiind construită cu React și TypeScript.

## Caracteristici Principale

### 1. Design Adaptabil
- **Mod Zi/Noapte**: Utilizatorii pot comuta între tema luminoasă și întunecată
- **Responsive Design**: Se adaptează perfect la toate dimensiunile de ecran
- **Interfață Modernă**: Utilizează Tailwind CSS pentru un design elegant și modern

### 2. Vizualizare Conținut
- **Markdown Rendering**: Conținutul este formatat folosind Markdown, permițând o structurare clară a textului
- **Suport pentru Tabele**: Implementează suport pentru tabele prin remark-gfm
- **Formatare Avansată**: Suportă toate elementele de formatare Markdown (titluri, liste, link-uri, etc.)

### 3. Sistem Avansat de Vizualizare a Imaginilor
- **Vizualizator Interactiv**: Permite vizualizarea imaginilor în format mare
- **Funcții de Zoom**: 
  - Mărire până la 3x
  - Micșorare până la 0.5x
  - Control precis al nivelului de zoom
- **Descărcare Imagini**: Posibilitatea de a descărca imaginile vizualizate
- **Navigare Intuitivă**: Interfață simplă pentru închiderea vizualizatorului

## Specificații Tehnice

### Tehnologii Utilizate
- **Frontend**: React 18.3.1
- **Limbaj**: TypeScript
- **Stilizare**: Tailwind CSS
- **Build Tool**: Vite
- **Dependențe Principale**:
  - react-markdown: Pentru renderizarea conținutului Markdown
  - lucide-react: Pentru iconițe și elemente vizuale
  - remark-gfm: Pentru suport extins Markdown

### Structura Aplicației
- **/src**: Codul sursă principal
- **/public**: Resurse statice
- **/dist**: Fișiere compilate pentru producție

### Configurare și Instalare

1. **Cerințe de Sistem**:
   - Node.js (versiunea 20 sau mai nouă)
   - npm (manager de pachete Node.js)

2. **Pași de Instalare**:
   ```bash
   npm install      # Instalează dependențele
   npm run dev      # Pornește serverul de dezvoltare
   npm run build    # Construiește versiunea de producție
   ```

3. **Configurare Docker**:
   ```bash
   docker build -t presentation-webapp .
   docker run -p 3000:3000 presentation-webapp
   ```

## Ghid de Utilizare

### Pentru Vizitatori
1. **Navigare**: Scrollați pentru a citi conținutul
2. **Vizualizare Imagini**: 
   - Click pe imagine pentru vizualizare detaliată
   - Folosiți butoanele de zoom pentru ajustarea mărimii
   - Click pe X pentru închidere
3. **Schimbare Temă**: 
   - Click pe iconița soare/lună din colțul dreapta sus
   - Tema se salvează automat în preferințele browserului

### Pentru Administratori
1. **Actualizare Conținut**: 
   - Modificați fișierul `content.txt`
   - Folosiți sintaxa Markdown pentru formatare
   - Adăugați `###!` la începutul titlului principal

## Performanță și Optimizare
- Optimizare automată a imaginilor
- Încărcare lazy pentru conținut mare
- Caching eficient pentru tema selectată
- Build-uri optimizate pentru producție

## Securitate
- Headers CORS configurați
- Sanitizare conținut Markdown
- Protecție împotriva XSS
- Link-uri externe cu atribute de securitate

## Suport și Mentenanță
- Cod sursă bine documentat
- Structură modulară pentru actualizări ușoare
- Configurare ESLint pentru calitatea codului
- Suport pentru debugging în dezvoltare 
