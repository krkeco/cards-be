module.exports.Turn = function Turn(mPlayers,mLocations){
	//firstplayer
	let players = [...mPlayers]
	let locations = [...mLocations]
	let FP;
	players.map((player,index)=>{
		if(player.firstPlayer){
			FP = index
			console.log('firstplayer:'+player.name)
		}
	})
	if(!FP){
		players[0].firstPlayer = true;
	}

	//foreach player
	//CHANGE THIS TO FIRSTPLAYER ROTATION
	for(let x = 0; x < players.length; x++){
		
		players[x].drawCards(5)
		
		//buy
		let gold = players[x].getTotalGold()
		let markets = []
		locations.map((location,index)=>{
			if(location.market.length > 0){
				location.market.map((card,index)=>{
					markets.push({location:location,card:card,index:index})
				})
			}
		})

		//card buy logic basic
		markets.sort((a,b) => b.cost - a.cost)
		markets.map((market,index)=>{
			console.log(market.card.name+' is for sale for '+market.card.cost)
			if(gold >= market.card.cost){
				//buy the card if you can
				market.location.buy(market.index, players[x])
				gold -= market.card.cost;
				console.log('bought card gold left:'+gold)
			}
		})
		


		//influence
		let target;
		locations.map((location, index)=>{
			let difficulty = location.compareInfluence();
			if(!target || difficulty.influence + difficulty.baseInfluence < target.influence){
				console.log('changing target to '+difficulty.name + " on "+location.name)
			}
		})

		let influence = players[x].getTotalInfluence()
	}

		//draw 
		/*
		make buy
			check gold
			buy ai
		make influence
			check influence
			compare to locations (with players)
			influence ai
		make mill
			mill ai

		*/

// Babylon.compareInfluence()


	//check win conditions
	//set player1
	//discard


}