class Card {
  constructor(power,hangable,points,trump,name) {
    this.power=power;
    this.hangable=hangable;
    this.points=points;
    this.trump=trump;
    this.name=name;
    this.playable=false;
  }
}

class Hand {
  constructor() {
    this.cards=[];
    this.canPlay=false;
  }

  setCanPlay() {
    canPlay=true;
  }
}

function createDeck() {
  var suits = ["s", "d", "c", "h"]; //S=Spades, D=Dimes, C=Clubs, H=Hearts
  var values = ["2", "3", "4", "5", "6", "7", "8", "9", "X", "J", "Q", "K", "A"]; //X=10, This is done so it is 1 character
  var deck = new Array();
  for (var i=0; i<suits.length; i++) {
    for (var j=0; j<values.length; j++) {
      var card={Suit: suits[i], Value: values[j]};
      deck.push(card);
    }
  }
  shuffle(deck);
  return deck;
}

function shuffle(deck) {
	for (var i = 0; i < 1000; i++) {
		var loc1 = Math.floor((Math.random() * deck.length));
		var loc2 = Math.floor((Math.random() * deck.length));
		var temp = deck[loc1];
		deck[loc1] = deck[loc2];
		deck[loc2] = temp;
	}
}

function deal(player,deck) {
  var card;
  for (var i=0; i<3; i++) {
    card=deck.pop();
    player.cards.push(card);
  }
}

function dealAll(player,deck) {
  for (var j=0; j<4; j++) {
    deal(player[j],deck);
  }
}

function checkGame(score) { //Returns 1 if Team 1 won, 2 if Team 2 won, 0 if nobody has won yet
  if (score[0] >= 12)
    return 1;
  if (score[1] >= 12)
    return 2;
  return 0;
}

function checkLift(lift) {
  var highest=0;
  var highIndex=0;
  for (var i=0; i<4; i++) {
    if (lift[i] > highest) {
      highest=lift[i];
      highIndex=i;
    }
  }
  //lift[4]+=team1;
  //lift[5]+=team2;
  return highIndex;
}

function checkKicked(kicked,score) {
  if (kicked.Value == 6) {
    if (dealer == 1 || dealer == 3)
      score[0]+=2;
    else
      score[1]+=2;
  }
  if (kicked.Value == "J") {
    if (dealer == 1 || dealer == 3)
      score[0]+=3;
    else
      score[1]+=3;
  }
  if (kicked.Value == "A") {
    if (dealer == 1 || dealer == 3)
      score[0]++;
    else
      score[1]++;
  }
  return score;
}

function beg(player,playerTurn,lift,deck) {
  dealAll(player,deck);
  displayPlayerCards(player);
  let kicked=deck.pop();
  displayKickedCard(kicked);
  playCard(playerTurn,player,lift,called);
}

function createCardId(cards) {
  var id;
  id=cards.Suit+cards.Value;
  return id;
}

function displayKickedCard(kicked) {
  var kick;
  kick = document.getElementById("kicked");
  kick.innerHTML = "Kicked: " + kicked.Suit + kicked.Value;
}

function displayPlayerCards(player) {
  var kick;
  var players;
  var id;
  players = document.getElementsByClassName("hand");
  for (var i=0; i<4; i++) {
    players[i].innerHTML = "";
  }
  for (var i=0; i<4; i++) {
    for (var j=0; j<player[i].cards.length; j++) {
      id=createCardId(player[i].cards[j]);
      players[i].innerHTML += "<a id='" + id + "' class='card" + i +"'>" + player[i].cards[j].Suit + " " + player[i].cards[j].Value + `</a>, `;
    }
  }
}

function displayCards(player,kicked) {
  displayPlayerCards(player);
  displayKickedCard(kicked);
}

function displayPlayerTurn(playerTurn) {
  playerTurnDisplay = playerTurn+1;
  document.getElementById("playerTurn").innerHTML = "It is player " + playerTurnDisplay + "'s turn.";
}

function getLift(lift,cardPlayed,playerTurn,called) {
  if (cardPlayed.Suit === called) {
    if (cardPlayed.Value === "2") {
      lift[playerTurn] = 2;
    }
    else if (cardPlayed.Value === "3") {
      lift[playerTurn] = 3;
    }
    else if (cardPlayed.Value === "4") {
      lift[playerTurn] = 4;
    }
    else if (cardPlayed.Value === "5") {
      lift[playerTurn] = 5;
    }
    else if (cardPlayed.Value === "6") {
      lift[playerTurn] = 6;
    }
    else if (cardPlayed.Value === "7") {
      lift[playerTurn] = 7;
    }
    else if (cardPlayed.Value === "8") {
      lift[playerTurn] = 8;
    }
    else if (cardPlayed.Value === "9") {
      lift[playerTurn] = 9;
    }
    else if (cardPlayed.Value === "X") {
      lift[playerTurn] = 10;
    }
    else if (cardPlayed.Value === "J") {
      lift[playerTurn] = 11;
    }
    else if (cardPlayed.Value === "Q") {
      lift[playerTurn] = 12;
    }
    else if (cardPlayed.Value === "K") {
      lift[playerTurn] = 13;
    }
    else if (cardPlayed.Value === "A") {
      lift[playerTurn] = 14;
    }
  }
  else {
    lift[playerTurn] = 0;
  }
}

