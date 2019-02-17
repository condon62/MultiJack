import React from 'react';
import { StyleSheet, Text, View, Image, Button, Alert, TouchableOpacity, Modal } from 'react-native';
import helpers from '../helpers';
import images from '../assets/images/images.js';
import Set from './Set';
import Card from './Card';

const TIMERLENGTH = 5;
const DECK = ['c2', 'd2', 'h2', 's2', 'c3', 'd3', 'h3', 's3', 'c4', 'd4', 'h4', 's4', 'c5', 'd5', 'h5', 's5',
'c6', 'd6', 'h6', 's6', 'c7', 'd7', 'h7', 's7', 'c8', 'd8', 'h8', 's8', 'c9', 'd9', 'h9', 's9',
'c10', 'd10', 'h10', 's10', 'cj', 'dj', 'hj', 'sj', 'cq', 'dq', 'hq', 'sq', 'ck', 'dk', 'hk', 'sk',
'ca', 'da', 'ha', 'sa'];

export default class Game extends React.Component {
  mounted = false;

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
      stay: false,
      autoStay: false,
      playersTurn: playersTurn,
      stayCounter: 0,
      pass: true,
      computerTimer: TIMERLENGTH,
      gameOver: false,
      computerFeedbackVisible: false,
    };
  }

  //----------------------------------------------------------------//
  // Lifecycle methods

  componentDidMount() {
    this.mounted = true;
    if ((this.state.playersTurn && this.props.players == 1) || this.state.autoStay) {
      this.automatePlayer();
    }
    if (this.props.players == 1) {
      this.computersTurn();
    }
  }

  componentDidUpdate() {
    this.gameOver();
    if ((this.state.playersTurn && this.props.players == 1) || this.state.autoStay) {
      this.automatePlayer();
    }
    if (this.props.players == 1) {
      this.computersTurn();
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  //----------------------------------------------------------------//
  // General game methods

  addCard = (set) => {
    let { deck, playerSet, computerSet, playersTurn } = this.state;
    let { players } = this.props;
    let hit = true;
    let computerTimer = TIMERLENGTH;
    let card = deck.pop();
    console.log(card);
    if (this.props.hands == 1 && players == 1) {
      if (playersTurn) {
        playerSet[0].push(card);
      } else {
        computerSet[0].push(card);
        this.computerFeedback();
      }
      playersTurn = !playersTurn;
      hit = false
    } else if (!playersTurn && players == 1) {
      computerTimer = 2;
      this.computerFeedback();
    }
    this.setState({
      card: card,
      hit: hit,
      stay: false,
      deck: deck,
      playerSet: playerSet,
      computerSet: computerSet,
      playersTurn: playersTurn,
      stayCounter: 0,
      computerTimer: computerTimer,
    });
  }

  flipCard = (card) => {
    if (this.state.hit) {
      let locked = false;
      let pos = 0;
      if (!this.state.playersTurn && this.props.players == 1) {
        pos = -1.25;
        locked = true;
      }
      return (
        <Card 
          card={card}
          type={'play'} 
          dropArea={(zone) => this.cardDropped(zone)} 
          pos={pos} 
          locked={locked}
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
    let { playerScore, computerScore, lastRoundScore, gameOver } = this.state;
    if (playerScore >= 50 && !gameOver) {
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
      this.setState({
        gameOver: true,
      });
    }
    if (computerScore >= 50 && !gameOver) {
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
      this.setState({
        gameOver: true,
      });
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
      stay: false,
      autoStay: false,
      playersTurn: playersTurn,
      stayCounter: 0,
      pass: true,
      computerTimer: TIMERLENGTH,
      gameOver: false,
    });
  }

  scoreboard = () => {
    let { playersTurn } = this.state;
    let scores = [];
    if (playersTurn) {
      scores.push(
        <View style={{flex: 1, justifyContent: 'flex-end', padding: '4%'}} key={1}>
          <Text style={{color: 'white', textAlign: 'left'}}>{(this.props.players == 1 ? 'Computer' : 'Player 2')}</Text>
          <Text style={{color: 'white', textAlign: 'left'}}>{`Score: ${this.state.computerScore}`}</Text>
        </View>
      );
      scores.push(
        <View style={{flex: 1, padding: '4%'}} key={2}>
          <Text style={{color: 'yellow', textAlign: 'left', fontSize: 20}}>{(this.props.players == 1 ? 'PLAYER' : 'PLAYER 1')}</Text>
          <Text style={{color: 'white', textAlign: 'left'}}>{`Score: ${this.state.playerScore}`}</Text>
        </View>
      );
    } else {
      scores.push(
        <View style={{flex: 1, justifyContent: 'flex-end', padding: '4%'}} key={1}>
          <Text style={{color: 'yellow', textAlign: 'left', fontSize: 20}}>{(this.props.players == 1 ? 'COMPUTER' : 'PLAYER 2')}</Text>
          <Text style={{color: 'white', textAlign: 'left'}}>{`Score: ${this.state.computerScore}`}</Text>
        </View>
      );
      scores.push(
        <View style={{flex: 1, padding: '4%'}} key={2}>
          <Text style={{color: 'white', textAlign: 'left'}}>{(this.props.players == 1 ? 'Player' : 'Player 1')}</Text>
          <Text style={{color: 'white', textAlign: 'left'}}>{`Score: ${this.state.playerScore}`}</Text>
        </View>
      );
    }
    return scores;
  }

  stay = () => {
    let { playersTurn, stayCounter, computerTimer, stay, computerFeedbackVisible } = this.state;
    if (playersTurn) {
      computerTimer = TIMERLENGTH;
      stay = false;
    } else {
      computerTimer = 0;
      stay = true;
      this.computerFeedback();
    }
    if (stayCounter == 1) { // End game
      this.setState({
        stayCounter: stayCounter + 1,
        computerTimer: computerTimer,
      });
      this.updateScore();
    } else { // End turn
      this.setState({
        playersTurn: !playersTurn,
        stayCounter: stayCounter + 1,
        pass: true,
        computerTimer: computerTimer,
        stay: stay,
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

  quit = () => {
    clearInterval(this.computerTimer);
    this.props.quit();
  }
  
  //----------------------------------------------------------------//
  // Player methods

  automatePlayer = () => {
    if ((this.playerBusted()) || this.state.autoStay) {
      this.stay();
    }
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

  playerBusted = () => {
    let busted = true;
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

  //----------------------------------------------------------------//
  // Computer methods

  computerShouldHit = (lowest) => {
    let { deck } = this.state;
    let { difficulty } = this.props;
    let hit = false;
    if (difficulty == 1) {
      if (Math.floor(Math.random() * 2) == 0) {
        hit = true;
      }
    } else if (difficulty == 2) {
      let counter = 0;
      let i = 0;
      while (i < deck.length) {
        let current = convertScore(deck[i]);
        if (current == 11) {
          current = 1;
        }
        if ((lowest + current) <= 21) {
          counter++;
        } 
        i++;
      }
      console.log(counter/deck.length);
      if ((counter / deck.length) > 0.5) {
        hit = true;
      }
    } else if (difficulty == 3) {
      if (lowest <= 13) {
        hit = true;
      }
    } else {
      console.log(deck[deck.length - 1]);
      let current = convertScore(deck[deck.length - 1]);
      if (current == 11) {
        current = 1;
      }
      if ((lowest + current) <= 21) {
        hit = true;
      } 
    }
    return hit;
  }

  computerHit = () => {
    let { card, computerSet } = this.state;
    computerSet = this.computerDropCard(computerSet, card);
    this.setState({
      computerSet: computerSet,
      hit: false,
      computerTimer: 0,
      playersTurn: true,
    });
  }

  computerHandScores = () => {
    let { computerSet} = this.state;
    let scores = [];
    let i = 0;
    while (i < computerSet.length) {
      let hand = computerSet[i];
      let aces = this.numberOfAces(hand);
      let currentScore = getScore(hand);
      scores.push(currentScore);
      if (aces > 0) {
        let altScore = 0;
        let j = 0;
        while (j < hand.length) {
          let value = convertScore(hand[j]);
          if (value == 11) {
            value = 1;
          }
          altScore += value;
          j++
        }
        scores.push(altScore);
      }
      i++;
    } 
    scores.sort((a, b) => a - b);
    return scores;
  }

  computerHitOrStay = () => {
    let scores = this.computerHandScores();
    if (this.state.computerTimer == TIMERLENGTH - 2) {
      if (this.computerShouldHit(scores[0])) {
        this.addCard();
      } else {
        this.stay();
      } 
    } else {
      this.computerHit();
    }
  }

  computerDropCard = (set, card) => {
    let hand = [];
    let best = -100;
    let index = 0;
    let i = 0;
    while (i < set.length) {
      // TODO: Which bust to take (22 vs 25 vs 30)
      hand = set[i];
      hand.push(card);
      let score = 21 - getScore(hand);
      hand.pop();
      if ((best < 0 && score > best) || (best > 0 && score > 0 && score < best)) {
        best = score;
        index = i;
      }
      i++;
    }
    set[index].push(card)
    return set;
  }

  computersTurn = () => {
    if (this.state.computerTimer <= 0) {
      clearInterval(this.computerTimer);
    }
    if (!this.state.playersTurn && this.props.players == 1) {
      if (this.state.computerTimer == TIMERLENGTH) {
        this.computerTimer = setInterval(
          () => this.setState((prevState) => ({
              computerTimer: prevState.computerTimer - 1,
            })), 1000
          );
      } else if (this.state.computerTimer == TIMERLENGTH - 2) {
        this.computerHitOrStay();
      } else if (this.state.computerTimer == TIMERLENGTH - 4) {
        this.computerHitOrStay();
      }
    }
  }

  numberOfAces = (hand) => {
    let aces = 0;
    if (hand.includes('sa')) {
      aces++;
    }
    if (hand.includes('ca')) {
      aces++;
    }
    if (hand.includes('ha')) {
      aces++;
    }
    if (hand.includes('da')) {
      aces++;
    }
    return aces;
  }

  computerFeedback = () => {
    setTimeout(() => {this.setState({computerFeedbackVisible: false})}, 1500);
    this.setState({
      computerFeedbackVisible: true, 
    });
  }

  //----------------------------------------------------------------//
  
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
        <Modal
          animationType={'fade'}
          transparent={true}
          visible={this.state.computerFeedbackVisible}>
          <TouchableOpacity style={{flex: 1, width: '100%'}} onPress={() => this.setState({ computerFeedbackVisible: false })}>
            <Text style={{alignSelf: 'center', top: '40%', color: 'white', fontSize: 16}}>{this.state.stay ? 'Stay' : 'Hit'}</Text>
          </TouchableOpacity>
        </Modal>
        <Set 
          set={computerSet} 
          type='comp'
          turnComplete={!this.state.hit}
          numHands={this.props.hands}
          endRound={this.state.stayCounter >= 2}
          pass={this.props.players == 2 ? this.state.pass : false}
        />
        <View style={styles.pannel}>
          <View style={{flex: 2, flexDirection: 'row'}}>
            <View style={styles.buttons}>
              <TouchableOpacity style={{width: '100%'}} onPress={() => {this.addCard(playerSet)}} disabled={this.playerBusted() || this.state.hit || (this.props.players == 2 ? false : !this.state.playersTurn)}>
                <Text style={[styles.button, {backgroundColor: 'red', opacity: (this.playerBusted() || this.state.hit || (this.props.players == 2 ? false : !this.state.playersTurn)) ? 0.5 : 1}]}>Hit</Text>
              </TouchableOpacity> 
              <TouchableOpacity style={{width: '100%'}} onPress={() => {this.stay()}} disabled={this.state.hit || (this.props.players == 2 ? false : !this.state.playersTurn)}>
                <Text style={[styles.button, {backgroundColor: 'blue', opacity: (this.state.hit || (this.props.players == 2 ? false : !this.state.playersTurn)) ? 0.5 : 1}]}>Stay</Text>
              </TouchableOpacity> 
              <TouchableOpacity style={{width: '100%'}} onPress={() => {this.quit()}}>
                <Text style={[styles.button, {backgroundColor: 'black'}]}>Quit</Text>
              </TouchableOpacity> 
            </View>
            <View style={{flex: 0.5}} />
            <View style={{flex: 4, justifyContent: 'center', alignItems: 'center',}}>
              <TouchableOpacity style={{width: '100%'}} onPress={() => {this.addCard(playerSet)}} disabled={this.playerBusted() || this.state.hit || (this.props.players == 2 ? false : !this.state.playersTurn)}>
                <Image source={require('../assets/images/back.jpg')} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            {this.flipCard(this.state.card)}
          </View>
          <View style={styles.scoreboard}>
            {this.scoreboard()}
          </View>
        </View>
        <Set 
          set={playerSet} 
          type='play'
          turnComplete={!this.state.hit}
          numHands={this.props.hands}
          pass={this.props.players == 2 ? this.state.pass : false}
        />
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
	},
	  
	pannel: {
		flex: 1,
		flexDirection: 'row',
		width: '100%',
		justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },

  buttons: {
    flex: 4,
		flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  scoreboard: {
		flexDirection: 'column',
    flex: 2,
    justifyContent: 'center',
  },

  triangle: {
    justifyContent: 'flex-end',
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 45,
    borderRightWidth: 70,
    borderBottomWidth: 45,
    borderLeftWidth: 70,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    //marginTop: 10,
  },

});