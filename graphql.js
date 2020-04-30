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
	influence: Boolean,
	influencer: Player,
	market: [Card],
	
			
},
type battlefield {
	neutral: [String],
	name: String,
	influence: Int,
	gold: Int,
	cards: [Card]
},
  type Query {
    hello: String,
    goodbye: String,
    game(players: [String]): String!
    players(gameId: Int): [Player],
    locations(gameId: Int): [Location],
    play(gameId: Int, playerName: String, locationName: String): String,
    buy(gameId: Int, playerName: String, locationName: String, cardIndex: Int): String,
    nextTurn(gameId: Int): String,
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
  play: ({gameId, playerName, buyLocation}) =>{
		let game = gameDB[gameId]
		let player = game.players.find((pl)=>pl.name==playerName)
		console.log('found player:'+player.name)
		let location = game.locations[buyLocation.toLowerCase()]
		console.log('found location'+location.name)
		location.playCard(req.body.cardname,player)
  },
  buy: ({gameId, playerName, buyLocation, cardIndex}) =>{
	console.log('getting buy '+req.params.id)
	let game = games[gameId]
	let player = game.players.find((pl)=>pl.name==playerName)
	let location = game.locations[buyLocation.toLowerCase()]
	location.buy(cardIndex,player)
  }
};

// const myGraphQLSchema = makeExecutableSchema({ typeDefs, resolvers })
const PORT = 4000
const app = express()

app.use(cors()) // not having cors enabled will cause an access control error
// app.use('/graphql', bodyParser.json(), graphqlExpress({ schema: myGraphQLSchema }))
// app.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }))
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));


console.log(`Server listening on http://localhost:${PORT} ...`)
app.listen(PORT)
