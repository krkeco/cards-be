const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');

// var mongo = require('./mongodb.js')

const GameBuilder = require('./objects/ApiGame.js');
var gameDB = []; //this is going to be mongo some day
// let players = ['Jonah','Esther']
// let game = GameBuilder.newGame(players)
// game.startNewTurn();
const cards = require('./objects/CardData.js');

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
	type Card {
    chrono:Int,
		name:String,
    img:String,
    quote: String,
	  quantity: Int,
	  cost: Int,
	  gold:Int,
	  influence:Int,
	  abilities:[String],
	  draw: Int,
	  faith:Int,
	  fear: Int,
	  politics: Float,
	  provision: Int,
},

type Player {	
	name: String,
  id: Int,
	firstPlayer: Boolean,
	type: String,
	deck: [Card],
	discard: [Card],
	hand: [Card],
			
},
type Location {	
	name: String,
  id: Int,
	influence: Int,
	info: [String],
	abilities: [String],
	influencer: String,
  character: Card,
	market: [Card],
  infoDeck: [Card],
	battlefield: [Battlefield],
	proselytized: [Int],
	hardened:Int,
  edicts:Int,
	wounds: [Int],
	weariness: Int,
			
},
type Battlefield {
	name: String,
  poliBonus: Int,
	influence: Int,
  fear: Int,
  faith: Int,
	gold: Int,
	cards: [Card]
},
type TurnInfo {
  log: [String],
	turn: Int,
	nextPlayer: Int,
	winner: String,
  loser: String,
},
type WaitingRoom {
	room: [String],
	started: Boolean,
  refreshMarket:Boolean,
  scrapCard:Boolean
},
type Game {
  players: [Player],
  locations: [Location]
},
  type Query {
    wakeup: [Location],
    waitingRoom(gameId: Int): WaitingRoom,
    newGame(players: [String], types: [String], refreshMarket: Boolean, scrapCard: Boolean, banes: Boolean): Int!,
    joinGame(players: [String],types: [String],gameId: Int): [String]!,
    startGame(gameId: Int): String,
    players(gameId: Int): [Player],
    locations(gameId: Int): [Location],
    play(gameId: Int, playerId: Int, locationId: Int, cardIndex: Int): String,
    buy(gameId: Int, playerId: Int, locationId: Int, cardIndex: Int): String,
    nextPlayer(gameId: Int, currentPlayer: Int): TurnInfo,
    currentPlayer(gameId: Int): TurnInfo,
    refreshMarket(gameId: Int, playerId: Int, locationId: Int): String,
  }`);

// The root provides a resolver function for each API endpoint
var root = {
  wakeup: async() => {
    let deckData = await cards.data();
    let game = new GameBuilder.newGame(deckData,["Jonah","Esther","Joshua","Paul"], ["player","player","player","player"]);
    
    game.setStartingPlayers(game.playerNames);
    game.startNewTurn();
    console.log('waking up')
    console.log(game.locations[1].character)
    return game.getLocationInfo();
    // return 'awake';
  },
  waitingRoom: ({ gameId }) => {
    let game = gameDB[gameId];
    let started = true;
    if (!game.players || game.players.length <= 0) {
      started = false;
    }
    return { room: game.playerNames, started: started, refreshMarket:game.refreshMarket, scrapCard: game.scrapCard };
  },
  currentPlayer: ({ gameId }) => {
    console.log('currentplayer for ' + gameId);
    let game = gameDB[gameId];
    // console.log('game found?'+game.locations[0].name)
    let player = game.getCurrentPlayer();
    console.log('current player found? ' + player + 'winner:' + game.winner);
    return { turn: game.turn, nextPlayer: player, winner: game.winner, log: game.log, loser: game.loser };
    // return player
  },
  newGame: async({ players, types, refreshMarket, scrapCard, banes }) => {
    console.log('players are:' + JSON.stringify(players));
    // let players = ['Jonah','Esther']

    let deckData = await cards.data();
    // let banes = true;
    let game = new GameBuilder.newGame(deckData,players, types, refreshMarket, scrapCard, banes);
    let gameId = gameDB.length;
    gameDB[gameId] = game;
    return gameId;
  },

  joinGame: ({ players, types, gameId }) => {
    console.log('new players are:' + JSON.stringify(players));
    let game = gameDB[gameId];
    if (!game.started) {
      let newPlayerList = [...game.playerNames, ...players];
      game.playerNames = newPlayerList;

      let newPlayerType = [...game.playerTypes, ...types];
      game.playerTypes = newPlayerType;
      return newPlayerList;
    } else if(players == []) {
      return game.playerNames
    } else {
      return 'this game is not available any more';
    }
  },
  startGame: ({ gameId }) => {
    let game = gameDB[gameId];
    game.setStartingPlayers(game.playerNames);
    console.log('starting first turn');
    game.startNewTurn();
    console.log('startGame finished and returning');
    return gameId;
  },
  players: ({ gameId }) => {
    console.log('getting players for game:' + gameId);
    let players = gameDB[gameId].getPlayerInfo();
    console.log(JSON.stringify(players[0].name));
    return players;
  },
  refreshMarket: ({ gameId, playerId, locationId }) => {
    let game = gameDB[gameId];
    console.log(
      'refreshing market' + gameId + '/' + playerId + '/' + locationId,
    );
    if (game.turn > 1) {
      console.log('past turn 1 can refreshmarket'+game.turn);
      let location = game.locations[locationId];
      console.log('location:' + location.name);
      let res = location.refreshMarket(playerId);
      console.log('res' + res);
      game.appendLog("Player refreshed the market at"+location.name)
      return res;
    } else {
      game.appendLog("Cannot refresh market on Turn 1");
      return 'cannot refresh turn 1';
    }
    return 'something went wrong...';
  },
  locations: ({ gameId }) => {
    let locations = gameDB[gameId].getLocationInfo();
    return locations;
  },
  play: ({ gameId, playerId, locationId, cardIndex }) => {
    let game = gameDB[gameId];
    console.log('play card' + locationId);
    let player = game.players.find((pl) => pl.id == playerId);
    let location;

    if (locationId != -1) {
      location = game.locations[locationId];
      console.log('found location' + location.name);
      let response = location.playCard(cardIndex, player);
      game.appendLog(player.name+" "+response)
      return response;
    } else {
      //mill card
      console.log('milling!');
      if (player.mills < 1 ) {
        console.log('millcard!');
        
        let mill = player.millCard(cardIndex);
        game.appendLog(mill)
        return mill;
      } else {
        return 'already milled this turn';
      }
    }
  },
  buy: ({ gameId, playerId, locationId, cardIndex }) => {
    console.log('getting buy ' + gameId);
    let game = gameDB[gameId];
    let player = game.players.find((pl) => pl.id == playerId);
    let location = game.locations[locationId];
    let buyString = location.buy(cardIndex, player);
    game.appendLog(player.name+" "+buyString)
    return buyString
    // return `card bought! ${JSON.stringify(player.discard[0])}`
  },
  nextPlayer: ({ gameId, currentPlayer }) => {
    let game = gameDB[gameId];
    let playerNumber = currentPlayer;
    let gamePlayer = game.getCurrentPlayer();
    console.log('currnetplayer' + playerNumber + ' vs ' + gamePlayer);
    // let winner = game.checkVictoryConditions();
    let npInfo = game.getNextPlayer();
    // let locInfo = game.getLocationInfo()
    // let playerInfo = game.getPlayerInfo()
    // console.log('nextplayer'+newNextPlayer)
    return {
      turn: game.turn,
      nextPlayer: npInfo.nextPlayer,
      winner: npInfo.winner,
      loser: game.loser,
      log: game.log
    };
  },
};

// const myGraphQLSchema = makeExecutableSchema({ typeDefs, resolvers })
const PORT = process.env.PORT || 4000;
const app = express();

app.use(cors()); // not having cors enabled will cause an access control error
// app.use('/graphql', bodyParser.json(), graphqlExpress({ schema: myGraphQLSchema }))
// app.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }))
app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  }),
);
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET,POST'); //,PUT,DELETE,OPTIONS
  res.header(
    'Access-Control-Allow-Headers',
    'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json',
  );
  next();
});

console.log(`Server listening on http://localhost:${PORT} ...`);
app.listen(PORT);
