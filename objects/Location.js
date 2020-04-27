
module.exports.Location = function Location(deck,story){
	this.deck = [...deck]
	this.card = story.card
	this.market = []
	this.battlefield = {}
	this.name = story.name;
	this.influence = story.influence;
	this.weariness = 0;
	this.abilities = story.abilities;
	this.influencer = {name:'neutral'};

	this.setWeariness = function(newWeary){
		this.weariness = newWeary
		console.log('weariness:'+this.weariness)
	}

	this.drawOne = function() {
		let newMarket = [...this.market]
		let newDeck = [...this.deck]
		console.log('location:drawOne:')
		if(newDeck.length > 0){
				let ranCard = Math.floor(Math.random()*(newDeck.length-1));
				newMarket.push(newDeck[ranCard])
				newDeck.splice(ranCard,1)
			}else{
				console.log('the market is empty!')
			}

		this.market = [...newMarket]
		this.deck = [...newDeck]
	}
	// createMarket = function(){
		//all decks start with 1 2cost and 1 3 cost card atm
	if(this.deck.length > 0){//otherwise jerusalem has no market
			this.market.push(this.deck[0])
			this.deck.splice(0,1)
			this.market.push(this.deck[5])
			this.deck.splice(5,1)
			this.drawOne();
			// console.log('market: '+this.market)
			// console.log('market: '+JSON.stringify(this.deck))
	}

	this.buy = function(index, player){
		if(this.battlefield[player.name].gold >= this.market[index].cost){
				console.log('location:buy:'+JSON.stringify(this.market[index].name))
				player.buyCard(this.market[index])
				let newMarket = [...this.market]
				newMarket.splice(index,1)
				this.market = [...newMarket]
				this.drawOne();
			}else{
				//can't afford card
			}
	}

	this.playCard = function(card,owner, copyInfluence){
		let newField = {...this.battlefield}
		console.log('location:playcard:'+card)
		if(!newField[owner.name]){
			newField[owner.name] = {name: owner.name,influence:0,gold:0, cards:[]};
		}
		console.log('play card'+owner.hand[card].name)
		newField[owner.name].influence += owner.hand[card].influence
		newField[owner.name].gold += owner.hand[card].gold
		newField[owner.name].cards.push(owner.hand[card]);
		
		//special abilities here!
		//ninevite
		if(owner.hand[card].abilities.indexOf('homeland') > -1 && this.name == "Nineveh"){
			newField[owner.name].influence += 2;
			console.log('ninevite advantage bonus')
		}
		//ninevite prince
		else if(owner.hand[card].abilities.indexOf('prince') > -1 && this.name == "Nineveh"){
			newField[owner.name].influence += 3;
			console.log('prince advantage bonus')
		}else if(owner.hand[card].abilities.indexOf('joshua') > -1 && this.name == "Canaan"){
			newField[owner.name].influence += 2;
			console.log('joshua advantage bonus')
		}else if(owner.hand[card].abilities.indexOf('mordecai') > -1){
			newField[owner.name].influence += copyInfluence;
			console.log('mordecai added '+copyInfluence+" to this location")
		}

		this.battlefield = newField;
		console.log(owner.name+" played "+owner.hand[card].name+" on "+this.name+" for influence: "+newField[owner.name].influence)
		// console.log(JSON.stringify(newField)+JSON.stringify(this.battlefield))
		if(owner.hand[card].abilities.indexOf("scrap") < 0){
			owner.discardCard(card)
		}else{
			console.log('this is an influence card and is not discarded')
		}
	}

	this.compareInfluence = function(){
		console.log('location:compareInfluence:')
		let influencer ={};
		influencer.baseInfluence = this.influence
		influencer.influence = 0;
		let runnerUp = 0;
		influencer.name = 'neutral';
		Object.keys(this.battlefield).map((player,index) => {
			if(this.battlefield[player].influence > influencer.influence){
				influencer = this.battlefield[player];
			}else if(this.battlefield[player].influence > runnerUp){
				runnerUp = this.battlefield[player].influence;
			}
		})
		console.log(influencer.name+" is the highest influencer by "+(influencer.influence-runnerUp))
		influencer.influence -= runnerUp
		return influencer
	}
	this.setInfluencing = function(){
		console.log('location:setInfluencing:')
		let influencer = this.compareInfluence();
		let baseInfluence = this.influence
		if(this.name == "Canaan"){
			baseInfluence += this.abilities[0]
			baseInfluence += this.abilities[0]-1
			baseInfluence += this.abilities[0]-2
			//0 = -3
			//1 = 0
			//2 = 3
		}
		if(influencer.influence > baseInfluence +this.weariness*2 && influencer.name != 'neutral'){
			this.influencer = influencer

			if(this.name == "Canaan"){
				this.abilities = [(this.abilities[0]+1)];
				console.log('canaan conquered, tier up'+this.abilities[0])
			}

			this.battlefield = {}
			console.log()
		}
			console.log('influence for '+this.name+' checked; Influencer is now: '+this.influencer.name)
	}

}
