const express = require('express');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/quiz', (req, res) => {
  res.render('quiz');
});

app.get('/resultados', (req, res) => {
  res.render('resultados');
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
