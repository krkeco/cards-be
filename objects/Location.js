
module.exports.Location = function Location(deck,story){
	this.deck = [...deck]
	this.card = story.card
	this.market = []
	this.battlefield = [];
	this.name = story.name;
	this.influence = story.influence;
	this.weariness = 0;
	this.abilities = story.abilities;
	this.influencer = {name:'neutral'};
	this.proselytized = false;
	this.wounds = 0;

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
		if(this.battlefield[player.id] && this.battlefield[player.id].gold >= this.market[index].cost){
				console.log('location:buy:'+JSON.stringify(this.market[index].name))
				let newBattleField  = [...this.battlefield]
				newBattleField[player.id].gold -= this.market[index].cost

				player.buyCard(this.market[index])
				let newMarket = [...this.market]
				newMarket.splice(index,1)
				this.market = [...newMarket]
				this.battlefield = [...newBattleField]
				this.drawOne();
				return `bought ${player.discard[0].name}`
			}else{
				//can't afford card
				return `can't afford card`
			}
			if(player.type == "AI"){
				//AI cheat ... if it has gold it floats it
				
				player.buyCard(this.market[index])
				let newMarket = [...this.market]
				newMarket.splice(index,1)
				this.market = [...newMarket]
				this.battlefield = [...newBattleField]
				this.drawOne();
				return `bought ${player.discard[0].name}`
				
			}
	}

	this.playCard = function(card,owner, copyInfluence){
		console.log('owner id:'+owner.id)
		let newField = [...this.battlefield]
		console.log('location:playcard:'+card)
		if(!newField[owner.id]){
			newField[owner.id] = {name: owner.name,influence:0,gold:0, cards:[]};
		}
		console.log('play card'+owner.hand[card].name)
		newField[owner.id].influence += owner.hand[card].influence
		newField[owner.id].gold += owner.hand[card].gold
		newField[owner.id].cards.push(owner.hand[card]);
		
		//special abilities here!
		//ninevite
		if(owner.hand[card].abilities.indexOf('homeland') > -1 && this.name == "Nineveh"){
			newField[owner.id].influence += 2;
			console.log('ninevite advantage bonus')
		}
		//ninevite prince
		else if(owner.hand[card].abilities.indexOf('prince') > -1 && this.name == "Nineveh"){
			newField[owner.id].influence += 2;
			console.log('prince advantage bonus')
		}else if(owner.hand[card].abilities.indexOf('mordecai') > -1){
			newField[owner.id].influence += copyInfluence;
			console.log('mordecai added '+copyInfluence+" to this location")
		}else if(owner.hand[card].weary){
			console.log('adding influence to location:'+this.weariness+" add "+owner.hand[card].wear)
			this.weariness += parseInt(owner.hand[card].weary);
		}else if(owner.hand[card].vitality){
			this.weariness -= owner.hand[card].vitality;
			if(this.weariness < 0){
				this.weariness = 0;
			}
		}else if(owner.hand[card].abilities.indexOf('balaam') > -1){
			newField[owner.id].influence += copyInfluence;
			console.log('balaam added '+copyInfluence+" to this location")
		}else if(owner.hand[card].name=='Paul'){
			newField[owner.id].playPaul = true;
			console.log('paul played on location')
		}

		this.battlefield = newField;
		console.log(owner.name+" played "+owner.hand[card].name+" on "+this.name+" for influence: "+newField[owner.id].influence)
		// console.log(JSON.stringify(newField)+JSON.stringify(this.battlefield))
		let cardName = owner.hand[card].name
		if(owner.hand[card].abilities.indexOf("scrap") < 0){
			owner.discardCard(card)
		}else{
			let newHand = [...owner.hand]
			newHand.splice(card,1)
			owner.hand = [...newHand]
			console.log('this is an influence card and is not discarded')
		}
		return `played ${cardName} on ${this.name}`
	}

	this.compareInfluence = function(){
		console.log('location:compareInfluence:')
		let influencer ={influence:this.influence};
		influencer.name = 'neutral';

		let runnerUp = 0;
		let paul = -1;
		this.battlefield.length > 0 ? (
			this.battlefield.map((player,index) => {
				if(player && this.battlefield[index] ){
					if(this.battlefield[index].playPaul){
						console.log('paul is playign')
						paul = index;

					}
					// if(this.battlefield[player].name == "Paul"){
					// 	if(this.battlefield[player].cards.findIndex((card,index)=>card.name == "Paul") > -1){
					// 		console.log('the paul card was played')
					// 	}
					// }
					console.log('player from battlefield'+player+index)
					if(this.battlefield[index].influence > influencer.influence){
						influencer = this.battlefield[index];
					}else if(this.battlefield[index].influence > runnerUp){
						runnerUp = this.battlefield[index].influence;
					}
				}
			}
		)):(null);
		if(paul > -1){
			if(influencer.name != "Paul"){
				console.log('paul is not the influencer! damage time...'+influencer.influence+" less "+this.battlefield[paul].influence)

			}
		}
		console.log(influencer.name+" is the highest influencer by "+(influencer.influence-runnerUp))
		influencer.finalInfluence = influencer.influence - runnerUp
		return influencer
	}
	this.setInfluencing = function(){
		console.log('location:setInfluencing:')
		let influencer = this.compareInfluence();
		let baseInfluence = this.influence
		// if(this.name == "Canaan"){
		// 	baseInfluence += this.abilities[0]
		// 	baseInfluence += this.abilities[0]-1
		// 	baseInfluence += this.abilities[0]-2

		// 	//0 = -3
		// 	//1 = 0
		// 	//2 = 3
		// }
		console.log('influence looks like: '+influencer.finalInfluence+" vs "+baseInfluence +"+"+this.weariness*2)
		if(influencer.finalInfluence > baseInfluence +this.weariness*2 && influencer.name != 'neutral'){
			this.influencer = influencer
			console.log('new influencer is now'+influencer.name)

			if(this.name == "Canaan" && influencer.name != "neutral"){
				this.abilities = [(this.abilities[0]+1)];
				this.influence += this.abilities[0]*2
				// this.card.influence += 2;
				console.log('canaan conquered, tier up'+this.abilities[0])
				// console.log('remove influencer after tier up?')
			}
			if(influencer.name == "Paul"){
				this.proselytized = true;
				console.log('location has been proselytized')
			}

			console.log()
		}
			this.battlefield = [];
			console.log('influence for '+this.name+' checked; Influencer is now: '+this.influencer.name+" \n battlefield:"+JSON.stringify(this.battlefield))
			
		if(this.name == "Canaan"){
			this.weariness++;
			console.log('end of turn weariness for canaan')
		}
	}

}
