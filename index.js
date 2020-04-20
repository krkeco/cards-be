const express = require('express');
const app = express();

// const deckData = require('./decks.json')
// const Player = require('./objects/Player.js')
// import {Player} from '/objects/Player.js'

app.get('/', function (req, res) {
 return res.send('Hello world');
});


// const pl = require('./objects/Player.js');
// const loc = require('./objects/Location.js');
// const tu = require('./objects/Turn.js')
// const cards = require('./objects/CardData.js')
// const deckData = new cards.data();
const sim = require('./objects/Simulation.js');


app.listen(process.env.PORT || 8080);

// let Jonah = new pl.Player(deckData.stories.jonah,deckData.decks.starter)
// let Babylon = new loc.Location(deckData.decks.esther,deckData.stories.esther.location)
// for(let x =0; x < 1000; x++){
// 	Jonah.drawCards(10)
// 	Jonah.discardCard(0)
// 	Jonah.discardHand();
// }

let simulation = new sim.Series(10);
//@10k plays
//FP rotate jonah winrate: 53% (really close!)
//fprotate jonah w/ draw1: winrate 46
//fprotate jonah w/ draw2: winrate 61 (too much)
//jonahD2 estherG3 Jwinrate 55 56 53
//jonahD2 estherG2I2 Jwinrate 52 50 52 52
