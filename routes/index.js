var express = require('express');
var router = express.Router();
var cors = require('cors')

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
    console.log('Closed the database connection.');
    process.exit()
  });
});

router.use(cors());

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/cool', function(req, res){
  let sql = 'SELECT * FROM feedback, reponse_question where feedback.id = reponse_question.feedback_id';
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

router.post('/sendAnswers', function(req, res){
  console.log('Receiving answers : body ' + JSON.stringify(req.body));
  console.log('inserting new feedback to link answers to');
  let sqlFeedback = 'INSERT INTO feedback(time_reception) values(?)';
  db.run(sqlFeedback, [Date.now()], function(err){
    if (err) {
      return console.log(err.message);
    }
    // get the last inserted id
    console.log(`A row of feedback has been inserted with rowid ${this.lastID}`);
    let idFeedback = this.lastID;
    res.send(String(idFeedback));
    console.log('inserting answers');
    let sqlAnswers = 'INSERT INTO reponse_question(feedback_id, num_question, reponse) values(?, ?, ?)';
    let answers = req.body.answers;
    answers.forEach(function(element, index){
      db.run(sqlAnswers, [idFeedback, index+1, element], function(err){
        if (err) {
          return console.log(err.message);
        }
        console.log('Answer saved for question ' + (index+1));
      });
    });
  });
});

router.post('/sendFeedback', function(req, res){
  console.log('Receiving feedback : body ' + JSON.stringify(req.body));

  // feedback:{
  //   id:null,
  //   note:null,
  //   commentaire:'',
  //   savoirPlus:false,
  //   email:'',
  //   profil:null
  // }
  
  let sql = 'UPDATE feedback SET commentaire = ?, profil = ?, eval = ?, savoir_plus = ?, email = ? WHERE id = ?;';
  let feedback = req.body.feedback;
  db.run(sql, [feedback.commentaire, feedback.profil, feedback.note, feedback.savoirPlus, feedback.email, feedback.id], function(err){
    if (err) {
      return console.log(err.message);
    }
    console.log(`The feedback has been updated`);
    res.json('OK');
  })

});



module.exports = router;
