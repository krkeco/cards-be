const fetch = require('node-fetch');
// const deckData = require('../decks.json');
const getDeckData = async() => {
  try{
    console.log('trying call')
    
    // fetch('https://calling-platform.s3-us-west-2.amazonaws.com/decks.json')
    // .then(res => res.json())
    // .then(json => console.log(json))

    let res = await fetch('https://calling-platform.s3-us-west-2.amazonaws.com/decks.json')
    let response = await res.json();
    // console.log(response)
    return response;

  }catch(e){
    console.log('no fetch'+e);
  }

}

 const cardData = async() => {
  let decks = {};
  console.log('getting deck')
  let deckData = await getDeckData();
  Object.keys(deckData.decks).map((deck) => {
    decks[deck] = [];
    deckData.decks[deck].map((card, index) => {
      for (let y = 0; y < card.quantity; y++) {
        decks[deck].push(card);
        // console.log('pushing'+card.name)
       }
    });
  });

  let cardData = { stories: {...deckData.stories}, decks: {...decks}, infoDecks: {...deckData.decks} };
  console.log('return dd'+cardData)
  return cardData;
};

module.exports.data = async() => cardData();