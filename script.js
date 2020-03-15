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

function beg(player,playerTurn) {
  displayPlayerCards(player);
  playCard(playerTurn,player);
}

function createCardId(cards) {
  var id;
  id=cards.Suit+cards.Value;
  return id;
}

function displayKickedCard(kicked) {
  var kick;
  kick = document.getElementById("kicked");
  kick.innerHTML += "Kicked: " + kicked.Suit + kicked.Value;
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

function playCard(playerTurn,player) {
  let turn="card"+playerTurn;
  var cardPlayed;
  var card;
  var playerTurnDisplay = playerTurn+1; 
  let cards = document.getElementsByClassName(turn);
  for (var i=0; i<cards.length; i++) {
    cards[i].addEventListener("click", function(){
    document.getElementById("demo").innerHTML = "Player " + playerTurnDisplay + " played " + this.innerHTML;
    cardPlayed=getCard(this.id);
    console.log("PT: " + playerTurn);
    console.log("Card Played: " + cardPlayed.Suit + cardPlayed.Value);
    console.log(player[playerTurn].cards[0].Suit);
    let card = player[playerTurn].cards.findIndex( element => element.Suit === cardPlayed.Suit && element.Value === cardPlayed.Value);
    player[playerTurn].cards.splice(card,1);
    console.log(player[0].cards);
    displayPlayerCards(player);
    playCard(playerTurn,player);
  });
  }
}

function getCard(cardId) {
  let suit=cardId.charAt(0);
  let value=cardId.charAt(1);
  var card={Suit: suit, Value: value};
  return card;
}

function mainGame(player,deck,dealer,playerTurn) {
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
  for (var i=0; i<4; i++) {
    console.log("Player", i+1, ": ", player[i].cards);
  }
  console.log("Trump is:", kicked.Suit);
  score=checkKicked(kicked,score);
  displayPlayerTurn(playerTurn);
  playCard(playerTurn,player)
  game=checkGame(score);
  return game;
}

let game=0;
let dealer=0;
let playerTurn=0;
let player = [];
let deck=createDeck();
//while (game == 0) {
  game=mainGame(player,deck,dealer,playerTurn);
/*  dealer++;
  if (dealer == 5) {
    dealer=1;
  }
  displayPlayerTurn(playerTurn);
  game=0;
} 
console.log("The winner is: ", game); */



