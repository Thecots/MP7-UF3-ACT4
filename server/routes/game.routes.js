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
  let winner = true
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

      con.query(`SELECT * FROM moviments WHERE id_partida=${req.query.id}`, (err, result2) => {
        if (err) return res.redirect('/game?id=' + req.query.id);

        result2.forEach(n => {
          let q = 5;
          while (q >= 0) {
            if (tablero[q][n.columna_moviment] == 0) {
              tablero[q][n.columna_moviment] = n.jugador;
              q = -1;
            }
            q--;
          }
        });

        tablero.forEach(n => {
          n.forEach(g => {
            if (g == 0) {
              winner = 'nadie'
            }
          })
        })

        if (winner != 'nadie') {
          title = 'has pedido'
        }

        if (checkWinner(tablero)) {
          if (checkWinner(tablero) == 'host') {
            if (result[0].host == req.id) {
              title = 'Has ganado'
            } else {
              title = 'Has perdido'
            }
          } else {
            if (result[0].host != req.id) {
              title = 'Has ganado'
            } else {
              title = 'Has perdido'
            }
          }
          winner = true;
        }


        con.end();
        res.render('gamePartida', {
          id: req.query.id,
          title,
          tablero,
          winner
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
          res.redirect('/game?id=' + req.query.id);
          con.end();
        });
        ;
      });
    });
  });
});


function checkWinner(game) {
  /* Horizonta jugador 1 */
  for (let i = 0; i < 6; i++) {
    let x = 0;
    for (let g = 0; g < 6; g++) {
      if (game[i][g] == 1) {
        x++;
        if (x == 4) {
          return 'host';
        }
      } else {
        x = 0;
      }
    }
  }
  /* Horizonta jugador 2 */
  for (let i = 0; i < 6; i++) {
    let x = 0;
    for (let g = 0; g < 6; g++) {
      if (game[i][g] == 2) {
        x++;
        if (x == 4) {
          return 'guest';
        }
      } else {
        x = 0;
      }
    }
  }
  /* Vertical jugador 1 */
  for (let i = 0; i < 7; i++) {
    let x = 0;
    for (let g = 0; g < 6; g++) {
      if (game[g][i] == 1) {
        x++;
        if (x == 4) {
          return 'host';
        }
      } else {
        x = 0;
      }
    }
  }
  /* Vertical jugador 2 */
  for (let i = 0; i < 7; i++) {
    let x = 0;
    for (let g = 0; g < 6; g++) {
      if (game[g][i] == 2) {
        x++;
        if (x == 4) {
          return 'guest';
        }
      } else {
        x = 0;
      }
    }
  }
  // Diagonal (\) jugador 1
  for (i = -3; i < 3; i++) {
    let x = 0;
    for (g = 0; g < 7; g++) {
      if (i + g >= 0 && i + g < 6 && g >= 0 && g < 7) {
        if (game[i + g][g] == 1) {
          x++;
          if (x >= 4) return 'host';
        } else {
          x = 0;
        }
      }
    }
  }
  // Diagonal (\) jugador 2
  for (i = -3; i < 3; i++) {
    let x = 0;
    for (g = 0; g < 7; g++) {
      if (i + g >= 0 && i + g < 6 && g >= 0 && g < 7) {
        if (game[i + g][g] == 2) {
          x++;
          if (x >= 4) return 'guest';
        } else {
          x = 0;
        }
      }
    }
  }
  // Diagonal (/) jugador 1
  for (i = 3; i < 8; i++) {
    let x = 0;
    for (g = 0; g < 7; g++) {
      if (i - g >= 0 && i - g < 6 && g >= 0 && g < 7) {
        if (game[i - g][g] == 1) {
          x++;
          if (x >= 4) return 'host';
        } else {
          x = 0;
        }
      }
    }
  }
  // Diagonal (/) jugador 2
  for (i = 3; i < 8; i++) {
    let x = 0;
    for (g = 0; g < 7; g++) {
      if (i - g >= 0 && i - g < 6 && g >= 0 && g < 7) {
        if (game[i - g][g] == 2) {
          x++;
          if (x >= 4) return 'guest';
        } else {
          x = 0;
        }
      }
    }
  }
  return false;
}

module.exports = router;
