const deckData = require('../decks.json');

module.exports.data = function CardData() {
  let decks = {};
  Object.keys(deckData.decks).map((deck) => {
    decks[deck] = [];
    deckData.decks[deck].map((card, index) => {
      for (let y = 0; y < card.quantity; y++) {
        decks[deck].push(card);
       }
    });
  });

  let cardData = { stories: {...deckData.stories}, decks: {...decks}, infoDecks: {...deckData.decks} };
  
  return cardData;
};
