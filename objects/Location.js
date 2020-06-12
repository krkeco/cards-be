module.exports.Location = function Location(deck, story, id = 7) {
  this.deck = [...deck];
  this.card = {...story.card};
  this.info = story.info;
  this.market = [];
  this.battlefield = [];
  this.name = story.name;
  this.influence = story.influence;
  this.weariness = 0;
  this.abilities = story.abilities;
  this.influencer = { name: 'neutral' };
  this.proselytized = [0,0,0,0];
  this.angelic = -1;
  this.apostle = -1;
  this.traversal = 0;
  this.switcheroo = [];
  this.prison = [];
  this.id = id;

  this.wounds = [0,0,0,0];
  this.hardened = 0;
  this.edicts = 0;

  this.setWeariness = function (newfear) {
    this.weariness = newfear;
    //console.log('weariness:'+this.weariness)
  };

  this.refreshMarket = function (playerId) {
    let newField = [...this.battlefield];
    //console.log('location refreshMarket by '+playerName+JSON.stringify(newField))
    let player;
    newField.map((pl, index) => {
      if (pl) {
        //console.log(pl.name+'mapped')
        if (pl.id == playerId) {
          //console.log('found player in bf')
          player = pl;
          if (player && player.gold > 0) {
            let newDeck = [...this.deck, ...this.market];
            this.deck = [...newDeck];
            this.market = [];
            this.drawOne();
            this.drawOne();
            this.drawOne();
            player.gold -= 1;
            this.battlefield = [...newField];
            //console.log('market refreshed')
            return 'market refreshed';
          }
        } else if(playerId == -1) {
           let newDeck = [...this.deck, ...this.market];
            this.deck = [...newDeck];
            this.market = [];
            this.drawOne();
            this.drawOne();
            this.drawOne();
           return 'market refreshed'; 
          //console.log('no player in bf found')
        }
      }
    });
    // //console.log(player.name+' is refreshing')
    //console.log('market NOT refreshed')
    return 'market not refreshed';
  };
  this.drawOne = function () {
    let newMarket = [...this.market];
    let newDeck = [...this.deck];
    //console.log('location:drawOne:')
    if (newDeck.length > 0) {
      let ranCard = Math.floor(Math.random() * (newDeck.length - 1));
      newDeck[ranCard].origin = this.id;
      newMarket.push(newDeck[ranCard]);
      newDeck.splice(ranCard, 1);
    } else {
      //console.log('the market is empty!')
    }

    this.market = [...newMarket];
    this.deck = [...newDeck];
  };
  // createMarket = function(){
  //all decks start with 1 2cost and 1 3 cost card atm
  if (this.deck.length > 0) {
    //otherwise jerusalem has no market
    this.market.push(this.deck[0]);
    this.deck.splice(0, 1);
    this.market.push(this.deck[5]);
    this.deck.splice(5, 1);
    this.drawOne();
    // //console.log('market: '+this.market)
    // //console.log('market: '+JSON.stringify(this.deck))
  }

  this.buy = function (index, player) {
    if (
      this.battlefield[player.id] &&
      this.battlefield[player.id].gold >= this.market[index].cost
    ) {
      //console.log('location:buy:'+JSON.stringify(this.market[index].name))
      let newBattleField = [...this.battlefield];
      newBattleField[player.id].gold -= this.market[index].cost;

      player.buyCard(this.market[index]);
      let newMarket = [...this.market];
      newMarket.splice(index, 1);
      this.market = [...newMarket];
      this.battlefield = [...newBattleField];
      this.drawOne();
      return `bought ${player.discard[0].name}`;
    } else {
      //can't afford card
      return `can't afford card`;
    }
    if (player.type == 'AI') {
      //AI cheat ... if it has gold it floats it

      player.buyCard(this.market[index]);
      let newMarket = [...this.market];
      newMarket.splice(index, 1);
      this.market = [...newMarket];
      this.battlefield = [...newBattleField];
      this.drawOne();
      return `bought ${player.discard[0].name}`;
    }
  };

  this.playCard = function (card, owner, copyInfluence) {
    console.log('playCard: owner id:'+owner.id+" on "+this.name)
    let newField = [...this.battlefield];
    //console.log('location:playcard:'+card)
    if (!newField[owner.id]) {
      newField[owner.id] = {
        name: owner.name,
        id: owner.id,
        influence: 0,
        gold: 0,
        politics: 0,
        poliBonus: 0,
        cards: [],
        finalInfluence:0,
      };
    }
    //console.log('play card'+owner.hand[card].name)
    newField[owner.id].influence += owner.hand[card].influence;
    newField[owner.id].gold += owner.hand[card].gold;
    newField[owner.id].cards.push(owner.hand[card]);

    //special abilities here!
    //ninevite
    if (
      owner.hand[card].abilities.indexOf('Ninevite') > -1 &&
      this.name == 'Nineveh'
    ) {
      newField[owner.id].influence += 1;
      //console.log('ninevite advantage bonus')
    }

    if (owner.hand[card].abilities.indexOf('angelic') > -1) {
      this.angelic = owner.id;
    }
    if (owner.hand[card].abilities.indexOf('mob') > -1) {
      newField[owner.id].influence += newField[owner.id].cards.length - 1;
      card.influence += newField[owner.id].cards.length - 1;
    }
    if (owner.hand[card].abilities.indexOf('xerxes') > -1) {
      this.switcheroo.push(owner.id);
    }
    if (owner.hand[card].abilities.indexOf('prison') > -1) {
      this.prison.push(owner.id);
    }
    if (owner.hand[card].abilities.indexOf('mordecai') > -1) {
      let greatest = 0;
      let gpolitic = 0;
      let gGold = 0;
      let blessing= false;
      let greatCard = {name:"nothing",influence:0,abilities:['scrap']};
      newField[owner.id].cards.map((c, index) => {
        let inf = c.influence || 0
        let gol = c.gold || 0
        let pol = c.politics || 0
        if (c.abilities.indexOf('mordecai') < 0 && inf +pol +gol> greatest + gpolitic*(this.edicts+1) + gGold) {
          greatest = inf;
          gpolitic = pol;
          gGold = gol;
          greatCard = c;
          // blessing =true;
          console.log('new greatest card'+inf)
        }
      });
      // newField[owner.id]
      let newCard = {
        ...greatCard,
        name: "mordecai's blessing: "+greatCard.name,
        abilities:["scrap","edict"]
      }
      owner.hand=[...owner.hand,newCard];
      this.playCard(owner.hand.length-1,owner);
    }

    if (owner.hand[card].fear) {
      //console.log('adding influence to location:'+this.weariness+" add "+owner.hand[card].wear)
      this.weariness += parseInt(owner.hand[card].fear);
    }
    if (owner.hand[card].faith) {
      //console.log('adding influence to location:'+this.weariness+" add "+owner.hand[card].wear)
      let faith = owner.hand[card].faith
      while(this.weariness > 0 && faith > 0){
        this.weariness -= 1;
        faith -=1;
        newField[owner.id].influence += 1;
      }
    }

    if (owner.hand[card].reinforce > 0) {
      for (let x = 0; x < owner.hand[card].reinforce; x++) {
        //console.log('reinforcements!')
        if (owner.deck.length > 0 || owner.discard.length > 0) {
          owner.drawCards(1);
          this.battlefield = [...newField];
          this.playCard(owner.hand.length - 1, owner);
        } else {
          //console.log('your deck is empty cannot reinforce')
        }
      }
    }
    if (owner.hand[card].abilities.indexOf('zeal') > -1) {
      newField[owner.id].influence += this.proselytized[owner.id];
    }
    if (owner.hand[card].abilities.indexOf('apostle') > -1) {
      newField[owner.id].playPaul = true;
      //console.log('paul played on location')
    }
    if (owner.hand[card].abilities.indexOf('traverse') > -1) {
      // newField[owner.id].playPaul = true;
      //console.log('paul played on location')
      this.traversal+=1;
      
    }

    if (
      owner.hand[card].abilities.indexOf('Harden') > -1 &&
      this.id == owner.id
    ) {
      this.hardened+=1;
      //console.log('Jonah has been hardened'+this.hardened)
    }
    //can't else this because some cards have both edict and politics
    if (owner.hand[card].abilities.indexOf('edict') > -1) {
      this.edicts+=1;
      console.log('edicts:'+this.edicts)
      
      //console.log('played an edict, now there are '+this.edicts)
    }
    if (owner.hand[card].politics) {
      newField[owner.id].politics += owner.hand[card].politics;
      // newField[owner.id].poliBonus = newField[owner.id].politics * this.edicts;
      //console.log('total politics bonus for loc is:'+newField[owner.id].politics +"*"+ this.edicts + newField[owner.id].poliBonus)
    }

    newField.map((bf, index)=>{
      if(bf){
        bf.poliBonus = bf.politics * this.edicts;
        console.log('new poli:'+bf.poliBonus)
      }
    })

    this.battlefield = newField;
    let theString = `played ${owner.hand[card].name} on ${this.name}`;
    //console.log(owner.name+" played "+owner.hand[card].name+" on "+this.name+" for influence new: "+newField[owner.id].influence)
    // //console.log(JSON.stringify(newField)+JSON.stringify(this.battlefield))
    let cardName = owner.hand[card].name;
    if (owner.hand[card].abilities.indexOf('scrap') < 0) {
      if (owner.hand[card].abilities.indexOf('mordecai') > -1) {

      }

      owner.playedCard(card);
      return theString;
    } else {
      owner.millCard(card);
      owner.mills-=1;

      // let newHand = [...owner.hand]
      // newHand.splice(card,1)
      // owner.hand = [...newHand]
      //console.log('this is an influence card and is not discarded')
      return theString;
    }
  };

  this.compareInfluence = function () {
    //console.log('location:compareInfluence:')
    let influencer = {
      name: 'neutral',
      id: -1,
      influence: 0,
      totalInfluence: 0,
      poliBonus: 0,
    };

    let runnerUp = 0;
    // let paul = -1;
    if (this.battlefield.length > 0) {
      this.battlefield.map((player, index) => {
        if (player && this.battlefield[index]) {

          if (this.battlefield[index].playPaul) {
            this.apostle = index;
          }

          if (
            this.battlefield[index] &&
            this.battlefield[index].influence +
            this.battlefield[index].poliBonus -
            this.weariness >
            influencer.influence + influencer.poliBonus - this.weariness
          ) {
            
            if(influencer.influence + influencer.poliBonus - this.weariness > 0){
              runnerUp = influencer.influence + influencer.poliBonus- this.weariness;
            }
            
            influencer = this.battlefield[index];
          } else if (
            this.battlefield[index] &&
            this.battlefield[index].influence + influencer.poliBonus - this.weariness > runnerUp
          ) {
            runnerUp = this.battlefield[index].influence + influencer.poliBonus - this.weariness;
          }
        }
      });
    }
  
    // if (!runnerUp) {
    //   runnerUp = 0;
    // }
    // //console.log(influencer.name+" is the highest influencer by "+influencer.influence+runnerUp);
    influencer.finalInfluence =
      influencer.influence + influencer.poliBonus - runnerUp - this.weariness;
      console.log('influencer of '+influencer.influence +"and"+ influencer.poliBonus+ " minus:" + runnerUp + " vs "+this.influence)
    return influencer;
  };
  this.setInfluencing = function () {

    let influencer = this.compareInfluence();

    if (this.angelic > -1 && (influencer.id != this.angelic || influencer.finalInfluence <= this.influence)) {
      //console.log('moments peace no influence today')
      this.postInfluencePhase();
    } else {
      //console.log('location:setInfluencing:')
      // let baseInfluence = this.influence;

      if (this.apostle > -1) {
        this.battlefield.map((bf,index)=>{
          if(bf && bf.playPaul){
            if(influencer.id == bf.id && influencer.finalInfluence > this.influence){
              this.proselytized[bf.id] += 1;
              console.log('paul got a church')
            }else{
              this.wounds[bf.id] +=1;
              console.log('paul got beat up')
            }
          }
        })
      }

      // //console.log('influence looks like: '+influencer.finalInfluence+" vs "+baseInfluence +"+"+this.weariness)
      if (
        influencer.finalInfluence > this.influence  &&
        influencer.name != 'neutral'
      ) {
        this.influencer = influencer;
        // //console.log('new influencer is now'+influencer.name)

        if (this.name == 'Canaan' && influencer.name == 'Joshua' && this.id == influencer.id) {
          this.abilities = [this.abilities[0] + 1];
          this.influence += 3;
          // this.card.influence += this.abilities[0]-1;
          this.card.fear += 1;
          console.log('canaan conquered, tier up'+this.abilities[0])
        }
      }


      this.postInfluencePhase();
    }//angelic
  };
  this.postInfluencePhase = function () {
    this.angelic = -1;
    this.battlefield = [];
    this.edicts = 0;
    this.apostle = -1;
    this.switcheroo = [];
    this.prison = [];
    this.traversal = 0;
    //moved to apigame
    if (this.name == 'Canaan') {
      this.weariness+=1;
      //console.log('end of turn weariness for canaan')
    }
  };
};
