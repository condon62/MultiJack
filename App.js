import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import Game from './Game';

export default class App extends React.Component {
  
  constructor() {
    super();

		this.state = {
      hands: 0,
    };
  }

  startGame = (num) => {
    this.setState({
      hands: num, 
    });
  }

  quit = () => {
    console.log("hello");
    this.setState({
      hands: 0, 
    });
  }

  display = () => {
    if(this.state.hands > 0) {
      return (
        <Game 
          hands={this.state.hands}
          quit={() => this.quit()}
        />
      );
    } else {
      return (
        <View style={styles.buttons}>
          <Button
            onPress={() => {this.startGame(1)}}
            title='BlackJack'
            color='blue'
          />
          <Button
            onPress={() => {this.startGame(2)}}
            title='DoubleJack'
            color='red'
          />
          <Button
            onPress={() => {this.startGame(3)}}
            title='TripleJack'
            color='black'
          />
        </View>
      );
    }
  }
  
  render() {
    return (
      <View style={styles.container}>
        {this.display()}
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
	},

  buttons: {
		flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
