const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');

// var mongo = require('./mongodb.js')

const GameBuilder = require('./objects/ApiGame.js');
var gameDB = [] //this is going to be mongo some day
	// let players = ['Jonah','Esther']
	// let game = GameBuilder.newGame(players)
	// game.startNewTurn();
	
	// let gameId = gameDB.length
	// gameDB[gameId] = game

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
	type Card {
		name:String,
	  quantity: Int,
	  cost: Int,
	  gold:Int,
	  influence:Int,
	  abilities:[String],
	  draw: Int,
	  faith:Int,
	  fear: Int,
	  politics: Float,
	  reinforce: Int,
},

type Player {	
	name: String,
	firstPlayer: Boolean,
	type: String,
	deck: [Card],
	discard: [Card],
	hand: [Card],
			
},
type Location {	
	name: String,
	influence: Int,
	info: [String],
	abilities: [String],
	influencer: String,
	market: [Card],
	battlefield: [Battlefield]
	proselytized: Boolean,
	hardened:Int,
	wounds: Int,
	weariness: Int,
			
},
type Battlefield {
	name: String,
	influence: Int,
	gold: Int,
	cards: [Card]
},
type TurnInfo {
	turn: Int,
	nextPlayer: Int,
	winner: String
},
type WaitingRoom {
	room: [String],
	started: Boolean
},
  type Query {
    waitingRoom(gameId: Int): WaitingRoom,
    newGame(players: [String], types: [String]): Int!,
    joinGame(players: [String],gameId: Int): [String]!,
    startGame(gameId: Int): String,
    players(gameId: Int): [Player],
    locations(gameId: Int): [Location],
    play(gameId: Int, playerName: String, locationName: String, cardIndex: Int): String,
    buy(gameId: Int, playerName: String, locationName: String, cardIndex: Int): String,
    nextPlayer(gameId: Int, currentPlayer: Int): TurnInfo,
    currentPlayer(gameId: Int): TurnInfo,
    refreshMarket(gameId: Int, playerName: String, locationName: String): String,
  }`);

// The root provides a resolver function for each API endpoint
var root = {
	waitingRoom: ({gameId})=>{
		let game = gameDB[gameId];
		let started = true
		if(!game.players || game.players.length <= 0){
			started = false;
		}
		return {room: game.playerNames, started: started};
	},
  currentPlayer: ({gameId})=>{
  	console.log('currentplayer for '+gameId)
  	let game = gameDB[gameId]
  	// console.log('game found?'+game.locations[0].name)
  	let player = game.getCurrentPlayer();
  	console.log('current player found? '+player+"winner:"+game.winner)
  	return {turn: game.turn,nextPlayer:player, winner: game.winner}
  	// return player
  },
  newGame: ({players, types})=>{
  	console.log('players are:'+JSON.stringify(players))
  		// let players = ['Jonah','Esther']
			let game = new GameBuilder.newGame(players, types)
			let gameId = gameDB.length
			gameDB[gameId] = game
		  return gameId
  },

  joinGame: ({players, gameId})=>{
  	console.log('new players are:'+JSON.stringify(players))
  	let game = gameDB[gameId]
  	if(!game || game.turn <2){
  		let newPlayerList = [...game.playerNames,...players]
  		game.playerNames = newPlayerList;
  		return newPlayerList
  	}else{
  		return 'this game is not available any more'
  	}
  },
  startGame: ({gameId})=>{
  		let game = gameDB[gameId]
  		game.setStartingPlayers(game.playerNames);
  		console.log('starting first turn')
			game.startNewTurn();
			console.log('startGame finished and returning')
			return gameId
  },
  players: ({gameId})=>{
  	console.log('getting players for game:'+gameId)
  	let players = gameDB[gameId].getPlayerInfo()
  	console.log(JSON.stringify(players[0].name))
  	return players
  },
  refreshMarket: ({gameId, playerName, locationName})=> {
		let game = gameDB[gameId]
		console.log('refreshing market'+gameId+"/"+playerName+"/"+locationName)
		if(game.turn > 1){
				console.log('past turn 1 can refreshmarket')
				let location= game.locations[locationName]
				console.log('location:'+location.name)
				let res = location.refreshMarket(playerName);
				console.log('res'+res)
				return res;
			}else{
				return 'cannot refresh turn 1'
			}
			return 'something went wrong...'
  },
  locations: ({gameId})=>{
  	let locations = gameDB[gameId].getLocationInfo()
  	return locations
  },
  play: ({gameId, playerName, locationName, cardIndex}) =>{
		let game = gameDB[gameId]
		let player = game.players.find((pl)=>pl.name==playerName)
		let location

		if(locationName != "mill"){
			
			location= game.locations[locationName]
			let response = location.playCard(cardIndex,player)
			return response

		} else{
			//mill card
			console.log('milling!')
			if(player.mills < 1){
				console.log('millcard!')
				let cardName = player.hand[cardIndex].name
				player.millCard(cardIndex)
				return 'Milled '+cardName
			}else{
				return 'already milled this turn'
			}
		}

  },
  buy: ({gameId, playerName, locationName, cardIndex}) =>{
	console.log('getting buy '+gameId)
	let game = gameDB[gameId]
	let player = game.players.find((pl)=>pl.name==playerName)
	let location = game.locations[locationName]
	return location.buy(cardIndex,player)
	// return `card bought! ${JSON.stringify(player.discard[0])}`
  },
  nextPlayer: ({gameId, currentPlayer}) => {
  	
		let game = gameDB[gameId]
		let playerNumber = currentPlayer
		let gamePlayer = game.getCurrentPlayer();
		console.log('currnetplayer'+playerNumber+' vs '+gamePlayer)
		// let winner = game.checkVictoryConditions();
		let npInfo = game.getNextPlayer();
		// let locInfo = game.getLocationInfo()
		// let playerInfo = game.getPlayerInfo()
		// console.log('nextplayer'+newNextPlayer)
		return {turn: game.turn,nextPlayer:npInfo.nextPlayer, winner: npInfo.winner}
  }
};

// const myGraphQLSchema = makeExecutableSchema({ typeDefs, resolvers })
const PORT = process.env.PORT || 4000
const app = express()

app.use(cors()) // not having cors enabled will cause an access control error
// app.use('/graphql', bodyParser.json(), graphqlExpress({ schema: myGraphQLSchema }))
// app.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }))
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,POST');//,PUT,DELETE,OPTIONS
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});

console.log(`Server listening on http://localhost:${PORT} ...`)
app.listen(PORT)
