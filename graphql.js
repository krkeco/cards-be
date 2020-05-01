const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');

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
	  draw: Int,
	  gold:Int,
	  influence:Int,
	  abilities:[String]
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
	influencer: String,
	market: [Card],
	battlefield: [Battlefield]
			
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
  type Query {
    hello: String,
    goodbye: String,
    game(players: [String]): String!
    players(gameId: Int): [Player],
    locations(gameId: Int): [Location],
    play(gameId: Int, playerName: String, locationName: String, cardIndex: Int): String,
    buy(gameId: Int, playerName: String, locationName: String, cardIndex: Int): String,
    nextPlayer(gameId: Int, currentPlayer: Int): TurnInfo,
  }
`);

// The root provides a resolver function for each API endpoint
var root = {
  hello: () => {
    return 'Hello world!';
  },
  game: ({players})=>{
  	console.log('players are:'+JSON.stringify(players))
  		// let players = ['Jonah','Esther']
			let game = GameBuilder.newGame(players)
			game.startNewTurn();
			
			let gameId = gameDB.length
			gameDB[gameId] = game
		  return gameId
  },
  players: ({gameId})=>{
  	let players = gameDB[gameId].getPlayerInfo()
  	console.log(JSON.stringify(players[0].name))
  	return players
  },
  locations: ({gameId})=>{
  	let locations = gameDB[gameId].getLocationInfo()
  	return locations
  },
  play: ({gameId, playerName, locationName, cardIndex}) =>{
		let game = gameDB[gameId]
		let player = game.players.find((pl)=>pl.name==playerName)
		let location = game.locations[locationName]
		let response = location.playCard(cardIndex,player)

		return response

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
		let newNextPlayer = game.getNextPlayer();
		let winner = game.checkVictoryConditions();
		// let locInfo = game.getLocationInfo()
		// let playerInfo = game.getPlayerInfo()
		console.log('nextplayer'+newNextPlayer)
		return {turn: game.turn,nextPlayer:newNextPlayer, winner: winner}
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
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});

console.log(`Server listening on http://localhost:${PORT} ...`)
app.listen(PORT)
