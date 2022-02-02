const express = require("express");
const router = express.Router();
const { checkUser, sqlcon } = require('./../middlewares/auth');

/* Word */
router.get('/setWord', checkUser, (req, res) => {
  let con = sqlcon();
  con.connect(function (err) {
    if (err) return res.redirect('/search');
    con.query(`SELECT * FROM partides WHERE id_partida=${req.query.id}`, (err, result) => {
      if (err) {
        console.log(err);
        return res.redirect('/search')
      };

      if (result[0].hostWord != null && result[0].guestWord != null) {
        return res.redirect('/game?id=' + req.query.id);
      }

      let player = req.id == result[0].host ? 'host' : 'guest';
      let state = '';
      if (player == 'host') {
        state = result[0].hostWord == null ? false : true;
      } else {
        state = result[0].guestWord == null ? false : true;
      }

      res.render('gameWord', {
        player,
        state,
        id: req.query.id
      });
      con.end();
    });
  });
})

/* Guardar palabra */
router.get('/setWordSave', checkUser, (req, res) => {
  let con = sqlcon();
  con.connect(function (err) {
    if (err) return res.redirect('/search');
    con.query(`SELECT * FROM partides WHERE id_partida=${req.query.id}`, (err, result) => {
      if (err) return res.redirect('/search');
      if (req.id == result[0].host) {
        con.query(`UPDATE partides SET hostWord = "${req.query.word}" WHERE id_partida=${req.query.id}`, (err, result) => {
          if (err) return res.redirect('/search');
          res.redirect('/setWord?id=' + req.query.id);
          con.end();
        });
      } else {
        con.query(`UPDATE partides SET guestWord = "${req.query.word}" WHERE id_partida=${req.query.id}`, (err, result) => {
          if (err) return console.log(err);
          res.redirect('/setWord?id=' + req.query.id);
          con.end();
        });
      }
    });
  });
})



/* partida */
router.get('/game', checkUser, (req, res) => {
  let player, state, id = req.query.id, hp1, hp2, p1, p2, l1, l2;
  let con = sqlcon();
  con.connect(function (err) {
    if (err) return res.redirect('/search');
    con.query(`SELECT * FROM partides WHERE id_partida=${req.query.id}`, (err, result) => {
      if (err) {
        console.log(err);
        return res.redirect('/search')
      };

      player = req.id == result[0].host ? 1 : 2;
      let win = false;
      if (player == 1) {
        state = result[0].torn != 1 ? 2 : 1;

        hp1 = getLives(result[0].guestWord, result[0].hostLetters.slice(0, result[0].hostLetters.length));
        hp2 = getLives(result[0].hostWord, result[0].guestLetters.slice(0, result[0].guestLetters.length));
        p1 = result[0].hostWord;
        p2 = result[0].guestWord;
        l1 = result[0].hostLetters;
        l2 = result[0].guestLetters;



      } else {
        state = result[0].torn == 1 ? 2 : 1;
        hp2 = getLives(result[0].guestWord, result[0].hostLetters.slice(0, result[0].hostLetters.length));
        hp1 = getLives(result[0].hostWord, result[0].guestLetters.slice(0, result[0].guestLetters.length));

        p2 = result[0].hostWord;
        p1 = result[0].guestWord;
        l2 = result[0].hostLetters;
        l1 = result[0].guestLetters;



      }

      if (hp1 == 0 || checkWinner(p1, l2)) {
        win = 'Has pedido';
        state = 3;
      }

      if (hp2 == 0 || checkWinner(p2, l1)) {
        win = 'Has ganado!'
        state = 3;
      }



      res.render('gamePartida', {
        player,
        state,
        id: req.query.id,
        hp1, hp2,
        p1, p2,
        l1, l2,
        win
      });
      con.end();
    });
  });
})

router.get('/move', checkUser, (req, res) => {
  let con = sqlcon();
  con.connect(function (err) {
    if (err) return res.redirect('/search');
    con.query(`SELECT * FROM partides WHERE id_partida=${req.query.id}`, (err, result) => {
      if (err) return res.redirect('/search');
      if (req.id == result[0].host) {
        con.query(`UPDATE partides SET hostLetters = "${result[0].hostLetters + req.query.letter}", torn = IF(torn=1,2,1) WHERE id_partida=${req.query.id}`, (err, result) => {
          if (err) return res.redirect('/search');
          res.redirect('/setWord?id=' + req.query.id);
          con.end();
        });
      } else {
        con.query(`UPDATE partides SET guestLetters = "${result[0].guestLetters + req.query.letter}", torn = IF(torn=1,2,1) WHERE id_partida=${req.query.id}`, (err, result) => {
          if (err) return console.log(err);
          res.redirect('/setWord?id=' + req.query.id);
          con.end();
        });
      }
    });
  });
});


function getLives(palabraRival, letras) {
  letras = letras.slice(1)
  palabraRival = palabraRival.split('').filter((item, pos) => {
    return palabraRival.indexOf(item) == pos;
  }).join().replace(/,/g, '');
  let x = letras.length;
  for (let i = 0; i < palabraRival.length; i++) {
    if (letras.split('').includes(palabraRival[i])) {
      x -= 1;
    }
  }
  return 7 - x;
}


function checkWinner(palabraRival, letras) {
  letras = letras.slice(1)
  palabraRival = palabraRival.split('').filter((item, pos) => {
    return palabraRival.indexOf(item) == pos;
  }).join().replace(/,/g, '');
  let x = 0;
  for (let i = 0; i < palabraRival.length; i++) {
    if (letras.split('').includes(palabraRival[i])) {
      x += 1;
    }
  }

  return x == palabraRival.length;
}

module.exports = router;
