import React from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import helpers from '../helpers';
import images from '../assets/images/images.js';
import Card from './Card';

export default class Hand extends React.Component {
  
  constructor() {
    super();
    
  }

  addCards = (score) => {
    let hand = this.props.hand.map((card) => 
      <Card 
        card={card} 
        type={this.props.type}
        dropped={this.props.dropped} 
        pos={`${this.props.hand.indexOf(card) * 20}%`} 
        locked={true}
        score={score}
        key={this.props.hand.indexOf(card)} 
      />
    );
    return hand;
  }

  busted = (score) => {
    if (score > 21) {
      return <Text style={styles.busted}>BUSTED</Text>;
    }
  }

  score = (score) => {
    if (score > 21) {
      return (
        <Text style={{position: 'absolute', bottom:'0%'}}>
          <Text style={{position: 'absolute', bottom:'0%', color: 'white', opacity: 0.4, textDecorationLine: 'line-through'}}>{score}</Text> 
          <Text style={{position: 'absolute', bottom:'0%', color: 'red'}}>(-10)</Text> 
        </Text>
      );
    } else {
      return <Text style={{position: 'absolute', bottom:'0%', color: 'white'}}>{score}</Text>;
    }
  }

  render() {
    score = getScore(this.props.hand);
    return (
      <View style={styles.container}> 
        {this.addCards(score)}
        {this.busted(score)}
        {this.score(score)}
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
  
  busted: {
    transform: [{ rotate: '45deg'}],
    position: 'absolute',
    bottom:'60%',
    fontSize: 20,
    color: 'white',
    backgroundColor: 'red'
  }
});