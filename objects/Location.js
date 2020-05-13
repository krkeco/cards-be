
module.exports.Location = function Location(deck,story){
	this.deck = [...deck]
	this.card = story.card
	this.info = story.info;
	this.market = []
	this.battlefield = [];
	this.name = story.name;
	this.influence = story.influence;
	this.weariness = 0;
	this.abilities = story.abilities;
	this.influencer = {name:'neutral'};
	this.proselytized = false;
	this.angelic = false;
	
	this.wounds = 0;
	this.hardened = 0;
	this.edicts = 0;

	this.setWeariness = function(newfear){
		this.weariness = newfear
		//console.log('weariness:'+this.weariness)
	}

	this.refreshMarket = function(playerName){
		let newField= [...this.battlefield]
		//console.log('location refreshMarket by '+playerName+JSON.stringify(newField))
		let player; 
		newField.map((pl,index)=>{
			if(pl){
				//console.log(pl.name+'mapped')
				if(pl.name==playerName){
					//console.log('found player in bf')
					player= pl;
					if(player && player.gold > 0){
						let newDeck = [...this.deck, ...this.market]
						this.deck = [...newDeck];
						this.market = []
						this.drawOne();
						this.drawOne();
						this.drawOne();
						player.gold -= 1;
						this.battlefield = [...newField]
						//console.log('market refreshed')
						return 'market refreshed'
					}
			}else{
				
				//console.log('no player in bf found')
			}
				}
		})
		// //console.log(player.name+' is refreshing')
			//console.log('market NOT refreshed')
		return 'market not refreshed'
	}
	this.drawOne = function() {
		let newMarket = [...this.market]
		let newDeck = [...this.deck]
		//console.log('location:drawOne:')
		if(newDeck.length > 0){
				let ranCard = Math.floor(Math.random()*(newDeck.length-1));
				newMarket.push(newDeck[ranCard])
				newDeck.splice(ranCard,1)
			}else{
				//console.log('the market is empty!')
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
			// //console.log('market: '+this.market)
			// //console.log('market: '+JSON.stringify(this.deck))
	}

	this.buy = function(index, player){
		if(this.battlefield[player.id] && this.battlefield[player.id].gold >= this.market[index].cost){
				//console.log('location:buy:'+JSON.stringify(this.market[index].name))
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
		//console.log('owner id:'+owner.id)
		let newField = [...this.battlefield]
		//console.log('location:playcard:'+card)
		if(!newField[owner.id]){
			newField[owner.id] = {name: owner.name,influence:0,gold:0,politics:0,poliBonus:0, cards:[]};
		}
		//console.log('play card'+owner.hand[card].name)
		newField[owner.id].influence += owner.hand[card].influence
		newField[owner.id].gold += owner.hand[card].gold
		newField[owner.id].cards.push(owner.hand[card]);
		
		//special abilities here!
		//ninevite
		if(owner.hand[card].abilities.indexOf('Ninevite') > -1 && this.name == "Nineveh"){
			newField[owner.id].influence += 2;
			//console.log('ninevite advantage bonus')
		}
		
		if(owner.hand[card].abilities.indexOf('angelic') > -1){
			this.angelic = true;
		}
		if(owner.hand[card].abilities.indexOf('mob') > -1){
			newField[owner.id].influence += newField[owner.id].cards.length-1;
			card.influence += newField[owner.id].cards.length-1;
		}
		 if(owner.hand[card].abilities.indexOf('mordecai') > -1){
			let greatest = 0;
			newField[owner.id].cards.map((card,index)=>{
				if(card.influence > greatest){
					greatest = card.influence
				}
			})
			newField[owner.id].influence += greatest;
			//console.log('mordecai added '+greatest+" to this location")
		}

		if(owner.hand[card].abilities.indexOf('haman') > -1){
			newField.map((bf, ind)=>{
				if(bf && bf.name != owner.name){
					bf.haman = true;
				}
			})
		}

		if(owner.hand[card].fear){
			//console.log('adding influence to location:'+this.weariness+" add "+owner.hand[card].wear)
			this.weariness += parseInt(owner.hand[card].fear);
		}
		 if(owner.hand[card].faith){
			this.weariness -= owner.hand[card].faith;
			if(this.weariness < 0){
				this.weariness = 0;
			}
		}
		if(owner.hand[card].abilities.indexOf('faithful') > -1){
			if(!newField[owner.id].faithfulReport){
				newField[owner.id].faithfulReport =0;
			}
			newField[owner.id].faithfulReport +=1
		}
		 if(owner.hand[card].abilities.indexOf('balaam') > -1){
			newField[owner.id].influence += copyInfluence;
			//console.log('balaam added '+copyInfluence+" to this location")
		}
		 if(owner.hand[card].reinforce > 0){	
			for(let x = 0; x < owner.hand[card].reinforce; x++){
				//console.log('reinforcements!')
				if(owner.deck.length >0 || owner.discard.length >0){
					owner.drawCards(1)
				this.battlefield = [...newField]
				this.playCard((owner.hand.length-1),owner)
				}else{
					//console.log('your deck is empty cannot reinforce')
				}
			}
		}
		 if(owner.hand[card].name=='Paul'){
			newField[owner.id].playPaul = true;
			//console.log('paul played on location')
		}
		
		if(owner.hand[card].abilities.indexOf('Harden') > -1 && this.name == "Nineveh"){
			this.hardened++;
			//console.log('Jonah has been hardened'+this.hardened)
		}
		//can't else this because some cards have both edict and politics
		if(owner.hand[card].abilities.indexOf('edict') > -1){
			this.edicts++;
			//console.log('played an edict, now there are '+this.edicts)
		}
		if(owner.hand[card].politics){
			newField[owner.id].politics += owner.hand[card].politics;
			newField[owner.id].poliBonus = newField[owner.id].politics * this.edicts
			//console.log('total politics bonus for loc is:'+newField[owner.id].politics +"*"+ this.edicts + newField[owner.id].poliBonus)
		}

		this.battlefield = newField;
		let theString = `played ${owner.hand[card].name} on ${this.name}`
		//console.log(owner.name+" played "+owner.hand[card].name+" on "+this.name+" for influence new: "+newField[owner.id].influence)
		// //console.log(JSON.stringify(newField)+JSON.stringify(this.battlefield))
		let cardName = owner.hand[card].name
		if(owner.hand[card].abilities.indexOf("scrap") < 0){
			owner.playedCard(card)
			return theString;
		}else{
			owner.millCard(card)
			owner.mills--;

			// let newHand = [...owner.hand]
			// newHand.splice(card,1)
			// owner.hand = [...newHand]
			//console.log('this is an influence card and is not discarded')
			return theString;
		}
	}

	this.compareInfluence = function(){
		//console.log('location:compareInfluence:')
		let influencer ={name: 'neutral',influence:this.influence, poliBonus:0};
		
		let runnerUp = 0;
		let paul = -1;
		if(this.battlefield.length > 0) {
			this.battlefield.map((player,index) => {
				if(player && this.battlefield[index] ){

					//paul
					if(this.battlefield[index].playPaul){
						//console.log('paul is playign')
						paul = index;
					}

					//faithful report
					if(this.battlefield[index].faithfulReport){
						while(this.battlefield[index].faithfulReport >0 && this.battlefield[index].gold > 2){
							this.weariness -=3
							this.battlefield[index].faithfulReport--;
							this.battlefield[index].gold -=3;

						}

					} 

					//haman
						
							if(player.haman){
								let greatest = 0;
								let greatDex;
								player.cards.map((card,index)=>{
									if(card.influence > greatest){
										greatest = card.influence
										greatDex = player
									}
								})
								if(greatDex){
									greatDex.influence -=greatest
									//console.log('haman reduce '+greatDex.name+"'s influence by "+greatest)
								}else{
									//console.log=('nothing to reduce for haman')
								}			
							}


					// //console.log('player from battlefield'+player+index)
					if(this.battlefield[index].influence + this.battlefield[index].poliBonus > influencer.influence + influencer.poliBonus ){
						influencer = this.battlefield[index];
					}else if(this.battlefield[index] && this.battlefield[index].influence > runnerUp){
						runnerUp = this.battlefield[index].influence;
					}
				}
			}
		)
		}
		if(paul > -1){
			if(influencer.name != "Paul"){
				//console.log('paul is not the influencer! damage time...'+influencer.influence+" less "+this.battlefield[paul].influence)

			}else{
				if(influencer.influence > 6 && !this.angelic){
					this.proselytized = true;
					//console.log('location has been proselytized')
				}

			}
		}
		if(!runnerUp){
		runnerUp = 0;
		} 
		// //console.log(influencer.name+" is the highest influencer by "+influencer.influence+runnerUp);
		influencer.finalInfluence = influencer.influence - runnerUp + influencer.poliBonus
		return influencer
	}
	this.setInfluencing = function(){

		if(this.angelic){
			//console.log('moments peace no influence today')
			this.postInfluencePhase()
			
		}else{
		//console.log('location:setInfluencing:')
		let influencer = this.compareInfluence();
		let baseInfluence = this.influence

		// //console.log('influence looks like: '+influencer.finalInfluence+" vs "+baseInfluence +"+"+this.weariness*2)
		if(influencer.finalInfluence > baseInfluence +this.weariness*2 && influencer.name != 'neutral'){
			this.influencer = influencer
			// //console.log('new influencer is now'+influencer.name)

			if(this.name == "Canaan" && influencer.name == "Joshua"){
				this.abilities = [(this.abilities[0]+1)];
				this.influence += 3
				this.card.influence += 2;
				//console.log('canaan conquered, tier up'+this.abilities[0])
			}
		
		}
			
			this.postInfluencePhase()
			//console.log('influence for '+this.name+' checked; Influencer is now: '+this.influencer.name+" \n battlefield:"+JSON.stringify(this.battlefield))
		}		
	}
	this.postInfluencePhase = function(){
		this.angelic = false;
		this.battlefield = [];
		this.edicts = 0;
		if(this.name == "Canaan"){
			this.weariness++;
			//console.log('end of turn weariness for canaan')
		}
	}

}
