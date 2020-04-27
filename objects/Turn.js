module.exports.Turn = function Turn(mPlayers,mLocations,turn, mConquerer){
	//firstplayer
	let players = [...mPlayers]
	let locations = {...mLocations}
	// console.log('locations!!'+JSON.stringify(locations['nineveh']))
	let FP;
	let firstTurn = false;
	console.log('\n\n\n starting turn '+turn)

	this.playerTurn = function(player){
		let draws = 5;

		Object.keys(locations).map((location)=>{
			if(locations[location].influencer.name == player.name){
				let newHand = [...player.hand]
				newHand.push(locations[location].card)
				player.hand = [...newHand]
				console.log('adding influence card to hand'+JSON.stringify(player.hand))
				if(locations[location].card.draw > 0){
					// player.drawCards(1);
					draws += locations[location].card.draw
				}

			}
		})

		player.drawCards(draws)
		if(player.type == "AI"){
			player.AI.runStrategy();
		// player.AI.runStrategy();
		}

		player.discardHand();

		}
	this.setFirstPlayer = function(){

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
			// players[0].drawCards(1)
			firstTurn = true;
		}
	}//setfirstplayer


	this.setFirstPlayer();

	//foreach player starting with FP - end
	for(let x = FP; x < players.length; x++){
		this.playerTurn(players[x]);
	}
	//cycle through the fp loop 0 to FP
	for(let x = 0; x < FP; x++){
		this.playerTurn(players[x]);
	}
	


	Object.keys(locations).map((location, index)=>{
		locations[location].setInfluencing();
	})

	let calling = false;
	let caller;
	for(let x =0; x < players.length;x++){	
		if(players[x].winning){
			calling = true;
			caller = players[x].name
			// return [players,locations,turn,true,player.name+" via calling"]
		}
	}

	if(calling){
		return [players,locations,turn,true,caller]
	}
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
		return [players,locations,turn,true,locations['jerusalem'].influencer.name]
	}

	return [players,locations,turn,false,locations['jerusalem'].influencer.name]

	console.log('end of turn ')

}