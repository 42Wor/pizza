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
app.use('/image', express.static(path.join(__dirname, 'image'), {
  maxAge: '30d',
  setHeaders: (res, filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    if (['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'].includes(ext)) {
      res.setHeader('Cache-Control', 'public, max-age=2592000, immutable');
    }
  }
}));
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

// Route
app.get('/', (req, res) => {
  // Compute categories per-request so changes in data.json don't require restart
  const categories = [
    { key: 'all', label: 'All' },
    ...Array.from(new Set((data.menu || []).map(i => (i.type || '').toLowerCase())))
      .filter(c => c)
      .map(c => ({ key: c, label: c.charAt(0).toUpperCase() + c.slice(1) }))
  ];

  res.render('index', {
    title: 'Red & Chilli',
    deals: data.deals,
    menu: data.menu,
    categories
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});