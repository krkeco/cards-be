module.exports.Player =  function Player(story, deck) {
	this.deck = [story.character, ...deck]
	this.hand = []
	this.discard = []
	this.firstPlayer = false;
	this.name = story.character.name;

	this.drawCards = function(cardCount){
	console.log('drawcards:'+this.deck.length+"/"+this.hand.length )
	// let randomLng = this.deck.length-1
	for(let x = 0; x < cardCount; x++){
		if(this.deck.length == 0 && this.discard.length > 1){
			// randomLng = this.discard.length-1
			this.deck = [...this.discard]
			this.discard = []
			console.log('shuffling discard into deck')
			cardCount -= x
			x = 0;
		}else
		if(this.deck.length == 0 && this.discard.length == 0){
			console.log('you drew all your cards!')
			break;
		}

			let ranCard = Math.floor(Math.random()*(this.deck.length-1));
			if(!this.deck[ranCard]){
			console.log(this.deck.length+"/"+ranCard+"/"+this.deck[ranCard]+'<lng? this card is not real!!! \n\n\n\n\n')

			}
			let card = this.deck[ranCard]
			this.hand.push(card)
			this.deck.splice(ranCard,1)
			if(card.draw){
				console.log('drew '+card.name+" drawing more cards!")
				this.drawCards(card.draw)
			}
			// console.log(ranCard);
		
		}
	}

	this.discardHand = function(){
		console.log('discardHand:')
		this.discard = [...this.discard, ...this.hand]
		this.hand =[]
	}
	this.discardCard = function(index){
		console.log('discardCard:')
		this.discard = [...this.discard, this.hand[index]]
		this.hand.splice(index,1)
		
		console.log('hand now:'+this.hand.length)
	}

	this.buyCard = function(card){
		console.log('buyCard:')
		console.log(card)
		this.discard = [card, ...this.discard]
	}

	this.millCard = function(index){
		console.log('millCard:')
		this.hand.splice(index,1);
	}

	this.getTotalGold = function(){
		console.log('getTotalGold:')
		let golds = 0;
		this.hand.map((card,index)=>{
			golds += this.hand[index].gold
		})
		console.log('has '+golds+' golds')
		return golds;
	}
	this.getTotalInfluence = function(){
		console.log('getTotalInfluence:')
		let influence = 0;
		this.hand.map((card,index)=>{
			influence += this.hand[index].influence
		})
		console.log('has '+influence+' influence this turn')
		return influence;
	}
}
