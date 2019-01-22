import React from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import Hand from './Hand';

export default class Set extends React.Component {
  
  constructor() {
    super();
    this.state = {
    };
  }

  getHands = () => {
    let set = this.props.set.map((hand) => 
      <Hand 
        hand={this.props.set[this.props.set.indexOf(hand)]} 
        type={this.props.type}
        turnComplete={this.props.turnComplete}
        index={this.props.set.indexOf(hand)}
        key={this.props.set.indexOf(hand)}
      />
    );
    return set;
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