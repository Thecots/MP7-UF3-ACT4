const jwt = require('jsonwebtoken');
const decode = require('jsonwebtoken/decode');

let checkUser = (req, res, next) => {
  jwt.verify(req.cookies.session, process.env.SEED, (err, decoded) => {
    if(err){
        return res.redirect("/signin");
    };
    req.usuari = decoded.username;
    req.id = decoded.id;
    next();
})
};

module.exports = {checkUser}