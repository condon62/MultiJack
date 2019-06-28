import React from 'react';
import { StyleSheet, View } from 'react-native';
import Hand from './Hand';

export default class Set extends React.Component {
  constructor() {
    super();
    this.state = {
    };
  }

  getHands = () => {
    const {
      set, type, turnComplete, endRound, pass
    } = this.props;
    const hands = set.map(hand => (
      <Hand
        hand={set[set.indexOf(hand)]}
        type={type}
        turnComplete={turnComplete}
        index={set.indexOf(hand)}
        endRound={endRound}
        pass={pass}
        key={set.indexOf(hand)}
      />
    ));
    return hands;
  }

  render() {
    return (
      <View style={styles.container}>
        {this.getHands()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
  },
});
