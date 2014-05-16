var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Home', name: req.cookies.name });
});

router.get('/sign_in', function(req, res) {
  res.render('sign_in', { title: 'Sign In' });
});

router.post('/sign_in', function(req, res) {
  var userName = req.body.userName;
  if (userName) {
    res.cookie('name', userName);
    res.redirect('/');
  } else {
    res.redirect('/sign_in');
  }
});

router.get('/sign_out', function(req, res) {
  res.clearCookie('name');
  res.redirect('sign_in');
});


module.exports = router;
