var express = require('express');
var app = express();
var handlebars = require("express-handlebars").create({defaultLayout: "main"});
var request = require('request')
var bodyParser = require("body-parser");
/*var helpers = require('handlebars-helpers')(); */


var mysql = require("mysql"); 

var pool = mysql.createPool({
    host: 'classmysql.engr.oregonstate.edu', 
    user: 'cs290_jangkat',
    password: '9163',
    database: 'cs290_jangkat'
});


app.engine("handlebars", handlebars.engine); 
app.set("view engine", 'handlebars');
app.set("port", 1963); 
//app.set("port", 3961); 



app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static("public"));

// Code to make queries were helped by modules: https://canvas.oregonstate.edu/courses/1798811/pages/using-mysql-with-node-dot-js?module_item_id=20252315
// Run a query by calling pool.query(query string, callback), and an error handler 
// Reset table deletes old table and creates a new table 
app.get('/reset-table',function(req,res,next){
    var context = {};
    pool.query("DROP TABLE IF EXISTS workouts", function(err){
      var createString = "CREATE TABLE workouts(" +
      "id INT PRIMARY KEY AUTO_INCREMENT," +
      "name VARCHAR(255) NOT NULL," +
      "reps INT," + 
      "weight INT," +
      "date DATE," +
      "unit BOOLEAN)";
      pool.query(createString, function(err){
        context.results = "Table reset";
        res.render('home',context);
      })
    });
});


// Code to make a post request inserts into the database a new workout using info 
// received from the client-side sent through the request body.  A second query is made to select 
// the entire table and send it back to the client-side
app.post('/',function(req,res,next){
  var context = {};
  console.log(req.body)
  pool.query("INSERT INTO workouts (`name`, `reps`, `weight`, `date`, `unit`) VALUES (?,?,?,?,?)", 
  [req.body.name, req.body.reps, req.body.weight, req.body.date, req.body.unit], function(err, result) {

    pool.query('SELECT * FROM workouts', function(err, rows, field){
      var context = {}
      if(err){
        next(err);
        return;
      }

      context.results = rows
      //context.results = "Inserted id " + result.insertId;
      console.log(context.results)
      res.send(context);
  })});
  
});


// Get request uses a select query to return all the rows and columns to display the entire table
app.get('/',function(req,res,next){
    var context = {};
    pool.query('SELECT * FROM workouts', function(err, rows, field){
        if(err){
            next(err);
            return;
        }
        context.results = rows;
        console.log(context.results);
        res.render('home', context);
    });
});


// Put request selects the row where the entry is supposed to be edited.  If an entry to update 
// the row is provided, then it is used.  If an entry is not provided, then it uses the data 
// of the current selected row 
app.put('/',function(req,res,next){
    var context = {};
    mysql.pool.query("SELECT * FROM todo WHERE id=?", [req.body.id], function(err, result){
      if(err){
        next(err);
        return;
      }

      if(result.length == 1){
        var curVals = result[0];
        mysql.pool.query("UPDATE workouts SET name=?, reps=?, weight=?, date=?, unit=? WHERE id=? ",
          [req.body.name || curVals.name, req.body.reps || curVals.reps, req.body.weight || curVals.weight, req.body.date || curVals.date, req.body.unit || curVals.unit, req.body.id], function(err, result){
            pool.query('SELECT * FROM workouts', function(err, rows, field){
              var context = {}
              if(err){
                next(err);
                return;
              }

              context.results = rows
              //context.results = "Inserted id " + result.insertId;
              console.log(context.results)
              res.send(context);
          });
        });
      }
    });
});





// Delete request deletes the row from the database, and sends back the data of the 
// resulting table in to display it 
app.delete('/', function(req,res,next){
  var context = {}
    pool.query("DELETE FROM workouts WHERE id=?", [req.body.id], function(err, result){
    
      pool.query('SELECT * FROM workouts', function(err, rows, field){
        var context = {}
        if(err){
            next(err);
            return;
        }
        context.results = rows 
        console.log(context.results)
        //console.log("Results" + result.removeId)
        //context.results = "Results" + result.removeId;
        res.send(context);
    })});
});




app.use(function(req, res){                 
	res.status(404);
	res.render("404");
});

app.use(function(err, req, res, next){
	console.log(err.stack);
	res.status(500);
	res.render("500");
});

app.listen(app.get("port"), function(){             
	console.log("Express started on port 1963");
});
