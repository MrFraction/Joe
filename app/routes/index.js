var express = require('express');
var mysql = require('mysql');

var router = express.Router();

var connection = mysql.createConnection({
  host     : '192.168.99.100',
  user     : 'root',
  port     : '3306',
  password : ''
});


router.get('/', function(req, res, next) {
    var ret = {
      "team": "Joe",
      "language": "javascript",
      "db": "mysql"
    }
    res.json(ret)
})

/* GET home page. */
router.get('/api/otaequipment', function(req, res, next) {
  console.log("I AM INSIDE HERE!")

  connection.connect(function(err) {
      if (err) {
      console.error('error connecting: ' + err.stack);
      return;
      }
      else{
        console.log("welcome")
      }

    console.log('connected as id ' + connection.threadId);
    res.json({"hej": "welcome"})
  });

});

module.exports = router;
