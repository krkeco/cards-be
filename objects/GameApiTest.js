const GameBuilder = require('./ApiGame.js');
let game = new GameBuilder.newGame(['Jonah', 'Esther']);
game.setStartingPlayers(game.playerNames);
game.startNewTurn();

console.log('checking win conditions jonah');
game.checkForNinevites();
let player = game.players.find((pl) => pl.name == 'Esther');
console.log(player.name + 'playin');
game.locations['Nineveh'].playCard(0, player);
game.locations['Nineveh'].playCard(0, player);
game.locations['Nineveh'].playCard(0, player);
game.checkForNinevites();
