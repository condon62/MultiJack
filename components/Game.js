import React from 'react';
import { StyleSheet, Text, View, Image, Button, Alert, TouchableOpacity } from 'react-native';
import helpers from '../helpers';
import images from '../assets/images/images.js';
import Set from './Set';
import Card from './Card';

export default class Game extends React.Component {
  
  constructor(props) {
    super(props);

    let deck = ['c2', 'd2', 'h2', 's2', 'c3', 'd3', 'h3', 's3', 'c4', 'd4', 'h4', 's4', 'c5', 'd5', 'h5', 's5',
    'c6', 'd6', 'h6', 's6', 'c7', 'd7', 'h7', 's7', 'c8', 'd8', 'h8', 's8', 'c9', 'd9', 'h9', 's9',
    'c10', 'd10', 'h10', 's10', 'cj', 'dj', 'hj', 'sj', 'cq', 'dq', 'hq', 'sq', 'ck', 'dk', 'hk', 'sk',
    'ca', 'da', 'ha', 'sa'].shuffle();

    let playerSet = [];
    let computerSet = [];
    let card;

    let i = 0;
    while(i < this.props.hands) {
      let playerHand = [];
      let computerHand = [];
      let j = 0;
      while(j < 2) {
        card = deck.pop();
        playerHand.push(card);
        card = deck.pop();
        computerHand.push(card);
        j++;
      }
      playerSet.push(playerHand);
      computerSet.push(computerHand);
      i++
    }

    let playersTurn = (Math.floor(Math.random() * 2) == 0);

		this.state = {
      deck: deck, // Remaining cards
      playerSet: playerSet, // Set of player hands
      computerSet: computerSet, // Set of computer hands
      card: '', // flipped card
      playerScore: 0,
      computerScore: 0,
      lastRoundScore: 0,
      hit: false,
      playersTurn: playersTurn,
      stayCounter: 0,
    };
  }

  addCard = (set) => {
    let { deck, playerSet, computerSet, playersTurn } = this.state;
    let hit = true;
    let card = deck.pop();
    if (this.props.hands == 1) {
      if (playersTurn) {
        playerSet[0].push(card);
      } else {
        computerSet[0].push(card);
      }
      playersTurn = !playersTurn;
      hit = false
    } else if (!playersTurn) {
      computerSet = this.computerSelect(computerSet, card);
      playersTurn = true;
      hit = false;
    }
    this.setState({
      card: card,
      hit: hit,
      deck: deck,
      playerSet: playerSet,
      computerSet: computerSet,
      playersTurn: playersTurn,
      stayCounter: 0
    });
  }

  cardDropped = (zone) => {
    let { playerSet, card, playersTurn } = this.state; 
    let hand = playerSet[zone - 1];
    hand.push(card);
    playerSet[zone - 1] = hand;
    playerSet
    this.setState({
      playerSet: playerSet,
      hit: false,
      playersTurn: !playersTurn
    });
  }

  componentDidMount() {
    if (!this.state.playersTurn) {
      // let stay = this.stay;
      // setTimeout(function (stay) {
      //       console.log('VIDEO HAS STOPPED');
      //       stay();
      // }, 2000);
      // console.log('test');
      this.computersAction();
    }
  }

  componentDidUpdate() {
    if (!this.state.playersTurn) {
      // let stay = this.stay;
      // setTimeout(function (stay) {
      //       console.log('VIDEO HAS STOPPED');
      //       stay();
      // }, 2000);
      // console.log('test');
      this.computersAction();
    }

  }

  computersAction = () => {
    let { computerSet } = this.state;
    let scores = [];
    let i = 0;
    while (i < computerSet.length) {
      scores[i] = getScore(computerSet[i]);
      i++;
    } 
    scores.sort((a, b) => a - b);
    if (scores[0] <= 13) {
      this.addCard();
    } else {
      this.stay();
    }
  }

  computerSelect = (set, card) => {
    let cardValue = convertScore(card);
    let best = -100;
    let index = 0;
    console.log(cardValue);
    let i = 0;
    while (i < set.length) {
      // TODO: IF GETSCORE() SCORE IS 11 i.e. an ACE
      let score = 21 - getScore(set[i]) - cardValue;
      if ((best < 0 && score > best) || (best > 0 && score > 0 && score < best)) {
        best = score;
        index = i;
      }
      console.log(score);
      i++;
    }
    set[index].push(card)
    return set;
  }

