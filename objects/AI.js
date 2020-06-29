module.exports.AI = function AI(player, locations) {
  this.runStrategy = async (strategy) => {
    try {
      console.log('logging ai');
      let golds = 0;
      let infl = 0;
      let apostles = 0;
      let allCards = [...player.deck, ...player.hand, ...player.discard]
      allCards.map((card,index)=>{
        golds+= card.gold;
        infl += card.influence;

      })
      console.log('checking player specific strategy '+player.name)
      switch (player.name) {
        case 'Esther':
          if (player.getTotalInfluence() >= 14) {
            console.log('winner play on babylon')
            this.playLoc(player.id);
          } else {
            if(golds < 7){
              this.buySomething('gold')
            }else{
              this.buySomething('influence')
            }
            // this.millSomething();
            this.attackSomething();
            // this.standardStrat();
          }
          break;
          case 'Jonah':
          let ninevites = 0;
              player.hand.map((card, index) => {
                console.log('mapping battlefield cards:' + card.name);
                if (card.abilities.indexOf('Ninevite') > -1) {
                  ninevites++;
                  console.log('ninevites' + ninevites);
                }
              });
              if (ninevites > 3) {
                //4
                console.log('jonah can win!');
                this.playLoc(player.id)
                
              
            } else {
              console.log('no jonah found');
              // this.standardStrat();
              this.buySomething('ninevite')
              this.millSomething();
              this.attackSomething();
            }

          break;
        case 'Joshua':
          let totalInf = player.getTotalInfluence();
          let locInf = locations[player.id].compareInfluence();
          // if(locations[player.id].weariness > 2){
          if(locations[player.id].weariness > 2){
            locations[player.id].weariness -= 1;
          }

          this.buySomething('gold')
            
          // this actually adds 1 turn to play
          // this.millSomething();
          console.log('strat josh: '+totalInf+' vs '+locInf.finalInfluence+"/"+locations[player.id].weariness)
          // if (totalInf > locInf.finalInfluence) {
            console.log('conquer the holy land')
            this.playLoc(player.id);
          // } else {
            // this.standardStrat();
          //   this.attackSomething();
          // }
          break;
        case 'Paul':
          // let totalInf = player.getTotalInfluence();
          // let locInf = locations[player.id].compareInfluence();
          
          this.buySomething('influence')
          this.millSomething('gold');
          this.attackSomething()
          // if(apostles > 1 && inf > 8){
          //   let infOne = 0;
          //   let apoOne = 0;
          //   for (let c = player.hand.length - 1; c > -1; c--) {
          //     if(infOne < 4 || (apoOne == 0 && player.hand[c].indexOf('apostle') > -1) ){
          //       locations[locId].playCard(c, player,0);
          //       if( player.hand[c].indexOf('apostle') > -1){
          //         apoOne = 1;
          //       }
          //     }else{
          //       locations[7].playCard(c, player,0);
          //     }
          //   }
          // }else{
          // }
          
        break;
        default:
          this.standardStrat();
      }
      return true;
    } catch (e) {
      return false;
    }
  };
  this.playLoc = (locId) => {
      console.log('playing on '+locations[locId].name)
    for (let c = player.hand.length - 1; c > -1; c--) {
      locations[locId].playCard(c, player,0);
    }
  };
  this.standardStrat = (strategy) => {
    console.log('running strategy ' + strategy + ' for player ' + player.name);
    let strategem = strategy;
    if (!strategy) {
      strategem = player.name;
    }

    this.buySomething();
    this.millSomething();
    this.attackSomething();
  };

  this.buySomething = function (preference) {
    console.log('buy something')
    let cashOnHand = player.getTotalGold();

    let prefValue = 0;
    let cardLocation;
    let cardIndex;

    Object.keys(locations).map((location, index) => {
      console.log('checking for buy')
      let locMarket = locations[location].market;
      if (locMarket.length > 0) {
        console.log('locmarket:'+locMarket.map(card=>card.name+card.abilities))
        for (let x = 0; x < locMarket.length; x++) {
          if (locMarket[x] && cashOnHand >= locMarket[x].cost) {

            if (!preference && locMarket[x].cost > prefValue) {

              console.log('found card with pref:'+preference)
              prefValue = locMarket[x].cost;
              cardLocation = location;
              cardIndex = x;
            
            }else if(preference == 'gold' && locMarket[x].gold > prefValue){
              prefValue = locMarket[x].gold;
              cardLocation = location;
              cardIndex = x;  
            
            }else if(preference == 'influence' && locMarket[x].influence > prefValue){
              prefValue = locMarket[x].influence;
              cardLocation = location;
              cardIndex = x;
            }else if(preference == 'ninevite' && (locMarket[x].abilities.indexOf("Ninevite") > -1 || locMarket[x].provision > 0)){
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
      for (let c = player.hand.length - 1; c > -1; c--) {
        if (player.hand[c].gold > 0) {
          locations[cardLocation].playCard(c, player);
        }
      }
      console.log('start buy')
      locations[cardLocation].buy(cardIndex, player);
    }else if(preference){
      console.log('failed prefrence, buying anything')
      this.buySomething();
    }
  };

  this.millSomething = function (preference) {
    console.log('milling something')
    // player.hand.indexOf()
    let allTehGold = 0;
    let allCard = 0;
    player.hand.map((card, index) => {
      allTehGold += player.hand[index].gold;
      allCard++;
    });
    player.deck.map((card, index) => {
      allTehGold += player.deck[index].gold;
      allCard++;
    });
    player.discard.map((card, index) => {
      allTehGold += player.discard[index].gold;
      allCard++;
    });
    //console.log('alltehgold' + allTehGold + ' all the cards:'+allCard)

    if (allCard > 8) {
      let hasPurse = player.hand.findIndex((card) => card.name == 'Gold');
      let hasInfluence = player.hand.findIndex(
        (card) => card.name == 'Influence',
      );

      if (hasInfluence > -1  && preference != 'gold') {
        player.mills++;
        console.log(player.name+' is milling influence'+player.mills)
        player.millCard(hasInfluence);
      } else if (hasPurse > -1 && allTehGold > 8) {
        player.mills++;
        console.log(player.name+' is milling purse'+player.mills)
        player.millCard(hasPurse);
      }
    }
  };

  this.attackSomething = function (maxCard) {
    console.log('attacking something')
    let target;
    Object.keys(locations).map((location, index) => {
      let locationDifficulty = locations[location].compareInfluence();
      if (!target || locations[location].influencer.name != player.name) {
        ////console.log('targeting '+locationDifficulty.name + " on "+locations[location].name);

        target = locations[location];
      }
    });

    //play cards on target
    //console.log('playing '+player.hand.length);
    for (let x = player.hand.length - 1; x > -1; x--) {
      //console.log('playing card:'+player.hand[x].name);
      target.playCard(x, player, maxCard);
    }
  };
};
