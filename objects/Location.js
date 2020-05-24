module.exports.Location = function Location(deck, story) {
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
  this.angelic = false;
  this.apostle = -1;
  this.traversal = 0;
  this.switcheroo = [];

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

    if(owner.hand[card].abilities.indexOf('ark') > -1 ) {
      // newField[owner.id].influence += 2;
      let hasFaith = false;
      if(this.battlefield[owner.id]){
        this.battlefield[owner.id].cards.map((card,index)=>{
          if(card.abilities.indexOf('faith') > -1){
            hasFaith = true;
          }
        })
      }
      if(hasFaith){
        console.log('has faith +3')
        this.weariness-=3;
        if (this.weariness < 0) {
          this.weariness = 0;
        }
      }else{
        console.log('has fear +3')
        this.weariness+=3;
      }
      //console.log('ninevite advantage bonus')
    }

    if (owner.hand[card].abilities.indexOf('angelic') > -1) {
      this.angelic = true;
    }
    if (owner.hand[card].abilities.indexOf('mob') > -1) {
      newField[owner.id].influence += newField[owner.id].cards.length - 1;
      card.influence += newField[owner.id].cards.length - 1;
    }
    if (owner.hand[card].abilities.indexOf('xerxes') > -1) {
      this.switcheroo = owner.id;
    }
    if (owner.hand[card].abilities.indexOf('mordecai') > -1) {
      let greatest = 0;
      let gpolitic = 0;
      newField[owner.id].cards.map((card, index) => {
        if (card.influence > greatest) {
          greatest = card.influence;
          gpolitic = card.politics;
          

        }
      });
      // newField[owner.id]
      owner.hand[card].influence = greatest;
      owner.hand[card].politics = gpolitic;
      newField[owner.id].influence += greatest;
      newField[owner.id].politics += gpolitic;
      newField[owner.id].poliBonus = newField[owner.id].politics * this.edicts;
      //console.log('mordecai added '+greatest+" to this location")
    }

    // if (owner.hand[card].abilities.indexOf('haman') > -1) {
    //   newField.map((bf, ind) => {
    //     if (bf && bf.id != owner.id) {
    //       bf.haman = true;
    //     }
    //   });
    // }

    if (owner.hand[card].fear) {
      //console.log('adding influence to location:'+this.weariness+" add "+owner.hand[card].wear)
      this.weariness += parseInt(owner.hand[card].fear);
    }
    if (owner.hand[card].faith) {
      this.weariness -= owner.hand[card].faith;
      if (this.weariness < 0) {
        this.weariness = 0;
      }
    }
    if (owner.hand[card].abilities.indexOf('faithful') > -1) {
      if (!newField[owner.id].faithfulReport) {
        newField[owner.id].faithfulReport = 0;
      }
      newField[owner.id].faithfulReport += 1;
    }
    if (owner.hand[card].abilities.indexOf('balaam') > -1) {
      newField[owner.id].influence += copyInfluence;
      //console.log('balaam added '+copyInfluence+" to this location")
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
      id: 0,
      influence: this.influence,
      totalInfluence: this.influence,
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

          if (this.battlefield[index].faithfulReport) {
            while (
              this.battlefield[index].faithfulReport > 0 &&
              this.battlefield[index].gold > 2
            ) {
              this.weariness -= 3;
              this.battlefield[index].faithfulReport-=1;
              this.battlefield[index].gold -= 3;
            }
          }

          // if (player.haman) {
          //   let greatest = 0;
          //   let greatDex;
          //   player.cards.map((card, index) => {
          //     if (card.influence > greatest) {
          //       greatest = card.influence;
          //       greatDex = player;
          //     }
          //   });
          //   if (greatDex) {
          //     greatDex.influence -= greatest;
          //   }
          // }

          // //console.log('player from battlefield'+player+index)
          if (
            this.battlefield[index].influence +
              this.battlefield[index].poliBonus >
            influencer.influence + influencer.poliBonus
          ) {
            influencer = this.battlefield[index];
          } else if (
            this.battlefield[index] &&
            this.battlefield[index].influence + influencer.poliBonus > runnerUp
          ) {
            runnerUp = this.battlefield[index].influence + influencer.poliBonus;
          }
        }
      });
    }
  
    // if (!runnerUp) {
    //   runnerUp = 0;
    // }
    // //console.log(influencer.name+" is the highest influencer by "+influencer.influence+runnerUp);
    influencer.finalInfluence =
      influencer.influence + influencer.poliBonus - runnerUp;
    return influencer;
  };
  this.setInfluencing = function () {

    if (this.angelic) {
      //console.log('moments peace no influence today')
      this.postInfluencePhase();
    } else {
      //console.log('location:setInfluencing:')
      let influencer = this.compareInfluence();
      // let baseInfluence = this.influence;

      if (this.apostle > -1) {
        this.battlefield.map((bf,index)=>{
          if(bf.playPaul){
            if(influencer.id == bf.id && influencer.finalInfluence > this.influence + this.weariness * 2){
              this.proselytized[bf.id] += 1;
              console.log('paul got a church')
            }else{
              this.wounds[bf.id] +=1;
              console.log('paul got beat up')
            }
          }
        })
      }

      // //console.log('influence looks like: '+influencer.finalInfluence+" vs "+baseInfluence +"+"+this.weariness*2)
      if (
        influencer.finalInfluence > this.influence + this.weariness * 2 &&
        influencer.name != 'neutral'
      ) {
        this.influencer = influencer;
        // //console.log('new influencer is now'+influencer.name)

        if (this.name == 'Canaan' && influencer.name == 'Joshua' && this.id == influencer.id) {
          this.abilities = [this.abilities[0] + 1];
          this.influence += 3;
          this.card.influence += 2*this.abilities[0] - 2;
          console.log('canaan conquered, tier up'+this.abilities[0])
        }
      }

      this.postInfluencePhase();
      //console.log('influence for '+this.name+' checked; Influencer is now: '+this.influencer.name+" \n battlefield:"+JSON.stringify(this.battlefield))
    }
  };
  this.postInfluencePhase = function () {
    this.angelic = false;
    this.battlefield = [];
    this.edicts = 0;
    this.apostle = -1;
    this.switcheroo = [];
    this.traversal = 0;
    if (this.name == 'Canaan') {
      this.weariness+=1;
      //console.log('end of turn weariness for canaan')
    }
  };
};
