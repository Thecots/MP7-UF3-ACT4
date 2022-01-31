const jwt = require('jsonwebtoken');
const decode = require('jsonwebtoken/decode');
const mysql = require('mysql2');

const checkUser = (req, res, next) => {
  jwt.verify(req.cookies.session, process.env.SEED, (err, decoded) => {
    if (err) {
      if (req.route.path == '/signin') return next();
      return res.redirect("/signin");
    };
    if (req.route.path == '/signin') return res.redirect("/search");

    req.usuari = decoded.username;
    req.id = decoded.id;
    next();
  })
};

const sqlcon = (req, res) => {
  return mysql.createConnection({
    connectionLimit: 100,
    host: "localhost",
    user: "daw_user",
    password: "P@ssw0rd",
    database: 'connect4'
  });
}

module.exports = { checkUser, sqlcon };