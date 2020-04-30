const pl = require('./Player.js');
const loc = require('./Location.js');
const tu = require('./Turn.js')
const cards = require('./CardData.js')
const deckData = new cards.data();
const ai = require('./AI.js')

module.exports.newGame = function Game(playerNames){
	
	let Jerusalem = new loc.Location([],deckData.stories.jerusalem)
	this.players = []
	this.locations = { 'jerusalem':Jerusalem}
	this.currentPlayer = 0;
	this.turn = 0;
	this.winner;
	this.getTurn = () => {return this.turn}

	this.getCurrentPlayer = () => {return this.currentPlayer;}
	this.getNextPlayer = () => {
		if(this.currentPlayer >= this.players.length-1){
			this.currentPlayer = 0;
		}else{
			this.currentPlayer += 1;
		}
		if(this.players[this.currentPlayer].firstPlayer == true){
			this.players[this.currentPlayer].firstPlayer= false;
			this.startNewTurn();
			// this.getNextPlayer();//increment again to move fpt
			if(this.currentPlayer >= this.players.length-1){
			this.currentPlayer = 0;
			}else{
				this.currentPlayer += 1;
			}
			this.players[this.currentPlayer].firstPlayer= true;
		}
		return this.currentPlayer;
	}

	playerNames.map((player, index)=>{
		switch(player){
			case "Jonah":
				this.Nineveh = new loc.Location(deckData.decks.jonah,deckData.stories.jonah.location)
				this.Jonah = new pl.Player(deckData.stories.jonah, deckData.decks.starter,'player')
				this.players.push(this.Jonah)
				this.locations.nineveh = this.Nineveh;
				break;
			case "Esther":
				this.Esther = new pl.Player(deckData.stories.esther, deckData.decks.starter,'player')
				this.Babylon = new loc.Location(deckData.decks.esther,deckData.stories.esther.location)
				this.players.push(this.Esther)
				this.locations.babylon = this.Babylon;
				break;
			case "Joshua":
				this.Canaan = new loc.Location(deckData.decks.joshua,deckData.stories.joshua.location)
				this.Joshua =  new pl.Player(deckData.stories.joshua, deckData.decks.starter,'player')
				this.players.push(this.Joshua)
				this.locations.canaan = this.Canaan;
				break;
			case "Paul":
				this.Rome = new loc.Location(deckData.decks.paul,deckData.stories.paul.location)
				this.Paul =  new pl.Player(deckData.stories.paul, deckData.decks.starter,'player')
				this.players.push(this.Paul)
				this.locations.rome = this.Rome;
				break;
			
		}
		if(index == 0){
			this.players[index].firstPlayer = true;
		}else{
			this.players[index].firstPlayer = false;
		}
	})

	this.checkVictoryConditions = () => {
		let conquerer;
		let conquest = false;
		Object.keys(this.locations).map((loc, index)=>{
			if(!conquerer ){
				conquest = true;
				conquerer = this.locations[loc].influencer.name
			}
			if(conquerer != this.locations[loc].influencer.name
				|| conquerer == 'neutral'){
				console.log('neutral cannot win')
				conquest = false;
			}

		})
		if(conquest && conquerer != 'neutral'){
			console.log('A WINNER!!!'+conquerer)
			this.winner = conquerer
		}

	}
	console.log('starting new game with '+playerNames)

	this.startNewTurn = function(){
		

		this.turn = this.turn +1;
		console.log('new turn:'+this.turn)
		this.players.map((player,index)=>{
			player.discardHand();
			player.drawCards(5);
		});
	
		Object.keys(this.locations).map((location, index)=>{
			this.locations[location].setInfluencing();
		})
		this.checkVictoryConditions();
		// return this.getPlayerInfo;
	}

	this.getPlayerInfo = function(){
		let playerInfo = []

		this.players.map((player,index)=>{
			
			let info = {
				name: player.name,
				hand: player.hand,
				deck: player.deck,
				discard: player.discard,
				firstPlayer: player.firstPlayer,
				type: player.type
			}
			playerInfo.push(info)
		})
		return playerInfo
	}

	this.getLocationInfo = function(){

		let locationInfo = []
		Object.keys(this.locations).map((loc, ind)=>{
			let location = this.locations[loc];
			let info = {
				name: location.name,
				market: location.market,
				battlefield: location.battlefield,
				influence: location.influence,
				weariness: location.weariness,
				abilities: location.abilities,
				influencer: location.influencer.name
			}
			if(info.battlefield == {}){
				console.log('empty battlefield, please proxy')
				info.battlefield = {name:'neutral',influence:0,gold:0, cards:[]}
			}
			locationInfo.push(info);
		})

		return locationInfo
	}
	return this
}
