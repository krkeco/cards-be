const pl = require('./Player.js');
const loc = require('./Location.js');
const tu = require('./Turn.js');
const cards = require('./CardData.js');
const deckData = new cards.data();
const ai = require('./AI.js');

module.exports.newGame = function Game(playerNames, playerTypes, gameType = "all") {
  let Jerusalem = new loc.Location([], deckData.stories.jerusalem);
  Jerusalem.id = 7;
  this.players = [];
  this.playerNames = [...playerNames];
  this.playerTypes = [...playerTypes];
  this.locations = { 7: Jerusalem };
  this.currentPlayer = 0;
  this.turn = 0;
  this.winner = '';
  this.loser = '';
  this.slug = 0;
  this.log = [];
  this.simulation= true;
  this.canaan = false;

  this.getTurn = () => {
    return this.turn;
  };
  this.appendLog = function (log) {
    let newLog = [...this.log]
    newLog.push(log)
    this.log = [...newLog];
  }

  this.incrementPlayer = function () {
    if (this.currentPlayer >= this.players.length - 1) {
      this.currentPlayer = 0;
    } else {
      this.currentPlayer += 1;
    }
    this.appendLog('Next player is '+this.players[this.currentPlayer].name+this.players[this.currentPlayer].id)
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
          return { nextPlayer: this.currentPlayer, winner: this.winner, loser:this.loser };
        } else {
          this.checkAI();
          console.log('returning the new player' + this.currentPlayer);
          return { nextPlayer: this.currentPlayer, winner: '', loser:this.loser };
        }
      }
    } else {
      console.log(
        'game is over with ' + this.winner + ' as winner on turn ' + this.turn,
      );
    }
  };
  this.checkAI = () => {
    console.log(
      'checking ai' + this.players[this.currentPlayer].type + this.turn,
    );
    if (this.players[this.currentPlayer].type == 'AI') {
      console.log('running ai');
      this.appendLog('Running AI for '+this.players[this.currentPlayer].name)
      this.players[this.currentPlayer].AI.runStrategy(gameType);
      if(this.simulation){
        // this.getNextPlayer();
      }
    }
  };
  this.setStartingPlayers = function () {
    console.log('playerTypes:'+this.playerTypes)
    this.playerNames.map((player, index) => {
      switch (player) {
        case 'Jonah':
          let Nineveh = new loc.Location(
            deckData.decks.jonah,
            deckData.stories.jonah.location,
          );
          Nineveh.id = index;
          this.Jonah = new pl.Player(
            deckData.stories.jonah,
            deckData.decks.starter,
            this.playerTypes[index],
          );
          this.Jonah.id = index;
          this.players.push(this.Jonah);
          this.locations[Nineveh.id] = Nineveh;
          break;
        case 'Esther':
          this.Esther = new pl.Player(
            deckData.stories.esther,
            deckData.decks.starter,
            this.playerTypes[index],
          );
          this.Esther.id = index;
          let Babylon = new loc.Location(
            deckData.decks.esther,
            deckData.stories.esther.location,
          );
          Babylon.id = index;
          this.players.push(this.Esther);
          this.locations[Babylon.id] = Babylon;
          break;
        case 'Joshua':
          let Canaan = new loc.Location(
            deckData.decks.joshua,
            deckData.stories.joshua.location,
          );
          Canaan.id = index;
          this.Joshua = new pl.Player(
            deckData.stories.joshua,
            deckData.decks.starter,
            this.playerTypes[index],
          );
          this.Joshua.id = index;
          this.players.push(this.Joshua);
          this.locations[Canaan.id] = Canaan;
          this.canaan = true;
          break;
        case 'Paul':
          let Rome = new loc.Location(
            deckData.decks.paul,
            deckData.stories.paul.location,
          );
          Rome.id = index;
          this.Paul = new pl.Player(
            deckData.stories.paul,
            deckData.decks.starter,
            this.playerTypes[index],
          );
          this.Paul.id = index;
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
      }else{
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
          console.log('babylonian influencer' + babylonian.name+babylonian.finalInfluence);
          if (babylonian.id == player.id && babylonian.finalInfluence > 17) {
            //17
            player.winning = true;
            this.winner = player.name+player.id;
          }else if(babylonian.id != player.id && this.locations[player.id].edicts >= 4){
            this.loser = player.name+player.id
          }
          break;
        case 'Jonah':
          console.log('checking jona win condition');

          //	let bf;
          let ninevites = 0;
          let jonah = 0;
          console.log(
            'checkforninevites' +
              JSON.stringify(this.locations[player.id].battlefield),
          );
          this.locations[player.id].battlefield.map((battlefield, ind) => {
            console.log('mapping nineveh');
            if (battlefield && battlefield.id == player.id) {
              console.log('found jonah');
              battlefield.cards.map((card, index) => {
                console.log('mapping battlefield cards:' + card.name);
                if (card.abilities.indexOf('Ninevite') > -1) {
                  ninevites++;
                  console.log('ninevites' + ninevites);
                }
                if(card.abilities.indexOf('Harden') > -1){
                  jonah = 1;
                }
              });
              if (jonah > 0 && ninevites > 4 + this.locations[player.id].traversal) {
                //4
                console.log('jonah is a winner!');
                player.winning = true;
                this.winner = player.name+player.id;
              }else
              if(this.locations[player.id].hardened >= 3){
                this.loser = player.name+player.id
              }
            } else {
              console.log('no jonah found');
            }
          });
          break;
        case 'Paul':
          //set proselytize
          console.log('checking paul win con');
          let pros = 0;
          let wounds = 0;
          Object.keys(this.locations).map((location, index) => {
            //if (this.locations[location].proselytized[player.id] > 0) {
              pros += this.locations[location].proselytized[player.id];
              wounds += this.locations[location].wounds[player.id];
            // }
          });
          if (pros >= 7) {
            player.winning = true;
            this.winner = player.name+player.id;
          }else if(wounds >= 6){
            this.loser = player.name+player.id
          }
          //check abilities

          break;
        case 'Joshua':
          console.log(
            'checking joshua wincon:' + this.locations[player.id].abilities[0],
          );
          let fear = 0;
          // Object.keys(this.locations).map((loc,ind)=>{
          // if(this.locations[loc].weariness > fear){
          //   fear = this.locations[loc].weariness
          // }
          // })
          if (this.locations[player.id].abilities[0] > 2) {
            this.winning = true;
            this.winner = player.name+player.id;
          }else if(this.locations[player.id].weariness >= 13){
            this.loser = player.name+player.id
          }

          break;
      }
    });

    console.log('finish checking winconditions'+this.winner);
    if(this.winner != ""){
      this.appendLog(this.winner+ " won the game by finishing their calling!")
    }
    return this.winner;
  };
  this.checkForConquerer = function () {
    let conquerer = {};
    // let chief = null;
    if(this.players.length > 1){
        // let conquest = false;
      Object.keys(this.locations).map((loc, index) => {
        let location = this.locations[loc]
        if(location.influencer.name != 'neutral'){
          if(!conquerer[location.influencer.id]){
            conquerer[location.influencer.id] = 1
          }else{
            conquerer[location.influencer.id]++;
          }
          if(conquerer[location.influencer.id]>2
            || (conquerer[location.influencer.id]>1 && this.players.length == 1)){
            this.winner = location.influencer.name+location.influencer.id
          }
  
        }
      });
    }
    if(this.winner != ""){
      this.appendLog(this.winner+ " won the game by influencing 3 locations!")
    }
  };
  // console.log('starting new game with '+playerNames)

  this.startSim = async () => {
    this.startNewTurn();
  };
  this.startNewTurn = function () {
    console.log('apigame startnewturn');

  if(gameType == "all" || gameType == "calling"){
    let winner = this.checkVictoryConditions();
  }
    this.appendLog("Starting turn "+this.turn)

    Object.keys(this.locations).map((location, index) => {
      //xerxes edict...
      console.log('checking xerxes edict'+this.locations[location].switcheroo)

       if(this.locations[location].switcheroo.length > 0){
          console.log('we have a xerxes')
        this.locations[location].switcheroo.map((king, ind)=>{
          console.log('kingId:'+king)
          let maxCardCost = 0;
          let maxCard;
          let switchId = -1;
          this.locations[location].battlefield.map((bf, i)=>{

            if(bf.id != king){
            console.log('bf near king:'+JSON.stringify(bf.cards))

              bf.cards.map((c,cInd)=>{
                console.log('card check: '+JSON.stringify(c))
                if(c.cost > maxCardCost && c.name != "Edict of Xerxes"){
                  maxCard = c;
                  maxCardCost = c.cost;
                  switchId = bf.id
                }
              })
            }
            if(maxCard){
              console.log('swap '+maxCard.name+' with xerxes')
              let switchPlay = [...this.players[switchId].played]
              console.log(switchPlay)
              let swapper;
              let swapperId = -1;
              let kingId = -1;
              switchPlay.map((card,cInd)=>{
                if(card.name == maxCard.name){
                  console.log('found the maxCard: '+card.name)
                  swapper = {...card};
                  swapperId = cInd;
                  console.log('swapper is '+swapper.name)
                  console.log('spliced switch'+switchPlay)
                  
                }})

              let kingPlay = [...this.players[king].played]
              console.log(kingPlay)
              let xerxes;
              kingPlay.map((card,cInd)=>{
                if(card.abilities.indexOf('xerxes') > -1){
                  console.log('found xerxes')
                  xerxes = {...card};
                  kingId = cInd;
                  // break;
                }
              })
              if(swapper && xerxes){
                this.appendLog('Xerxes chooses: '+swapper.name)
                kingPlay.splice(kingId,1);
                console.log('no xerxes right?:'+kingId+JSON.stringify(kingPlay))
                switchPlay.splice(swapperId,1);
                console.log('no xerxes right?:'+kingId+JSON.stringify(kingPlay))
                kingPlay = [...kingPlay, swapper]
                switchPlay = [...switchPlay, xerxes]
                this.players[switchId].played = [...switchPlay]
                this.players[king].played = [...kingPlay]
                console.log('swap successful:'+JSON.stringify(this.players[king].played))
              }
              // console.log('swapping'+xerxes.name+" with "+swapper.name)

            }
          });

        })    
       }
      this.locations[location].setInfluencing();
    //       // console.log('so far so good:'+xerxes.name)
    //       // let bestPlayed = [...this.players[switchId].played]
    //       // let best = bestPlayed.slice(bestPlayed.map((c)=>c.name == kingsCard.name))
    //       // console.log('so far so good:'+best.name)
    //       // xerxesPlayed.push(best);
    //       // bestPlayed.push(xerxes);
    //       // this.players[king].played = [...xerxesPlayed]
    //       // this.players[switchId].played = [...bestPlayed]
    //       // console.log('xerxes switch xerxes:'+this.players[king].played.map((c)=>c.name+","))
    //       // console.log('xerxes switch other:'+this.players[switchId].played.map((c)=>c.name+","))
    //     })
    // }
    });

    if(gameType == "all" || gameType == "conquer"){
      this.checkForConquerer();
    }

    this.turn = this.turn + 1;
    console.log('\n new turn:' + this.turn);

    // Object.keys(this.locations).map((location) => {
    //   if(this.canaan){
    //     this.locations[location].weariness +=1;
    //   }
    // });

    console.log('player setup');

    this.players.map((player, index) => {
      player.startTurn();
      let draws = 4;

      //influence cards
      Object.keys(this.locations).map((location) => {
        
        if (this.locations[location].influencer.id == player.id) {
          let newHand = [...player.hand];
          newHand.push(this.locations[location].card);
          player.hand = [...newHand];
          // console.log(
          //   'adding influence card to hand' + JSON.stringify(player.hand),
          // );
          if (this.locations[location].card.draw > 0) {
            // player.drawCards(1);
            draws += this.locations[location].card.draw;
          }
        }
      });

      player.drawCards(draws);
      // console.log('player hand' + JSON.stringify(player.hand));
    });

    return true;
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
      let theInfluencer = location.influencer.name
      if(theInfluencer != "neutral"){
        theInfluencer = location.influencer.name+location.influencer.id
      }
      let info = {
        name: location.name,
        id: location.id,
        market: location.market,
        battlefield: location.battlefield,
        influence: location.influence,
        abilities: location.abilities,
        influencer: theInfluencer,
        influencerId: location.influencer.id,
        edicts:location.edicts,
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
