const express = require('express');
const db = require('./db');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const app = express();


// Connect templating engine to app instance
app.engine('mustache', mustacheExpress());
// Connect views folder to views name in app instance
app.set('views', './views');
// Connect view engine to mustache
app.set('view engine', 'mustache');
//config body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.get('/', (req, res, next) => {
  db.query('SELECT * FROM runner', [], (err, results) => {
    if (err) {
      return next(err)
    }
    res.render('index', {runners:results.rows})
  });
});

app.get('/add_runner', (req,res) => {
  res.render('addRunner')
});

app.post('/add_runner', (req, res, next) => {
  let addRunner =
  `INSERT INTO runner(division,sponsor,name)
  VALUES('${req.body.division}','${req.body.sponsor}','${req.body.name}')`;
  db.query(addRunner, (err) =>{
    if (err){
      return next(err)
    }
    res.redirect('/')
  });
});

app.get('/:id', (req, res, next) => {
  const id = req.params.id
  db.query(`SELECT * FROM runner WHERE bib_id = ${id}`, (err, results) => {
    if (err) {
      return next(err)
    }
    res.render('specific_runner', {runner:results.rows})
  });
});

app.listen(3000, () => {
console.log('Server listening on port 3000...');
});
