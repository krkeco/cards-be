// var test = require('./objects/GameApiTest.js')

var graphqlApi = require('./graphql.js')


// const GameBuilder = require('./objects/ApiGame.js');

// // let count = 0;
// let jonah = 0;

// let shortest = 100;
// let longest = 0;

// let runs = 1000;
// let average = 0;

// let run = 0


// // let game = new GameBuilder.newGame(["Jonah","Esther"], ["AI","AI"])
// // game.setStartingPlayers(game.playerNames);
// // //console.log('starting first turn')
// // game.startNewTurn();

// let player1 = "Joshua"
// let player2 = "Esther"
// let players = [player1, player2]
// let game = new GameBuilder.newGame(players, ["AI","AI"])
// game.setStartingPlayers(game.playerNames);
// console.log('starting game'+ run)
// run++;
// game.startNewTurn();

// const checkWinGame = () =>{
// 	// if(game && game.winner == ""){
		
// 	// }else{
// 		// console.log('check win')
// 		while(game.winner == ""){
			
// 		}
// 		// console.log('after a while')
// 		if(shortest > game.turn){
// 			shortest = game.turn
// 		}
// 		if(longest < game.turn){
// 			longest = game.turn
// 		}
// 		average += game.turn;

// 		if(game.winner == "Joshua"){
// 			jonah++
// 		}

// 		// console.log('shortest:'+shortest+ ' longest:'+longest+" average"+average/runs+ " joshua%:"+jonah+"/"+runs)
// 		if(run < runs){
// 			game = null;
// 			game = new GameBuilder.newGame(players.reverse(), ["AI","AI"])
// 			run++;
// 			game.setStartingPlayers(game.playerNames);
// 			game.startNewTurn();
// 			// console.log('starting game'+ run)
// 			checkWinGame();
// 		}else{
// 			 console.log('shortest:'+shortest+ ' longest:'+longest+" average"+average/runs+ " joshua%:"+jonah+"/"+runs)
// 		}
// 	// }
// }
// checkWinGame();

// setInterval(()=>{run > runs ? null : checkWinGame()}, 20)
 // console.log('shortest:'+shortest+ ' longest:'+longest+" average"+average/runs+ " joshua%:"+jonah+"/"+runs)

// var gameXpressApi = require('./XPApi.js')

// const sim = require('./objects/Simulation.js');
// let simulation = new sim.Series(10);
// var tests = require('./objects/PlayerTest.js')
// let sweet = tests.test();