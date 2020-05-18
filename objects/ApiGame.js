const pl = require('./Player.js');
const loc = require('./Location.js');
const tu = require('./Turn.js')
const cards = require('./CardData.js')
const deckData = new cards.data();
const ai = require('./AI.js')

module.exports.newGame = function Game(playerNames, playerTypes){
	
	let Jerusalem = new loc.Location([],deckData.stories.jerusalem)
	Jerusalem.id = 7;
	this.players = []
	this.playerNames = [...playerNames]
	this.playerTypes = [...playerTypes]
	this.locations = { 7:Jerusalem}
	this.currentPlayer = 0;
	this.turn = 0;
	this.winner ="";
	this.loser = "";
	this.slug = 0;
	this.log = []

	this.getTurn = () => {return this.turn}
	
	this.incrementPlayer = function(){
		if(this.currentPlayer >= this.players.length-1){
			this.currentPlayer = 0;
		}else{
			this.currentPlayer += 1;
		}
	}

	this.getCurrentPlayer = () => {return this.currentPlayer;}
	
	this.getNextPlayer = () => {
		if(this.winner == ""){
		//solo game
		if(this.players.length == 1){
			let winner = this.checkVictoryConditions();
			this.startNewTurn();
			return {nextPlayer: 0, winner:winner}
		}else{

			console.log('getting next player');
			this.incrementPlayer();

			console.log('checking for new turn');
			if(this.players[this.currentPlayer].firstPlayer == true){
				console.log('starting a new turn');
				this.players[this.currentPlayer].firstPlayer= false;
				
				console.log('getting new firstplayer');
				this.incrementPlayer();
				this.players[this.currentPlayer].firstPlayer= true;
				
				let winner =  this.checkVictoryConditions();
					this.startNewTurn();
					this.checkAI();
					console.log('new turn and new firstplayer is'+this.currentPlayer);
				return {nextPlayer: this.currentPlayer, winner: winner};
			}else{
				this.checkAI();
				console.log('returning the new player' +this.currentPlayer);
				return {nextPlayer: this.currentPlayer, winner: ""};
			}
			}
		}else{
			console.log('game is over with '+this.winner+' as winner on turn '+this.turn);
		}
	}
	this.checkAI = () => {
		console.log('checking ai' + this.players[this.currentPlayer].type+this.turn);
				if(this.players[this.currentPlayer].type == "AI"){
					console.log('running ai')
					this.players[this.currentPlayer].AI.runStrategy('default');
					// this.getNextPlayer();
				}
	}
	this.setStartingPlayers = function() {
		this.playerNames.map((player, index)=>{
			switch(player){
				case "Jonah":
					let Nineveh = new loc.Location(deckData.decks.jonah,deckData.stories.jonah.location)
					Nineveh.id = index;
					this.Jonah = new pl.Player(deckData.stories.jonah, deckData.decks.starter,this.playerTypes[index])
					this.Jonah.id = index
					this.players.push(this.Jonah)
					this.locations[Nineveh.id] = Nineveh;
					break;
				case "Esther":
					this.Esther = new pl.Player(deckData.stories.esther, deckData.decks.starter,this.playerTypes[index])
					this.Esther.id = index
					let Babylon = new loc.Location(deckData.decks.esther,deckData.stories.esther.location)
					Babylon.id = index;
					this.players.push(this.Esther)
					this.locations[Babylon.id] = Babylon;
					break;
				case "Joshua":
					let Canaan = new loc.Location(deckData.decks.joshua,deckData.stories.joshua.location)
					Canaan.id = index;
					this.Joshua =  new pl.Player(deckData.stories.joshua, deckData.decks.starter,this.playerTypes[index])
					this.Joshua.id = index
					this.players.push(this.Joshua)
					this.locations[Canaan.id] = Canaan;
					break;
				case "Paul":
					let Rome = new loc.Location(deckData.decks.paul,deckData.stories.paul.location)
					Rome.id = index;
					this.Paul =  new pl.Player(deckData.stories.paul, deckData.decks.starter,this.playerTypes[index])
					this.Paul.id = index
					this.players.push(this.Paul)
					this.locations[Rome.id] = Rome;
					break;
				
			}
			
			if(index == 0){
				this.players[index].firstPlayer = true;
			}else{
				this.players[index].firstPlayer = false;
			}
		})
		this.players.map((player, index)=>{

			if(player.type == "AI"){
				console.log('created AI for '+player.name)
				player.AI = new ai.AI(player,this.locations);
			}
		})
	}
	// this.setStartingPlayers(playerNames);

	this.checkVictoryConditions = function() {
		//esther 18
		// this.winner = "";
		console.log('cehcking win conditions');
		this.players.map((player, index)=>{


			switch(player.name){
				case "Esther":
					console.log('checking esther win condition');
					let babylonian = this.locations[player.id].compareInfluence();
					console.log('babylonian influencer'+babylonian.name)
					if(babylonian.name == "Esther" && babylonian.finalInfluence > 17){//17
						player.winning = true;
						this.winner += player.name +" "
					}
				break;
				case "Jonah":
					console.log('checking jona win condition');
					
					 
				//	let bf;
				let ninevites = 0;
			console.log('checkforninevites'+JSON.stringify(this.locations[player.id].battlefield));
					this.locations[player.id].battlefield.map((battlefield, ind)=>{
						console.log('mapping nineveh');
						if(battlefield && battlefield.name == "Jonah"){
							console.log('found jonah');
							battlefield.cards.map((card,index)=>{
								console.log('mapping battlefield cards:'+card.name);
								if(card.abilities.indexOf('Ninevite') > -1){
									ninevites ++;
									console.log('ninevites'+ninevites);
								}
							})
							if(ninevites > 4){//4
								console.log('jonah is a winner!');
								player.winning = true;
								this.winner += player.name +" "
							}
						}else{
							console.log('no jonah found');
					};
					})
				break;
				case "Paul":
					//set proselytize
					console.log('checking paul win con');
						let pros = 0;
					Object.keys(this.locations).map((location, index)=>{
						if(this.locations[location].proselytized){
							pros += 1;
							console.log(this.locations[location].name+' has been proselytized to' + pros);
						}
					})
						if (pros > 2){
							player.winning = true;
							this.winner += player.name +" "
						}
					//check abilities

				break;
				case "Joshua":
				console.log('checking joshua wincon:'+this.locations[player.id].abilities[0]);
					
					if(this.locations[player.id].abilities[0]>2){
						this.winning = true;
						this.winner += player.name +" "
					}
					

				break;
			}
		})

		console.log('finish checking winconditions');
		return this.winner;
	}
	this.checkForConquerer = function(){
		let conquerer ={
			'neutral': -10
		};
		let chief = null;
		// let conquest = false;
		Object.keys(this.locations).map((loc, index)=>{
			// if(!conquerer ){
			// 	conquest = true;
			// 	conquerer = this.locations[loc].influencer.name
			// }
			// if(conquerer != this.locations[loc].influencer.name
			// 	|| conquerer == 'neutral'){
			// 	console.log('neutral cannot win');
			// 	conquest = false;
			// }
			if(!conquerer[this.locations[loc].influencer.id]){
				conquerer[this.locations[loc].influencer.id]=1
			}else{
				conquerer[this.locations[loc].influencer.id]++;
				if(conquerer[this.locations[loc].influencer.id] > 2){
					chief = this.locations[loc].influencer.id 
				}
			}

		})

		if(chief){
			console.log('A WINNER!!!'+conquerer);
			this.winner += chief
		}}
	// console.log('starting new game with '+playerNames)

	this.startSim = async () => {
		this.startNewTurn();

	}
	this.startNewTurn = function(){
		console.log('apigame startnewturn');

		this.turn = this.turn +1;
		console.log('new turn:'+this.turn);
		
		Object.keys(this.locations).map((location, index)=>{
			this.locations[location].setInfluencing();
		})
		
		this.checkForConquerer();

		console.log('player setup');

		this.players.map((player,index)=>{
			player.startTurn()
			console.log('player hand'+JSON.stringify(player.hand));
			let draws = 5;

			//influence cards
			Object.keys(this.locations).map((location)=>{
				if(this.locations[location].influencer.id == player.id){
					let newHand = [...player.hand]
					newHand.push(this.locations[location].card)
					player.hand = [...newHand]
					console.log('adding influence card to hand'+JSON.stringify(player.hand));
					if(this.locations[location].card.draw > 0){
						// player.drawCards(1);
						draws += this.locations[location].card.draw
					}
				}
			})

			player.drawCards(draws)

			
		});

		return true;
	}

	this.getPlayerInfo = function(){
		let playerInfo = []

		this.players.map((player,index)=>{
			
			let info = {
				name: player.name,
				id: player.id,
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
				id: location.id,
				market: location.market,
				battlefield: location.battlefield,
				influence: location.influence,
				abilities: location.abilities,
				influencer: location.influencer.name,
				influencerId: location.influencer.id,
				info: location.info,
				weariness: location.weariness,
				wounds: location.wounds,
				hardened: location.hardened,
				proselytized: location.proselytized,
			}
			if(info.battlefield == {}){
				console.log('empty battlefield, please proxy');
				info.battlefield = {name:'neutral',influence:0,gold:0, cards:[]}
			}
			locationInfo.push(info);
		})

		return locationInfo
	}

	return this
}
