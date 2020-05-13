
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/myproject';

const GameBuilder = require('./objects/ApiGame.js');

var insertNewGame = function(newGame) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    //console.log("Connected successfully to server");
    
  	var collection = db.collection('calling')
    // collection.remove({})//deletes all the things
    Promise.resolve(collection.count()).then(function(value) {
    //console.log(value); // "Success"
    newGame.slug = value
    //console.log('new game'+newGame.slug)
  	collection.insertMany([newGame], function(err, result) {
    assert.equal(err, null);
    // assert.equal(3, result.result.n);
    // assert.equal(3, result.ops.length);
    //console.log("Inserted game"+JSON.stringify(result.ops));

    //console.log("Inserted game"+JSON.stringify(newGame.slug));
    // callback(result);
    });
    db.close();

    });
  });
}
var showGames = function() {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    //console.log("Connected successfully to server");
    var collection = db.collection('calling')

    collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    //console.log(docs)
    // callback(docs);
    db.close();
  });
  });
}

const getGame = (gameId, callback) => {
  

  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    //console.log("Connected successfully to server");
    var collection = db.collection('calling')

    collection.find({'slug':gameId}).toArray(function(err, docs) {
    assert.equal(err, null);
    //console.log(docs)
    // callback ? callback(docs[0], "Esther","Babylon",0) : null;
    let game = docs[0];
    db.close();
    // //console.log('got game '+game.slug)
    return game
  });
  });
  return null;
  
}

const play = (game, playerName, locationName, cardIndex) =>{
    // let game = gameDB[gameId]

    let player = game.players.find((pl)=>pl.name==playerName)
    let location

    if(locationName != "mill"){
      
      location= game.locations[locationName]
      let response = location.playCard(cardIndex,player)
      return response

    } else{
      //mill card
      //console.log('milling!')
      if(player.mills < 1){
        //console.log('millcard!')
        let cardName = player.hand[cardIndex].name
        player.millCard(cardIndex)
        return 'Milled '+cardName
      }else{
        return 'already milled this turn'
      }
    }

}

const dbTest = async () => {
  
  // let game = GameBuilder.newGame(["Jonah","Esther"])
  // game.setStartingPlayers(game.playerNames);
  // // //console.log('starting first turn')
  // game.startNewTurn();
  // // //console.log('startGame finished and returning')
  // insertNewGame(game)

  getGame(1,play)

  // await play
  // await buy
  // await nextPlayer
  // await refreshMarket


  // await showGames()

}
dbTest();



//usage example of mongo for my starting learning
// Use connect method to connect to the server
// MongoClient.connect(url, function(err, db) {
//   assert.equal(null, err);
//   //console.log("Connected successfully to server");
  
//   updateDocument(db, function() {
    
//     findDocuments(db, function() {
      
//       // removeDocument(db, function() {
//         db.close();
//       });
//     });
//   // });

// });
// var insertDocuments = function(db, callback) {
//   // Get the documents collection
//   var collection = db.collection('documents');
//   // Insert some documents
//   collection.insertMany([
//     {a : 1}, {a : 2}, {a : 3}
//   ], function(err, result) {
//     assert.equal(err, null);
//     assert.equal(3, result.result.n);
//     assert.equal(3, result.ops.length);
//     //console.log("Inserted 3 documents into the collection");
//     callback(result);
//   });
// }
// var findDocuments = function(db, callback) {
//   // Get the documents collection
//   var collection = db.collection('documents');
//   // Find some documents
//   collection.find({'a':3}).toArray(function(err, docs) {
//     assert.equal(err, null);
//     //console.log("Found the following records");
//     //console.log(docs)
//     callback(docs);
//   });
// }
// var updateDocument = function(db, callback) {
//   // Get the documents collection
//   var collection = db.collection('documents');
//   // Update document where a is 2, set b equal to 1
//   collection.updateOne({ a : 2 }
//     , { $set: { b : 1 } }, function(err, result) {
//     assert.equal(err, null);
//     assert.equal(1, result.result.n);
//     //console.log("Updated the document with the field a equal to 2");
//     callback(result);
//   });  
// }
// var removeDocument = function(db, callback) {
//   // Get the documents collection
//   var collection = db.collection('documents');
//   // Delete document where a is 3
//   collection.deleteOne({ a : 3 }, function(err, result) {
//     assert.equal(err, null);
//     assert.equal(1, result.result.n);
//     //console.log("Removed the document with the field a equal to 3");
//     callback(result);
//   });    
// }
// var indexCollection = function(db, callback) {
//   db.collection('documents').createIndex(
//     { "a": 1 },
//       null,
//       function(err, results) {
//         //console.log(results);
//         callback();
//     }
//   );
// };






// const mongo = require('mongodb').MongoClient
// const url = 'mongodb://localhost:27017'
// mongo.connect(url, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   }, (err, client) => {
//   if (err) {
//     console.error(err)
//     return
//   }
//   //...
// })
// const db = client.db('kennel')
// const collection = db.collection('dogs')
// collection.insertOne({name: 'Roger'}, (err, result) => {

// })
// collection.find({name: 'Togo'}).toArray((err, items) => {
//   //console.log(items)
// })
// collection.findOne({name: 'Togo'}, (err, item) => {
//   //console.log(item)
// })
// collection.updateOne({name: 'Togo'}, {'$set': {'name': 'Togo2'}}, (err, item) => {
//   //console.log(item)
// })
// collection.deleteOne({name: 'Togo'}, (err, item) => {
//   //console.log(item)
// })
// collection.find().toArray((err, items) => {
//   //console.log(items)
// })
// client.close()
// collection.insertMany([{name: 'Togo'}, {name: 'Syd'}], (err, result) => {
// })
