import express from 'express';
import { engine } from 'express-handlebars';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware
app.use('/image', express.static(path.join(__dirname, 'image')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', engine({
  extname: '.handlebars',
  defaultLayout: false,
  helpers: {
    json: (context) => JSON.stringify(context)
  }
}));

app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Load Data
let data = { deals: [], menu: [] };
const dataFilePath = path.join(__dirname, 'data', 'data.json');
if (fs.existsSync(dataFilePath)) {
  try {
    data = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
  } catch (error) {
    console.error("Error parsing data.json:", error);
  }
}

// Build categories (server-side) for menu filters
const categories = [
  { key: 'all', label: 'All' },
  ...Array.from(new Set(data.menu.map(i => i.type.toLowerCase())))
    .map(c => ({ key: c, label: c.charAt(0).toUpperCase() + c.slice(1) }))
];

// Route
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Red & Chilli',
    deals: data.deals,
    menu: data.menu,
    categories: categories
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});