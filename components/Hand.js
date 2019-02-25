import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { getScore } from '../helpers';
import Card from './Card';

export default class Hand extends React.Component {

  addCards = (score) => {
    const {
      hand, type, dropped, endRound, pass
    } = this.props;
    const locked = true;
    const cards = hand.map(card => (
      <Card
        card={card}
        type={type}
        dropped={dropped}
        pos={hand.indexOf(card)}
        locked={locked}
        score={score}
        endRound={endRound}
        pass={pass}
        key={hand.indexOf(card)}
      />
    ));
    return cards;
  }

  busted = (score) => {
    const { pass, type, endRound } = this.props;
    if (!pass && score > 21 && (type === 'play' || endRound)) {
      return <Text style={styles.busted}>BUSTED</Text>;
    }
    return null;
  }

  score = (score) => {
    const { pass, type, endRound } = this.props;
    if ((endRound || type === 'play') && (!pass)) {
      let scoreBlock;
      if (score > 21) {
        scoreBlock = (
          <Text style={{ position: 'absolute', top: '0%', fontSize: 20 }}>
            <Text style={{
              position: 'absolute', top: '0%', color: 'white', opacity: 0.4, textDecorationLine: 'line-through'
            }}
            >
              {score}
            </Text>
            <Text style={{ position: 'absolute', top: '0%', color: 'red' }}>(-10)</Text>
          </Text>
        );
      } else {
        scoreBlock = (
          <Text style={{
            position: 'absolute', top: '0%', color: 'white', fontSize: 20
          }}
          >
            {score}
          </Text>
        );
      }
      return scoreBlock;
    }
    return null;
  }

  render() {
    const { hand } = this.props;
    const score = getScore(hand);
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
    transform: [{ rotate: '45deg' }],
    position: 'absolute',
    bottom: '50%',
    fontSize: 20,
    color: 'white',
    backgroundColor: 'red'
  }
});
