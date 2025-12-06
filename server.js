const express = require('express');
const { engine } = require('express-handlebars');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Handlebars
app.engine('hbs', engine({ 
  extname: '.hbs',
  helpers: { json: context => JSON.stringify(context) }
}));
app.set('view engine', 'hbs');
app.set('views', './views');

const menu = JSON.parse(fs.readFileSync('./data/menu.json', 'utf-8'));

app.get('/', (req, res) => {
  res.render('home', { menu });
});

app.listen(PORT, () => {
  console.log(`Pizza & Burger Palace LIVE → http://localhost:${PORT}`);
  console.log(`WhatsApp Orders → https://wa.me/923410099882`);
});