module.exports.AI = function AI(player, locations){

		this.runStrategy = function(strategy){
				let strategem = strategy
			if(!strategy){
				strategem = player.name
			}


			console.log('getMaxCard:')
			let maxCard = 0;
			console.log(player.hand)
			
			player.hand.map((card,index)=>{
				console.log(card+index)
				if(card.influence > maxCard){
					maxCard = card.influence
				}
			})

			//char specific strategy
			switch(strategem){
				case "Esther":
				if(player.name != "Esther"){
					break;
				}
					// this.buySomething('babylon')
					// this.millSomething()
					// this.attackSomething()
						this.buySomething('babylon')
						this.millSomething();
						
					console.log('esther logic? '+player.getTotalInfluence())
					
					if(player.getTotalInfluence() > 24){
						player.winning = true;
						console.log('> is winnable for esther')
						for(let x= player.hand.length-1; x>-1 ;x--){
							locations['babylon'].playCard(x,player,maxCard)
						}
					}else
					{
						// basic strategy
						this.attackSomething(maxCard)
					}
				break;

				case "Jonah":
				console.log('jonah logic')
				if(player.name != "Jonah"){
					break;
				}

					// this.buySomething('babylon')
					// this.millSomething()
					// this.attackSomething()

					this.buySomething('nineveh')
					this.millSomething();
					

					let ninevites = 0;
					
					player.hand.map((card,index)=>{
						if(card.abilities.indexOf('ninevite') > -1){
							ninevites ++;
							console.log(ninevites+' in hand and '+player.discard.length+'+'+player.deck.length+" cards outside hand")
						}
					})

					if(ninevites > 3){
						player.winning = true;
						console.log('Jonah is winning? '+player.winning)
						
					}else{
						// this.attackSomething(maxCard);
					}
						for(let x = player.hand.length-1; x >= 0; x--){
							console.log('playing '+x+' of '+ninevites+" ninevites for the win")
							locations['nineveh'].playCard(x,player,maxCard)
						}
				break;
				default:
					this.buySomething('babylon')
					// this.millSomething()
					this.attackSomething(maxCard)

			}
		}



	this.buySomething = function(preference){
		let cashOnHand = player.getTotalGold();

		// //basic strategy
		switch(preference){
			case 'nineveh':
				if(locations['nineveh'].market.length > 0){
			
					// let gold = 50;
					let market = locations['nineveh'].market;
					
					if(market.length > 0){
						let caravanDex = market.findIndex((card)=>card.name == 'caravan');
						let prinIndex = market.findIndex((card)=>card.abilities.indexOf('ninevite')>-1)
						let drawDex = market.findIndex((card)=>card.draw>0)


							console.log('did we find a nin:'+prinIndex + JSON.stringify(market))
							if(caravanDex>=market[drawDex] && cashOnHand>=market[caravanDex].cost && caravanDex > -1){
								locations['nineveh'].buy(caravanDex,player)
								cashOnHand -= market[caravanDex].cost
								
							}
							if(cashOnHand>=market[drawDex] && cashOnHand>=market[drawDex].cost && drawDex > -1){
								locations['nineveh'].buy(drawDex,player)
								cashOnHand -= market[drawDex].cost
								
							}
							 if(cashOnHand>=market[prinIndex] && cashOnHand>=market[prinIndex].cost && prinIndex > -1){
								locations['nineveh'].buy(prinIndex,player)
								cashOnHand -= market[prinIndex].cost
							}else{
								this.buySomething()
							}

						}
					}
				
			break;
			case 'babylon':
				console.log('buy babylon')
				//buy the single most powerful card you can
				let buy = false;
				
					let locMarket = locations['babylon'].market
					if(locMarket.length > 0){
						for(let x =0; x < locMarket.length;x++){
							if(cashOnHand >= locMarket[x].cost){
								locations['babylon'].buy(x,player)
								buy = true;
								break;
							}
						}
					}
				
				if(!buy){
					this.buySomething();
				}
			break;
			case 'influence':
				console.log('buy babylon')
				//buy the single most powerful card you can
				let highLocation;
				let highIndex;
				let highInfluence = 2;
				Object.keys(locations).map((location,index)=>{
					let locMarket = locations[location].market
					if(locMarket.length > 0){
						for(let x =0; x < locMarket.length;x++){
							if(locMarket[x].influence > highInfluence && cashOnHand >= locMarket[x].cost){
								highLocation = location;
								highIndex = x
								highInfluence = locMarket[x].influence
							//	break;
							}
						}
					}
				})
				if(highLocation){
					locations[highLocation].buy(highIndex,player)
					
				}else{
					this.buySomething();
				}
			break;
			case 'gold':
				Object.keys(locations).map((location,index)=>{
				let locMarket = locations[location].market
				if(locMarket.length > 0){
					for(let x =0; x < locMarket.length;x++){
						if(locMarket[x].gold > 1 && cashOnHand >= locMarket[x].cost){
							cashOnHand -= locMarket[x].cost
							locations[location].buy(x,player)
							break;
						}
					}
				}
			})
			break;
			default:
				Object.keys(locations).map((location,index)=>{
					let locMarket = locations[location].market
					if(locMarket.length > 0){
						for(let x =0; x < locMarket.length;x++){
							if(locMarket[x] && cashOnHand >= locMarket[x].cost){
								cashOnHand -= locMarket[x].cost
								locations[location].buy(x,player)
								break;
							}
						}
					}
				})



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
		console.log('alltehgold' + allTehGold + ' all the cards:'+allCard)

		// if(allCard> 8){
			let hasPurse = player.hand.findIndex((card)=> card.name == "Purse")
			let hasInfluence = player.hand.findIndex((card)=>card.name=="Influence")
			
			if(hasInfluence > -1){
				console.log(player.name+' is milling influence')
				player.millCard(hasInfluence)
			}else if(allTehGold > 6 && hasPurse > -1){
				console.log(player.name+' is milling purse')
				player.millCard(hasPurse)
			}
		// }
		
	}

	this.attackSomething = function(maxCard){
		
		let target;
		Object.keys(locations).map((location, index)=>{
			let locationDifficulty = locations[location].compareInfluence();
			if(!target || locations[location].influencer.name != player.name){
				console.log('targeting '+locationDifficulty.name + " on "+locations[location].name)
				
					target = locations[location];
				
			}
		})

	//play cards on target
		console.log('playing '+player.hand.length)
		for(let x = player.hand.length -1; x >-1;x--){
			console.log('playing card:'+player.hand[x].name)
			target.playCard(x,player,maxCard)
		}
	}

	}