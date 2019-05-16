//jshint esversion:8

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.json({
  extended: true
}));

app.use(express.static("public"));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PATCH, LINK");
  next();
});

mongoose.set('runValidators', true);

mongoose.connect("mongodb://localhost:27017/danfossDB", {
  useCreateIndex: true,
  useNewUrlParser: true
});

var Schema = mongoose.Schema;

const houseSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true
  },
  company: String
});

const House = mongoose.model('House', houseSchema);

const meterSchema = new mongoose.Schema({
  house: houseSchema,
  factoryNumber: {
    type: String,
    maxlength: 15
  },
  indication: {
    type: Number,
    min: 1,
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} must be positive whole number.'
    }
  }
});

const Meter = mongoose.model('Meter', meterSchema);

//Find house with most water consumed
app.get("/houses/mostConsumed",async function(req, res) {
  await Meter.aggregate([{
      $unwind: "$house"
    },
    {
      $group: {
        _id: "$house.address",
        indication: {
          $sum: "$indication"
        }
      }
    },
    {
      $sort: {
        indication: -1
      }
    },
    {
      $limit: 1
    }
  ], function(err, result) {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

//Find house with least water consumed
app.get("/houses/leastConsumed",async function(req, res) {
  await Meter.aggregate([{
      $unwind: "$house"
    },
    {
      $group: {
        _id: "$house.address",
        indication: {
          $sum: "$indication"
        }
      }
    },
    {
      $sort: {
        indication: 1
      }
    },
    {
      $limit: 1
    }
  ], function(err, result) {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

//Requests targeting houses
app.route("/houses")
  //Get all houses
  .get(function(req, res) {
      House.find(function(err, foundHouses) {
      if (err) {
        res.send(err);
      } else {
        res.send(foundHouses);
      }
    });
  })

  //Add new house
  .post(function(req, res) {
    unique(House, 'address', req.body.address)
    .then(response => {
      if(response)
        return res.send(JSON.stringify({msg: "House with such name already exists."}));

      const newHouse = new House({
         address: req.body.address,
         company: req.body.company
       });
       newHouse.save(function(err) {
         if (!err) {
           res.send(JSON.stringify({msg: "Successfully added a new house."}));
         } else {
           res.send(JSON.stringify({msg: "House with such name already exists."}));
         }
       });
    });
  });

//Requests targeting single house
app.route("/houses/:houseID")
  //Get house by its ID
  .get(function(req, res) {
    House.findOne({
      _id: req.params.houseID
    }, function(err, foundHouse) {
      if (foundHouse) {
        res.send(foundHouse);
      } else {
        res.send(JSON.stringify({msg: "No house with such ID"}));
      }
    });
  })
  //Delete house by its ID
  .delete(function(req, res) {
    House.deleteOne({
        _id: req.params.houseID
      },
      function(err, result) {
        if (err || result.deletedCount === 0) {
          res.send(JSON.stringify({msg: "No house with such ID"}));
        } else {
          res.send(JSON.stringify({msg: "House deleted!"}));
        }
      }
    );
  })
  //Change house address or company
  .patch(function(req, res) {
    House.updateOne({
        _id: req.params.houseID
      }, {
        $set: req.body
      },
      function(err, result) {
        if (err || result.n === 0) {
          res.send(JSON.stringify({msg: "No house with such ID"}));
        } else {
          res.send(JSON.stringify({msg: "House updated!"}));
        }
      }
    );
  })
  //Get all meters assigned to one house
  .link(function(req, res) {
    if (req.params.houseID) {
      House.findOne({
        _id: req.params.houseID
      }, function(err, foundHouse) {
        if (err || foundHouse === null) {
          res.send(JSON.stringify({msg: "No house with such ID."}));
        } else {
          Meter.find({
            'house._id': foundHouse._id
          }, function(err, foundMeters) {
            if (err) {
              res.send(err);
            } else {
              if (foundMeters.length > 0) {
                res.send(foundMeters);
              } else {
                res.send(JSON.stringify({msg: "This house does not have any meters"}));
              }
            }
          });
        }
      });
    } else {
      res.send(JSON.stringify({msg: "Please specifie houseID"}));
    }
  });

app.route("/meters")
  //Adding new meter with or without house. Has to be a better way?!
  .post(function(req, res) {
    if (req.body.houseID) {
      House.findOne({
        _id: req.body.houseID
      }, function(err, foundHouse) {
        if (err || foundHouse === null) {
          res.send(JSON.stringify({msg: "No House with such ID"}));
        } else {
          const newMeter = new Meter({
            house: foundHouse,
            factoryNumber: req.body.factoryNumber,
            indication: req.body.indication
          });

          newMeter.save(function(err) {
            if (err) {
              res.send(JSON.stringify({msg: "Please check your input! Meter Factory number cant be over 15 characters and Meter Indication has to be a Counting Number!"}));
            } else {
              res.send(JSON.stringify({msg: "Successfully added a new meter, with house."}));
            }
          });
        }
      });
    } else {
      const newMeter = new Meter({
        factoryNumber: req.body.factoryNumber,
        indication: req.body.indication
      });

      newMeter.save(function(err) {
        if (err) {
          res.send(JSON.stringify({msg: "Please check your input! Meter Factory number cant be over 15 characters and Meter Indication has to be a Counting Number!"}));
        } else {
          res.send(JSON.stringify({msg: "Successfully added a new meter, without house."}));
        }
      });
    }
  })
  //Embed meter to house
  .patch(function(req, res) {
    if (req.body.meterID && req.body.houseID) {
      House.findOne({
        _id: req.body.houseID
      }, function(err, foundHouse) {
        if (err || foundHouse === null) {
          res.send(JSON.stringify({msg: "No House with such ID"}));
        } else {
          Meter.updateOne({
              _id: req.body.meterID
            }, {
              house: foundHouse
            },
            function(err, result) {
              if (!err && result.n !== 0) {
                console.log(result.n);
                res.send(JSON.stringify({msg: "Meter registered to House"}));
              } else {
                res.send(JSON.stringify({msg: "No Meter with such ID!"}));
              }
            }
          );
        }
      });
    } else {
      res.send("houseID and meterID must be assigned.");
    }
  });

app.route("/meters/:meterID")
  //Insert indication into existing meter
  .patch(function(req, res) {
    if (req.params.meterID && req.body.meterIndication) {
      Meter.findOne({
        _id: req.params.meterID
      }, function(err, foundMeter) {
        if (err || foundMeter === null) {
          res.send(JSON.stringify({msg: "No Meter with such ID"}));
        } else {
          Meter.updateOne({
            _id: foundMeter._id
          }, {
            indication: req.body.meterIndication
          }, function(err) {
            if (err) {
              res.send(JSON.stringify({msg: "Indication must be a counting number!"}));
            } else {
              res.send(JSON.stringify({msg: "Indication updated!"}));
            }
          });
        }
      });
    } else {
      res.send("meteID and meter Indication must be assigned.");
    }
  });

  const unique = function(collection, parameter, field){
      return new Promise((resolve, reject) => {
         var result = collection.findOne({
           [parameter]: field
         }, function(err, item){

        });

        resolve(result);
       });
    };


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
