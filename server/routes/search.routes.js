const express = require("express");
const router = express.Router();
const { checkUser, sqlcon } = require('./../middlewares/auth');

router.get('/search', checkUser, (req, res) => {
  let con = sqlcon();
  con.connect(function (err) {
    if (err) {
      console.log(err);
      console.log('---------------------------');
      return res.render('gameSearch', { ok: false });
    }
    con.query("SELECT * FROM partides WHERE ISNULL(guest)", function (err, result, fields) {
      if (err) return res.render('gameSearch', { ok: false });
      if (result.length === 0) {
        return res.render('gameSearch', { ok: false, username: req.usuari })
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
      res.render('gameSearch', { ok: true, games, username: req.usuari })
      con.end();
    });
    con.end();
  });
});

module.exports = router;
