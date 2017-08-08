var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var uri = "mongodb://trustuslife:india123@ourbackend-shard-00-00-rcuwr.mongodb.net:27017,ourbackend-shard-00-01-rcuwr.mongodb.net:27017,ourbackend-shard-00-02-rcuwr.mongodb.net:27017/UserInfo?ssl=true&replicaSet=OurBackend-shard-0&authSource=admin";
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET Hello World page. */
router.get('/helloworld', function(req, res) {
    res.render('helloworld', { title: 'Hello, World!' });
});

/* GET New Info page. */
router.get('/newinfo', function(req, res) {
    res.render('newinfo', { title: 'Add New User' });
});

/* GET information page. */
 router.get('/information', function(req, res) {
/*const stitch = require("mongodb-stitch")
const client = new stitch.StitchClient('accinfo-flftv');
const db = client.service('mongodb', 'mongodb-atlas').db('Info');
client.login().then(() =>
  db.collection('Info').find({},{})
).then(docs => {
	res.render('information', {
            "information" : docs
        });
  console.log("Found docs", docs)
  console.log("[MongoDB Stitch] Connected to Stitch")
}).catch(err => {
  console.error(err)
}); */
	MongoClient.connect(uri, function(err, db) {
		//var db = req.db;
		//var collection = db.get('Info');
		db.collection('Info').find({},{},function(e,docs){
			res.render('information', {
				"information" : docs
			}); 
		}); 
	});
 });

/* POST to Add User Service */
router.post('/addinfo', function(req, res) {
const stitch = require("mongodb-stitch")
const client = new stitch.StitchClient('accinfo-flftv');
const db = client.service('mongodb', 'mongodb-atlas').db('UserInfo');
client.login().then(() =>
  db.collection('Info').updateOne({owner_id: client.authedId()}, {$set:{number:42}}, {upsert:true})
).then(() =>
  db.collection('Info').find({owner_id: client.authedId()})
).then(docs => {
	res.render('information', {
            "information" : docs
        });
  console.log("Found docs", docs)
  console.log("[MongoDB Stitch] Connected to Stitch")
}).catch(err => {
  console.error(err)
});
    // Set our internal DB variable
    var deb = req.db;

    // Get our form values. These rely on the "name" attributes
    var website = req.body.website;
	var userName = req.body.username;
    var passwd = req.body.passwd;

    // Set our collection
    //var collection = db.get('Info');

    // Submit to the DB
    db.collection('Info').insert({
        "website" : website,
		"username" : userName,
        "password" : passwd
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // And forward to success page
            res.redirect("information");
        }
    });
});

module.exports = router;
