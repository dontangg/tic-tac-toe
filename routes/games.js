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
    if (!row) {
      res.status(404).send('Not found');
      return;
    }

    var myName = req.cookies.name;

    if (row.xName != myName && !row.oName) {
      row.oName = myName;
      db.run("UPDATE games SET oName = ? WHERE id = ?", myName, gameId, function (err) {
        if (err) {
          console.log(err);
        }
      });
    }

    var gameData = row.data ? JSON.parse(row.data) : [];

    var count = 0;
    // TODO: Can I use underscore for this?
    for (var i = 0; i < gameData.length; i++) {
      if (gameData[i]) count++;
    }

    
    var yourTurn = false;
    
    if (row.xName == myName)
      yourTurn = count % 2 == 0;
    else if (row.oName == myName)
      yourTurn = count % 2 == 1;

    res.render('game', {
      title: 'Playing Game',
      xName: row.xName,
      oName: row.oName,
      yourTurn: yourTurn,
      p0: gameData[0],
      p1: gameData[1],
      p2: gameData[2],
      p3: gameData[3],
      p4: gameData[4],
      p5: gameData[5],
      p6: gameData[6],
      p7: gameData[7],
      p8: gameData[8],
    });
  });

});

module.exports = router;
