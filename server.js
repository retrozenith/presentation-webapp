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

// Pornește serverul pe portul configurat
app.listen(port, host, () => {
  console.log(`Serverul rulează pe http://${host}:${port}`);
});
