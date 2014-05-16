var express = require('express');
var router = express.Router();

var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('database.sqlite3');

/* GET games listing */
router.get('/', function(req, res) {

  var games = [];
  db.each("SELECT * FROM games", function(err, row) {
    if (err) {
      console.log(err);
    } else {
      games.push(row);
    }
  });

  console.log("games:", games);

  res.render('game_list', { title: 'Games', games: games });
});

router.get('/new', function(req, res) {

  db.run("INSERT INTO games (xName) VALUES (?)", req.cookies.name, function(err) {
    if (err) throw err;

    res.redirect('/games/' + this.lastID);
  });

});

router.get('/:id', function(req, res) {
  var gameId = req.params.id;

  db.get("SELECT * FROM games WHERE id = ?", gameId, function(err, row) {
    if (err) throw err;

    var myName = req.cookies.name;

    if (row.xName != myName && !row.oName) {
      row.oName = myName;
      db.run("UPDATE games SET oName = ? WHERE id = ?", myName, gameId, function (err) {
        if (err) {
          console.log(err);
        }
      });
    }

    res.render('game', {
      title: 'Playing Game',
      xName: row.xName,
      oName: row.oName
    });
  });

});

module.exports = router;
