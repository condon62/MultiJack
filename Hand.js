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
  
  getScore = () => {
    let score = 0;
    let i = 0;
    while(i < this.props.hand.length) {
      score += this.convertScore(this.props.hand[i]);
      i++;
    }
    if(this.props.hand.includes('sa') && score > 21) {
      score -= 10;
    }
    if(this.props.hand.includes('ca') && score > 21) {
      score -= 10;
    }
    if(this.props.hand.includes('ha') && score > 21) {
      score -= 10;
    }
    if(this.props.hand.includes('da') && score > 21) {
      score -= 10;
    }

    if(this.props.type == 'play') {
      this.props.score(score, 'play');
    } else {
      this.props.score(score, 'comp');
    }
    
    return score;
  }

  addCards = () => {
    let hand = this.props.hand.map((card) => <Card card={card} dropped={this.props.dropped} pos={`${this.props.hand.indexOf(card) * 20}%`} key={this.props.hand.indexOf(card)} />);
    if (hand.length > 2 && !this.props.turnComplete) {
      hand = hand.slice(0, hand.length - 1);
    }
    return hand;
  }

  render() {
    return (
      <View style={styles.container}>
        {this.addCards()}
        <Text style={{position: 'absolute', bottom:'0%', color: 'white'}}>{this.getScore()}</Text> 
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
		flex: 1,
    width: '100%',
    height: '33%',
    alignItems: 'center',
    justifyContent: 'flex-start',
		flexDirection: 'column',
  },
});