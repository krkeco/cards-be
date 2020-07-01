
const pl = require("../objects/Player");
const loc = require("../objects/Location");

const cards = require('../objects/CardData.js');
let deckData = cards.testData();
// let deckData = { stories: {...cards.stories}, decks: {...cards.decks}, infoDecks: {...cards.decks} };

const seed = [
  {name:'0gold',abilities:[],quantity:2,cost:1,gold:10,influence:0},
  {name:'1influence',abilities:[],quantity:2,cost:1,gold:0,influence:2},
  {name:'2prince',abilities:[],quantity:2,cost:1,gold:1,influence:2},
  {name:'3fear',abilities:['fear'],fear:2,cost:1,gold:1,influence:2},
  {name:'4faith',abilities:['faith'],faith:2,cost:1,gold:1,influence:1},
  {name:'5Ninevite',abilities:['Ninevite'],quantity:2,cost:1,gold:2,influence:2},
  {name:'6angelic',abilities:['angelic'],quantity:2,cost:1,gold:1,influence:2},
  {name:'7mob',abilities:['mob'],quantity:2,cost:1,gold:1,influence:1},
  {name:'8xerxes',abilities:['xerxes'],quantity:2,cost:1,gold:2,influence:2},
  {name:'9prison',abilities:['prison'],quantity:2,cost:1,gold:1,influence:2},
  {name:'10mordecai',abilities:['mordecai'],quantity:2,cost:1,gold:1,influence:1},
  {name:'11provision',abilities:[],provision:2,cost:1,gold:2,influence:2},
  {name:'12apostle',abilities:['apostle'],quantity:2,cost:1,gold:1,influence:0},
  {name:'13endeavor',abilities:['endeavor'],quantity:2,cost:1,gold:1,influence:1},
  {name:'14politics',abilities:[],politics:2,cost:1,gold:2,influence:2},
  {name:'15politics',abilities:[],politics:-2,cost:1,gold:2,influence:2},
  {name:'16scrap',abilities:['scrap'],quantity:2,cost:1,gold:1,influence:2},
]

describe("initialize location object", () => {
let location = new loc.Location([...deckData.decks.jerry], {...deckData.stories.jerusalem}, 7, [...deckData.infoDecks.starter]);
// let location = new location.Player({...deckData.stories.esther},[...deckData.decks.starter],"player",);  
    test("empty battlefield", () => {
      expect(location.battlefield).toEqual([]);
    });
    test("full deck", () => {
      expect(location.deck.length).toEqual(9);//jerusalem not other locations
    });
    test("empty market", () => {
      expect(location.market.length).toEqual(1);//jerusalem not other locations
    });
    let location2 = new loc.Location([...deckData.decks.esther], {...deckData.stories.esther}, 0, [...deckData.infoDecks.esther]);
// let location = new location.Player({...deckData.stories.esther},[...deckData.decks.starter],"player",);  
    test("empty battlefield", () => {
      expect(location2.battlefield).toEqual([]);
    });
    test("full deck", () => {
      expect(location2.deck.length).toEqual(15);//other locations
    });
    test("empty market", () => {
      expect(location2.market.length).toEqual(3);//other locations
    });
});

//playCard
describe("playCard", () => {
  let location = new loc.Location([...deckData.decks.esther], {...deckData.stories.esther}, 0, [...deckData.infoDecks.esther]);
  let player = new pl.Player({...deckData.stories.esther},[...deckData.decks.starter],"player",);  
  player.hand = [...seed];
  
  
  location.playCard(-1,player)
  location.playCard(0,player)
  let playerBF = location.battlefield.find(bf => bf.id === player.id);
  console.log(playerBF.cards)
  test("bf has 1 card; 1 gold", () => {
      expect(playerBF.cards.length).toEqual(1);//other locations
      expect(playerBF.gold).toEqual(10);//other locations
    });

    
});

describe("playCard abilities", () => {
  test("play card abilities", () => {
    let location = new loc.Location([...deckData.decks.esther], {...deckData.stories.esther}, 0, [...deckData.infoDecks.esther]);
    let player = new pl.Player({...deckData.stories.esther},[...deckData.decks.starter],"player",);  
    player.hand = [...seed];
    location.proselytized = [1,0,1,0];
    
    while(player.hand.length > 0){
      
      location.playCard(0,player)
    }
    let playerBF = location.battlefield.find(bf => bf.id === player.id);
    console.log(playerBF.cards)
      expect(playerBF.cards.length).toEqual(20);//2 from provision 2 seed, 1 from mordecai
      expect(playerBF.fear).toEqual(2);
      expect(playerBF.faith).toEqual(2);
      expect(playerBF.politics).toEqual(0);
      expect(playerBF.poliBonus).toEqual(0);
      expect(location.edicts).toEqual(2);//1 from the endeavor 1 from mordecai
      expect(location.angelic).toEqual(player.id);
      expect(playerBF.cards[7].influence).toEqual(8);//mob bonus to 1 + 7 prev cards
      expect(playerBF.playPaul).toEqual(true);
      expect(playerBF.cards[12].influence).toEqual(2);//2 churchs
      expect(player.played.length).toEqual(18);//2 churchs
    });

  // location.playCard(0,player)
    
});

//drawOne
describe("drawOne", () => {
  let location = new loc.Location([...deckData.decks.esther], {...deckData.stories.esther}, 0, [...deckData.infoDecks.esther]);
  let player = new pl.Player({...deckData.stories.esther},[...deckData.decks.starter],"player",);  
  player.hand = [...seed];

  // location.playCard(0,player)//gold
  test("one", () => {
    location.drawOne()
    expect(location.market.length).toEqual(4);
  })
  test("too many", () => {
    for(let x = 0; x <  20; x++){
      location.drawOne()
    }

    expect(location.market.length).toEqual(18);//total cards in a deck
  })
  // location.refreshMarket(player.id)
  
});


//refreshMarket
describe("refreshMarket", () => {

  test("refreshmarket", () => {
    let location = new loc.Location([...deckData.decks.esther], {...deckData.stories.esther}, 0, [...deckData.infoDecks.esther]);
    let player = new pl.Player({...deckData.stories.esther},[...deckData.decks.starter],"player",);  
    player.hand = [...seed];
    location.playCard(0,player)//gold
    location.drawOne();
    location.drawOne();
    location.drawOne();
    location.drawOne();
    
    location.refreshMarket(player.id);

    expect(location.market.length).toEqual(3);

    location.drawOne();
    location.drawOne();
    location.drawOne();
    location.refreshMarket();//no idea
    expect(location.market.length).toEqual(6);
    
    location.drawOne();
    location.refreshMarket(-1);//any id
    expect(location.market.length).toEqual(3);
  });
  
  // location.refreshMarket(player.id)
  
});


//buy
describe("buyCard", () => {
  let location = new loc.Location([...deckData.decks.esther], {...deckData.stories.esther}, 0, [...deckData.infoDecks.esther]);
  let player = new pl.Player({...deckData.stories.esther},[...deckData.decks.starter],"player",);  
  player.hand = [...seed];
  location.playCard(0,player)
  let card = {...location.market[0]}
  location.buy(0,player);
  test("card in played", () => {
    expect(player.played[0]).toEqual(card);
    expect(location.market.length).toEqual(3);
  })
})

//compareInfluence
//setInfluencing
//postInfluencePhase