  flipCard = (card) => {
    if(this.state.hit) {
      return (
        <Card 
          card={card}
          type={'play'} 
          dropArea={(zone) => this.cardDropped(zone)} 
          pos={10} 
          locked={false}
          hands={this.props.hands}
          zones={this.legalZones()}
        />
      );
    } else {
      return null;
    }
  }

  gameOver = () => {
    let { playerScore, computerScore, lastRoundScore } = this.state;
    if (playerScore >= 50) {
      Alert.alert(
        'Game Won',
        `Player wins round by a score of ${lastRoundScore} with a score of ${playerScore}`,
        [
          {Text: 'Home', onPress: () => this.quit()}
        ],
        { cancelable: false }
      );
    }
    if (computerScore >= 50) {
      Alert.alert(
        'Game Lost',
        `Computer wins round by a score of ${lastRoundScore} and game with a score of ${computerScore}`,
        [
          {Text: 'Home', onPress: () => this.quit()}
        ],
        { cancelable: false }
      );
    }
  }

  initializeHands = () => {
    let updatedDeck = ['c2', 'd2', 'h2', 's2', 'c3', 'd3', 'h3', 's3', 'c4', 'd4', 'h4', 's4', 'c5', 'd5', 'h5', 's5',
    'c6', 'd6', 'h6', 's6', 'c7', 'd7', 'h7', 's7', 'c8', 'd8', 'h8', 's8', 'c9', 'd9', 'h9', 's9',
    'c10', 'd10', 'h10', 's10', 'cj', 'dj', 'hj', 'sj', 'cq', 'dq', 'hq', 'sq', 'ck', 'dk', 'hk', 'sk',
    'ca', 'da', 'ha', 'sa'].shuffle();
    let playerSet = [];
    let computerSet = [];
    let card;

    let i = 0;
    while(i < this.props.hands) {
      let playerHand = [];
      let computerHand = [];
      let j = 0;
      while(j < 2) {
        card = updatedDeck.pop();
        playerHand.push(card);
        card = updatedDeck.pop();
        computerHand.push(card);
        j++;
      }
      playerSet.push(playerHand);
      computerSet.push(computerHand);
      i++
    }

    let playersTurn = (Math.floor(Math.random() * 2) == 0);
    
    this.setState({
      deck: updatedDeck,
      playerSet: playerSet,
      computerSet: computerSet,
      lastRoundScore: 0,
      hit: false,
      playersTurn: playersTurn,
      stayCounter: 0,
    });
  }

  legalZones = () => {
    let { playerSet } = this.state;
    let zones = [];
    let i = 0;
    while (i < playerSet.length) {
      if (getScore(playerSet[i]) > 21) {
        zones[i] = false;
      } else {
        zones[i] = true;
      }
      i++;
    }
    return zones;
  }
 
  stay = () => {
    let { playersTurn, stayCounter } = this.state;
    if (stayCounter == 1) { // End game
      this.setState({
        stayCounter: stayCounter + 1,
      });
      this.updateScore();
      //this.initializeHands();
    } else { // End turn
      console.log('end turn');
      this.setState({
        playersTurn: !playersTurn,
        stayCounter: stayCounter + 1,
      });
    }
  }

  updateScore = () => {
    let { playerScore, computerScore, playerSet, computerSet } = this.state;
  
    let i = 0;
    let player = 0;
    let computer = 0;
    let pScores = [];
    let cScores = [];
    while (i < playerSet.length) {
      pScores[i] = getScore(playerSet[i]);
      if (pScores[i] > 21) {
        pScores[i] = -10;
      }
      cScores[i] = getScore(computerSet[i]);
      if (cScores[i] > 21) {
        cScores[i] = -10;
      }
      i++;
    }

    pScores.sort((a, b) => a - b);
    cScores.sort((a, b) => a - b);

    let j = 0;
    while (j < pScores.length) {
      if (pScores[j] == -10 && cScores[j] == -10){
        player += 0;
      } else if (pScores[j] == -10) {
        player -= 10;
      } else if (cScores[j] == -10) {
        computer -= 10;
      } else if (pScores[j] > cScores[j]) {
        player += pScores[j] - cScores[j];
      } else {
        computer += cScores[j] - pScores[j];
      }
      j++;
    }

    let lastRoundScore = 0;
    let title = '';
    let message = '';

    if (player > computer) {
      playerScore += player - computer;
      lastRoundScore = player - computer;
      title = 'Round Won';
      message = 'Player Wins by ' + (player - computer);
    } else if (computer > player) {
      computerScore += computer - player;
      lastRoundScore = computer - player;
      title = 'Round Lost';
      message = 'Computer wins by ' + (computer - player);
    } else {
      title = 'Draw';
      message = 'Player and Computer tie'
    }

    if (playerScore < 50 && computerScore < 50) {
      Alert.alert(
        title,
        message,
        [
          {Text: 'Next Round', onPress: () => this.initializeHands()}
        ],
        { cancelable: false }
      );
    }
    
    this.setState({
      playerScore: playerScore,
      computerScore: computerScore,
      lastRoundScore: lastRoundScore
    });
  }

