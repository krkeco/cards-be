// var test = require('./objects/GameApiTest.js')

var graphqlApi = require('./graphql.js')

// const GameBuilder = require('./objects/ApiGame.js');
// let gameSim  = () =>{
// // let count = 0;
// let jonah = 0;

// let shortest = 100;
// let longest = 0;

// let runs = 1000;
// let average = 0;

// let run = 0;

// // let game = new GameBuilder.newGame(["Jonah","Esther"], ["AI","AI"])
// // game.setStartingPlayers(game.playerNames);
// // //console.log('starting first turn')
// // game.startNewTurn();

// //esther Jonah :
// //esther paul
// //esther joshua
// let player1 = 'Esther';
// // let player2 = "Esther"
// let players = [player1];
// let overload = 0;

// let game = new GameBuilder.newGame(players, ['AI', 'AI']);

// let turn = 'turns: ';

// const runGame = () => {
//   console.log('flip it' + players);
//   let newPlayers = players.reverse();
//   players = [...newPlayers];
//   console.log('reverse it' + players);
//   game = null;
//   game = new GameBuilder.newGame(players, ['AI', 'AI']);
//   game.setStartingPlayers(players);
//   console.log('starting game' + run);
//   game.startNewTurn();
//   let gameTurn = 0;
//   while (game.winner == '' && game.turn < 25) {
//     game.getNextPlayer();
//     gameTurn++;
//   }
//   turn += '\n run' + run + 'turn' + gameTurn + 'winner:' + game.winner;
//   if (game.turn >= 25) {
//     overload++;
//   }
//   if (shortest > game.turn) {
//     shortest = game.turn;
//   }
//   if (longest < game.turn) {
//     longest = game.turn;
//   }
//   average += game.turn;

//   if (game.winner == player1) {
//     jonah++;
//   }
// };
// while (run < runs) {
//   run++;
//   runGame();
// }
// console.log(
//   '\n\nSUMMARY:' +
//     '\nshort:' +
//     shortest +
//     '\nlong:' +
//     longest +
//     '\naverage' +
//     average / runs +
//     '\nplayer1%:' +
//     jonah +
//     '/' +
//     runs +
//     '\noverloads:' +
//     overload,
//   // +"\ngameTurn:"+turn
// );
// }
