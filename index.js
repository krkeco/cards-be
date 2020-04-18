const express = require('express');
const app = express();

const deckData = require('./decks.json')
// const Player = require('./objects/Player.js')
// import {Player} from '/objects/Player.js'

app.get('/', function (req, res) {
 return res.send('Hello world');
});

var pl = require('./objects/Player.js');
var loc = require('./objects/Location.js');
var tu = require('./objects/Turn.js')


app.listen(process.env.PORT || 8080);

//initialize data
let decks = deckData.decks;

//set deck sizes
Object.keys(decks).map((deck)=>{
	decks[deck].map((card,index) => {
		for(let x = 0; x < decks[deck][index].quantity-1; x++){
			decks[deck].push(decks[deck][index])
		}
	})
})
// console.log(decks)


let Jonah = new pl.Player(deckData.stories.jonah,decks.starter)
let Esther = new pl.Player(deckData.stories.esther, decks.starter)

let Babylon = new loc.Location(decks.esther,deckData.stories.esther.location)
let Nineveh = new loc.Location(decks.jonah,deckData.stories.jonah.location)
let Jerusalem = new loc.Location([],deckData.stories.jerusalem)
console.log('babs'+Babylon.name)

let players = [Jonah, Esther]
let locations = [Babylon, Jerusalem, Nineveh]

let turn = tu.Turn(players,locations,1);
