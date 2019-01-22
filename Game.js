import React from 'react';
import { StyleSheet, Text, View, Image, Button } from 'react-native';
import helpers from './helpers';
import images from './assets/images/images.js';
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

		this.state = {
      deck: deck, // Remaining cards
      playerSet: playerSet, // Set of player hands
      computerSet: computerSet, // Set of computer hands
      card: '', // flipped card
      playerScore: 0,
      computerScore: 0,
      hit: false,
    };
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
    
    this.setState({
      deck: updatedDeck,
      playerSet: playerSet,
      computerSet: computerSet,
      hit: false
    });
  }

	addCard = (set) => {
    let updatedDeck = this.state.deck;
    let card = updatedDeck.pop();
    
    this.setState({
      card: card,
      hit: true,
      deck: updatedDeck,
    });
  }

  cardDropped = (zone) => {
    let { playerSet, card } = this.state; 
    let hand = playerSet[zone - 1];
    hand.push(card);
    playerSet[zone - 1] = hand;
    playerSet
    this.setState({
      playerSet: playerSet,
      hit: false
    });
  }
 
  stay = () => {
    this.updateScore();
    this.initializeHands();
  }

  flipCard = (card) => {
    if(this.state.hit) {
      return (
        <Card 
          card={card} 
          dropArea={(zone) => this.cardDropped(zone)} 
          pos={0} 
          hands={this.props.hands}
        />
      );
    } else {
      return null;
    }
  }

  updateScore = () => {
    let { playerScore, computerScore, playerSet, computerSet } = this.state;
    let i = 0;
    let player = 0;
    let computer = 0;
    while(i < playerSet.length) {
      let currentPlayerScore = this.getScore(playerSet[i]);
      let currentComputerScore = this.getScore(computerSet[i]);
      if(currentPlayerScore > 21) {
        player -= 10;
      } else {
        player += currentPlayerScore;
      }
      if(currentComputerScore > 21) { 
        computer -= 10;
      } else {
        computer += currentComputerScore;
      }
      i++;
    }

    if(player > computer) {
      playerScore += player - computer;
    } else {
      computerScore += computer - player;
    }
    
    this.setState({
      playerScore: playerScore,
      computerScore: computerScore,
    });
  }

  quit = () => {
    this.props.quit();
  }

  playerBusted = () => {
    let busted = true
    console.log(this.state.playerSet);
    let { playerSet } = this.state;
    // let { playerBusted } = this.state;
    let i = 0;
    while(i < playerSet.length && busted == true) {
      if(this.getScore(playerSet[i]) < 21) {
        busted = false;
      }
      i++;
    }
    return busted;
  }

  convertScore = (str) => {
    let value = 0;
    switch (str.substring(1)) {
      case 'j':
        value = 10;
        break;
      case 'q':
        value = 10;
        break;
      case 'k':
        value = 10;
        break;
      case 'a':
        value = 11;
        break;
      default:
        value = parseInt(str.substring(1));
    }
    return value;
  }
  
  getScore = (hand) => {
    let score = 0;
    let i = 0;
    while(i < hand.length) {
      score += this.convertScore(hand[i]);
      i++;
    }
    if(hand.includes('sa') && score > 21) {
      score -= 10;
    }
    if(hand.includes('ca') && score > 21) {
      score -= 10;
    }
    if(hand.includes('ha') && score > 21) {
      score -= 10;
    }
    if(hand.includes('da') && score > 21) {
      score -= 10;
    }
    return score;
  }
  
  render() {
    let { playerSet, computerSet } = this.state;
    return (
      <View style={styles.container}>
        <Set 
          set={computerSet} 
          type='comp'
          turnComplete={!this.state.hit}
          numHands={this.props.hands}
        />
        <View style={styles.pannel}>
          <View style={{width: '40%', flexDirection: 'row',}}>
            <View style={styles.buttons}>
              <Button
                onPress={() => {this.addCard(playerSet)}}
                title='Hit'
                color='red'
                disabled={this.playerBusted() || this.state.hit}
              />
              <Button
                onPress={() => {this.stay()}}
                title='Stay'
                color='blue'
              />
              <Button
                onPress={() => {this.quit()}}
                title='Quit'
                color='yellow'
              />
            </View>
            <Image source={require('./assets/images/back.jpg')} />
          </View>
          <View style={{width: '20%'}}>
            {this.flipCard(this.state.card)}
          </View>
          <View style={styles.scoreboard}>
            <Text style={{height: '25%', color: 'white'}}>{`Player Score: ${this.state.playerScore}`}</Text>
            <Text style={{height: '25%', color: 'white'}}>{`Computer Score: ${this.state.computerScore}`}</Text>
          </View>
        </View>
        <Set 
          set={playerSet} 
          type='play'
          turnComplete={!this.state.hit}
          numHands={this.props.hands}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
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