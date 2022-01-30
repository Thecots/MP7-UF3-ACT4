const express = require("express");
const router = express.Router();
const { checkUser, sqlcon } = require('./../middlewares/auth');

/* partida */
router.get('/game', checkUser, (req, res) => {
  const tablero = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ];
  let con = sqlcon();
  con.connect(function (err) {
    if (err) return res.redirect('/game?id=' + req.query.id);
    con.query(`SELECT * FROM partides WHERE id_partida=${req.query.id}`, (err, result) => {
      if (err) return res.redirect('/game?id=' + req.query.id);
      /* turno */
      let title = '';
      if (req.id == result[0].host) {
        if (result[0].torn == 1) {
          title = 'Tu turno';
        } else {
          title = 'Esperando movimiento del rival';
        }
      } else {
        if (result[0].torn == 2) {
          title = 'Tu turno';
        } else {
          title = 'Esperando movimiento del rival';
        }
      }

      con.query(`SELECT * FROM moviments WHERE id_partida=${req.query.id}`, (err, result) => {
        if (err) return res.redirect('/game?id=' + req.query.id);

        result.forEach(n => {
          let q = 5;
          while (q >= 0) {
            if (tablero[q][n.columna_moviment] == 0) {
              tablero[q][n.columna_moviment] = n.jugador;
              q = -1;
            }
            q--;
          }
        });
        res.render('gamePartida', {
          id: req.query.id,
          title,
          tablero
        });
      });
    });
  });


})

router.get('/move', checkUser, (req, res) => {
  let con = sqlcon();
  con.connect(function (err) {
    if (err) return res.redirect('/search');
    con.query(`UPDATE  partides SET torn = IF(torn=1,2,1)  WHERE id_partida=${req.query.id}`, (err, result) => {
      if (err) return res.redirect('/search');

      con.query(`SELECT * FROM partides WHERE id_partida=${req.query.id}`, (err, result) => {
        if (err) return res.redirect('/search');

        con.query(`INSERT INTO moviments VALUES (null,${result[0].torn == 1 ? 2 : 1},${req.query.move},${req.query.id})`, (err, result) => {
          if (err) return res.redirect('/search');
        });
      });
    });
  });
  res.redirect('/game?id=' + req.query.id);
});


module.exports = router;
