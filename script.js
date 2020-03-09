class Card {
  constructor(power,hangable,points,trump,name,playable) {
    this.power=power;
    this.hangable=hangable;
    this.points=points;
    this.trump=trump;
    this.name=name;
    this.playable=playable;
  }
}

class Hand {
  constructor() {
    this.cards=[];
  }
}

function createDeck() {
  var suits = ["spades", "dimes", "clubs", "hearts"];
  var values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
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

function dealAll(p1,p2,p3,p4,deck) {
  for (var i=0; i<2; i++) {
    deal(p1,deck);
    deal(p2,deck);
    deal(p3,deck);
    deal(p4,deck);
  }
}

function checkGame(t1,t2) { //Returns 1 if Team 1 won, 2 if Team 2 won, 0 if nobody has won yet
  if (t1 >= 12)
    return 1;
  if (t2 >= 12)
    return 2;
  return 0;
}

function mainGame(dealer) {
  let deck = createDeck();
  let p1 = new Hand();
  let p2 = new Hand();
  let p3 = new Hand();
  let p4 = new Hand();
  let game=0;
  let team1Score = 0;
  let team2Score = 0;
  dealAll(p1,p2,p3,p4,deck);
  let kicked=deck.pop();
  console.log("Player 1: ", p1.cards);
  console.log("Player 2: ", p2.cards);
  console.log("Player 3: ", p3.cards);
  console.log("Player 4: ", p4.cards);
  console.log("Trump is:", kicked.Suit);
  console.log(kicked);
  if (kicked.Value == 6) {
    if (dealer == 1 || dealer == 3)
      team1Score+=2;
    else
      team2Score+=2;
  }
  if (kicked.Value == "J") {
    if (dealer == 1 || dealer == 3)
      team1Score+=3;
    else
      team2Score+=3;
  }
  if (kicked.Value == "A") {
    if (dealer == 1 || dealer == 3)
      team1Score++;
    else
      team2Score++;
  }
  console.log(team1Score);
  game=checkGame(team1Score, team2Score);
  return game;
}

let game=0;
let dealer=1;
//while (game == 0) {
  game=mainGame(dealer);
/*  dealer++;
  if (dealer == 5)
    dealer=1;
}
console.log("The winner is: ", game) */

