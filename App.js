import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Modal, TouchableHighlight, Alert, TouchableWithoutFeedback, ScrollView } from 'react-native';
import Game from './components/Game';
import Instructions from './components/Instructions';

export default class App extends React.Component {
  
  constructor() {
    super();

		this.state = {
      play: false,
      hands: 4,
      players: 1,
      difficulty: 1,
      modalVisible: false,
      comingModalVisible: false,
      instruction: 0,
    };
  }

  startGame = () => {
    this.setState({
      play: true, 
    });
  }

  switchDifficulty = (num) => {
    this.setState({
      difficulty: num, 
    });
  }

  switchPlayers = (num) => {
    this.setState({
      players: num, 
      difficulty: 1,
    });
  }

  switchMode = (num) => {
    this.setState({
      hands: num, 
    });
  }

  closeComingSoonModal = () => {
    this.setState({
      comingModalVisible: false, 
    });
  }

  comingSoon = () => {
    setTimeout(() => {this.setState({comingModalVisible: false})}, 1500);
    this.setState({
      comingModalVisible: true, 
    });
  }

  difficultyButtons = () => {
    let { players, difficulty } = this.state;
    if (players == 1) {
      let difficulties = ['Easy', 'Medium', 'Hard', 'Expert'];
      let buttons = difficulties.map((diff) => 
        <TouchableOpacity onPress={() => {this.switchDifficulty(difficulties.indexOf(diff) + 1)}} disabled={difficulties.indexOf(diff) + 1 == difficulty} key={difficulties.indexOf(diff)}>
          <Text style={[styles.button, {backgroundColor: 'black', opacity: difficulties.indexOf(diff) + 1 == difficulty ? 1 : 0.5}]}>{diff}</Text>
        </TouchableOpacity> 
      );
      return buttons;
    } else {
      let difficulties = ['Local', 'Online'];
      // let buttons = difficulties.map((diff) => 
      //   <TouchableOpacity onPress={() => {this.switchDifficulty(difficulties.indexOf(diff) + 1)}} disabled={difficulties.indexOf(diff) + 1 == difficulty} key={difficulties.indexOf(diff)}>
      //     <Text style={[styles.button, {backgroundColor: 'black', opacity: difficulties.indexOf(diff) + 1 == difficulty ? 1 : 0.5}]}>{diff}</Text>
      //   </TouchableOpacity> 
      // );
      let buttons = [];
      buttons.push(
        <TouchableOpacity key={1}>
          <Text style={[styles.button, {backgroundColor: 'black'}]}>Local</Text>
        </TouchableOpacity> 
      );
      buttons.push(
        <TouchableOpacity onPress={() => {this.comingSoon()}} key={2}>
          <Text style={[styles.button, {backgroundColor: 'black', opacity: 0.5}]}>Online</Text>
        </TouchableOpacity> 
      );
      return buttons;
    }
  }

  playerButtons = () => {
    let { players } = this.state;
    let player = ['Single', 'Multi'];
    let buttons = player.map((play) => 
      <TouchableOpacity onPress={() => {this.switchPlayers(player.indexOf(play) + 1)}} disabled={player.indexOf(play) + 1 == players} key={player.indexOf(play)}>
        <Text style={[styles.button, {backgroundColor: 'red', opacity: player.indexOf(play) + 1 == players ? 1 : 0.5}]}>{play}</Text>
      </TouchableOpacity> 
    );
    return buttons;
  }

  modeButtons = () => {
    let { hands } = this.state;
    let modes = ['BlackJack', 'DoubleJack', 'TripleJack', 'QuadJack'];
    let buttons = modes.map((mode) => 
      <TouchableOpacity onPress={() => {this.switchMode(modes.indexOf(mode) + 1)}} disabled={modes.indexOf(mode) + 1 == hands} key={modes.indexOf(mode)}>
        <Text style={[styles.button, {backgroundColor: 'black', opacity: modes.indexOf(mode) + 1 == hands ? 1 : 0.5}]}>{mode}</Text>
      </TouchableOpacity> 
    );
    return buttons;
  }

  quit = () => {
    this.setState({
      play: false, 
    });
  }

  display = () => {
    if (this.state.play) {
      return (
        <Game 
          hands={this.state.hands}
          players={this.state.players}
          difficulty={this.state.difficulty}
          quit={() => this.quit()}
        />
      );
    } else {
      return (
        <View style={styles.container}>

          <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
            <Text style={{fontSize: 80, fontWeight: 'bold', fontFamily: 'TimesNewRomanPS-BoldItalicMT'}}>
              <Text style={{color: 'black'}}>Multi</Text>
              <Text style={{color: 'red'}}>Jack</Text>
            </Text>
          </View>
          
          <View style={styles.buttonGroup}>
            <View style={{flex: 1, justifyContent: 'flex-start'}}>
              {this.modeButtons()}
            </View>

            <View style={{flex: 1}}>
              {this.playerButtons()}
            </View>

            <View style={{flex: 1, justifyContent: 'flex-end'}}>
              {this.difficultyButtons()}
            </View>
          </View>

          <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center'}}>
            <View style={{flex: 1}}>
            </View>
            <View style={{flex: 1}}>
              <TouchableOpacity onPress={() => {this.startGame()}}>
                <Text style={[styles.button, {backgroundColor: 'blue'}]}>Start</Text>
              </TouchableOpacity>
            </View>
            <View style={{flex: 1}}>
            </View>
          </View>

        </View>
      );
    }
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  
  render() {
    return (
      <View style={styles.container}>
        <Instructions
          visible={this.state.modalVisible}
          close={() => this.setModalVisible(false)}
        />
        <Modal
          animationType={'fade'}
          transparent={true}
          visible={this.state.comingModalVisible}>
          <TouchableOpacity style={{flex: 1, width: '100%'}} onPress={() => this.setState({ comingModalVisible: false })}>
            <Text style={{alignSelf: 'center', top: '30%', color: 'white', fontSize: 16}}>Mode Coming Soon</Text>
          </TouchableOpacity>
        </Modal>
        {this.display()}
        <TouchableOpacity onPress={() => {this.setModalVisible(true)}} style={styles.instructions}>
          <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>i</Text>
        </TouchableOpacity>
      </View> 
    );
  }
}

const styles = StyleSheet.create({

  button: {
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 12,
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    overflow: 'hidden',
    padding: 12,
    textAlign:'center',
  },

  buttonGroup: {
    flex: 3,
		flexDirection: 'row',
		width: '100%',
		justifyContent: 'center',
    alignItems: 'center',
  },

  container: {
		flex: 1,
		flexDirection: 'column',
		width: '100%',
		backgroundColor: 'green',
		justifyContent: 'center',
    alignItems: 'center',
  },
  
  instructions: {
    borderWidth: 1,
    borderColor:'white',
    alignItems:'center',
    justifyContent:'center',
    width: 30,
    height: 30,
    backgroundColor:'blue',
    borderRadius: 100,
    position: 'absolute',
    right: '2%',
    top: '3%'
  }

});
