const express = require("express");
const router = express.Router();
const {checkUser} = require('./../middlewares/auth');
const mysql = require('mysql');

const getDataBase = () => {
  return mysql.createConnection({
    host: "localhost",
    user: "daw_user",
    password: "P@ssw0rd",
    database: 'connect4'
  });
}

router.get('/search',checkUser, (req, res) => {
  let con = getDataBase();
  con.connect(function (err) {
    if (err) throw res.json({ ok: false });
    res.render("gameSearch",{ok:false});
  });
})

module.exports = router;
  