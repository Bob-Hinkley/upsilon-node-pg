var router = require('express').Router();
// var router = express.Router();

var pg = require('pg'); //already installed in our dependencies


//assumes DB is running on local host unless specified

//Configuration object in JS, with a piece of data called 'database'
var config = {
  database: 'library'  //as a string
};

//initialized connection Pool, how I connect to database
//constructor take 1 argument, PG Pool is constructor function, new is used
var pool = new pg.Pool(config); //pool is holding a fixed number of databast connections.
// connects to database are used by clients, and then returned when done.


router.get('/', function (req, res) {
  //err - an error object, will be non-null if there was some error
  //      connecting to the DB. ex: DB not running, config incorrect, etc.

  //client - used to make the actual queries to DB

  //done - function to call when we are finished
  //          this will ultimately return the connection back to the pool
  pool.connect(function(err, client, done){
    if (err) {
      console.log('Error connecting to DB: ', err); //always respond to client
      res.sendStatus(500); //represents server error, client can't fix it
      done();
      // return; //return or else statement
    } else {

      //no error yet, so now we make with the queiries
      //.query method used here
      client.query('SELECT * FROM books;', function (err, result){ //'function' is callback, waiting for DB to come back with stuff
      done(); //done with connection pool
      if (err) {
        console.log('Error querying DB', err);
        res.sendStatus(500);
      } else {
        console.log('Got info from DB', result.rows);
        res.send(result.rows);  //.rows coming from DB
      }
    });

  }
})
})

router.post ('/', function(req, res){

  //err - an error object, will be non-null if there was some error
  //      connecting to the DB. ex: DB not running, config incorrect, etc.

  //client - used to make the actual queries to DB

  //done - function to call when we are finished
  //          this will ultimately return the connection back to the pool
  pool.connect(function(err, client, done){
    if (err) {
      console.log('Error connecting to DB: ', err); //always respond to client
      res.sendStatus(500); //represents server error, client can't fix it
      done();
      // return; //return or else statement
    } else {

      //no error yet, so now we make with the queiries
      //.query method used here
      client.query('INSERT INTO books (title, author, publication_date, edition, publisher) VALUES ($1, $2, $3, $4, $5) RETURNING *;', //RETURNING * gives back message of whatever DB just created
      [req.body.title, req.body.author, req.body.published, req.body.edition, req.body.publisher],
      function (err, result){ //'function' is callback, waiting for DB to come back with stuff
      //************* '$'' is place holder, that will be replaced in DB, followed by array containing request body ************
      done(); //done with connection pool
      if (err) {
        console.log('Error querying DB', err);
        res.sendStatus(500);
      } else {
        console.log('Got info from DB', result.rows);
        res.send(result.rows);  //.rows coming from DB
      }
    });
  }
})


})
module.exports = router;  //exporting router object
