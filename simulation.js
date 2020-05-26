
const GameBuilder = require('./objects/ApiGame.js');
module.exports.gameSim = () => {
  // let count = 0;
  let win1 = 0;
  let win2 = 0;

  let shortest = 100;
  let longest = 0;

  let runs = 1000;
  let average = 0;

  let run = 0;

/*
game stats:
solo conquer:
  paul: 5.2
  joshua: 11.5
  jonah: 4.9
  esther: 5.6

solo calling:
  paul @7:   15 / 24 / 34 
  paul @3: 7 / 13 / 25
  esther: 5 / 18 / 40
  jonah:  8 / 15 / 23
  joshua: 6 / 13 / 50
*/

  let player1 = 'Paul';
  let player2 = 'Paul';
  let players = [player1];
  let overload = 0;

  let game = new GameBuilder.newGame(players, ['AI','AI'],'calling');

  let turn = 'turns: ';

  const runGame = () => {
    console.log('flip it' + players);
    let newPlayers = players.reverse();
    players = [...newPlayers];
    console.log('reverse it' + players);
    game = null;
    game = new GameBuilder.newGame(players, ['AI', 'AI']);
    game.setStartingPlayers(players);
    console.log('starting game' + run);
    game.startNewTurn();

    let gameTurn = 0;
    let turnLimit = 50;

    while (game.winner == '' && game.turn < turnLimit) {
      game.getNextPlayer();
      gameTurn++;
    }
    console.log('---game: winner:'+game.winner)
    turn += '\n run' + run + 'turn' + gameTurn + 'winner:' + game.winner;
    if (game.turn >= turnLimit) {
      overload+=1;
    }
    if (shortest > game.turn) {
      shortest = game.turn;
    }
    if (longest < game.turn) {
      longest = game.turn;
    }
    average += game.turn;

    if (game.winner == player1) {
      win1++;
    }
    if (game.winner == player2) {
      win2++;
    }
  };
  while (run < runs) {
    console.log('running game' + game.id);
    run++;
    runGame();
  }
  console.log(
    '\n\nSUMMARY:' +
      '\nshort:' +
      shortest +
      '\nlong:' +
      longest +
      '\naverage' +
      average / runs +
      '\nplayer1%:' +
      win1 +
      '/' +
      runs +
      '\nplayer2%:' +
      win2 +
      '/' +
      runs +
      '\noverloads:' +
      overload,
    // +"\ngameTurn:"+turn
  );
};
