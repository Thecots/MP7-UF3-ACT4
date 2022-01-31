const express = require("express");
const router = express.Router();
const { checkUser, sqlcon } = require('./../middlewares/auth');

/* crear partida */
router.get('/createLocal', checkUser, (req, res) => {
  let con = sqlcon();
  con.connect(function (err) {
    if (err) return res.redirect('/search');
    let d = new Date();
    con.query(`INSERT INTO partides VALUES (null,'${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}','${req.id}','IA',1,NULL,'${req.usuari}')`, (err, result) => {
      if (err) return res.redirect('/search');
      res.redirect('/localgame?id=' + result.insertId);
      con.end();
    });
    con.end();
  });
})

/* partida */

router.get('/localgame', checkUser, (req, res) => {
  res.render('gameLocal')
});



module.exports = router;
