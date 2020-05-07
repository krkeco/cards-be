const pl = require('./Player.js');
const loc = require('./Location.js');
const tu = require('./Turn.js')
const cards = require('./CardData.js')
const deckData = new cards.data();
const ai = require('./AI.js')

module.exports.newGame = function Game(playerNames){
	
	let Jerusalem = new loc.Location([],deckData.stories.jerusalem)
	this.players = []
	this.playerNames = [...playerNames]
	this.locations = { 'Jerusalem':Jerusalem}
	this.currentPlayer = 0;
	this.turn = 0;
	this.winner ="";
	this.slug = 0;
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
		//solo game
		if(this.players.length == 1){
			let winner = this.checkVictoryConditions();
			this.startNewTurn();
			return {nextPlayer: 0, winner:winner}
		}else{

			console.log('getting next player')
			this.incrementPlayer();

			console.log('checking for new turn')
			if(this.players[this.currentPlayer].firstPlayer == true){
				console.log('starting a new turn')
				this.players[this.currentPlayer].firstPlayer= false;
				
				console.log('getting new firstplayer')
				this.incrementPlayer();
				this.players[this.currentPlayer].firstPlayer= true;
				
				let winner = this.checkVictoryConditions();
				this.startNewTurn();
				console.log('new turn and new firstplayer is'+this.currentPlayer)
				return {nextPlayer: this.currentPlayer, winner: winner};
			}else{

				console.log('returning the new player' +this.currentPlayer)
				return {nextPlayer: this.currentPlayer, winner: ""};
			}
		}
	}
	this.setStartingPlayers = function(nPlayerNames) {
		nPlayerNames.map((player, index)=>{
			switch(player){
				case "Jonah":
					this.Nineveh = new loc.Location(deckData.decks.jonah,deckData.stories.jonah.location)
					this.Jonah = new pl.Player(deckData.stories.jonah, deckData.decks.starter,'player')
					this.Jonah.id = index
					this.players.push(this.Jonah)
					this.locations[this.Nineveh.name] = this.Nineveh;
					break;
				case "Esther":
					this.Esther = new pl.Player(deckData.stories.esther, deckData.decks.starter,'player')
					this.Esther.id = index
					this.Babylon = new loc.Location(deckData.decks.esther,deckData.stories.esther.location)
					this.players.push(this.Esther)
					this.locations[this.Babylon.name] = this.Babylon;
					break;
				case "Joshua":
					this.Canaan = new loc.Location(deckData.decks.joshua,deckData.stories.joshua.location)
					this.Joshua =  new pl.Player(deckData.stories.joshua, deckData.decks.starter,'player')
					this.Joshua.id = index
					this.players.push(this.Joshua)
					this.locations[this.Canaan.name] = this.Canaan;
					break;
				case "Paul":
					this.Rome = new loc.Location(deckData.decks.paul,deckData.stories.paul.location)
					this.Paul =  new pl.Player(deckData.stories.paul, deckData.decks.starter,'player')
					this.Paul.id = index
					this.players.push(this.Paul)
					this.locations[this.Rome.name] = this.Rome;
					break;
				
			}
			if(index == 0){
				this.players[index].firstPlayer = true;
			}else{
				this.players[index].firstPlayer = false;
			}
		})
	}
	// this.setStartingPlayers(playerNames);

	this.checkVictoryConditions = function() {
		//esther 18
		this.winner = "";
		console.log('cehcking win conditions')
		this.players.map((player, index)=>{


			switch(player.name){
				case "Esther":
					console.log('checking esther win condition')
					let babylonian = this.locations['Babylon'].compareInfluence();
					console.log('babylonian influencer'+babylonian.name)
					if(babylonian.name == "Esther" && babylonian.finalInfluence > 17){//17
						player.winning = true;
						this.winner += player.name +" "
					}
				break;
				case "Jonah":
					console.log('checking jona win condition')
					
					 
				//	let bf;
				let ninevites = 0;
			console.log('checkforninevites'+JSON.stringify(this.locations["Nineveh"].battlefield))
					this.locations["Nineveh"].battlefield.map((battlefield, ind)=>{
						console.log('mapping nineveh')
						if(battlefield && battlefield.name == "Jonah"){
							console.log('found jonah')
							battlefield.cards.map((card,index)=>{
								console.log('mapping battlefield cards:'+card.name)
								if(card.abilities.indexOf('Ninevite') > -1){
									ninevites ++;
									console.log('ninevites'+ninevites)
								}
							})
							if(ninevites > 4){//4
								console.log('jonah is a winner!')
								player.winning = true;
								this.winner += player.name +" "
							}
						}else{console.log('no jonah found')}
					})
				break;
				case "Paul":
					//set proselytize
					console.log('checking paul win con')
						let pros = 0;
					Object.keys(this.locations).map((location, index)=>{
						if(this.locations[location].proselytized){
							pros += 1;
							console.log(this.locations[location].name+' has been proselytized to' + pros)
						}
					})
						if (pros > 2){
							player.winning = true;
							this.winner += player.name +" "
						}
					//check abilities

				break;
				case "Joshua":
				console.log('checking joshua wincon:'+this.locations['Canaan'].abilities[0])
					if(this.locations['Canaan'].abilities[0]>2){
						this.winning = true;
						this.winner += player.name +" "
					}
					

				break;
			}
		})

		console.log('finish checking winconditions')
		return this.winner;
	}
	this.checkForConquerer = function(){
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
			this.winner += conquerer
		}}
	// console.log('starting new game with '+playerNames)

	this.startNewTurn = function(){
		console.log('apigame startnewturn')

		this.turn = this.turn +1;
		console.log('new turn:'+this.turn)
		
		Object.keys(this.locations).map((location, index)=>{
			this.locations[location].setInfluencing();
		})
		
		this.checkForConquerer();

		console.log('player setup')

		this.players.map((player,index)=>{
			player.startTurn()
			console.log('player hand'+JSON.stringify(player.hand))
			let draws = 5;

			//influence cards
			Object.keys(this.locations).map((location)=>{
				if(this.locations[location].influencer.name == player.name){
					let newHand = [...player.hand]
					newHand.push(this.locations[location].card)
					player.hand = [...newHand]
					console.log('adding influence card to hand'+JSON.stringify(player.hand))
					if(this.locations[location].card.draw > 0){
						// player.drawCards(1);
						draws += this.locations[location].card.draw
					}

				}
			})

			player.drawCards(draws)



		});
	
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
				abilities: location.abilities,
				influencer: location.influencer.name,
				info: location.info,
				weariness: location.weariness,
				wounds: location.wounds,
				hardened: location.hardened,
				proselytized: location.proselytized,
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
