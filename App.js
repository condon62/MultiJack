import React from 'react';
import { StyleSheet, Text, View, Image, Button } from 'react-native';
import helpers from './helpers';
import images from './assets/images/images.js';
import Hand from './Hand';
import Card from './Card';

export default class App extends React.Component {
  
  constructor() {
    super();

		this.state = {
			deck: [],
			playerHand: [],
      computerHand: [],
      playerBusted: false,
      computerBusted: false,
      playerScore: 0,
      computerScore: 0,
      currentPlayerScore: 0,
      currentComputerScore: 0,
      hit: false,
    };
  }
  
  componentWillMount() {
    this.initializeHands();
  }

  initializeHands = () => {
    let updatedDeck = ['c2', 'd2', 'h2', 's2', 'c3', 'd3', 'h3', 's3', 'c4', 'd4', 'h4', 's4', 'c5', 'd5', 'h5', 's5',
    'c6', 'd6', 'h6', 's6', 'c7', 'd7', 'h7', 's7', 'c8', 'd8', 'h8', 's8', 'c9', 'd9', 'h9', 's9',
    'c10', 'd10', 'h10', 's10', 'cj', 'dj', 'hj', 'sj', 'cq', 'dq', 'hq', 'sq', 'ck', 'dk', 'hk', 'sk',
    'ca', 'da', 'ha', 'sa'].shuffle();
    let updatedPlayerHand = [];
    let updatedComputerHand = [];
    let card;
    let i = 0;
    while(i < 2) {
      card = updatedDeck.pop();
      updatedPlayerHand.push(card);
      card = updatedDeck.pop();
      updatedComputerHand.push(card);
      i++;
    }
    
    this.setState({
      deck: updatedDeck,
      playerHand: updatedPlayerHand,
      computerHand: updatedComputerHand,
      playerBusted: false,
      computerBusted: false,
      currentPlayerScore: 0,
      currentComputerScore: 0,
      hit: false
    });
  }

	addCard = (hand) => {
    let updatedDeck = this.state.deck;
    let card = updatedDeck.pop();
    console.log('card: ' + card);
    hand.push(card);
    
    this.setState({
      hit: true,
      deck: updatedDeck,
      playerHand: hand,
    });
  }

  checkBusted = (score, type) => { 
    let { playerBusted, computerBusted, currentPlayerScore, currentComputerScore } = this.state;
    if (type == 'play') {
      if(currentPlayerScore != score) {
        currentPlayerScore = score;
        if(score >= 21 && this.state.playerBusted == false) {
          playerBusted = true;
          this.setState({
            playerBusted: playerBusted,
            currentPlayerScore: currentPlayerScore,
          });
        } else {
          this.setState({
            currentPlayerScore: currentPlayerScore,
          });
        }
      }
    } else {
      if(currentComputerScore != score) {
        currentComputerScore = score;
        if(score >= 21 && this.state.playerBusted == false) {
          computerBusted = true;
          this.setState({
            computerBusted: computerBusted,
            currentComputerScore: currentComputerScore,
          });
        } else {
          this.setState({
            currentComputerScore: currentComputerScore,
          });
        }
      }
    }
  }

  cardDropped = (dropped) => {
    this.setState({
      hit: false
    });
  }
 
  stay = () => {
    this.updateScore();
    this.initializeHands();
  }

  flipCard = (hand) => {
    if(this.state.hit) {
      return <Card card={playerHand[playerHand.length - 1]} dropped={(dropped) => this.cardDropped(dropped)} pos={0} />
    } else {
      return null;
    }
  }

  updateScore = () => {
    let {playerScore, computerScore, currentPlayerScore, currentComputerScore} = this.state;
    if(currentPlayerScore > 21) {
      currentPlayerScore = -10;
    }
    if(currentComputerScore > 21) { 
      currentComputerScore >= -10;
    }
    if(currentPlayerScore > currentComputerScore) {
      playerScore += currentPlayerScore - currentComputerScore;
    } else {
      computerScore += currentComputerScore - currentPlayerScore;
    }
    this.setState({
      playerScore: playerScore,
      computerScore: computerScore,
    });
  }
  
  render() {
    console.log('deck size: ' + this.state.deck.length);
    playerHand = this.state.playerHand;
    computerHand = this.state.computerHand;
    return (
      <View style={styles.container}>
        <Hand 
          hand={computerHand} 
          score={(score, type) => this.checkBusted(score, type)}
          type='comp'
          turnComplete={!this.state.hit}
        />
        <View style={styles.pannel}>
          <View style={{width: '40%', flexDirection: 'row',}}>
            <View style={styles.buttons}>
              <Button
                onPress={() => {this.addCard(playerHand)}}
                title='Hit'
                color='red'
                disabled={this.state.playerBusted || this.state.hit}
              />
              <Button
                onPress={() => {this.stay()}}
                title='Stay'
                color='blue'
              />
            </View>
            <Image source={require('./assets/images/back.jpg')} />
          </View>
          <View style={{width: '20%'}}>
            {this.flipCard(playerHand)}
          </View>
          <View style={styles.scoreboard}>
            <Text style={{height: '25%', color: 'white'}}>{`Player Score: ${this.state.playerScore}`}</Text>
            <Text style={{height: '25%', color: 'white'}}>{`Computer Score: ${this.state.computerScore}`}</Text>
          </View>
        </View>
        <Hand 
          hand={playerHand} 
          score={(score, type) => this.checkBusted(score, type)}
          type='play'
          turnComplete={!this.state.hit}
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
