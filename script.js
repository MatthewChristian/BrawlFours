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

function beg(player,playerTurn,lift,deck,called,kicked,highLow) {
  let prevKicked=kicked;
  console.log("PK: " + prevKicked.Suit + prevKicked.Value);
  dealAll(player,deck);
  kicked=deck.pop();
  displayKickedCard(kicked);
  if (kicked.Suit === prevKicked.Suit) {
    dealAll(player,deck);
    kicked=deck.pop();
    displayKickedCard(kicked);
    if (kicked.Suit === prevKicked.Suit) {
      kicked=deck.pop();
      displayKickedCard(kicked);
    }
  }
  displayPlayerCards(player);
  document.getElementById("begButton").removeEventListener("click", letBeg);
  playCard(playerTurn,player,lift,called,0,kicked,highLow,0,0,false);
}

function createCardId(cards) {
  var id;
  id=cards.Suit+cards.Value;
  return id;
}

function displayKickedCard(kicked) {
  var kick;
  kick = document.getElementById("kicked");
  kick.innerHTML += kicked.Suit + kicked.Value +", ";
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
      players[i].innerHTML += "<a id='" + id + "' class='card" + i +"'>" + "<img src=/Cards/" + player[i].cards[j].Suit + player[i].cards[j].Value + ".png alt='Logo' class='cardImage'>" + `</a> `;
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

function displayPoints(lift) {
  let team1=document.getElementById("score1");
  let team2=document.getElementById("score2");
  team1.innerHTML = "Team 1 Score: " + lift[4];
  team2.innerHTML = "Team 2 Score: " + lift[5];
}

function displayTotalPoints(totalPoints) {
  let pointDisplay = document.getElementById("totalPoints");
  pointDisplay.innerHTML = "Score : " + totalPoints[0] + " - " + totalPoints[1];
}

function determineGame(lift) {
  if (lift[4] > lift[5]) {
    document.getElementById("gameWinner").innerHTML = "Team 1 won game.";
    return 1;
  }
  else {
    document.getElementById("gameWinner").innerHTML = "Team 2 won game.";
    return 2;
  }
}

function determineHighLow(highLow) {
  document.getElementById("highWinner").innerHTML = "Team " + highLow[0] + " won high. ";
  document.getElementById("lowWinner").innerHTML = "Team " + highLow[1] + " won low. ";
}

function determineJackWinner(jackWinner) {
  if (jackWinner[0] == 1 && jackWinner[1] == 1) { // Team 1 won, no hang
    document.getElementById("jackWinner").innerHTML = "Team 1 won Jack.";
    jackWinner[2] = 1;
  }
  else if (jackWinner[0] == 2 && jackWinner [1] == 2) { //Team 2 won, no hang
    document.getElementById("jackWinner").innerHTML = "Team 2 won Jack.";
    jackWinner[2] = 2;
  }
  else if (jackWinner[0] == 2 && jackWinner[1] == 1 ) { //Team 1 won, hang
    document.getElementById("jackWinner").innerHTML = "Team 1 hung Jack!";
    jackWinner[2] = 3;
  }
  else if (jackWinner[0] == 1 && jackWinner[1] == 2 ) { //Team 2 won, hang
    document.getElementById("jackWinner").innerHTML = "Team 2 hung Jack!";
    jackWinner[2] = 4;
  }
}

function determinePoints(gameWinner, highLow, jackWinner) {
  var points = [0,0];
  if (gameWinner == 1) {
    points[0]++;
  }
  else {
    points[1]++;
  }
  if (highLow[0] == 1) {
    points[0]++
  }
  else {
    points[1]++;
  }
  if (highLow[1] == 1) {
    points[0]++;
  }
  else {
    points[1]++;
  }
  if (jackWinner[2] == 1) {
    points[0]++;
  }
  else if (jackWinner[2] == 2) {
    points[1]++;
  }
  else if (jackWinner[2] == 3) {
    points[0] += 3;
  }
  else if (jackWinner[2] == 4) {
    points[1] += 3;
  }
  return points;
}

function getPoints(lift,liftWinner) {
  let points = 0;
  for (var i=0; i<4; i++) {
    if (lift[i] === 10 || lift[i] === 110 || lift[i] === -90) {
      points += 10;
    }
    if (lift[i] === 11 || lift[i] === 111 || lift[i] === -89) {
      points += 1;
    }
    if (lift[i] === 12 || lift[i] === 112 || lift[i] === -88) {
      points += 2;
    }
    if (lift[i] === 13 || lift[i] === 113 || lift[i] === -87) {
      points += 3;
    }
    if (lift[i] === 14 || lift[i] === 114 || lift[i] === -86) {
      points += 4;
    }
  }
  if (liftWinner == 0 || liftWinner == 2) {
    lift[4] += points;
  }
  else {
    lift[5] += points;
  }
}


function getLift(lift,cardPlayed,playerTurn,called,kicked) {
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
  if (cardPlayed.Suit == kicked.Suit) {
    lift[playerTurn] += 100;
  }
  if (cardPlayed.Suit !== called && cardPlayed.Suit !== kicked.Suit) {
    lift[playerTurn] = lift[playerTurn] - 100;
  }
}


 function undertrump (lift,hand) {
  let trumpPlayed=false;
  var handValue;
  for (var i=0; i<4; i++) {
    if (lift[i] > 100) {
      trumpPlayed = true;
    }
  }
  if (trumpPlayed == false) {
    return false;
  }
  if (hand.charAt(1) === "2") {
    handValue = 102;
  }
  else if (hand.charAt(1) === "3") {
    handValue = 103;
  }
  else if (hand.charAt(1) === "4") {
    handValue = 104;
  }
  else if (hand.charAt(1) === "5") {
    handValue = 105;
  }
  else if (hand.charAt(1) === "6") {
    handValue = 106;
  }
  else if (hand.charAt(1) === "7") {
    handValue = 107;
  }
  else if (hand.charAt(1) === "8") {
    handValue = 108;
  }
  else if (hand.charAt(1) === "9") {
    handValue = 109;
  }
  else if (hand.charAt(1) === "X") {
    handValue = 110;
  }
  else if (hand.charAt(1) === "J") {
    handValue = 111;
  }
  else if (hand.charAt(1) === "Q") {
    handValue = 112;
  }
  else if (hand.charAt(1) === "K") {
    handValue = 113;
  }
  else if (hand.charAt(1) === "A") {
    handValue = 114;
  }
  for (var i=0; i<4; i++) {
    if (lift[i] > handValue) {
      return true;
    }
  }
  return false;
}

function getCardValue(card) {
  var value=0;
  if (card.Value == "2") {
    value=2;
  }
  else if (card.Value == "3") {
    value=3;
  }
  else if (card.Value == "4") {
    value=4;
  }
  else if (card.Value == "5") {
    value=5;
  }
  else if (card.Value == "6") {
    value=6;
  }
  else if (card.Value == "7") {
    value=7;
  }
  else if (card.Value == "8") {
    value=8;
  }
  else if (card.Value == "9") {
    value=9;
  }
  else if (card.Value == "X") {
    value=10;
  }
  else if (card.Value == "J") {
    value=11;
  }
  else if (card.Value == "Q") {
    value=12;
  }
  else if (card.Value == "K") {
    value=13;
  }
  else if (card.Value == "A") {
    value=14;
  }
  return value;
}


function playCard(playerTurn,player,lift,called,count,kicked,highLow,jackHangerTeam,jackHangerValue,jackInPlay) {
  let turn="card"+playerTurn;
  var cardPlayed;
  var card;
  var hand;
  var bare=true;
  var calledTemp;
  var liftWinner;
  var countPlayed;
  var undertrumped;
  let playerTurnDisplay = playerTurn+1; 
  var played;
  var points;
  var value;
  var team;
  var gameWinner;
  var totalPoints;
  if (playerTurn == 0 || playerTurn == 2) {
    team = 1;
  }
  else {
    team = 2;
  }
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
    undertrumped=undertrump(lift,hand);
    if (hand.charAt(0) == called || called == "any" || calledTemp == "any" || (hand.charAt(0) == kicked.Suit && undertrumped == false)) {
      cards[i].addEventListener("click", function(){
      document.getElementById("begButton").removeEventListener("click", letBeg);
      countPlayed=count+1;
      played = "played" + countPlayed;
      if (count == 0) {
        document.getElementById("played1").innerHTML = "";
        document.getElementById("played2").innerHTML = "";
        document.getElementById("played3").innerHTML = "";
        document.getElementById("played4").innerHTML = "";
        document.getElementById("gameWinner").innerHTML = "";
        document.getElementById("highWinner").innerHTML = "";
        document.getElementById("lowWinner").innerHTML = "";
      }
      document.getElementById(played).innerHTML = "Player " + playerTurnDisplay + " played " + this.getAttribute('id');
      cardPlayed=getCard(this.id);
      if (called == "any") {
        called=cardPlayed.Suit;
      }
      if (cardPlayed.Suit == kicked.Suit) { //If trump is played
        value=getCardValue(cardPlayed);
        if (value > highLow[2]) {
          highLow[0] = team;
          highLow[2] = value;
        }
        if (value < highLow[3]) {
          highLow[1] = team;
          highLow[3] = value;
        }
        if (value == 1) {
          console.log("Jack Played");
        }
        if (value == 11 && jackWinner[0] == 0) { //If jack has not yet been played
          console.log("JACKEROOO");
          jackWinner[0] = team;
          jackWinner[1] = team;
          jackInPlay = true;
          console.log("JACK: " + jackWinner[0]);
          console.log("JACK2: " + jackWinner[1]);
        }
        if (value > 11 && jackInPlay == true) {
          console.log("HANG");
          jackWinner[1] = team;
        }
        if (value > 11 && value > jackHangerValue) {
          console.log("Hang2");
          jackHangerTeam = team;
          jackHangerValue = value;
        }
      }
      let card = player[playerTurn].cards.findIndex( element => element.Suit === cardPlayed.Suit && element.Value === cardPlayed.Value);
      player[playerTurn].cards.splice(card,1);
      getLift(lift,cardPlayed,playerTurn,called,kicked);
      playerTurn+=1;
      count+=1;
      if (playerTurn == 4) {
        playerTurn=0;
      }
      if (count == 4) { //Lift end
        count=0;
        console.log("Jack Hanger Team: " + jackHangerTeam);
        if (jackHangerTeam > 0 && jackInPlay) {
          jackWinner[1] = jackHangerTeam;
        }
        jackHangerTeam = 0;
        jackHangerValue = 0; 
        jackInPlay = false;
        called="any";
        liftWinner=checkLift(lift);
        playerTurn=liftWinner;
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
        points = getPoints(lift,liftWinner);
        for (var j=0; j<4; j++) {
          lift[j] = 0;
        }
      }
      calledTemp="";
      displayPlayerTurn(playerTurn);
      displayPlayerCards(player);
      displayPoints(lift);
      if (player[0].cards.length == 0 && player[1].cards.length == 0 && player[2].cards.length == 0 && player[3].cards.length == 0) //If nobody has cards left, round end
      {
        gameWinner = determineGame(lift);
        determineHighLow(highLow);

        console.log("Jack winner[0]: " + jackWinner[0]);
        console.log("Jack winner[1]: " + jackWinner[1]);
        console.log("Jack winner[2]: " + jackWinner[2]);
        determineJackWinner(jackWinner);
        console.log("Jack winner[0]: " + jackWinner[0]);
        console.log("Jack winner[1]: " + jackWinner[1]);
        console.log("Jack winner[2]: " + jackWinner[2]);
        
        totalPoints = determinePoints(gameWinner, highLow, jackWinner);
        displayTotalPoints(totalPoints);
        for (var j=4; j<6; j++) {
          lift[j] = 0;
        }
        highLow[0] = 0;
        highLow[1] = 0;
        highLow[2] = 0;
        highLow[3] = 15;  
        jackWinner[0] = 0;
        jackWinner[1] = 0;
        jackWinner[2] = 0;    
        let deck=createDeck();
        kicked=deck.pop();
        document.getElementById("begButton").addEventListener("click", letBeg);
        mainGame(player,deck,playerTurn,playerTurn,lift,kicked,highLow,jackWinner);
      }
      else {
        playCard(playerTurn,player,lift,called,count,kicked,highLow,jackHangerTeam,jackHangerValue,jackInPlay);
      }
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

function letBeg() {
  beg(player,playerTurn,lift,deck,"any",kicked,highLow);
}


function mainGame(player,deck,dealer,playerTurn,lift,kicked,highLow,jackWinner) {
  for (var i=0; i<4; i++) {
    player[i] = new Hand();
  }
  let game=0;
  let score = [];
  score[0] = 0; //Team 1 Score
  score[1] = 0; //Team 2 Score
  document.getElementById("played1").innerHTML = "";
  document.getElementById("played2").innerHTML = "";
  document.getElementById("played3").innerHTML = "";
  document.getElementById("played4").innerHTML = "";
  document.getElementById("kicked").innerHTML = "Kicked: ";
  document.getElementById("liftWinner").innerHTML = "";
  document.getElementById("begButton").addEventListener("click",letBeg);
  for (var i=0; i<2; i++) {
    dealAll(player,deck);
  }
  displayCards(player,kicked);
  score=checkKicked(kicked,score);
  displayPlayerTurn(playerTurn);
  playCard(playerTurn,player,lift,"any",0,kicked,highLow,0,0,false);
  game=checkGame(score);
  return game;
}

let game=0;
let dealer=0;
let playerTurn=0;
let player = [];
let lift = [0,0,0,0,0,0]; //Index 0 - 3: Players 1 - 4 points, Index 4: Team 1 total points for game, Index 5: Team 2 total points for game
let highLow = [0,0,0,15] //Index 1: Team winning High, Index 2: Team winning Low, Index 3: High, Index 4: Low
var jackWinner = [0,0,0]; //First index = Who played jack, Second index = Who won jack, Third index = value
let deck=createDeck();
let kicked=deck.pop();
//while (game == 0) {
  game=mainGame(player,deck,dealer,playerTurn,lift,kicked,highLow,jackWinner);
/*  dealer++;
  if (dealer == 5) {
    dealer=1;
  }
  displayPlayerTurn(playerTurn);
  game=0;
} 
console.log("The winner is: ", game); */



