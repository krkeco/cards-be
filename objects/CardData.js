
const deckData = require('../decks.json')

module.exports.data =  function CardData(){

	let decks = {};
	let cardsPushed = 0;
	//set deck sizes
	console.log(Object.keys(deckData.decks))
	Object.keys(deckData.decks).map((deck)=>{
		decks[deck] = []
		// for(let x = deckData.decks[deck].length-1; x > 0; x--){
		deckData.decks[deck].map((card,index) => {
			for(let y = 0; y < card.quantity; y++){
				decks[deck].push(card)
				cardsPushed ++;
			}
		})
		console.log(deck+' pushed:'+cardsPushed)
		cardsPushed = 0;
	})
	let cardData = {stories: deckData.stories, decks: decks}
	return cardData
}