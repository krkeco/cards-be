const pl = require('./Player.js');
const cards = require('./CardData.js')
const deckData = new cards.data();
const ai = require('./AI.js')

module.exports.test = function PlayerTest(){
	let Jonah = new pl.Player(deckData.stories.jonah, deckData.decks.starter)
	console.log('testing '+Jonah.name)


	// this.deck = [story.character, ...deck]
	this.getCardGroups = function(){
		console.log("deck:"+Jonah.deck.length)
		console.log("hand:"+Jonah.hand.length)
		console.log("discard:"+Jonah.discard.length)
	}
	const getCardNames = (cards) => {
		console.log('cards:')
		cards.map((card,ind)=>{
			console.log(card.name)
		})
	}
	const playAllCards =(player, location)=>{
		for(let x= player.hand.length-1; x > -1 ;x--){
			console.log('x:'+x)
			location.playCard(x,Jonah, 0)
		}
	}
	this.getCardGroups();
	console.log('drawing 3')
	Jonah.drawCards(3)
	this.getCardGroups()
	console.log('drawing 5 more')
	Jonah.drawCards(5)
	this.getCardGroups()
	console.log('drawing 3 more')
	Jonah.drawCards(3)
	this.getCardGroups()
	console.log('drawing 3 more')
	Jonah.drawCards(3)
	this.getCardGroups()

	console.log('\n\ndiscarding')
	Jonah.discardHand()
	this.getCardGroups()
	
	console.log('\n\ndraw 5 discard 1')
	Jonah.drawCards(5)
	Jonah.discardCard(1)
	this.getCardGroups()
	


	console.log('milling 0')
	Jonah.millCard(0)
	this.getCardGroups()
	
	// // this.buyCard;

	Jonah.getTotalGold()

	Jonah.getTotalInfluence()



	//abilities
	const loc = require('./Location.js');
	let Nineveh = new loc.Location(deckData.decks.jonah,deckData.stories.jonah.location)
	this.getCardGroups();
	Jonah.drawCards(10);
	this.getCardGroups();
	playAllCards(Jonah, Nineveh)
	Nineveh.buy(0,Jonah)
	Nineveh.buy(0,Jonah)
	
	Nineveh.setInfluencing();
	Jonah.drawCards(11)
	getCardNames(Jonah.hand)
	playAllCards(Jonah, Nineveh)

}