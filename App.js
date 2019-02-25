import React from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, Modal
} from 'react-native';
import { AdMobBanner } from 'expo';
// import { AdMobBanner } from 'react-native-admob';
import Game from './components/Game';
import Instructions from './components/Instructions';

// const BANNERID = 'ca-app-pub-1898056984576377/4852799219';
const BANNERID = 'ca-app-pub-1425926517331745/4139536433'; ////// Test ID

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
    };
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  switchDifficulty = (num) => {
    this.setState({
      difficulty: num,
    });
  }

  startGame = () => {
    this.setState({
      play: true,
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
    setTimeout(() => { this.setState({ comingModalVisible: false }); }, 1500);
    this.setState({
      comingModalVisible: true,
    });
  }

  difficultyButtons = () => {
    const { players, difficulty } = this.state;
    let buttons = [];
    if (players === 1) {
      const difficulties = ['Easy', 'Medium', 'Hard', 'Expert'];
      buttons = difficulties.map(diff => (
        <TouchableOpacity
          onPress={() => { this.switchDifficulty(difficulties.indexOf(diff) + 1); }}
          disabled={difficulties.indexOf(diff) + 1 === difficulty}
          key={difficulties.indexOf(diff)}
        >
          <Text style={[styles.button, { backgroundColor: 'black', opacity: difficulties.indexOf(diff) + 1 === difficulty ? 1 : 0.5 }]}>{diff}</Text>
        </TouchableOpacity>
      ));
    } else {
      // const difficulties = ['Local', 'Online'];
      // let buttons = difficulties.map((diff) =>
      // <TouchableOpacity
      //   onPress={() => {this.switchDifficulty(difficulties.indexOf(diff) + 1)}}
      //   disabled={difficulties.indexOf(diff) + 1 == difficulty}
      //   key={difficulties.indexOf(diff)}
      // >
      // <Text
      // style={[styles.button, {
      //   backgroundColor: 'black',
      //   opacity: difficulties.indexOf(diff) + 1 == difficulty ? 1 : 0.5
      // }]}
      // >
      //   {diff}
      // </Text>
      //   </TouchableOpacity>
      // );
      buttons.push(
        <TouchableOpacity key={1}>
          <Text style={[styles.button, { backgroundColor: 'black' }]}>Local</Text>
        </TouchableOpacity>
      );
      buttons.push(
        <TouchableOpacity onPress={() => { this.comingSoon(); }} key={2}>
          <Text style={[styles.button, { backgroundColor: 'black', opacity: 0.5 }]}>Online</Text>
        </TouchableOpacity>
      );
    }
    return buttons;
  }

  playerButtons = () => {
    const { players } = this.state;
    const player = ['Single', 'Multi'];
    const buttons = player.map(play => (
      <TouchableOpacity
        onPress={() => { this.switchPlayers(player.indexOf(play) + 1); }}
        disabled={player.indexOf(play) + 1 === players}
        key={player.indexOf(play)}
      >
        <Text style={[styles.button, { backgroundColor: 'red', opacity: player.indexOf(play) + 1 === players ? 1 : 0.5 }]}>{play}</Text>
      </TouchableOpacity>
    ));
    return buttons;
  }

  modeButtons = () => {
    const { hands } = this.state;
    const modes = ['BlackJack', 'DoubleJack', 'TripleJack', 'QuadJack'];
    const buttons = modes.map(mode => (
      <TouchableOpacity
        onPress={() => { this.switchMode(modes.indexOf(mode) + 1); }}
        disabled={modes.indexOf(mode) + 1 === hands}
        key={modes.indexOf(mode)}
      >
        <Text style={[styles.button, { backgroundColor: 'black', opacity: modes.indexOf(mode) + 1 === hands ? 1 : 0.5 }]}>{mode}</Text>
      </TouchableOpacity>
    ));
    return buttons;
  }

  quit = () => {
    this.setState({
      play: false,
    });
  }

  display = () => {
    const {
      play, hands, players, difficulty
    } = this.state;
    let displayBlock;
    if (play) {
      displayBlock = (
        <Game
          hands={hands}
          players={players}
          difficulty={difficulty}
          quit={() => this.quit()}
        />
      );
    } else {
      displayBlock = (
        <View style={styles.container}>

          <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <Text style={{ fontSize: 80, fontWeight: 'bold', fontFamily: 'TimesNewRomanPS-BoldItalicMT' }}>
              <Text style={{ color: 'black' }}>Multi</Text>
              <Text style={{ color: 'red' }}>Jack</Text>
            </Text>
          </View>

          <View style={styles.buttonGroup}>
            <View style={{ flex: 1, justifyContent: 'flex-start' }}>
              {this.modeButtons()}
            </View>

            <View style={{ flex: 1 }}>
              {this.playerButtons()}
            </View>

            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
              {this.difficultyButtons()}
            </View>
          </View>

          <View style={{ flex: 2, flexDirection: 'column', justifyContent: 'center' }}>
            <View style={{ flex: 1 }}>
              <TouchableOpacity onPress={() => { this.startGame(); }}>
                <Text style={[styles.button, { backgroundColor: 'blue' }]}>Start</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }} />
          </View>

          <AdMobBanner
            style={styles.bottomBanner}
            bannerSize="smartBannerPortrait"
            adUnitID={BANNERID} // Test ID, Replace with your-admob-unit-id
            didFailToReceiveAdWithError={this.bannerError}
          />

        </View>
      );
    }
    return displayBlock;
  }

  render() {
    const { modalVisible, comingModalVisible } = this.state;
    const transparent = true;
    return (
      <View style={styles.container}>
        <Modal
          animationType="fade"
          transparent={transparent}
          visible={comingModalVisible}
        >
          <TouchableOpacity style={{ flex: 1, width: '100%' }} onPress={() => this.setState({ comingModalVisible: false })}>
            <Text style={{
              alignSelf: 'center', top: '25%', color: 'white', fontSize: 16
            }}
            >
              Mode Coming Soon
            </Text>
          </TouchableOpacity>
        </Modal>
        {this.display()}
        {!modalVisible ? (
          <TouchableOpacity
            onPress={() => { this.setModalVisible(true); }}
            style={styles.instructions}
            visible={false}
            render={false}
          >
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>i</Text>
          </TouchableOpacity>
        ) : null}
        <Instructions
          visible={modalVisible}
          close={() => this.setModalVisible(false)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bottomBanner: {
    position: 'absolute',
    bottom: 0,
  },

  button: {
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 12,
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    overflow: 'hidden',
    padding: 12,
    textAlign: 'center',
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
    paddingTop: '12%'
  },

  instructions: {
    borderWidth: 1,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
    backgroundColor: 'blue',
    borderRadius: 100,
    position: 'absolute',
    right: '2%',
    top: '4%'
  }

});
