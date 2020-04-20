
module.exports.Location = function Location(deck,story){
	this.deck = [...deck]
	this.market = []
	this.battlefield = {}
	this.name = story.name;
	this.influence = story.influence;
	this.abilities = story.abilities;
	this.influencer = {name:'neutral'};

	this.drawOne = function() {
		console.log('location:drawOne:')
		if(this.deck.length > 0){
				let ranCard = Math.floor(Math.random()*(this.deck.length-1));
				this.market.push(this.deck[ranCard])
				this.deck.splice(ranCard,1)
			}else{
				console.log('the market is empty!')
			}
	}
	// createMarket = function(){
		//all decks start with 1 2cost and 1 3 cost card atm
	if(this.deck.length > 0){//otherwise jerusalem has no market
			this.market.push(this.deck[0])
			this.deck.splice(0,1)
			this.market.push(this.deck[0])
			this.deck.splice(0,1)
			this.drawOne();
			// console.log('market: '+this.market)
	}

	this.buy = function(index, player){
		console.log('location:buy:'+JSON.stringify(this.market[index]))
		player.buyCard(this.market[index])
		this.market.splice(index,1)
		this.drawOne();
		// console.log('jonah discard:'+JSON.stringify(player.discard))
		// console.log('babylon market:'+JSON.stringify(this.market))
	}

	this.playCard = function(card,owner){
		console.log('location:playcard:')
		if(!this.battlefield[owner.name]){
			this.battlefield[owner.name] = {name: owner.name,influence:0,gold:0, cards:[]};
		}
		console.log('play card'+owner.hand[card])
		this.battlefield[owner.name].influence += owner.hand[card].influence
		this.battlefield[owner.name].gold += owner.hand[card].gold
		this.battlefield[owner.name].cards.push(owner.hand[card]);
		
		//special abilities here!
		console.log(owner.name+" played "+owner.hand[card].name+" for influence: "+this.battlefield[owner.name].influence)

		owner.discardCard(card)
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
		if(influencer.influence > this.influence && influencer.name != 'neutral'){
			this.influencer = influencer
			this.battlefield = []
			console.log()
		}
			console.log('influence for '+this.name+' checked; Influencer is now: '+this.influencer.name)
	}

}
