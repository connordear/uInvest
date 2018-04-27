// Set up
var express  = require('express');
var app = express();                               // create our app w/ express
var mongoose = require('mongoose');                     // mongoose for mongodb
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var cors = require('cors');

var MONGODB_URI = process.env.MONGODB_URI || 'mongodb://heroku_k706z12s:l8kemdsfu33k8p4dtsokenid9v@ds153869.mlab.com:53869/heroku_k706z12s';

// Configuration
mongoose.connect(MONGODB_URI, {
  useMongoClient: true,
});


app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());
app.use(cors());

app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});




// Models
var User = mongoose.model('User', {
  name: String,
  riskProfile: Number,
  interests: [String],
  ownedAssets: [
    {
      symbol: String,
      quantity: Number,
      bookValue: Number
    }
  ]
});

// Routes

    // Get users
    app.get('/api/users', function(req, res) {

        console.log("fetching users");

        // use mongoose to get all Users in the database
        User.find(function(err, users) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                console.log(err)

            res.json(users); // return all Users in JSON format
        });
    });

    // create User and send back all Users after creation
    app.post('/api/users', function(req, res) {

        console.log("creating user");

        // create a User, information comes from request from Ionic
        User.create({
            name: req.body.name,
            riskProfile: req.body.riskProfile,
            interests: req.body.interests,
            ownedAssets: req.body.ownedAssets
        }, function(err, user) {
            if (err)
                res.send(err);

            // get and return all the Users after you create another
            User.find(function(err, users) {
                if (err)
                    res.send(err)
                res.json(users);
            });
        });

    });

    // Update a User, send back the updated User
    app.put('/api/users/:user_id', function(req, res) {
      console.log("Updating user...");
        // Update a user
        User.findById(req.params.user_id, function(err, user) {
          user.name = req.body.name;
          user.riskProfile = req.body.riskProfile;
          user.interests = req.body.interests;
          user.ownedAssets = req.body.ownedAssets;
          user.save(function (err, updatedUser) {
            if (err) {
              res.send(err);
            } else {
              res.send(updatedUser);
            }
          });
        });
    });

    // delete a User
    app.delete('/api/users/:user_id', function(req, res) {
        User.remove({
            _id : req.params.user_id
        }, function(err, User) {
          console.log(err);
          res.json(User);
        });
    });


// listen (start app with node server.js) ======================================
app.listen(8080);
console.log("App listening on port 8080");
