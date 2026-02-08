const express = require('express');
const { engine } = require('express-handlebars');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use('/image', express.static(path.join(__dirname, 'image')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handlebars Setup (Layouts Disabled)
app.engine('hbs', engine({
  extname: '.hbs',
  defaultLayout: false, // <--- This tells it to not look for a layout file
  helpers: {
    json: (context) => JSON.stringify(context)
  }
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Load Data
const loadData = () => {
  const filePath = path.join(__dirname, 'data', 'data.json');
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }
  return { deals: [], menu: [] };
};

// Route
app.get('/', (req, res) => {
  const data = loadData();
  res.render('index', { // Renders views/index.hbs
    title: 'Jee Bhai Cafe',
    deals: data.deals,
    menu: data.menu
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});