const express = require("express");
const router = express.Router();
const { checkUser, sqlcon } = require('./../middlewares/auth');

/* unirse a partida */
router.get('/join', checkUser, (req, res) => {
  let con = sqlcon();
  con.connect(function (err) {
    if (err) return res.redirect('/search');
    con.query(`UPDATE partides SET guest='${req.id}', torn=1`, (err, result) => {
      if (err) return res.redirect('/search');
      res.redirect('/game?id=' + req.query.id);
      con.end();
    });
    con.end();
  });
})

module.exports = router;
