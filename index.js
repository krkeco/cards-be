const express = require('express');
const app = express();
var cors = require("cors");
app.use(cors());

var bodyParser     =        require("body-parser");
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const api = require('./objects/ApiGame.js');

app.get('/', function (req, res) {
 return res.json('Hello world');
});

//non permanent data structure 0.0
let gameId = 0;
let games = []

//start new game
app.get('/game', function (req, res) {
	console.log('new game!'+res)
	let players = ['Jonah','Esther']
	let game = api.newGame(players)
	game.startNewTurn();
	gameId++;
	games[gameId] = game
  return res.json({id:gameId});
});

//get starting game info
app.get('/game/:id',function(req,res) {
	console.log('getting game '+req.params.id)
	let gameId = req.params.id
	let game = games[gameId]
	let locInfo = game.getLocationInfo()
	let playerInfo = game.getPlayerInfo()
	// console.log(game.players[0])
	return res.json({locations: locInfo, players: playerInfo})
});

//get
//play
app.post('/game/:id/play',function(req,res) {
	console.log('getting buy '+req.params.id)
	let gameId = req.params.id
	let game = games[gameId]
	console.log('buyreq:'+JSON.stringify(req.body))
	let player = game.players.find((pl)=>pl.name==req.body.player)
	console.log('found player:'+player.name)
	let location = game.locations[req.body.location.toLowerCase()]
	console.log('found location'+location.name)
	// let card = player.hand.findIndex((card)=> card.name == req.body.cardname)
	// game.locations[req.body.location.name].buy(req.body.index,player)
	location.playCard(req.body.cardname,player)
	// let response = req.json();

	let locInfo = game.getLocationInfo()
	let playerInfo = game.getPlayerInfo()
	// console.log(game.players[0])
	return res.json({locations: locInfo, players: playerInfo})
});

//buy
app.post('/game/:id/buy',function(req,res) {
	console.log('getting buy '+req.params.id)
	let gameId = req.params.id
	let game = games[gameId]
	console.log('buyreq:'+JSON.stringify(req.body))
	let player = game.players.find((pl)=>pl.name==req.body.player)
	console.log('found player:'+player.name)
	let location = game.locations[req.body.location.name.toLowerCase()]
	console.log('found location'+location.name)
	// game.locations[req.body.location.name].buy(req.body.index,player)
	location.buy(req.body.index,player)
	// let response = req.json();

	let locInfo = game.getLocationInfo()
	let playerInfo = game.getPlayerInfo()
	// console.log(game.players[0])
	return res.json({locations: locInfo, players: playerInfo})
});

app.get('/game/:id/:player',function(req,res) {
	console.log('getting player for game '+req.params.id)
	let game = games[req.params.id]
	let playerNumber = req.params.player
	if(playerNumber >= game.players.length){
		playerNumber = 0;
	}
	game.players[playerNumber].drawCards(5)
	console.log('got player:'+playerNumber)


	// let player = game.players[playerNumber]
	return res.json()
});



// const pl = require('./objects/Player.js');
// const loc = require('./objects/Location.js');
// const tu = require('./objects/Turn.js')
// const cards = require('./objects/CardData.js')
// const deckData = new cards.data();

// const sim = require('./objects/Simulation.js');
// let simulation = new sim.Series(100);

// const playerTest = require('./objects/Player.js.test')
// playerTest.test();

app.listen(process.env.PORT || 8080);

