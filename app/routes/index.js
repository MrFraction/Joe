var express = require('express');
var mysql = require('mysql');

var router = express.Router();

var connection = mysql.createConnection({
  host     : 'my-db',
  user     : 'root',
  port     : '3306',
  password : '',
  database : 'Joe'
});

router.get('/', function(req, res, next) {
    var ret = {
      "team": "Joe",
      "language": "javascript",
      "db": "mysql"
    }
    res.json(ret)
})

var sqlcallback = function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
}

/* GET home page. */
router
.get('/api/otaequipment', function(req, res, next) {
  var query = "SELECT * FROM ota;"
    connection.query(query, function(err, rows, fields) {
      if (err) {
        console.error(err);
      }

      res.json(rows);
    })
  })
  .post('/api/otaequipment', function(req, res, next) {
    var eq = req.body;
    var query = "INSERT into ota (name, description) VALUES (?, ?);"
    connection.query(query, [eq.ota, eq.description], function(err, rows, fields) {
      if (err) {
        console.error(err);
      }

      res.json({"id": rows.insertId});
    })
  })
  .get('/api/action', function(req, res, next) {
    var query = "SELECT * FROM action;"
    connection.query(query, function(err, rows, fields) {
      if (err) {
        console.error(err);
      }

      res.json(rows);

    })
  })
  .post('/api/action', function(req, res, next) {
    var ac = req.body
    var dd = ac.date
    var checkDate = new Date(dd)
    if(checkDate.toString() == "Invalid Date") {
      res.json({"error": "Invalid values"})
      return;
    } else {
      var dateString = checkDate.toISOString().substring(0, 10)
      if(dateString != dd) {
        res.json({"error": "Invalid values"})
        return;
      }
    }
    var doOtaExistQuery = "SELECT id FROM ota where name = ? LIMIT 1"
    connection.query(doOtaExistQuery, [ac.ota], function(err, rows, fields) {
      if(rows.length == 0 ) {
        // throw err
        res.json({"error": "OTA code not in our database"})
        return;
      }

      var query = "INSERT into action (ota, pickup, booking_date) VALUES (?, ?, ?);"
      connection.query(query, [ac.ota, ac.plo, ac.date], function(err, rows, fields) {
        if (err) {
          console.error(err);
        }

        res.json({"id": rows.insertId});
      })
    });


  })
  .get('/api/recommend/:year/:month', function(req, res, next) {
    var almostDate = req.params.year+"-"+req.params.month;

    if (!(/^\d{4}-\d{2}$/.test(almostDate))) {
      res.json({"error": "Invalid values"})
      return;
    }

    var query = "SELECT count(*) as count, ota FROM action where booking_date >= ? AND booking_date <= ? GROUP BY ota LIMIT 5";
    connection.query(query, [almostDate, almostDate + '-9'], function(err, rows, fields) {
      if (err) {
        console.error(err);
      }

      res.json(rows);
    })

  })

module.exports = router;
