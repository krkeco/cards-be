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
	this.winner;
	this.getTurn = () => {return this.turn}

	this.getCurrentPlayer = () => {return this.currentPlayer;}
	this.getNextPlayer = () => {
		//solo game
		if(this.players.length == 1){
			this.startNewTurn();
			return 0
		}
		console.log('getting next player and maybe turn')
		if(this.currentPlayer >= this.players.length-1){
			this.currentPlayer = 0;
		}else{
			this.currentPlayer += 1;
		}

		if(this.players[this.currentPlayer].firstPlayer == true){
			console.log('starting a new turn')
			this.players[this.currentPlayer].firstPlayer= false;
			this.startNewTurn();
			console.log('new turn complete and getting new firstplayer')
			// this.getNextPlayer();//increment again to move fpt
			if(this.currentPlayer >= this.players.length-1){
			this.currentPlayer = 0;
			}else{
				this.currentPlayer += 1;
			}
			this.players[this.currentPlayer].firstPlayer= true;
		}
		console.log('returning the new player' +this.currentPlayer)
		return this.currentPlayer;
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
					let ninevites = 0;
					let bf = this.locations["Nineveh"].battlefield.find((bf)=>bf.name=="Jonah")
					if(bf){
						console.log('did play on nineveh')
						bf.cards.map((card,index)=>{
							if(card.abilities.indexOf('ninevite') > -1){
								ninevites ++;
								console.log('ninevites'+ninevites)
							}
						})
						if(ninevites > 4){//4 irl
							player.winning = true;
							this.winner += player.name +" "
						}
					}
				break;
				case "Paul":
					//set proselytize
					
					//check abilities

				break;
				case "Joshua":
				console.log('checking joshua wincon:'+this.locations['Canaan'].abilities[0])
					if(this.locations['Canaan'].abilities[0]>1){
						this.winning = true;
						this.winner += player.name +" "
					}
					

				break;
			}
		})

		//jonah  5
		//joshua canaan
		//paul   3 loc card with paul
		this.players.map((player,index)=>{
			if(player.winning){
				this.winner += player.name+" "
			}
		})

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
		}
		return this.winner;
	}
	// console.log('starting new game with '+playerNames)

	this.startNewTurn = function(){
		

		this.turn = this.turn +1;
		console.log('new turn:'+this.turn)
		
		Object.keys(this.locations).map((location, index)=>{
			this.locations[location].setInfluencing();
		})

		this.players.map((player,index)=>{
			player.discardHand();
			player.mills = 0;

			let draws = 5;

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
	
		// this.checkVictoryConditions();
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
