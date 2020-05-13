module.exports.AI = function AI(player, locations){

		this.runStrategy = async(strategy) =>{
			try{

			//console.log('running strategy '+strategy+' for player '+player.name);
				let strategem = strategy
			if(!strategy){
				strategem = player.name
			}


			//console.log('getMaxCard:');
			let maxCard = 0;
			//console.log(player.hand);
			
			player.hand.map((card,index)=>{
				//console.log(card+index);
				if(card.influence > maxCard){
					maxCard = card.influence
				}
			})
			this.buySomething();
			this.attackSomething();
			return true;
		}catch(e){
			return false;
		}

		}



	this.buySomething = function(preference){
		let cashOnHand = player.getTotalGold();

		let cardCost = 0;
		let cardLocation;
		let cardIndex;

				Object.keys(locations).map((location,index)=>{
					let locMarket = locations[location].market
					if(locMarket.length > 0){

						for(let x =0; x < locMarket.length;x++){
							if(locMarket[x] && cashOnHand >= locMarket[x].cost){
								if(locMarket[x].cost > cardCost){
									cardCost = locMarket[x].cost;
									cardLocation = location;
									cardIndex = x;
								}
							}
						}
					}
				})
				if(cardLocation){
					//we can afford a card
				for(let c = player.hand.length-1; c > -1; c--){
					if(player.hand[c].gold > 0){
						locations[cardLocation].playCard(c, player)
					}
				}
				locations[cardLocation].buy(cardIndex, player)

				}

		}

	this.millSomething = function(){
		// player.hand.indexOf()
		let allTehGold = 0;
		let allCard =0;
		player.hand.map((card,index)=>{
			allTehGold += player.hand[index].gold
			allCard++
		})
		player.deck.map((card,index)=>{
			allTehGold += player.deck[index].gold
			allCard++
		})
		player.discard.map((card,index)=>{
			allTehGold += player.discard[index].gold
			allCard++
		})
		//console.log('alltehgold' + allTehGold + ' all the cards:'+allCard)

		if(allCard> 8){
			let hasPurse = player.hand.findIndex((card)=> card.name == "Purse")
			let hasInfluence = player.hand.findIndex((card)=>card.name=="Influence")
			
			if(hasInfluence > -1){
				player.mills ++;
				//console.log(player.name+' is milling influence'+player.mills)
				player.millCard(hasInfluence)
			}else if( hasPurse > -1){
				player.mills ++;
				//console.log(player.name+' is milling purse'+player.mills)
				player.millCard(hasPurse)
			}
		}
		
	}

	this.attackSomething = function(maxCard){
		
		let target;
		Object.keys(locations).map((location, index)=>{
			let locationDifficulty = locations[location].compareInfluence();
			if(!target || locations[location].influencer.name != player.name){
				////console.log('targeting '+locationDifficulty.name + " on "+locations[location].name);
				
					target = locations[location];
				
			}
		})

	//play cards on target
		//console.log('playing '+player.hand.length);
		for(let x = player.hand.length -1; x >-1;x--){
			//console.log('playing card:'+player.hand[x].name);
			target.playCard(x,player,maxCard)
		}
	}

	}