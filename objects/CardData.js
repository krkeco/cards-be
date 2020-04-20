
const deckData = require('../decks.json')

module.exports.data =  function cardData(){

	let decks = deckData.decks;

	//set deck sizes
	Object.keys(decks).map((deck)=>{
		decks[deck].map((card,index) => {
			for(let x = 0; x < decks[deck][index].quantity-1; x++){
				decks[deck].push(decks[deck][index])
			}
		})
	})
	let cardData = {stories: deckData.stories, decks: decks}

	return cardData
}