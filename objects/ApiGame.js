const pl = require('./Player.js');
const loc = require('./Location.js');
const tu = require('./Turn.js');

const ai = require('./AI.js');

module.exports.newGame = function Game(
  deckData,
  playerNames,
  playerTypes,
  refreshMarket,
  scrapCard,
  banes,
  gameType = 'all',
) {
  // console.log('dd:' + JSON.stringify(deckData));
  let Jerusalem = new loc.Location(
    [...deckData.decks.jerry],
    { ...deckData.stories.jerusalem },
    7,
    [...deckData.infoDecks.starter],
  );
  Jerusalem.id = 7;

  let neutralPlayer = new pl.Player({character:{abilities:[], name:'Persecutor'}},[],'player',7);
  
  this.players = [];
  this.banes = banes;
  this.started = false;
  this.refreshMarket = refreshMarket;
  this.scrapCard = scrapCard;
  this.playerNames = [...playerNames];
  this.playerTypes = [...playerTypes];
  this.locations = { 7: Jerusalem };
  this.currentPlayer = 0;
  this.turn = 1;
  this.winner = '';
  this.loser = '';
  this.losers = 0;
  this.slug = 0;
  this.log = [];
  this.simulation = true;
  this.canaan = false;
  this.draws = 4;

  this.getTurn = () => {
    return this.turn;
  };
  this.appendLog = function (log) {
    let newLog = [...this.log];
    newLog.push(log);
    this.log = [...newLog];
  };

  this.incrementPlayer = function () {
    if (this.currentPlayer >= this.players.length - 1) {
      this.currentPlayer = 0;
    } else {
      this.currentPlayer += 1;
    }
    if (this.players[this.currentPlayer].baned) {
      this.incrementPlayer();
    }
    this.appendLog(
      'Next player is ' +
        this.players[this.currentPlayer].name +
        this.players[this.currentPlayer].id,
    );
  };

  this.getCurrentPlayer = () => {
    return this.currentPlayer;
  };

  this.getNextPlayer = () => {
    if (this.winner == '') {
      //solo game
      if (this.players.length == 1) {
        this.startNewTurn();
        this.checkAI();
        // let winner = this.checkVictoryConditions();

        return { nextPlayer: 0, winner: this.winner, loser: this.loser };
      } else {
        console.log('getting next player');
        this.incrementPlayer();

        console.log('checking for new turn');
        if (this.players[this.currentPlayer].firstPlayer == true) {
          console.log('starting a new turn');
          this.players[this.currentPlayer].firstPlayer = false;

          console.log('getting new firstplayer');
          this.incrementPlayer();
          this.players[this.currentPlayer].firstPlayer = true;

          // let winner = this.checkVictoryConditions();
          this.startNewTurn();
          this.checkAI();
          console.log('new turn and new firstplayer is' + this.currentPlayer);
          return {
            nextPlayer: this.currentPlayer,
            winner: this.winner,
            loser: this.loser,
          };
        } else {
          this.checkAI();
          console.log('returning the new player' + this.currentPlayer);
          return {
            nextPlayer: this.currentPlayer,
            winner: '',
            loser: this.loser,
          };
        }
      }
    } else {
      console.log(
        'game is over with ' + this.winner + ' as winner on turn ' + this.turn,
      );
    }
  };
  this.checkAI = async () => {
    console.log(
      'checking ai' + this.players[this.currentPlayer].type + this.turn,
    );
    if (this.players[this.currentPlayer].type == 'AI') {
      console.log('running ai');
      this.appendLog('Running AI for ' + this.players[this.currentPlayer].name);
      let newLog = await this.players[this.currentPlayer].AI.runStrategy(
        gameType,
      );
      // console.log('new logs:'+newLog)
      this.log = [...this.log, ...newLog];
      // if(this.simulation){
      //   // this.getNextPlayer();
      // }
    }
  };
  this.setStartingPlayers = function () {
    this.started = true;
    console.log('playerTypes:' + this.playerTypes);
    this.playerNames.map((player, index) => {
      switch (player) {
        case 'Jonah':
        let Nineveh;
        if(gameType == "coop"){
            let storyDeck = []
            let nineviteDeck = []
            deckData.decks.jonah.map(card => {
              if(card.abilities.indexOf('Ninevite') > -1){
                nineviteDeck.push(card)
              }else{
                storyDeck.push(card);
              }
            })
          Nineveh = new loc.Location(
            [...storyDeck],
            deckData.stories.jonah.location,
            index,
            deckData.infoDecks.jonah,
            deckData.stories.jonah.character,
          );
          Nineveh.coopDeck = [...nineviteDeck]

        }else{
          Nineveh = new loc.Location(
            deckData.decks.jonah,
            deckData.stories.jonah.location,
            index,
            deckData.infoDecks.jonah,
            deckData.stories.jonah.character,
          );
        }
          // Nineveh.id = index;
          this.Jonah = new pl.Player(
            deckData.stories.jonah,
            deckData.decks.starter,
            this.playerTypes[index],
            index,
          );
          // this.Jonah.id = index;
          this.players.push(this.Jonah);
          this.locations[Nineveh.id] = Nineveh;
          break;
        case 'Esther':
          this.Esther = new pl.Player(
            deckData.stories.esther,
            deckData.decks.starter,
            this.playerTypes[index],
            index,
          );
          // this.Esther.id = index;
          let Babylon;

          if(gameType == "coop"){
            let storyDeck = []
            let challengeDeck = []
            let ham = 0;
            let tax = 0;
            let xerxes = 0;
            let ann = 0;
            deckData.decks.esther.map(card => {
              if(card.abilities.indexOf('challenge') > -1){
                switch(card.name){
                  case "Haman's Undertaking":
                  if(ham < 4){
                    ham++
                    challengeDeck.push(card)
                  }
                  break;
                  case "Taxes":
                  if(tax < 2){
                    tax++
                    challengeDeck.push(card)
                  }
                  break;
                  case "Xerxes Command":
                  if(xerxes < 1){
                    xerxes++
                    challengeDeck.push(card)
                  }
                  break;
                  case "Annihilation":
                  if(ann < 1){
                    ann++
                    challengeDeck.push(card)
                  }
                  break;
                  default:
                  storyDeck.push(card);  

                }
              }else{
                storyDeck.push(card);
              }
            })
            Babylon = new loc.Location(
              [...storyDeck],
              deckData.stories.esther.location,
              index,
              deckData.infoDecks.esther,
              deckData.stories.esther.character,
            );
            Babylon.coopDeck = [...challengeDeck]

          }else{
            Babylon = new loc.Location(
              deckData.decks.esther,
              deckData.stories.esther.location,
              index,
              deckData.infoDecks.esther,
              deckData.stories.esther.character,
            );
          }


          // Babylon.id = index;
          this.players.push(this.Esther);
          this.locations[Babylon.id] = Babylon;
          break;
        case 'Joshua':
          let Canaan;
          if(gameType == "coop"){
            let storyDeck = []
            let fearDeck = []
            deckData.decks.joshua.map(card => {
              if(card.fear > 0){
                fearDeck.push(card)
              }else{
                storyDeck.push(card);
              }
            })
            Canaan = new loc.Location(
              [...storyDeck],
              deckData.stories.joshua.location,
              index,
              deckData.infoDecks.joshua,
              deckData.stories.joshua.character,
            );
            Canaan.coopDeck = [...fearDeck]

          }else{
            Canaan = new loc.Location(
              deckData.decks.joshua,
              deckData.stories.joshua.location,
              index,
              deckData.infoDecks.joshua,
              deckData.stories.joshua.character,
            );
          }
          // Canaan.id = index;
          this.Joshua = new pl.Player(
            deckData.stories.joshua,
            deckData.decks.starter,
            this.playerTypes[index],
            index,
          );
          // this.Joshua.id = index;
          this.players.push(this.Joshua);
          this.locations[Canaan.id] = Canaan;
          this.canaan = true;
          break;
        case 'Paul':
          let Rome = new loc.Location(
            deckData.decks.paul,
            deckData.stories.paul.location,
            index,
            deckData.infoDecks.paul,
            deckData.stories.paul.character,
          );
          // Rome.id = index;
          this.Paul = new pl.Player(
            deckData.stories.paul,
            deckData.decks.starter,
            this.playerTypes[index],
            index,
          );
          // this.Paul.id = index;
          this.players.push(this.Paul);
          this.locations[Rome.id] = Rome;
          break;
      }

      if (index == 0) {
        this.players[index].firstPlayer = true;
      } else {
        this.players[index].firstPlayer = false;
      }
    });
    this.players.map((player, index) => {
      if (player.type == 'AI') {
        console.log('created AI for ' + player.name);
        player.AI = new ai.AI(player, this.locations);
      } else {
        this.simulation = false;
      }
    });
  };
  // this.setStartingPlayers(playerNames);

  this.checkVictoryConditions = function () {
    //esther 18
    // this.winner = "";
    console.log('cehcking win conditions');
    this.players.map((player, index) => {
      switch (player.name) {
        case 'Esther':
          console.log('checking esther win condition');
          let babylonian = this.locations[player.id].compareInfluence();
          console.log(
            'babylonian influencer' +
              babylonian.name +
              babylonian.finalInfluence,
          );
          if (babylonian.id == player.id && babylonian.finalInfluence >= 14) {
            //og 14
            //17
            this.setWinner(player);
            // }else if(babylonian.id != player.id && this.locations[player.id].edicts >= 4){
          } else {
            this.locations[player.id].battlefield.map((bf, ind) => {
              if (bf && bf.id == player.id && bf.poliBonus + bf.influence < 0) {
                //totalinfluence
                console.log(
                  'esther has a polibonus' + bf.poliBonus + ' so she loses',
                );
                this.setLoser(player);
              }
            });
          }
          break;
        case 'Jonah':
          console.log('checking jona win condition');

          //	let bf;
          let hardened = 0;
          let ninevites = 0;
          let jonah = 0;
          let isInfluencer = true;
          if (this.locations[player.id].influencer.id == player.id) {
            console.log('jonah is the influencer');
            isInfluencer = true;
          }
          // console.log(
          //   'checkforninevites' +
          //     JSON.stringify(this.locations[player.id].battlefield),
          // );
          // this.locations.map((l, i)=>{
          Object.keys(this.locations).map((l, i) => {
            this.locations[l].battlefield.map((battlefield, ind) => {
              console.log('mapping nineveh');
              if (battlefield && battlefield.id == player.id) {
                console.log('found jonah');
                battlefield.cards.map((card, index) => {
                  console.log('mapping battlefield cards:' + card.name);
                  if (this.locations[l].id == player.id) {
                    console.log('played on nineveh');
                    if (card.abilities.indexOf('Ninevite') > -1) {
                      ninevites++;
                      console.log('ninevites' + ninevites);
                    }
                    if (
                      battlefield.id == player.id &&
                      card.abilities.indexOf('Harden') > -1
                    ) {
                      jonah = 1;
                    }
                  } else {
                    if (
                      battlefield.id == player.id &&
                      card.abilities.indexOf('Harden') > -1
                    ) {
                      // jonah = 1;
                      console.log('hardening');
                      this.locations[player.id].hardened += 1;
                    }
                  }
                });
                //jonah > 0 &&
                if (ninevites >= 4 && isInfluencer) {
                  //4
                  this.setWinner(player);
                } else if (this.locations[player.id].hardened >= 3) {
                  this.setLoser(player);
                }
              } else {
                console.log('no jonah found');
              }
            });
          });
          break;
        case 'Paul':
          //set proselytize
          console.log('checking paul win con');
          let pros = 0;
          let wounds = 0;
          Object.keys(this.locations).map((location, index) => {
            pros += this.locations[location].proselytized[player.id];
            wounds += this.locations[location].wounds[player.id];
          });
          if (pros >= 7) {
            //og 7
            this.setWinner(player);
          } else if (wounds >= 6) {
            this.setLoser(player);
          }
          //check abilities

          break;
        case 'Joshua':
          console.log(
            'checking joshua wincon:' + this.locations[player.id].abilities[0],
          );

          if (this.locations[player.id].abilities[0] > 2) {
            this.setWinner(player);
            //add ALL fear subtract ALL faith
          } else if (
            this.locations[player.id].battlefield[player.id] &&
            this.locations[player.id].battlefield[player.id].fear +
              this.locations[player.id].battlefield[player.id].weariness >=
              9
          ) {
            this.setLoser(player);
          }

          break;
      }
    });

    console.log('finish checking winconditions' + this.winner);

    if (this.losers + 1 == this.players.length && this.players.length != 1) {
      this.players.map((play, index) => {
        if (!play.baned) {
          this.winning = true;
          this.winner = play.name + play.id;
        }
      });
    } else if (this.banes && this.losers == this.players.length) {
      this.winning = true;
      this.winner = 'No one!';
      this.appendLog('Everyone fell for their banes!');
    }
    return this.winner;
  };

  this.setWinner = function (player) {
    this.winning = true;
    this.winner = player.name + player.id;
    this.appendLog(this.winner + ' won the game by finishing their calling!');
  };

  this.setLoser = function (player) {
    this.appendLog(player.name + player.id + ' fell to their bane!');
    // this.loser = player.name+player.id
    if (this.banes) {
      this.players[player.id].baned = true;
      this.losers += 1;
    }
  };

  this.checkForConquerer = function () {
    let conquerer = {};
    // let chief = null;
    if (this.players.length > 1) {
      // let conquest = false;
      Object.keys(this.locations).map((loc, index) => {
        let location = this.locations[loc];
        if (location.influencer.name != 'neutral') {
          if (!conquerer[location.influencer.id]) {
            conquerer[location.influencer.id] = 1;
          } else {
            conquerer[location.influencer.id]++;
          }
          if (
            conquerer[location.influencer.id] > 2 ||
            (conquerer[location.influencer.id] > 1 && this.players.length == 1)
          ) {
            this.winner = location.influencer.name + location.influencer.id;
            this.appendLog(
              this.winner + ' won the game by influencing 3 locations!',
            );
          }
        }
      });
    }
  };
  // console.log('starting new game with '+playerNames)

  this.startSim = async () => {
    this.startNewTurn();
  };

  this.startNewTurn = function () {
    console.log('apigame startnewturn');

    if (gameType == 'all' || gameType == 'calling') {
      let winner = this.checkVictoryConditions();
    } 

    this.appendLog('Starting turn ' + this.turn);

    Object.keys(this.locations).map((location, index) => {
      //xerxes edict...
      console.log(
        'checking xerxes edict' + this.locations[location].switcheroo,
      );

      if (this.locations[location].switcheroo.length > 0) {
        this.checkXerxes(location);
      }
      if (this.locations[location].prison.length > 0) {
        this.checkPrison(location);
      }
      let old = this.locations[location].influencer;
      this.locations[location].setInfluencing();
      if (old.name != this.locations[location].influencer.name) {
        this.appendLog(
          this.locations[location].influencer.name +
            ' has taken ' +
            this.locations[location].name +
            ' from ' +
            old.name,
        );
      }
    });

    if (gameType == 'all' || gameType == 'conquer') {
      this.checkForConquerer();
    }

    this.turn = this.turn + 1;


    console.log('\n new turn:' + this.turn);

    console.log('player setup');
      // let draws = 4;
    if(gameType == 'coop'){
      this.runEffect();
    }

    this.players.map((player, index) => {
      player.startTurn();

      //influence cards
      Object.keys(this.locations).map((location) => {
        if (this.locations[location].influencer.id == player.id) {
          let newHand = [...player.hand];
          newHand.push(this.locations[location].card);
          player.hand = [...newHand];
          // console.log(
          //   'adding influence card to hand' + JSON.stringify(player.hand),
          // );
          // if (this.locations[location].card.draw > 0) {
          //   // player.drawCards(1);
          //   draws += this.locations[location].card.draw;
          // }
        }
      });

      player.drawCards(this.draws);
      this.draws = 4;//reset bc of how useeffect works...
      // console.log('player hand' + JSON.stringify(player.hand));
    });

    return true;
  };

  this.runEffect = function() {
    switch(this.locations[this.currentPlayer].name){
      case "Canaan":
      //check for fallen from fear...

      //add new fear to correct location...
      for(let x = 0; x < this.players.length; x++){
      //if not canaan, move to correct lcoation
        this.locations[this.currentPlayer].drawEffect();
      }
      let totalFear = 0;
      this.locations[this.currentPlayer].coopDisplay.map(fearCard=>{
        totalFear+=fearCard.fear;
      })
      if(totalFear > 13 * this.players.length +1){//+1 is jerusalem
        console.log('fear lose the game')
      }

      break;
      case "Nineveh":
        let ninev = this.locations[this.currentPlayer]
        ninev.drawEffect();
        // ninev.drawEffect();//hardmode much?
      //discard cards
      let ninevites = 0;
        let warriors = 0;
        ninev.coopDisplay.map(card =>{
          if(card.name == "Priestess"){
            if(this.draws > 2){
              this.draws -= 1;
            }
          }
          if(card.name == "Warrior"){
            warriors+=1;
          }
        })
        if(ninevites > 3){
          console.log('ninevite lose the game')
        }

        Object.keys(this.locations).map(location => {
          let replenish = true;
          while( 3 - warriors < this.locations[location].market.length){
            replenish = false;
            let last = this.locations[location].market.length -1
  
            let newMarket = [...this.locations[location].market]
            let floater = {...newMarket[last]};
            newMarket.splice(last,1);
            let newDeck = [...this.locations[location].deck]
            newDeck.push(floater)
            this.locations[location].market = [...newMarket]
            this.locations[location].deck = [...newDeck]
          }
          // if(replenish){
          //   while(this.locations[location].market.length <= warriors){
          //     this.locations[location].drawOne();
          //   }
          // }
          

        })
      //discard market cards
      
      break;
      case "Rome":
      console.log('rome effect')
      //play 1 card on each location
      // console.log('deck names',romeDeck.map(card=>card.name))
      
      Object.keys(this.locations).map((location,index) =>{
        if(this.locations[location].influencer.name == "Persecutor"){
          this.locations[this.currentPlayer].wounds[this.currentPlayer]++;
        }
        console.log('playing storm on ',this.locations[location].name)
        let romeDeck = [...this.locations[this.currentPlayer].deck]
        // let neutralPlayer = {name:'neutral',id:7,hand:[],deck:[],discard:[],played:[],
        // playedCard:function(){console.log('played')},
        // millCard:function(){console.log('milled')}}//new pl.Player([],[],'Player',7);
        let ranNum = Math.floor(Math.random() * (romeDeck.length - 1))
        neutralPlayer.hand = [{...romeDeck[ranNum]}];
        console.log('hand:',neutralPlayer.hand)
        this.locations[location].playCard(0,neutralPlayer);
      })
      if(this.locations[this.currentPlayer].wounds[this.currentPlayer] > 6){
        console.log('paul lose game')
      }

      break;
      case "Babylon":
      /*
      2 taxes 
      4 haman
      1 annihilation
      1 kings
      */
      if(this.locations[this.currentPlayer].coopDisplay.length > 3){
        console.log('challenge lose game')
      }

      for(let x = 0; x < this.players.length; x++){
        this.locations[this.currentPlayer].drawEffect();
      }


      break;
    }
  }

  this.checkPrison = function (location) {
    console.log('we have a imprisonment/warrant');
    // this.locations[location].prison.map((king, ind) => {
    for (let x = 0; x < this.locations[location].prison.length; x++) {
      let king = this.locations[location].prison[x];
      console.log('prisonId:' + king);
      let maxCardCost = 0;
      let maxCard;
      let switchId = -1;
      this.locations[location].battlefield.map((bf, i) => {
        if (bf) {
          if (bf.id != king) {
            console.log('bf near prison:' + JSON.stringify(bf.cards));
            if (bf.cards.length > 0) {
              bf.cards.map((c, cInd) => {
                console.log('card check: ' + JSON.stringify(c));
                if (c.cost > maxCardCost && c.name != 'Imprisonment') {
                  maxCard = c;
                  maxCardCost = c.cost;
                  switchId = bf.id;
                }
              });
            }
          }
          if (maxCard) {
            console.log('removing ' + maxCard.name + ' with imprison');
            let switchPlay = [...this.players[switchId].played];
            console.log(switchPlay);
            let swapper;
            let swapperId = -1;
            let kingId = -1;
            switchPlay.map((card, cInd) => {
              if (card.name == maxCard.name) {
                console.log('found the maxCard: ' + card.name);
                swapper = { ...card };
                swapperId = cInd;
                console.log('swapper is ' + swapper.name);
                console.log('spliced switch' + switchPlay);
              }
            });

            let kingPlay = [...this.players[king].played];
            console.log(kingPlay);
            let prison;
            kingPlay.map((card, cInd) => {
              if (card.abilities.indexOf('prison') > -1) {
                console.log('found prison');
                prison = { ...card };
                kingId = cInd;
                // break;
              }
            });
            if (swapper && prison) {
              this.appendLog('imprisoned: ' + swapper.name);
              kingPlay.splice(kingId, 1);
              console.log(
                'no prison right?:' + kingId + JSON.stringify(kingPlay),
              );
              switchPlay.splice(swapperId, 1);
              console.log(
                'no xerxes right?:' + kingId + JSON.stringify(kingPlay),
              );
              kingPlay = [...kingPlay];
              switchPlay = [...switchPlay];

              this.locations[prison.origin].deck = [
                ...this.locations[prison.origin].deck,
                prison,
              ];
              if (this.locations[prison.origin].market.length < 3) {
                this.locations[prison.origin].drawOne();
              }
              this.locations[swapper.origin].deck = [
                ...this.locations[swapper.origin].deck,
                swapper,
              ];
              if (this.locations[swapper.origin].market.length < 3) {
                this.locations[swapper.origin].drawOne();
              }
              this.players[switchId].played = [...switchPlay];
              this.players[king].played = [...kingPlay];
              console.log(
                'swap successful:' + JSON.stringify(this.players[king].played),
              );
            }
            // console.log('swapping'+xerxes.name+" with "+swapper.name)
          }
        }
      });
      // });
    }
  };
  this.checkXerxes = function (location) {
    console.log('we have a xerxes');
    // this.locations[location].switcheroo.map((king, ind) => {
    for (let x = 0; x < this.locations[location].switcheroo.length; x++) {
      let king = this.locations[location].switcheroo[x];
      console.log('kingId:' + king);
      let maxCardCost = 0;
      let maxCard;
      let switchId = -1;
      this.locations[location].battlefield.map((bf, i) => {
        if (bf) {
          if (bf.id != king) {
            console.log('bf near king:' + JSON.stringify(bf.cards));

            bf.cards.map((c, cInd) => {
              console.log('card check: ' + JSON.stringify(c));
              if (c.cost > maxCardCost && c.name != 'Edict of Xerxes') {
                maxCard = c;
                maxCardCost = c.cost;
                switchId = bf.id;
              }
            });
          }
          if (maxCard != null) {
            console.log('swap ' + maxCard.name + ' with xerxes');
            let switchPlay = [...this.players[switchId].played];
            console.log(switchPlay);
            let swapper;
            let swapperId = -1;
            let kingId = -1;
            switchPlay.map((card, cInd) => {
              if (card.name == maxCard.name) {
                console.log('found the maxCard: ' + card.name);
                swapper = { ...card };
                swapperId = cInd;
                console.log('swapper is ' + swapper.name);
                console.log('spliced switch' + switchPlay);
              }
            });

            let kingPlay = [...this.players[king].played];
            console.log(kingPlay);
            let xerxes;
            kingPlay.map((card, cInd) => {
              if (card.abilities.indexOf('xerxes') > -1) {
                console.log('found xerxes');
                xerxes = { ...card };
                kingId = cInd;
                // break;
              }
            });
            if (swapper && xerxes) {
              this.appendLog('Xerxes chooses: ' + swapper.name);
              kingPlay.splice(kingId, 1);
              console.log(
                'no xerxes right?:' + kingId + JSON.stringify(kingPlay),
              );
              switchPlay.splice(swapperId, 1);
              console.log(
                'no xerxes right?:' + kingId + JSON.stringify(kingPlay),
              );
              kingPlay = [...kingPlay, swapper];
              switchPlay = [...switchPlay, xerxes];
              this.players[switchId].played = [...switchPlay];
              this.players[king].played = [...kingPlay];
              console.log(
                'swap successful:' + JSON.stringify(this.players[king].played),
              );
            }
            // console.log('swapping'+xerxes.name+" with "+swapper.name)
          }
        }
      });
    }
  };

  this.getPlayerInfo = function () {
    let playerInfo = [];

    this.players.map((player, index) => {
      let info = {
        name: player.name,
        id: player.id,
        hand: player.hand,
        deck: player.deck,
        discard: player.discard,
        firstPlayer: player.firstPlayer,
        type: player.type,
      };
      playerInfo.push(info);
    });
    return playerInfo;
  };

  this.getLocationInfo = function () {
    let locationInfo = [];
    Object.keys(this.locations).map((loc, ind) => {
      let location = this.locations[loc];
      let theInfluencer = location.influencer.name;
      if (theInfluencer != 'neutral') {
        theInfluencer = location.influencer.name + location.influencer.id;
      }
      let info = {
        name: location.name,
        character: location.character,
        id: location.id,
        market: location.market,
        infoDeck: location.infoDeck,
        coopDisplay: location.coopDisplay,
        battlefield: location.battlefield,
        influence: location.influence,
        abilities: location.abilities,
        influencer: theInfluencer,
        influencerId: location.influencer.id,
        edicts: location.edicts,
        info: location.info,
        weariness: location.weariness,
        wounds: location.wounds,
        hardened: location.hardened,
        proselytized: location.proselytized,
      };
      if (info.battlefield == {}) {
        console.log('empty battlefield, please proxy');
        info.battlefield = {
          name: 'neutral',
          influence: 0,
          gold: 0,
          cards: [],
        };
      }
      locationInfo.push(info);
    });

    return locationInfo;
  };

  return this;
};
