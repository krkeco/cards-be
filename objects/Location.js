module.exports.Location = function Location(
  deck,
  story,
  id = 7,
  infoDeck,
  character,
) {
  this.deck = [...deck];
  this.character = { ...character };
  this.infoDeck = [...infoDeck];
  this.card = { ...story.card };
  this.info = story.info;
  this.market = [];
  this.coopDeck = [];
  this.coopDisplay = [];

  this.tax = 0;
  this.extortion = 0;
  this.kingCommand = false;

  this.battlefield = [];
  this.name = story.name;
  this.influence = story.influence;
  // this.weariness = 0;
  this.abilities = story.abilities;
  this.influencer = { name: 'neutral' };
  this.proselytized = [0, 0, 0, 0, 0, 0];
  this.angelic = -1;
  this.apostle = -1;
  this.traversal = 0;
  this.switcheroo = [];
  this.prison = [];
  this.id = id;

  this.wounds = [0, 0, 0, 0, 0, 0];
  this.hardened = 0;
  this.edicts = 0;

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
        } else if (playerId == -1) {
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

  this.drawEffect = function () {
    let newMarket = [...this.coopDisplay];
    let newDeck = [...this.coopDeck];
    //console.log('location:drawOne:')
    if (newDeck.length > 0) {
      let ranCard = Math.floor(Math.random() * (newDeck.length - 1));
      newDeck[ranCard].origin = this.id;
      newMarket.push(newDeck[ranCard]);

      newDeck.splice(ranCard, 1);
    } else {
      //console.log('the market is empty!')
    }

    this.coopDisplay = [...newMarket];
    this.coopDeck = [...newDeck];
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
  //all decks start with 1 2cost and 1 3 cost card atm
  if (this.deck.length > 0) {
    //otherwise jerusalem has no market
    // this.market.push(this.deck[0]);
    // this.deck.splice(0, 1);
    // this.market.push(this.deck[5]);
    // this.deck.splice(5, 1);
    this.drawOne();
    if (this.name != 'Jerusalem') {
      this.drawOne();
      this.drawOne();
    }
  }
  this.coopCount = {
    totalGold: 0,
    totalInfluence: 0,
    totalFaith: 0,
    totalCourage: 0,
    totalProvision: 0,
  };
  this.removeEffect = function (index) {
    let removedCard = this.coopDisplay[index];
    console.log('remove effect ', removedCard.name);
    switch (this.name) {
      case 'Canaan':
        console.log(
          this.name,
          'against',
          this.coopCount.totalFaith + this.coopCount.totalInfluence,
        );
        // totalInfluence + totalFaith >= fear
        if (
          this.coopCount.totalFaith + this.coopCount.totalInfluence >=
          removedCard.fear
        ) {
          console.log(
            'removing fear of ' + removedCard.fear,
            ' with ',
            this.coopCount.totalFaith,
            this.coopCount.totalInfluence,
          );
          this.coopCount.totalFaith -= removedCard.fear;
          if (this.coopCount.totalFaith < 0) {
            this.coopCount.totalInfluence += this.coopCount.totalFaith;
            this.coopCount.totalFaith = 0;
          }

          let newCanaanCoopDeck = [...this.coopDeck];
          newCanaanCoopDeck.push({ ...removedCard });
          this.coopDeck = [...newCanaanCoopDeck];
          this.spliceOp(index);
        }
        break;
      case 'Nineveh':
        //provision > 0 || gold > 0
        if (this.coopCount.totalProvision > 1) {
          this.coopCount.totalProvision -= 2;

          let newMarket = [...this.market];
          newMarket.push({ ...removedCard });
          this.market = [...newMarket];
          this.spliceOp(index);
        } else if (this.coopCount.totalProvision > 0) {
          this.coopCount.totalProvision -= 1;

          let newDeck = [...this.coopDeck];
          newDeck.push({ ...removedCard });
          this.coopDeck = [...newDeck];
          this.spliceOp(index);
        } else if (this.coopCount.totalGold > 1) {
          this.coopCount.totalGold -= 2;

          let newDeck = [...this.coopDeck];
          newDeck.push({ ...removedCard });
          this.coopDeck = [...newDeck];
          this.spliceOp(index);
        }
        break;
      case 'Babylon':
        console.log('effect on Babylon');
        //courage > 0 || gold > cost
        if (this.coopCount.totalCourage > 0 && removedCard.name != "Annihilation") {
          this.coopCount.totalCourage -= 1;
          let newDeck = [...this.coopDeck];
          newDeck.push({ ...removedCard });
          this.coopDeck = [...newDeck];
          this.spliceOp(index);
          console.log('removed effect from babylon');
        } else if (this.coopCount.totalGold >= removedCard.cost) {
          this.coopCount.totalGold -= removedCard.cost;
          let newDeck = [...this.coopDeck];
          newDeck.push({ ...removedCard });
          this.coopDeck = [...newDeck];
          this.spliceOp(index);
        } else if (this.coopCount.totalCourage > 1 && removedCard.name == "Annihilation") {
          this.coopCount.totalCourage -= 2;
          let newDeck = [...this.coopDeck];
          newDeck.push({ ...removedCard });
          this.coopDeck = [...newDeck];
          this.spliceOp(index);
          console.log('removed annihilation from babylon');
        console.log('fin bab');
      }
        break;

      case 'Rome':
        // let romDeck = [...this.deck];
        // romDeck.push({...removedCard});
        // this.deck = [...romDeck];
        // this.spliceOp(index)
        break;
    }

    return removedCard.name;
  };
  this.spliceOp = function (index) {
    let newCoop = [...this.coopDisplay];
    newCoop.splice(index, 1);
    this.coopDisplay = [...newCoop];
  };

  this.buy = function (index, player) {
    if (
      this.battlefield[player.id] &&
      this.battlefield[player.id].gold >= this.market[index].cost + this.tax
    ) {
      console.log('location:buy:' + JSON.stringify(this.market[index].name));
      let newBattleField = [...this.battlefield];
      newBattleField[player.id].gold -= this.market[index].cost;
      newBattleField[player.id].gold -= this.tax;
      this.coopCount.totalGold -= this.market[index].cost;
      this.coopCount.totalGold -= this.tax;

      let cardBuy = this.market[index];
      player.buyCard(cardBuy);
      let newMarket = [...this.market];
      newMarket.splice(index, 1);
      this.market = [...newMarket];
      this.battlefield = [...newBattleField];
      if (this.market.length < 3) {
        this.drawOne();
      }
      return `bought ${cardBuy.name}`;
    } else {
      //can't afford card
      return `can't afford card`;
    }
  };

  this.playCard = function (card, owner) {
    if (owner.hand[card]) {
      console.log('playCard: owner id:' + owner.id + ' on ' + this.name);
      let newField = [...this.battlefield];
      //console.log('location:playcard:'+card)
      if (!newField[owner.id]) {
        newField[owner.id] = {
          name: owner.name,
          id: owner.id,
          influence: 0,
          runningTotal: 0,
          gold: 0,
          politics: 0,
          provision: 0,
          poliBonus: 0,
          fear: 0,
          weariness: 0,
          faith: 0,
          faithing: false,
          cards: [],
          finalInfluence: 0,
        };
      }
      //console.log('play card'+owner.hand[card].name)
      newField[owner.id].influence += owner.hand[card].influence;
      newField[owner.id].gold += owner.hand[card].gold;
      let bfCard = { ...owner.hand[card] };
      newField[owner.id].cards.push(bfCard);

      this.coopCount.totalInfluence += bfCard.influence || 0;
      this.coopCount.totalGold += bfCard.gold || 0;
      this.coopCount.totalFaith += bfCard.faith || 0;
      this.coopCount.totalCourage += bfCard.politics ? 1 : 0;
      this.coopCount.totalProvision += bfCard.provision || 0;
      console.log('coopCount', JSON.stringify(this.coopCount));

      if (bfCard.fear != null) {
        console.log('fear played');
        newField[owner.id].fear += bfCard.fear;
      }
      console.log('fear updated');
      if (bfCard.faith != null) {
        newField[owner.id].faith += bfCard.faith;
      }
      //special abilities here!
      //ninevite
      if (bfCard.abilities.indexOf('Ninevite') > -1 && this.name == 'Nineveh') {
        // newField[owner.id].influence += 1;
        //console.log('ninevite advantage bonus')
      }

      if (bfCard.abilities.indexOf('angelic') > -1) {
        //if you want to scrap it into the market after play..
        // this.deck = [...this.deck, {...owner.hand[card]}]
        // owner.hand[card].abilities.push("scrap")
        if (this.angelic != -1) {
          this.angelic = 7;
        } else {
          this.angelic = owner.id;
        }
      }
      if (bfCard.abilities.indexOf('mob') > -1) {
        newField[owner.id].influence += newField[owner.id].cards.length - 1;
        bfCard.influence += newField[owner.id].cards.length - 1;
      }
      if (bfCard.abilities.indexOf('xerxes') > -1) {
        this.switcheroo.push(owner.id);
      }
      if (bfCard.abilities.indexOf('prison') > -1) {
        this.prison.push(owner.id);
      }
      if (bfCard.abilities.indexOf('mordecai') > -1) {
        let greatest = -1;
        let greatCard = { name: 'nothing', influence: 0, abilities: ['scrap'] };
        newField[owner.id].cards.map((c, index) => {
          if (c.abilities.indexOf('mordecai') < 0 && c.cost > greatest) {
            greatest = c.cost;
            greatCard = c;
          }
        });
        let newCard = {
          ...greatCard,
          name: "mordecai's blessing: " + greatCard.name,
          abilities: ['scrap'],
        };
        owner.hand = [...owner.hand, newCard];
        this.playCard(owner.hand.length - 1, owner);
      }

      if (bfCard.provision > 0) {
        newField[owner.id].provision += bfCard.provision;
        for (let x = 0; x < bfCard.provision; x++) {
          //console.log('provisionments!')
          if (owner.deck.length > 0 || owner.discard.length > 0) {
            owner.drawCards(1);
            this.battlefield = [...newField];
            this.playCard(owner.hand.length - 1, owner);
          } else {
            //console.log('your deck is empty cannot provision')
          }
        }
      }

      //may change to fellowship?
      if (bfCard.abilities.indexOf('apostle') > -1) {
        let churches = 0;
        this.proselytized.map((church) => (churches += church));
        newField[owner.id].influence += churches;
      }
      if (bfCard.abilities.indexOf('apostle') > -1) {
        newField[owner.id].playPaul = true;
      }
      if (bfCard.abilities.indexOf('traverse') > -1) {
        this.traversal += 1;
      }

      if (bfCard.abilities.indexOf('challenge') > -1) {
        this.edicts += 1;
        console.log('edicts:' + this.edicts);
      }
      if (bfCard.politics) {
        newField[owner.id].politics += bfCard.politics;
      }

      newField.map((bf, index) => {
        if (bf) {
          bf.poliBonus = bf.politics * this.edicts;
          console.log('new poli:' + bf.poliBonus);
        }
      });

      this.battlefield = newField;
      let theString = `played ${bfCard.name} on ${this.name}`;
      console.log(
        owner.name +
          ' played ' +
          owner.hand[card].name +
          ' on ' +
          this.name +
          ' for influence new: ' +
          newField[owner.id].influence,
      );
      // //console.log(JSON.stringify(newField)+JSON.stringify(this.battlefield))
      let cardName = bfCard.name;
      if (bfCard.abilities.indexOf('scrap') < 0) {
        owner.playedCard(card);
      } else {
        owner.millCard(card);
        owner.mills -= 1;
      }
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
      runningTotal: 0,
      poliBonus: 0,
      fear: 0,
      faith: 0,
      faithing: false,
      weariness: 0,
      politics: 0,
    };

    let runnerUp = 0;
    // let paul = -1;
    if (this.battlefield.length > 0) {
      this.battlefield.map((player, index) => {
        if (player && this.battlefield[index]) {
          this.battlefield[index].poliBonus =
            this.battlefield[index].politics * this.edicts;
          // console.log(player.name+' has polibonus '+this.battlefield[index].poliBonus)
          // if(this.battlefield[index].poliBonus < 0){
          //   this.battlefield[index].poliBonus = 0;
          // }
        }
      });

      this.battlefield.map((player, index) => {
        if (player && this.battlefield[index]) {
          this.battlefield[index].weariness = 0;

          if (!this.battlefield[index].faithing) {
            this.battlefield.map((pl, ind) => {
              if (pl && pl.id != this.battlefield[index].id) {
                this.battlefield[index].weariness += pl.fear;
                console.log('fear to weary:' + pl.fear);
              }
            });
          }

          if (
            this.battlefield[index].influence <= 0 &&
            this.battlefield[index].faith > 0
          ) {
            this.battlefield[index].influence = this.battlefield[index].faith;
            this.battlefield[index].weariness = 0;
            this.battlefield[index].faithing = true;
          }

          if (this.battlefield[index].playPaul) {
            this.apostle = index;
          }

          //new influencer
          if (
            this.battlefield[index].influence +
              this.battlefield[index].poliBonus -
              this.battlefield[index].weariness >
            influencer.influence + influencer.poliBonus - influencer.weariness
          ) {
            //influencer becomes runner up?
            if (
              influencer.influence +
                influencer.poliBonus -
                influencer.weariness >
              0
            ) {
              runnerUp =
                influencer.influence +
                influencer.poliBonus -
                influencer.weariness;
            }
            //new influencer
            influencer = this.battlefield[index];

            //new runnerup
          } else if (
            this.battlefield[index].influence +
              this.battlefield[index].poliBonus -
              this.battlefield[index].weariness >
            runnerUp
          ) {
            runnerUp =
              this.battlefield[index].influence +
              this.battlefield[index].poliBonus -
              this.battlefield[index].weariness;
          }
        }
      });
    }

    // if (!runnerUp) {
    //   runnerUp = 0;
    // }
    // //console.log(influencer.name+" is the highest influencer by "+influencer.influence+runnerUp);
    influencer.finalInfluence =
      influencer.influence +
      influencer.poliBonus -
      influencer.weariness -
      runnerUp;
    console.log(
      'influencer of ' +
        influencer.influence +
        'and' +
        influencer.poliBonus +
        'less weari' +
        influencer.weariness +
        ' minus:' +
        runnerUp +
        ' vs ' +
        this.influence +
        ' on ' +
        this.name,
    );
    return influencer;
  };
  this.setInfluencing = function () {
    let influencer = this.compareInfluence();
    if (
      //ignores angelic
      influencer.finalInfluence > this.influence && //this.influence
      this.name == 'Canaan' &&
      influencer.name == 'Joshua' &&
      this.id == influencer.id
    ) {
      this.abilities = [this.abilities[0] + 1];
      this.influence += 3;
      // this.card.influence += this.abilities[0]-1;
      this.card.fear += 1;
      // console.log('canaan conquered, tier up'+this.abilities[0])
    }

    if (
      this.angelic > -1 &&
      (influencer.id != this.angelic ||
        this.angelic == 7 ||
        influencer.finalInfluence <= this.influence)
    ) {
      //console.log('moments peace no influence today')

      this.postInfluencePhase();
    } else {
      //console.log('location:setInfluencing:')
      // let baseInfluence = this.influence;

      if (this.apostle > -1) {
        this.battlefield.map((bf, index) => {
          if (bf && bf.playPaul && bf.name == 'Paul') {
            if (
              influencer.id == bf.id &&
              influencer.finalInfluence > this.influence
            ) {
              this.proselytized[bf.id] += 1;
              console.log('paul got a church');
            } else {
              this.wounds[bf.id] += 1;
              console.log('paul got beat up');
            }
          }
        });
      }

      // //console.log('influence looks like: '+influencer.finalInfluence+" vs "+baseInfluence +"+"+this.weariness)
      if (
        influencer.finalInfluence > this.influence && //this.influence
        influencer.name != 'neutral'
      ) {
        this.influencer = influencer;
        // //console.log('new influencer is now'+influencer.name)
      }

      this.postInfluencePhase();
    } //angelic
  };
  this.postInfluencePhase = function () {
    this.angelic = -1;
    this.battlefield = [];
    this.edicts = 0;
    this.apostle = -1;
    this.switcheroo = [];
    this.prison = [];
    this.kingCommand = false;
    this.traversal = 0;
    this.tax = 0;
    this.influence = 3;
    //moved to apigame
    if (this.name == 'Canaan') {
      this.influence += this.abilities * 3;
    }

  this.coopCount = {
    totalGold: 0,
    totalInfluence: 0,
    totalFaith: 0,
    totalCourage: 0,
    totalProvision: 0,
  };
  };
};
