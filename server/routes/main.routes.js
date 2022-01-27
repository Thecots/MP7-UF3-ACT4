const express = require("express");
const router = express.Router();
const path = require('path');

router.use(require('./signin.routes'));
router.use(require('./search.routes'));


router.get('/', (req, res) => {
  res.redirect("/signin");
})

/* 404 */
router.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/html/404/404.html'));
});

module.exports = router;
