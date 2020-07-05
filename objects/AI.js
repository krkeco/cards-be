module.exports.AI = function AI(player, locations) {
  this.runStrategy = async (strategy) => {
    this.log = [];
    // this.log = [...log]
    try {
      console.log('logging ai');
      let golds = 0;
      let infl = 0;
      let politics = 0;
      let apostles = 0;
      let faith = 0;
      let allCards = [...player.deck, ...player.hand, ...player.discard];
      allCards.map((card, index) => {
        golds += card.gold;
        politics += card.politics ? card.politics : 0;
        infl += card.influence;
        faith += card.faith ? card.faith : 0;
      });
      console.log('faith ai ' + faith);
      console.log('checking player specific strategy ' + player.name);
      switch (player.name) {
        case 'Esther':
          if (
            player.getTotalInfluence() +
              locations[player.id].edicts * politics >
            14
          ) {
            console.log('winner play on babylon');
            this.playLoc(player.id);
          } else {
            if (golds < 7 && infl < 14) {
              this.buySomething('gold');
              this.buySomething();
            } else {
              this.buySomething('influence');
              this.buySomething();
            }
            this.millSomething('gold');
            this.attackSomething();
            // this.standardStrat();
          }
          break;
        case 'Jonah':
          let ninevites = 0;
          player.hand.map((card, index) => {
            // console.log('mapping battlefield cards:' + card.name);
            if (card.abilities.indexOf('Ninevite') > -1) {
              ninevites++;
              console.log('ninevites' + ninevites);
            }
            if (card.abilities.indexOf('Harden') > -1) {
              //no fail bane
              console.log('no bane jonah');
              locations[player.id].playCard(index, player);
            }
          });
          if (ninevites > 3) {
            this.playLoc(player.id);
          } else {
            console.log('no jonah found');
            // this.standardStrat();
            this.buySomething('ninevite');
            this.buySomething();
            this.buySomething();
            this.millSomething();
            this.attackSomething();
          }

          break;
        case 'Joshua':
          this.buySomething('faith');
          this.buySomething('faith');
          this.millSomething();
          let faithGold = 0;
          if (faith > locations[player.id].influence) {
            for (let c = player.hand.length - 1; c > -1; c--) {
              if (
                player.hand[c].faith > 0 ||
                (player.hand[c].gold > 0 && player.hand[c].influence < 1)
              ) {
                faithGold += player.hand[c].gold;
                locations[player.id].playCard(c, player);
              }
            }
            locations[player.id].market.map((card, index) => {
              if (faithGold >= card.cost) {
                locations[player.id].buy(index, player);
              }
            });
          }
          this.buySomething();
          // this.buySomething();
          this.attackSomething('nonCanaan');
          break;
        case 'Paul':
          this.buySomething('influence');
          this.buySomething();
          this.millSomething('gold');
          this.attackSomething();
          break;
        default:
          this.standardStrat();
      }

      return this.log;
    } catch (e) {
      console.log('somethign bad happened to AI: ' + e);
      // this.log.push('something went wrong'+e)
      return this.log;
    }
  };
  this.playLoc = (locId) => {
    this.log.push(player.name + ' is attacking ' + locations[locId].name);
    // console.log('playing on '+locations[locId].name)
    for (let c = player.hand.length - 1; c > -1; c--) {
      locations[locId].playCard(c, player);
    }
  };
  this.standardStrat = (strategy) => {
    console.log('running strategy ' + strategy + ' for player ' + player.name);
    let strategem = strategy;
    if (!strategy) {
      strategem = player.name;
    }

    this.buySomething();
    this.buySomething();
    this.millSomething();
    this.attackSomething();
  };

  this.buySomething = function (preference) {
    console.log('buy something');
    let cashOnHand = player.getTotalGold();

    let prefValue = 0;
    let cardLocation;
    let cardIndex;

    Object.keys(locations).map((location, index) => {
      console.log('checking for buy');
      let locMarket = locations[location].market;
      if (locMarket.length > 0) {
        console.log(
          'locmarket:' + locMarket.map((card) => card.name + card.abilities),
        );
        for (let x = 0; x < locMarket.length; x++) {
          if (locMarket[x] && cashOnHand >= locMarket[x].cost) {
            if (preference == null && locMarket[x].cost > prefValue) {
              // console.log('found card with pref:'+preference)
              prefValue = locMarket[x].cost;
              cardLocation = location;
              cardIndex = x;
            } else if (preference == 'gold' && locMarket[x].gold > prefValue) {
              prefValue = locMarket[x].gold;
              cardLocation = location;
              cardIndex = x;
            } else if (
              preference == 'influence' &&
              locMarket[x].influence > prefValue
            ) {
              prefValue = locMarket[x].influence;
              cardLocation = location;
              cardIndex = x;
            } else if (
              preference == 'ninevite' &&
              (locMarket[x].abilities.indexOf('Ninevite') > -1 ||
                locMarket[x].provision > 0)
            ) {
              prefValue = locMarket[x].cost;
              cardLocation = location;
              cardIndex = x;
            } else if (preference == 'faith' && locMarket[x].faith > 0) {
              prefValue = locMarket[x].cost;
              cardLocation = location;
              cardIndex = x;
            }
          }
        }
      }
    });

    if (cardLocation) {
      //we can afford a card
      let currGold = 0;
      for (let c = player.hand.length - 1; c > -1; c--) {
        if (
          player.hand[c].gold > 0 &&
          currGold < locations[cardLocation].market[cardIndex].cost
        ) {
          currGold += player.hand[c].gold;
          locations[cardLocation].playCard(c, player);
        }
      }
      console.log('start buy');
      this.log.push(
        player.name +
          ' is buying ' +
          locations[cardLocation].market[cardIndex].name,
      );
      locations[cardLocation].buy(cardIndex, player);
    }
    // else if(preference){
    //   console.log('failed prefrence, buying anything')
    //   if(preference != 'faith'){//joshua will need to check play on canaan first
    //     this.buySomething();
    //   }
    // }
  };

  this.millSomething = function (preference) {
    console.log('milling something');
    // player.hand.indexOf()
    let allTehGold = 0;
    let starters = 0;
    let highestCost = 0;
    let allCards = [...player.hand, ...player.deck, ...player.discard];
    let allCard = allCards.length;
    allCards.map((card, index) => {
      allTehGold += card.gold;
      if (card.cost > highestCost) {
        highestCost = card.cost;
      } else if (card.cost == 0) {
        starters++;
      }
    });
    //console.log('alltehgold' + allTehGold + ' all the cards:'+allCard)

    if (allCard > 8) {
      let hasPurse = player.hand.findIndex((card) => card.name == 'Gold');
      let hasTaxes = player.hand.findIndex(
        (card) => card.name == 'Tax Collector',
      );
      let hasInfluence = player.hand.findIndex(
        (card) => card.name == 'Influence',
      );

      if (hasInfluence > -1 && preference != 'gold') {
        this.log.push(player.name + ' is milling an influence');
        player.millCard(hasInfluence);
      } else if (hasPurse > -1 && allTehGold > 7) {
        this.log.push(player.name + ' is milling a gold');
        player.millCard(hasPurse);
      } else if (hasTaxes > -1 && starters < 3) {
        player.millCard(hasTaxes);
      }
    }
  };

  this.attackSomething = function (preference) {
    console.log('attacking something');
    let target;
    Object.keys(locations).map((location, index) => {
      let locationDifficulty = locations[location].compareInfluence();
      if (!target || locations[location].influencer.name != player.name) {
        ////console.log('targeting '+locationDifficulty.name + " on "+locations[location].name);
        if (preference == 'nonCanaan' && locations[location].name == 'Canaan') {
          //don't attack canaan if noncanaan
        } else {
          target = locations[location];
        }
      }
    });

    //play cards on target
    //console.log('playing '+player.hand.length);
    this.log.push(player.name + ' is attacking ' + target.name);
    for (let x = player.hand.length - 1; x > -1; x--) {
      //console.log('playing card:'+player.hand[x].name);
      target.playCard(x, player);
    }
  };
};
