const express = require("express");
const router = express.Router();
const { checkUser, sqlcon } = require('./../middlewares/auth');


/* partida */

router.get('/localgame', checkUser, (req, res) => {
  res.render('gameLocal')
});



module.exports = router;
