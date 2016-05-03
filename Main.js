var express = require('express');
var app = express();
var mongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/notesDB';

app.listen(8081);

app.get('/', function(req, res){
    res.send('Hello to Note API runninng on http://146.185.150.81:8081/');
});

app.get('/addNote', function(req, res){
	var newNote =  {
        'name' : req.query.name,
        'body' : req.query.body
   	};

   	var insertNote = function(db, callback) {
   		db.collection('notes').insertOne( newNote, 
   			function(err, result) {
		    	assert.equal(err, null);
		    	console.log("Inserted a user into the users collection.");
		    	callback();
	  		});
	};
	
	mongoClient.connect(url, function(err, db) {
  		assert.equal(null, err);
  		insertNote(db, function() {
		    res.set('Content-Type', 'application/json');
		     if(!err){
	         	console.log(err);
    			res.json({"status_code" : "200"});
	         }
	         else {
    			res.json({"status_code" : "101"});
	         }      		
	         db.close();
  		});
	});
});

app.get('/getNotes', function(req, res){

	var findRestaurants = function(db, callback) {
	   var cursor = db.collection('notes').find();
	   var jsonString= '[';
	   cursor.each(function(err, doc) {
	      assert.equal(err, null);
	      if (doc != null) {
	         console.log(doc);
	         jsonString += (JSON.stringify(doc) + ',');
	      } else {
	      	 jsonString =  jsonString.substring(0, jsonString.length - 1);
	      	 if(jsonString.length > 0)
	      	 	jsonString += ']';
	         callback(jsonString);
	         console.log ("Callback: " +jsonString)
	      }
	   })
	};
	
	mongoClient.connect(url, function(err, db) {
  		assert.equal(null, err);
  		findRestaurants(db, function(jsonString) {
      		db.close();
      		res.set('Content-Type', 'application/json');
    		res.send(jsonString);
  		});
	});
});

app.get('/deleteNote', function(req, res){
	
	var id = req.query.id;
	var removeNote = function(db, callback) {
		var deleteObject=  { "_id": ObjectId(id)};
	   	db.collection('notes').deleteOne(
	     deleteObject,
	      function(err, results) {
	         callback();

			res.set('Content-Type', 'application/json');
	         if(!err){
	         	console.log(err);
	         	console.log(deleteObject);
    			res.json({"status_code" : "200"});
	         }
	         else {
    			res.json({"status_code" : "101"});
	         }
	      }
	    );
	};

	mongoClient.connect(url, function(err, db) {
	  	assert.equal(null, err);
	  	removeNote(db, function() {
	     db.close();
	  	});
	});
});

app.get('/updateNote', function(req, res){
	var id = req.query.id;

	var updateNote = function(db, callback) {
	   db.collection('notes').updateOne(
	      { "_id" : ObjectId(id) } ,
	      { $set: { "name": req.query.name , "body": req.query.body } }, 
	      	function(err, results) {
	      		res.set('Content-Type', 'application/json');
	         	if(!err){
	         		console.log(err);
    				res.json({"status_code" : "200"});
	         	} else {
    				res.json({"status_code" : "101"});
	        	}
	      		callback();
	   		});
	};

	mongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		updateNote(db, function() {
			db.close();
		});
	});
});

app.get('/register', function(req, res){
	console.log('register method \n');
	res.set('Content-Type', 'application/json');
	var userName = req.query.username;
	var password = req.query.password;
	var alreadyInserted = false;
	var findUser = function(db, callback) {
	   	var cursor = db.collection('users').find( { "username" : userName });
	   	cursor.each(function(err, doc) {
	   		assert.equal(err, null);
		      if (doc == null) {
		      	if (!alreadyInserted)
		         	callback();
		      } else {
		      	console.log();	
		      	alreadyInserted = true;
		        res.json({"status_code" : "101"});
		      }
	 	});
    };

   var insertUser = function(db, callback) {
   		db.collection('users').insertOne( {
   			"username" : userName,
   			"password" : password
   		}, 
   		function(err, result) {
		    assert.equal(err, null);
		    console.log("Inserted a user into the users collection.");
		    callback(result);
	  	});
	};

   	mongoClient.connect(url, function(err, db) {
	  	assert.equal(null, err);
	  	findUser(db, function(exists) {
			console.log();
		  	insertUser	(db, function(result) {
				if(!err){
			    	res.json({"status_code" : "200", '_id' : result.ops[0]._id});
				}
				else {
			    	res.json({"status_code" : "101"});
				}  
		  		db.close();
	  			});
  		});
	});
});

app.get('/getUsers', function(req, res){

	var findRestaurants = function(db, callback) {
	   var cursor = db.collection('users').find();
	   var jsonString= '[';
	   cursor.each(function(err, doc) {
	      assert.equal(err, null);
	      if (doc != null) {
	         console.log(doc);
	         jsonString += (JSON.stringify(doc) + ',');
	      } else {
	      	 jsonString =  jsonString.substring(0, jsonString.length - 1);
	      	 if(jsonString.length > 0)
	      	 	jsonString += ']';
	         callback(jsonString);
	         console.log ("Callback: " +jsonString)
	      }
	   })
	};
	
	mongoClient.connect(url, function(err, db) {
  		assert.equal(null, err);
  		findRestaurants(db, function(jsonString) {
      		db.close();
      		res.set('Content-Type', 'application/json');
    		res.send(jsonString);
  		});
	});
});

app.get('/deleteUser', function(req, res){
	
	var name = req.query.name;
	var removeUser = function(db, callback) {
		var deleteObject=  { "username": name};
	   	db.collection('users').deleteOne(
	     deleteObject,
	      function(err, results) {
	         callback();

			res.set('Content-Type', 'application/json');
	         if(!err){
	         	console.log(err);
	         	console.log(deleteObject);
    			res.json({"status_code" : "200"});
	         }
	         else {
    			res.json({"status_code" : "101"});
	         }
	      }
	    );
	};

	mongoClient.connect(url, function(err, db) {
	  	assert.equal(null, err);
	  	removeUser(db, function() {
	     db.close();
	  	});
	});
});

console.log('Server running at http://146.185.150.81:8081/');