  playerBusted = () => {
    let busted = true
    let { playerSet } = this.state;
    let i = 0;
    while (i < playerSet.length && busted == true) {
      if (getScore(playerSet[i]) < 21) {
        busted = false;
      }
      i++;
    }
    return busted;
  }

  quit = () => {
    this.props.quit();
  }

  turnIndicator = () => {
    if (this.state.playersTurn) {
      return (
        <View style={{alignSelf: 'center', position: 'absolute', bottom: 250}}>
          <Text style={{color: 'yellow'}}>Player &#x2193; Turn</Text>
        </View>
      );
    } else {
      return (
        <View style={{alignSelf: 'center', position: 'absolute', top: 250}}>
          <Text style={{color: 'yellow'}}>Computer &#x2191; Turn</Text>
        </View>
      );
    }
  }
  
  render() {
    let { playerSet, computerSet } = this.state;
    console.log(this.state.stayCounter);
    console.log('p: ' + playerSet);
    console.log('c: ' + computerSet);
    return (
      <View style={styles.container}>
        <Set 
          set={computerSet} 
          type='comp'
          turnComplete={!this.state.hit}
          numHands={this.props.hands}
          endRound={this.state.stayCounter >= 2}
        />
        <View style={styles.pannel}>
          <View style={{width: '40%', flexDirection: 'row',}}>
            <View style={styles.buttons}>
              <TouchableOpacity onPress={() => {this.addCard(playerSet)}} disabled={this.playerBusted() || this.state.hit || !this.state.playersTurn}>
                <Text style={[styles.button, {backgroundColor: 'red', opacity: (this.playerBusted() || this.state.hit || !this.state.playersTurn) ? 0.5 : 1}]}>Hit</Text>
              </TouchableOpacity> 
              <TouchableOpacity onPress={() => {this.stay()}} disabled={this.state.hit}>
                <Text style={[styles.button, {backgroundColor: 'blue', opacity: (this.state.hit) ? 0.5 : 1}]}>Stay</Text>
              </TouchableOpacity> 
              <TouchableOpacity onPress={() => {this.quit()}}>
                <Text style={[styles.button, {backgroundColor: 'black'}]}>Quit</Text>
              </TouchableOpacity> 
            </View>
            <View style={{justifyContent: 'center', alignItems: 'center',}}>
              <Image source={require('../assets/images/back.jpg')} />
            </View>
          </View>
          <View style={{width: '20%'}}>
            
          </View>
          <View style={styles.scoreboard}>
            <Text style={{height: '25%', color: 'white'}}>{`Computer Score: ${this.state.computerScore}`}</Text>
            <Text style={{height: '25%', color: 'white'}}>{`Player Score: ${this.state.playerScore}`}</Text>
          </View>
        </View>
        <Set 
          set={playerSet} 
          type='play'
          turnComplete={!this.state.hit}
          numHands={this.props.hands}
        />
        {/* {this.turnIndicator()} */}
        {this.gameOver()}
        {this.flipCard(this.state.card)}
      </View>
    );
  }
}

const styles = StyleSheet.create({

  button: {
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 12,
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    overflow: 'hidden',
    padding: 12,
    textAlign:'center',
  },

  container: {
		flex: 1,
		flexDirection: 'column',
		width: '100%',
		backgroundColor: 'green',
		justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 18
	},
	  
	pannel: {
		flex: 1,
		flexDirection: 'row',
		width: '100%',
		justifyContent: 'center',
    alignItems: 'center',
  },

  buttons: {
		flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  scoreboard: {
		flexDirection: 'column',
    width: '40%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 35,
  },

});