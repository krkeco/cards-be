module.exports.Player =  function Player(story, deck) {
	this.deck = [story.character, ...deck]
	this.hand = []
	this.discard = []
	this.firstPlayer = false;
	this.name = story.character.name;

	this.drawCards = function(cardCount){
	console.log(this.deck.length+"/"+this.hand.length )
	for(let x = 0; x < cardCount; x++){
		if(this.deck.length == 0 && this.discard.length > 1){
			this.deck = [...this.discard]
			this.discard = []
			console.log('shuffling discard into deck')
		}else
		if(this.deck.length == 0 && this.discard.length == 0){
			console.log('you drew all your cards!')
			break;
		}

			let ranCard = Math.floor(Math.random()*(this.deck.length));
			this.hand.push(this.deck[ranCard])
			this.deck.splice(ranCard,1)
			// console.log(ranCard);
		
		}
	}

	this.discardHand = function(){
		this.discard = [...this.discard, ...this.hand]
		this.hand =[]
	}
	this.discardCard = function(index){
		this.discard = [...this.discard, this.hand[index]]
		this.hand.splice(index,1)
		
		console.log('hand now:'+this.hand.length)
	}

	this.buyCard = function(card){
		this.discard = [card, ...this.discard]
		console.log(this.discard)
	}

	this.millCard = function(index){
		this.hand.splice(index,1);
	}

	this.getTotalGold = function(){
		let golds = 0;
		this.hand.map((card,index)=>{
			golds += this.hand[index].gold
		})
		console.log('has '+golds+' golds')
		return golds;
	}
	this.getTotalInfluence = function(){
		let influence = 0;
		this.hand.map((card,index)=>{
			influence += this.hand[index].influence
		})
		console.log('has '+influence+' influence this turn')
		return influence;
	}
}
