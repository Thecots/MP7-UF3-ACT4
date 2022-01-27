const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

router.get('/signin',(req, res) => {
  res.render("signin", {
    signin: true
  });
})

router.post('/signin', (req, res) => {
  let token = jwt.sign(
    {
      username: req.body.username,
      id: uuidv4()
    },
    process.env.SEED,
    {
      expiresIn: process.env.CADUCITAT_TOKEN,
    }
  );

  res.status(200).json({ok: true, token})
})


module.exports = router;
  