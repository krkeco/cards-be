const express = require('express');
const app = express();

app.get('/', function (req, res) {
 return res.send('Hello world');
});

const pl = require('./objects/Player.js');
const loc = require('./objects/Location.js');
const tu = require('./objects/Turn.js')
const cards = require('./objects/CardData.js')
const deckData = new cards.data();

const sim = require('./objects/Simulation.js');

// const playerTest = require('./objects/Player.js.test')
// playerTest.test();

app.listen(process.env.PORT || 8080);

let simulation = new sim.Series(100);
