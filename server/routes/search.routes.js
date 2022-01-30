const express = require("express");
const router = express.Router();
const { checkUser, sqlcon } = require('./../middlewares/auth');

let vv = 0;
router.get('/search', checkUser, (req, res) => {
  vv += 1;
  console.log(vv);

  try {
    let con = sqlcon();
    con.connect(function (err) {
      if (err) return res.render('gameSearch', { ok: false });
      con.query("SELECT * FROM partides WHERE ISNULL(guest)", function (err, result, fields) {
        if (err) return res.render('gameSearch', { ok: false });
        if (result.length === 0) {
          return res.render('gameSearch', { ok: false })
        }
        const games = [];
        result.forEach(n => {
          if (req.id != n.host) {
            games.push({
              id: n.id_partida,
              player: n.player,
              data: n.data,
            });
          }
        });
        res.render('gameSearch', { ok: true, games })
      });
    });
  } catch (error) {
    console.log('error reror ero');
  }
});

module.exports = router;
