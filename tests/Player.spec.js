
const pl = require("../objects/Player");
const cards = require('../objects/CardData.js');
const deckData = new cards.data();
const seed = [{name:'gold',abilities:[],quantity:2,cost:1,gold:1,influence:1},{name:'influence',abilities:[],quantity:2,cost:1,gold:2,influence:2},{name:'prince',abilities:[],quantity:2,cost:1,gold:1,influence:2}]

describe("initialize player object", () => {

let player = new pl.Player({...deckData.stories.esther},[...deckData.decks.starter],"player",);  
    test("empty hand", () => {
      expect(player.hand).toEqual([]);
    });
    test("full deck", () => {
      expect(player.deck.length).toEqual(10);
    });
    test("empty discard", () => {
      expect(player.discard).toEqual([]);
    });
    test("empty played", () => {
      expect(player.played).toEqual([]);
    });
});

describe("removePlayed function", () => {
  let player = new pl.Player(deckData.stories.esther,deckData.decks.starter,"player",);  
   const discard = [{name:'gold'},{name:'influence'},{name:'influence'}]
   const played = [{name:'influence'},{name:'influence'}]
   // player.hand = [{name:'influence'},{name:'gold'},{name:'influence'}];
   player.discard = [...discard];
   player.played = [...played]
  test("empty played", ()=> {
    expect(player.removePlayed()).toEqual([...played,...discard])
  })

});

describe("drawCards function", () => {
  let player = new pl.Player({...deckData.stories.esther},[...deckData.decks.starter],"player",);  
  // const deck = [{name:'gold'},{name:'influence'},{name:'influence'}]
  const hand = []
  player.deck = [...seed]
  player.discard = [...seed]
  test("draw 2 cards should be 2 in hand 1 in deck 3 in discard", ()=> {
    player.drawCards(2)
    expect(player.hand.length).toEqual(2);
    expect(player.deck.length).toEqual(1);
    expect(player.discard.length).toEqual(3);
  })
  test("draw 2 more cards should reshuffle for deck2, dis1,hand4", ()=> {
    player.drawCards(2)
    expect(player.hand.length).toEqual(4);
    expect(player.deck.length).toEqual(2);
    expect(player.discard.length).toEqual(0);
  })
  test("should be out of cards and not crash", ()=>{
    player.drawCards(5);
    
    expect(player.hand.length).toEqual(6);
    expect(player.deck.length).toEqual(0);
    expect(player.discard.length).toEqual(0);
  })
  test("draw negative cards", ()=>{
    player.drawCards(-3);
    expect(player.hand.length).toEqual(6);
    expect(player.deck.length).toEqual(0);
    expect(player.discard.length).toEqual(0);
  })
});



describe("discardHand function", () => {
  let player = new pl.Player({...deckData.stories.esther},[...deckData.decks.starter],"player",);  
  player.hand = [...seed]
  player.discard = [];
  test("expect discard to move cards from hand to discard",()=>{
    player.discardHand();
    expect(player.hand).toEqual([])
    expect(player.discard).toEqual([...seed])
  })

});

describe("discardCard function", () => {
  let player = new pl.Player({...deckData.stories.esther},[...deckData.decks.starter],"player",);  
  player.hand = [...seed]
  player.discard = [];
  test("discard middle card",()=>{
    player.discardCard(1);
    expect(player.hand).toEqual([seed[0],seed[2]])
    expect(player.discard).toEqual([seed[1]])
  })
  test("discard too many wrong cards",()=>{
    player.discardCard(0);
    player.discardCard(0);
    player.discardCard(0);
    player.discardCard(-1);
    player.discardCard(undefined);
    expect(player.hand).toEqual([])
    expect(player.discard).toEqual([seed[1],seed[0],seed[2]])
  })
});

describe("playedCard function", () => {
  let player = new pl.Player({...deckData.stories.esther},[...deckData.decks.starter],"player",);  
  test("play a card to played",()=>{
    player.hand = [...seed]
    player.played = [];
    player.playedCard(0);
    expect(player.hand).toEqual([seed[1],seed[2]])
    expect(player.played).toEqual([seed[0]])
  })  
  test("play a null card to played",()=>{
    player.hand = [...seed]
    player.played = [];
    player.playedCard(null);
    expect(player.hand).toEqual([...seed])
    expect(player.played).toEqual([])
  })
  test("play a negative card to played",()=>{
    player.playedCard(-1);
    expect(player.hand).toEqual([...seed])
    expect(player.played).toEqual([])
  })

});

describe("buyCard function", () => {
  let player = new pl.Player({...deckData.stories.esther},[...deckData.decks.starter],"player",);  
  
  player.discard = [];
  test("buy card",()=>{
    player.buyCard(seed[0]);
    expect(player.discard).toEqual([seed[0]])
  })
  test("buy null card",()=>{
    player.buyCard(null);
    expect(player.discard).toEqual([seed[0]])
  })
});

describe("millCard function", () => {
  let player = new pl.Player({...deckData.stories.esther},[...deckData.decks.starter],"player",);  
  player.hand = [...seed]
  test('mill card',()=>{
    player.millCard(1);
    expect(player.hand).toEqual([seed[0],seed[2]])
  })
  test('mill fake card',()=>{
    player.millCard(-1);
    player.millCard(100);
    player.millCard(null);
    expect(player.hand).toEqual([seed[0],seed[2]])
  })

});

describe("getTotalGold function", () => {
  let player = new pl.Player({...deckData.stories.esther},[...deckData.decks.starter],"player",);  
  test('get golds of empty',()=>{
    player.deck = [...seed];
    expect(player.getTotalGold()).toEqual(0)
  })
  test('get golds',()=>{
    player.hand = [...seed];
    expect(player.getTotalGold()).toEqual(4)
  })
});

describe("getTotalInfluence function", () => {
  let player = new pl.Player({...deckData.stories.esther},[...deckData.decks.starter],"player",);  
    test('get influence of empty',()=>{
    player.deck = [...seed];
    expect(player.getTotalInfluence()).toEqual(0)
  })
  test('get influence',()=>{
    player.hand = [...seed];
    expect(player.getTotalInfluence()).toEqual(5)
  })
});