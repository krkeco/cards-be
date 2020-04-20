module.exports.Turn = function Turn(mPlayers,mLocations,turn, mConquerer){
	//firstplayer
	let players = [...mPlayers]
	let locations = {...mLocations}
	console.log('locations!!'+JSON.stringify(locations['nineveh']))
	let FP;
	let firstTurn = false;
	console.log('\n\n\n starting turn '+turn)

	this.isEstherWin = function(){
		let babFluence = 0;
		console.log('babylon?'+locations['babylon'].name)
		if(locations['babylon'].battlefield['Esther'] && locations['babylon'].battlefield['Esther'].cards){
			console.log('Esther lon')
			locations['babylon'].battlefield['Esther'].cards.map((card,index)=>{
				
				babFluence += card.influence;
				
				console.log(card)
			})
		}
		if(babFluence > 16){
			console.log('we have 16+ influence on babylon!!!!')
			return true

		}else{
			console.log('we only have '+babFluence+ ' infleunce on Babylon')
			return false
		}
	}

	this.isJonahWin = function(){
		let ninevites = 0;
		if(locations['nineveh'].battlefield['Jonah'] && locations['nineveh'].battlefield['Jonah'].cards){
			console.log('jonah nin')
			locations['nineveh'].battlefield['Jonah'].cards.map((card,index)=>{
				if(card.abilities.indexOf('ninevite') > -1){
					ninevites++;
				}
				console.log(card)
			})
		}
		if(ninevites > 4){
			console.log('we have 5+ ninevites!!!!')
			return true

		}else{
			console.log('we only have '+ninevites+ ' ninevites')
			return false
		}
	}

	this.isConquererWin = function() {
			let conquerer = false;
	if(locations['jerusalem'].influencer.name != 'neutral'){
		conquerer = true;
	}
	Object.keys(locations).map((location, index)=>{
		if(locations[location].influencer.name != locations['jerusalem'].influencer.name){
			conquerer = false
		}
	})
	
	if(conquerer){
		console.log(locations['jerusalem'].influencer.name+' has won the game by influence!')
		return true
	}else{
		console.log('no one won this turn by influence')
		return false;
	}

	}

	this.buySomething = function(player,gold,locPreference){

		//basic strategy
		if(locPreference == 'nineveh'){
			console.log('location pref is nineveh'+locations['nineveh'].market)

				if(locations['nineveh'].market.length > 0){
			locations['nineveh'].market.map((card,index)=>{
				console.log('nineveh market:'+card)
				if(gold >= card.cost && card.abilities.indexOf('ninevite') > -1){
					//buy the card if you can
					locations['nineveh'].buy(index, player)
					gold -= card.cost;
					console.log(player.name+' bought '+card.name + ' a ninevite')
				}else if (gold >= card.cost ){
					locations['nineveh'].buy(index, player)
					gold -= card.cost;					
					console.log(player.name+' bought '+card.name)	
				}
			})
		}
		}else{

			Object.keys(locations).map((location,index)=>{
				if(locations[location].market.length > 0){
					locations[location].market.map((card,index)=>{
						if(gold >= card.cost){
							//buy the card if you can
							locations[location].buy(index, player)
							gold -= card.cost;						
							console.log(player.name+' bought '+card.name)
						}
					})
				}
			})

		}

	}
	this.millSomething = function(player, gold, allGold, allInfluence){

		//mill purses
		let hasPurse = player.hand.indexOf(player.hand.find((card)=>card.name=="Purse"))
		let hasInfluence = player.hand.indexOf(player.hand.find((card)=>card.name=="Influence"))
		
		if(gold > 0 && hasPurse > -1 && allGold > 6){
			console.log('milling purse from '+player.hand.length +"index:"+hasPurse)
			player.millCard(hasPurse)
			console.log('milled purse from '+player.hand.length)
		}else if(hasInfluence > -1 && allInfluence > 10){
			console.log('milling purse from '+player.hand.length)
			player.millCard(hasInfluence)
			console.log('milled purse from '+player.hand.length)

		}
	}

	this.attackSomething = function(player){
		
		let target;
		Object.keys(locations).map((location, index)=>{
			let locationDifficulty = locations[location].compareInfluence();
			if(!target 
				|| (locationDifficulty.influence + locationDifficulty.baseInfluence < target.baseInfluence+ target.influence
					&& locations[location].influencer.name != player.name)){
				console.log('targeting '+locationDifficulty.name + " on "+locations[location].name)
				
					target = locations[location];
				
			}
		})

		//play cards on target
		player.hand.map((card,index)=>{
			target.playCard(index,player)
		})

	}

	this.playerTurn = function(player){

		player.drawCards(5)

		//get some basic stats
		let gold = player.getTotalGold()
		let allCards = [...player.hand,...player.deck,...player.discard]
		let allInfluence = 0;
		let allGold = 0;
		allCards.map((card,index)=>{
			allInfluence += card.influence;
			allGold += card.gold;
		})

		//char specific strategy
		switch(player.name){
			case "Esther":
				if(allInfluence > 16){
					console.log('>16 is winnable for esther')
					// this.buySomething(player,gold);
					// this.millSomething(player, gold, allGold, 0);
					player.hand.map((card,index)=>{
						locations['babylon'].playCard(index,player)
					})
				}else{
					//basic strategy
					// this.buySomething(player,gold);
					// this.millSomething(player, gold, allGold, allInfluence);
					this.attackSomething(player)
				}
			break;

			case "Jonah":
				let ninevites = 0;
				player.hand.map((card,index)=>{
					if(card.abilities.indexOf('ninevite') > -1){
						ninevites ++;
					}
				})
				if(ninevites > 4){
					this.buySomething(player,gold,'nineveh');
					// this.millSomething(player, gold, allGold, 0);
					player.hand.map((card,index)=>{
						locations['nineveh'].playCard(index,player)
					})
				}else{
					this.buySomething(player,gold,'nineveh');
					// this.millSomething(player, gold, allGold, allInfluence);
					this.attackSomething(player)

				}
			break;
		}

		player.discardHand();

		}

		let newFP = false;
	players.map((player,index)=>{
		if(player.firstPlayer && !newFP){
			player.firstPlayer=  false;
			FP = index+1
			if (FP > players.length-1){
				FP = 0;
			}
			players[FP].firstPlayer = true
			newFP = true;
			console.log('firstplayer:'+player.name)
		}
	})
	if(!FP){
		players[0].firstPlayer = true;
		FP = 0
		players[0].drawCards(1)
		firstTurn = true;

		// players.map((player,index)=>{
		// 	if(!player.firstPlayer){
		// 		// player.drawCards(1);
		// 	}
		// })
	}

	//foreach player starting with FP - end
	for(let x = FP; x < players.length; x++){
		this.playerTurn(players[x]);
	}
	//cycle through the fp loop 0 to FP
	for(let x = 0; x < FP; x++){
		this.playerTurn(players[x]);
	}
	

	// console.log('checking player win conditions')
	// players.map((player,index)=>{
	// 	switch(players[index].name){
	// 		case 'Jonah':
	// 			let ninevites = 0;
	// 			console.log('nineveh?'+locations['nineveh'].name)
	// 			if(locations['nineveh'].battlefield['Jonah'] && locations['nineveh'].battlefield['Jonah'].cards){
	// 				console.log('jonah nin')
	// 				locations['nineveh'].battlefield['Jonah'].cards.map((card,index)=>{
	// 					if(card.abilities.indexOf('ninevite') > -1){
	// 						ninevites++;
	// 					}
	// 					console.log(card)
	// 				})
	// 			}
	// 			if(ninevites > 4){
	// 				console.log('we have 5+ ninevites!!!!')
	// 				return [players,locations,turn,true,"Jonah"]

	// 			}else{
	// 				console.log('we only have '+ninevites+ ' ninevites')
	// 			}
	// 		break;
	// 		case 'Esther':
	// 		console.log('wincase esther')
	// 		let babFluence = 0;
	// 			console.log('babylon?'+locations['babylon'].name)
	// 			if(locations['babylon'].battlefield['Esther'] && locations['babylon'].battlefield['Esther'].cards){
	// 				console.log('Esther lon')
	// 				locations['babylon'].battlefield['Esther'].cards.map((card,index)=>{
						
	// 						babFluence += card.influence;
						
	// 					console.log(card)
	// 				})
	// 			}
	// 			if(babFluence > 16){
	// 				console.log('we have 16+ influence on babylon!!!!')
	// 				return [players,locations,turn,true,"Esther"]

	// 			}else{
	// 				console.log('we only have '+babFluence+ ' infleunce on Babylon')
	// 			}
	// 		break;
	// 		case 'Paul':
	// 		break;
	// 		case 'Joshua':
	// 		break;
	// 	}
	// })

	//set influencers
	Object.keys(locations).map((location, index)=>{
		locations[location].setInfluencing();
		})

	//check win conditions
	// if(this.isConquererWin()){
	// 	return [players,locations,turn,true,locations['jerusalem'].influencer.name]
	// }else 
	// if(this.isEstherWin()){
	// 	return [players,locations,turn,true,"Esther"]
	// }else 
	if(this.isJonahWin()){
		return [players,locations,turn,true,"Jonah"]
	}else{
		return [players,locations,turn,false,locations['jerusalem'].influencer.name]
	}



	console.log('end of turn ')


	

}