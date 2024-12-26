const express = require('express');
const fs = require('fs');
const path = require('path');

// Creează aplicația Express
const app = express();

// Citește fișierul de configurare pentru a obține portul și gazda
const config = fs.readFileSync(path.join(__dirname, 'config.txt'), 'utf-8').split('\n');
let port = 3000;  // valoare implicită
let host = 'localhost'; // valoare implicită

config.forEach(line => {
  if (line.startsWith('PORT=')) {
    port = line.split('=')[1].trim();
  }
  if (line.startsWith('HOST=')) {
    host = line.split('=')[1].trim();
  }
});

// Setează directorul public pentru fișiere statice
app.use(express.static(path.join(__dirname, 'public')));

// Rute pentru site
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

if (config.production === false) {
  // Dacă aplicația nu este în producție, împiedicăm cache-ul resurselor
  app.use((req, res, next) => {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      next();
  });
}

// Pornește serverul pe portul configurat
app.listen(port, host, () => {
  console.log(`Serverul rulează pe http://${host}:${port}`);
});
