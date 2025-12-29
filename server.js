const express = require('express');
const { engine } = require('express-handlebars');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// FIX: Use path.join for Windows compatibility
const imagePath = path.join('C:', 'Users', 'maaz', 'Desktop', 'pizza', 'image');
app.use('/image', express.static(imagePath));

app.engine('hbs', engine({ 
  extname: '.hbs',
  helpers: { json: context => JSON.stringify(context) }
}));
app.set('view engine', 'hbs');

// Error checking: Log if the menu file exists
const menuPath = './data/menu.json';
if (!fs.existsSync(menuPath)) {
    console.error("❌ ERROR: menu.json not found at " + menuPath);
    process.exit(1);
}
const menu = JSON.parse(fs.readFileSync(menuPath, 'utf-8'));

app.get('/', (req, res) => {
  res.render('home', { menu });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running: http://localhost:${PORT}`);
  console.log(`📁 Serving images from: ${imagePath}`);
});