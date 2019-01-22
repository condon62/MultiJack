import React from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import images from './assets/images/images.js';
import Card from './Card';

export default class Hand extends React.Component {
  
  constructor() {
    super();
    this.state = {
      score : 0,
    };
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

  addCards = () => {
    let hand = this.props.hand.map((card) => 
      <Card 
        card={card} 
        dropped={this.props.dropped} 
        pos={`${this.props.hand.indexOf(card) * 20}%`} 
        key={this.props.hand.indexOf(card)} 
      />
    );
    return hand;
  }

  render() {
    return (
      <View style={styles.container}> 
        {this.addCards()}
        <Text style={{position: 'absolute', bottom:'0%', color: 'white'}}>{this.getScore(this.props.hand)}</Text> 
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
		flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
		flexDirection: 'column',
  },
});