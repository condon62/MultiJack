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
      pass: true,
    };
  }

  addCard = (set) => {
    let { deck, playerSet, computerSet, playersTurn } = this.state;
    let { players } = this.props;
    let hit = true;
    let card = deck.pop();
    if (this.props.hands == 1 && players == 1) {
      if (playersTurn) {
        playerSet[0].push(card);
      } else {
        computerSet[0].push(card);
      }
      playersTurn = !playersTurn;
      hit = false
    } else if (!playersTurn && players == 1) {
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
    let { playerSet, computerSet, card, playersTurn } = this.state; 
    let hand = [];
    if (!playersTurn && this.props.players == 2) {
      hand = computerSet[zone - 1];
      hand.push(card);
      computerSet[zone - 1] = hand;
    } else {
      hand = playerSet[zone - 1];
      hand.push(card);
      playerSet[zone - 1] = hand;
    }
    this.setState({
      playerSet: playerSet,
      computerSet: computerSet,
      hit: false,
      playersTurn: !playersTurn,
      pass: true,
    });
  }

  componentDidMount() {
    if (!this.state.playersTurn && this.props.players == 1) {
      this.computersAction();
    }
  }

  componentDidUpdate() {
    if (!this.state.playersTurn && this.props.players == 1) {
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
    let i = 0;
    while (i < set.length) {
      // TODO: IF GETSCORE() SCORE IS 11 i.e. an ACE
      let score = 21 - getScore(set[i]) - cardValue;
      if ((best < 0 && score > best) || (best > 0 && score > 0 && score < best)) {
        best = score;
        index = i;
      }
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
          pass={this.props.players == 2 ? this.state.pass : false}
        />
      );
    } else {
      return null;
    }
  }

  gameOver = () => {
    let { playerScore, computerScore, lastRoundScore } = this.state;
    if (playerScore >= 50) {
      let title = 'Game Won';
      let message = `Player wins round by a score of ${lastRoundScore} with a score of ${playerScore}`;
      if (this.props.players == 2) {
        title = 'Player 1 Won';
        message = `Player 1 wins round by a score of ${lastRoundScore} with a score of ${playerScore}`;
      }
      Alert.alert(
        title,
        message,
        [
          {Text: 'Home', onPress: () => this.quit()}
        ],
        { cancelable: false }
      );
    }
    if (computerScore >= 50) {
      let title = 'Game Lost';
      let message = `Computer wins round by a score of ${lastRoundScore} and game with a score of ${computerScore}`;
      if (this.props.players == 2) {
        title = 'Player 2 Won';
        message = `Player 2 wins round by a score of ${lastRoundScore} and game with a score of ${computerScore}`;
      }
      Alert.alert(
        title,
        message,
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
      pass: true,
    });
  }

  legalZones = () => {
    let { playerSet, computerSet, playersTurn } = this.state;
    let { players } = this.props;
    let temp = [];
    if (!playersTurn && this.props.players == 2) {
      temp = playerSet;
      playerSet = computerSet;
      computerSet = temp;
    }
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

  passDevice = () => {
    let { players } = this.props;
    let { playersTurn, pass } = this.state;
    if (players == 2 && pass) {
      Alert.alert(
        `Player ${playersTurn ? 1 : 2}'s Turn`,
        `Pass device to player ${playersTurn ? 1 : 2}`,
        [
          {Text: 'Start Turn', onPress: () => this.passed()}
        ],
        { cancelable: false }
      );
    }
  }

  passed = () => {
    this.setState({
      pass: false,
    });
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
      this.setState({
        playersTurn: !playersTurn,
        stayCounter: stayCounter + 1,
        pass: true,
      });
    }
  }

  updateScore = () => {
    let { playerScore, computerScore, playerSet, computerSet } = this.state;
    let { players } = this.props;
  
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
      if (players == 1) {
        title = 'Round Won';
        message = 'Player Wins by ' + (player - computer);
      } else {
        title = 'Player 1 Won Round';
        message = 'Player 1 Wins by ' + (player - computer);
      }
    } else if (computer > player) {
      computerScore += computer - player;
      lastRoundScore = computer - player;
      if (players == 1) {
        title = 'Round Lost';
        message = 'Computer wins by ' + (computer - player);
      } else {
        title = 'Player 2 Won Round';
        message = 'Player 2 wins by ' + (computer - player);
      }
    } else {
      title = 'Draw';
      if (players == 1) {
        message = 'Player and Computer tie';
      } else {
        message = 'Player 1 and Player 2 tie';
      }
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
    let { playerSet, computerSet, playersTurn } = this.state;
    let temp = [];
    if (!playersTurn && this.props.players == 2) {
      temp = playerSet;
      playerSet = computerSet;
      computerSet = temp;
    }
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
    let { playerSet, computerSet, playersTurn } = this.state;
    let temp = [];
    if (!playersTurn && this.props.players == 2) {
      temp = playerSet;
      playerSet = computerSet;
      computerSet = temp;
    }
    return (
      <View style={styles.container}>
        <Set 
          set={computerSet} 
          type='comp'
          turnComplete={!this.state.hit}
          numHands={this.props.hands}
          endRound={this.state.stayCounter >= 2}
          pass={this.props.players == 2 ? this.state.pass : false}
        />
        <View style={styles.pannel}>
          <View style={{width: '40%', flexDirection: 'row',}}>
            <View style={styles.buttons}>
              <TouchableOpacity onPress={() => {this.addCard(playerSet)}} disabled={this.playerBusted() || this.state.hit || (this.props.players == 2 ? false : !this.state.playersTurn)}>
                <Text style={[styles.button, {backgroundColor: 'red', opacity: (this.playerBusted() || this.state.hit || (this.props.players == 2 ? false : !this.state.playersTurn)) ? 0.5 : 1}]}>Hit</Text>
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
            <Text style={{height: '25%', color: 'white'}}>{`${(this.props.players == 1 ? 'Computer Score' : 'Player 2 Score')}: ${this.state.computerScore}`}</Text>
            <Text style={{height: '25%', color: 'white'}}>{`${(this.props.players == 1 ? 'Player Score' : 'Player 1 Score')}: ${this.state.playerScore}`}</Text>
          </View>
        </View>
        <Set 
          set={playerSet} 
          type='play'
          turnComplete={!this.state.hit}
          numHands={this.props.hands}
          pass={this.props.players == 2 ? this.state.pass : false}
        />
        {/* {this.turnIndicator()} */}
        {this.gameOver()}
        {this.flipCard(this.state.card)}
        {this.passDevice()}
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