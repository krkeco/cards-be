module.exports.Player =  function Player(story, deck) {
	this.deck = [story.character, ...deck]
	this.hand = []
	this.discard = []
	this.firstPlayer = false;
	this.winning = false;
	this.name = story.character.name;
	// this.AI = new ai.AI(this);

	this.drawCards = function(cardCount){
	console.log('drawcards:'+this.deck.length+"/"+this.hand.length +"/" +this.discard.length)
	// let randomLng = this.deck.length-1
	let newDeck = [...this.deck]
	let newDiscard = [...this.discard]
	let newHand = [...this.hand]
	// let drawMore = 0;
	let cardsLeft = cardCount;
	while(cardsLeft > 0){
		if(newDeck.length == 0 && newDiscard.length > 1){
			newDeck = [...this.discard]
			newDiscard = []

		}else if(newDeck.length == 0 && newDiscard.length == 0){
			cardsLeft = 0;
			console.log('you drew all the cards!')
		}else{
			cardsLeft--
			let ranCard = Math.floor(Math.random()*(newDeck.length-1));
			if(newDeck[ranCard] && newDeck[ranCard].abilities.indexOf('scrap') > -1){
				cardsLeft++
				console.log('drew a location card, banishing')
				newDeck.splice(ranCard,1)

			}else{

				if(newDeck[ranCard] && newDeck[ranCard].draw){
					cardsLeft += newDeck[ranCard].draw
					console.log('drew '+newDeck[ranCard].name+" drawing more cards")
				}
				if(newDeck[ranCard]){
					newHand.push(newDeck[ranCard])
					newDeck.splice(ranCard,1)
				}
			}

		}
	}
		this.deck = [...newDeck]
		this.discard = [...newDiscard]
		this.hand = [...newHand]
		console.log('drawcards:'+this.deck.length+"/"+this.hand.length +"/" +this.discard.length)

	}

	this.discardHand = function(){
		console.log('discardHand:')
		this.hand.map((card,index)=>{
			if(card && card.abilities.indexOf('scrap')){
				this.hand.splice(index,1)
			}
		})
		this.discard = [...this.discard, ...this.hand]
		this.hand =[]
	}
	this.discardCard = function(index){
		let newHand = [...this.hand]
		console.log('discardCard:')
		this.discard = [...this.discard, this.hand[index]]
		newHand.splice(index,1)
		this.hand = [...newHand]
		console.log('hand now:'+this.hand.length)
	}

	this.buyCard = function(card){
		console.log('buyCard:')
		console.log(card)
		this.discard = [card, ...this.discard]
	}

	this.millCard = function(index){
		console.log('millCard:')
		let newHand = [...this.hand]
		newHand.splice(index,1);
		this.hand = [...newHand]
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
		console.log('getTotalInfluence: '+influence+' influence this turn with '+this.hand.length+ ' cards')
		console.log(this.hand.map((card)=>card.name+card.influence))
		return influence;
	}

}
