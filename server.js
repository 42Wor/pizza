const express = require('express');
const { engine } = require('express-handlebars');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static images
const imagePath = path.join(__dirname, 'image');
app.use('/image', express.static(imagePath));

// Handlebars setup
app.engine('hbs', engine({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  helpers: {
    json: (context) => JSON.stringify(context)
  }
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Load menu
const menuPath = path.join(__dirname, 'data/menu.json');
if (!fs.existsSync(menuPath)) {
  console.error("❌ ERROR: menu.json not found at", menuPath);
  process.exit(1);
}
const menu = JSON.parse(fs.readFileSync(menuPath, 'utf-8'));

// Route
app.get('/', (req, res) => {
  res.render('home', {
    menu,
    title: 'Jee Bhai Cafe - High Quality Fast Food',
    year: new Date().getFullYear()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running: http://localhost:${PORT}`);
  console.log(`📁 Images served from: ${imagePath}`);
});