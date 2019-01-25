import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import Game from './components/Game';

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
    this.setState({
      hands: 0, 
    });
  }

  display = () => {
    if (this.state.hands > 0) {
      return (
        <Game 
          hands={this.state.hands}
          quit={() => this.quit()}
        />
      );
    } else {
      return (
        <View style={styles.container}>
          <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
            <Text style={{fontSize: 50, fontWeight: 'bold'}}>
              <Text style={{color: 'black'}}>Multi</Text>
              <Text style={{color: 'red'}}>Jack</Text>
            </Text>
          </View>
          <View style={styles.buttons}>
            <View style={{flex: 1}}>
              <Button
                onPress={() => {this.startGame(1)}}
                title='BlackJack'
                color='blue'
              />
              <Button
                onPress={() => {this.startGame(3)}}
                title='TripleJack'
                color='black'
              />
            </View>
            <View style={{flex: 1}}>
              <Button
                onPress={() => {this.startGame(2)}}
                title='DoubleJack'
                color='red'
              />
              <Button
                onPress={() => {this.startGame(4)}}
                title='QuadJack'
                color='yellow'
              />
            </View>
          </View>
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
    flex: 1,
		flexDirection: 'row',
  },
});
