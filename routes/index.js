var express = require('express');
var router = express.Router();

const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./db/quizz.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the quizz database.');
});

process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Close the database connection.');
  });
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/cool', function(req, res){
  let sql = 'SELECT * FROM feedback';
  db.all(sql, [], (err, rows)=>{
    if (err) {
      throw err;
    }
    console.log(rows);
    rows.forEach((row) => {
      console.log(row.profil);
    });
    res.json(rows);
  });
});

router.post('/sendFeedback', function(req, res){
  console.log('Receiving feedback : body ' + JSON.stringify(req.body));
  
  let sql = 'INSERT INTO feedback(commentaire) values(?)';
  db.run(sql, [req.body.feedback], function(err){
    if (err) {
      return console.log(err.message);
    }
    // get the last insert id
    console.log(`A row has been inserted with rowid ${this.lastID}`);
    res.json(this.lastID);
  })

});

router.use(function(req, res, next){
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});



module.exports = router;
