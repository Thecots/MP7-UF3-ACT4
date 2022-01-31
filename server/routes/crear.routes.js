const express = require("express");
const router = express.Router();
const { checkUser, sqlcon } = require('./../middlewares/auth');

/* crea partida */
router.get('/create', checkUser, (req, res) => {
  let con = sqlcon();
  con.connect(function (err) {
    if (err) return res.redirect('/search');
    let d = new Date();
    con.query(`INSERT INTO partides VALUES (null,'${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}','${req.id}',NULL,'host',NULL,'${req.usuari}')`, (err, result) => {
      if (err) return res.redirect('/search');
      res.render('gameWaiting', { id: result.insertId });
      con.end();
    });
    con.end();
  });
});

/* esprando rival */
router.get('/waiting', checkUser, (req, res) => {
  let con = sqlcon();
  con.connect(function (err) {
    if (err) return res.redirect('/search');
    con.query(`SELECT (guest) FROM partides WHERE id_partida=${req.query.id}`, (err, result) => {
      if (err) return console.log('hola');
      if (result[0].guest == null) {
        res.render('gameWaiting', { id: req.query.id });
      } else {
        res.redirect('/game?id=' + req.query.id);
      }
      con.end();
    });
    con.end();
  });
})

/* borrar partida */
router.get('/delete', checkUser, (req, res) => {
  let con = sqlcon();
  con.connect(function (err) {
    if (err) return res.redirect('/search');
    con.query(`DELETE FROM partides WHERE id_partida=${req.query.id}`, (err, result) => {
      if (err) { console.log(err); return res.redirect('/search'); }
      res.redirect('/search');
    });
  })
  setTimeout(() => { con.end() }, 100)
})
module.exports = router;
