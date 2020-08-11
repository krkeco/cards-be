const GameBuilder = require('./objects/ApiGame.js');
const cards = require('./objects/CardData.js');

module.exports.gameSim = () => {
  let deckData = cards.testData();
  // let count = 0;
  let win1 = 0;
  let win2 = 0;
  let wins = [];

  let shortest = 100;
  let longest = 0;
  let average = 0;

  let runs = 100;

  let run = 0;
  let player1 = 'Jonah';
  let player2 = 'Esther';
  let players = [player1, player2];
  let overload = 0;

  /*
PVE  48 //influence to 1 maybe bump fellowship to +2?
JVE  38 //faith4
JoVE 8 
game stats:
solo conquer:
  paul: 5.2
  joshua: 11.5
  jonah: 4.9
  esther: 5.6

solo calling:
  paul  : 14/21/34
  esther: 7/17/33
  jonah:  9/23/45
  joshua: 10/23/39
*/

  let game = new GameBuilder.newGame(
    deckData,
    players,
    ['AI', 'AI'],
    false,
    true,
    false,
    'all'//this can be calling
  );
  // let game = new GameBuilder.newGame(deckData,["Jonah","Esther","Joshua","Paul"], ["player","player","player","player"]);

  let turn = 'turns: ';

  const runGame = () => {
    console.log('flip it' + players);
    let newPlayers = players.reverse();
    players = [...newPlayers];
    console.log('reverse it' + players);
    game = null;
    game = new GameBuilder.newGame(
      deckData,
      players,
      ['AI', 'AI'],
      false,
      true,
      false,
    );
    game.setStartingPlayers(players);
    console.log('starting game' + run);
    game.startNewTurn();

    let gameTurn = 0;
    let turnLimit = 50;

    while (game.winner == '' && game.turn < turnLimit) {
      game.getNextPlayer();
      gameTurn++;
    }
    console.log('---game: winner:' + game.winner);
    turn += '\n run' + run + 'turn' + gameTurn + 'winner:' + game.winner;
    if (game.turn >= turnLimit) {
      overload += 1;
    }
    if (shortest > game.turn) {
      shortest = game.turn;
    }
    if (longest < game.turn) {
      longest = game.turn;
    }
    average += game.turn;
    wins.push(game.winner);
    if (game.winner.substring(0, game.winner.length - 1) == player1) {
      win1++;
    }
    if (game.winner.substring(0, game.winner.length - 1) == player2) {
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
      '\naverage' +
      average / runs +
      '\nlong:' +
      longest +
      '\nplayer1%:' +
      win1 +
      '/' +
      runs +
      '\nplayer2%:' +
      win2 +
      '/' +
      // '\nwinList:' +
      // wins +
      // '/' +
      runs +
      '\noverloads:' +
      overload,
    // +"\ngameTurn:"+turn
  );
};
