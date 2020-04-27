
const pl = require('./Player.js');
const loc = require('./Location.js');
const tu = require('./Turn.js')
const cards = require('./CardData.js')
const deckData = new cards.data();
const ai = require('./AI.js')


module.exports.Series = function Simulation(gameCount){

	let games = [];
	playerWon = 0;
	let averageTurnBase = 0;
	let maxTurn = 0;
	let minTurn = 100;
	
	for(let x = 0; x < gameCount; x++){
		let game = new Game(x);
		games.push(game)
		
		if(game[game.length-1][2] < minTurn){
			minTurn = game[game.length-1][2]
		}
		if(game[game.length-1][2] > maxTurn){
			maxTurn = game[game.length-1][2]
		}
		averageTurnBase += game[game.length-1][2]

		if(game[game.length-1][4] == 'Joshua'){
			playerWon++;
		}
		console.log('Jonah won '+playerWon+' games of ' +gameCount)
		console.log('minWin:'+minTurn+" maxTurn:"+maxTurn+" avgTurns:"+(averageTurnBase/games.length))
	}
}

function Game(playerRotation){

	// let Canaan = new loc.Location(deckData.decks.esther,deckData.stories.esther.location)
	let Rome = new loc.Location(deckData.decks.paul,deckData.stories.paul.location)
	let Babylon = new loc.Location(deckData.decks.esther,deckData.stories.esther.location)
	let Canaan = new loc.Location(deckData.decks.joshua,deckData.stories.joshua.location)
	let Nineveh = new loc.Location(deckData.decks.jonah,deckData.stories.jonah.location)
	let Jerusalem = new loc.Location([],deckData.stories.jerusalem)
	
	let locations = {'canaan':Canaan,'rome':Rome, 'jerusalem':Jerusalem, "nineveh":Nineveh, 'babylon':Babylon}


	let players = []
	
	let Jonah = new pl.Player(deckData.stories.jonah, deckData.decks.starter)
	let Esther = new pl.Player(deckData.stories.esther, deckData.decks.starter)
	let Paul =  new pl.Player(deckData.stories.paul, deckData.decks.starter)
	let Joshua =  new pl.Player(deckData.stories.joshua, deckData.decks.starter)

	Jonah.AI = new ai.AI(Jonah, locations);
	Esther.AI = new ai.AI(Esther, locations);
	Paul.AI = new ai.AI(Paul, locations);
	Joshua.AI = new ai.AI(Joshua, locations);

	if(playerRotation % 2 == 0){
		players = [ Joshua,Paul ]
	}else{
		players = [Paul, Joshua]
	}
	
	

	let gameSim = []

	winner=false;
	while(!winner){

		let turn = tu.Turn(players,locations,(gameSim.length+1),false);	
		winner = turn[3]
		gameSim.push(turn)
		// if(turn[2] > 30){
		// 	console.log('game took too long')
		// 	break;
		// }
	}

	console.log('game took ' + gameSim.length + ' turns to finish.')
	console.log('the winner is '+gameSim[gameSim.length-1][4])
	
	return gameSim
}
