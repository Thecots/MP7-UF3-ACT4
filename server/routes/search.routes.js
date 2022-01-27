const express = require("express");
const router = express.Router();
const {checkUser} = require('./../middlewares/auth');

router.get('/search',checkUser, (req, res) => {
  console.log(req.id);
  res.render("gameSearch");
})

module.exports = router;
  