function playCard(playerTurn,player,lift,called) {
  let turn="card"+playerTurn;
  var cardPlayed;
  var card;
  var hand;
  var bare=true;
  var calledTemp;
  var liftWinner;
  let playerTurnDisplay = playerTurn+1; 
  let played = "played" + playerTurnDisplay;
  let cards = document.getElementsByClassName(turn);
  for (var i=0; i<cards.length; i++) {
    if (called !== "any") {
      for (var j=0; j<cards.length; j++) {
        hand=cards[j].id;
        if (hand.charAt(0) == called) {
          bare=false;
        }
      }
    }
    if (bare == true) {
      calledTemp = "any";
    }
    hand=cards[i].id;
    if (hand.charAt(0) == called || called == "any" || calledTemp == "any") {
      cards[i].addEventListener("click", function(){
      if (played == "played1") {
        document.getElementById("played2").innerHTML = "";
        document.getElementById("played3").innerHTML = "";
        document.getElementById("played4").innerHTML = "";
      }
      document.getElementById(played).innerHTML = "Player " + playerTurnDisplay + " played " + this.innerHTML;
      cardPlayed=getCard(this.id);
      if (called == "any") {
        called=cardPlayed.Suit;
      }
      let card = player[playerTurn].cards.findIndex( element => element.Suit === cardPlayed.Suit && element.Value === cardPlayed.Value);
      player[playerTurn].cards.splice(card,1);
      console.log(player[0].cards);
      getLift(lift,cardPlayed,playerTurn,called);
      console.log("Lift: " + lift[0], lift[1], lift[2], lift[3]);
      playerTurn+=1;
      if (playerTurn == 4) {
        playerTurn=0;
        called="any";
        liftWinner=checkLift(lift);
        console.log(liftWinner);
        if (liftWinner == 0) {
          document.getElementById("liftWinner").innerHTML = "Player 1 won the lift for Team 1";
        }
        else if (liftWinner == 1){
          document.getElementById("liftWinner").innerHTML = "Player 2 won the lift for Team 2";
        }
        else if (liftWinner == 2){
          document.getElementById("liftWinner").innerHTML = "Player 3 won the lift for Team 1";
        }
        else if (liftWinner == 3){
          document.getElementById("liftWinner").innerHTML = "Player 4 won the lift for Team 2";
        }
      }
      calledTemp="";
      displayPlayerTurn(playerTurn);
      displayPlayerCards(player);
      playCard(playerTurn,player,lift,called);
    });
    }
  }
}

function getCard(cardId) {
  let suit=cardId.charAt(0);
  let value=cardId.charAt(1);
  var card={Suit: suit, Value: value};
  return card;
}

function mainGame(player,deck,dealer,playerTurn,lift) {
  for (var i=0; i<4; i++) {
    player[i] = new Hand();
  }
  let game=0;
  let score = [];
  score[0] = 0; //Team 1 Score
  score[1] = 0; //Team 2 Score
  for (var i=0; i<2; i++) {
    dealAll(player,deck);
  }
  let kicked=deck.pop();
  displayCards(player,kicked);
  /* for (var i=0; i<4; i++) {
    console.log("Player", i+1, ": ", player[i].cards);
  }
  console.log("Trump is:", kicked.Suit); */
  score=checkKicked(kicked,score);
  displayPlayerTurn(playerTurn);
  playCard(playerTurn,player,lift,"any");
  game=checkGame(score);
  return game;
}

let game=0;
let dealer=0;
let playerTurn=0;
let player = [];
let lift = [0,0,0,0,0,0]; //Index 0 - 3 = Players 1 - 4 points, Index 4 = Team 1 total points for game, Index 5 = Team 2 total points for game
let deck=createDeck();
//while (game == 0) {
  game=mainGame(player,deck,dealer,playerTurn,lift);
/*  dealer++;
  if (dealer == 5) {
    dealer=1;
  }
  displayPlayerTurn(playerTurn);
  game=0;
} 
console.log("The winner is: ", game); */



