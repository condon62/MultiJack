import React from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, Modal, ScrollView
} from 'react-native';

export default class Instructions extends React.Component {
  constructor() {
    super();
    this.state = {
      category: 0,
    };
  }

  switchCategory = (num) => {
    this.setState({
      category: num,
    });
  }

  categoryButtons = () => {
    const { category } = this.state;
    const categories = ['Overview', 'Scoring', 'Winning', 'Modes', 'Players', 'Difficulties'];
    const buttons = categories.map(cat => (
      <TouchableOpacity
        onPress={() => { this.switchCategory(categories.indexOf(cat)); }}
        disabled={categories.indexOf(cat) === category}
        key={categories.indexOf(cat)}
      >
        <Text style={[styles.button, { backgroundColor: 'black', opacity: categories.indexOf(cat) === category ? 1 : 0.5 }]}>{cat}</Text>
      </TouchableOpacity>
    ));
    return buttons;
  }

  categoryInformation = () => {
    const { category } = this.state;
    const text = [];
    if (category === 0) {
      text.push(
        <View>
          <Text style={styles.title} key={1}>Overview</Text>
          <Text style={styles.text}>MultiJack is a twist on the classic game of Blackjack.  The twist is that players have the option to have more than 1 hand (up to 4) at once.</Text>
          <Text style={styles.subtitle}>1. Objective</Text>
          <Text style={styles.text}>Each player attempts to beat their opponent by getting a score as close to 21 as possible without going over on each of their hands.</Text>
          <Text style={styles.subtitle}>2. Setup</Text>
          <Text style={styles.text}>Each player is dealt 2 cards per hand and only the second card in each hand is visible to the opponent.</Text>
          <Text style={styles.subtitle}>3. Play</Text>
          <Text style={styles.text}>Players alternate turns deciding to "hit" (add card to hands) or "stay" (keep hands as is).  On a "hit",  a card is flipped and shown to all players.  The player who "hit" must drag the card to the hand they wish to add it to.  Once placed, the card cannot be moved.  The round ends when both players have chosen to "stay" consecutively or have no remaining moves (all hands 21 or busted).</Text>
        </View>
      );
    } else if (category === 1) {
      text.push(
        <View>
          <Text style={styles.title} key={2}>Scoring</Text>
          <Text style={styles.subtitle}>1. Card</Text>
          <Text style={styles.text}>Each playing card has a corresponding value.  Face cards (J, Q, K) are worth 10, aces are worth either 11 or 1, all other cards are their face value.</Text>
          <Text style={styles.subtitle}>2. Hand</Text>
          <Text style={styles.text}>Each hand has a score which is the sum of its cards.  Busting (obtaining a score of greater than 21) results in a hand score of 0.  Aces are counted as a score of 1 or 11 based on which gives a hand score closer to 21 without exceeding it.</Text>
          <Text style={styles.subtitle}>3. Round</Text>
          <Text style={styles.text}>For each player, the scores of each of their hands are added together to form a total round score.  The player with the higher total round score is awarded the number of points greater their score is than their opponent's.</Text>
          <Text style={[styles.text, { paddingTop: '3%' }]}>Each busted hand awards the opponent 10 points.  The busted hand is treated as a score of 0 and the opponent's worst hand (busted or lowest score) is replaced by a score of 10.  Busts will cancel out (award 0 points) if both players have busted.  Multiple busted hands will replace multiple lowest scores of the opponent.</Text>
        </View>
      );
    } else if (category === 2) {
      text.push(
        <View>
          <Text style={styles.title} key={3}>Winning</Text>
          <Text style={styles.subtitle}>1. Round</Text>
          <Text style={styles.text}>One player scores per round.  The player with the highest round score has the same number of points added to their game score.  Ties result in no points being added.</Text>
          <Text style={styles.subtitle}>2. Game</Text>
          <Text style={styles.text}>Players compete to a total score of 50.  First player to reach 50 is the winner.</Text>
        </View>
      );
    } else if (category === 3) {
      text.push(
        <View>
          <Text style={styles.title} key={4}>Modes</Text>
          <Text style={styles.text}>MultiJack features 4 different playing modes.  Each mode features a different number of hands per player.</Text>
          <Text style={styles.subtitle}>1. BlackJack</Text>
          <Text style={styles.text}>Each player has 1 hand (Your classic blackjack rules).</Text>
          <Text style={styles.subtitle}>2. DoubleJack</Text>
          <Text style={styles.text}>Each player has 2 hands (Double the decisions).</Text>
          <Text style={styles.subtitle}>3. TripleJack</Text>
          <Text style={styles.text}>Each player has 3 hands (Three's a crowd).</Text>
          <Text style={styles.subtitle}>4. QuadJack</Text>
          <Text style={styles.text}>Each player has 4 hands (Absolute mayhem).</Text>
        </View>
      );
    } else if (category === 4) {
      text.push(
        <View>
          <Text style={styles.title} key={5}>Players</Text>
          <Text style={styles.text}>MultiJack supports capabilities for 1 and 2 players.</Text>
          <Text style={styles.subtitle}>1. Single</Text>
          <Text style={styles.text}>Test your skills against a computer of varying difficulties.</Text>
          <Text style={styles.subtitle}>2. Multi</Text>
          <Text style={styles.text}>Play against a friend (or foe) in local pass-and-play.  The game takes place on a single device which is passed after each turn.</Text>
        </View>
      );
    } else if (category === 5) {
      text.push(
        <View>
          <Text style={styles.title} key={6}>Difficulties</Text>
          <Text style={styles.text}>MultiJack currently features the following 4 levels of computer difficulty:</Text>
          <Text style={styles.subtitle}>1. Easy</Text>
          <Text style={styles.text}>An opponent with some questionable decisions.  A great place for beginners.</Text>
          <Text style={styles.subtitle}>2. Medium</Text>
          <Text style={styles.text}>A worthy opponent.  You better step up your game.</Text>
          <Text style={styles.subtitle}>3. Hard</Text>
          <Text style={styles.text}>A hardened challenger.  Do not understimate.</Text>
          <Text style={styles.subtitle}>4. Expert</Text>
          <Text style={styles.text}>A seasoned veteran.  Challenge at your own peril.</Text>
        </View>
      );
    }
    return text;
  }

  render() {
    const { visible, close } = this.props;
    return (
      <View style={{ justifyContent: 'center' }}>
        <Modal
          animationType="slide"
          transparent={visible}
          visible={visible}
        >
          <View style={styles.container}>
            <View style={{ flex: 3, justifyContent: 'center' }}>
              {this.categoryButtons()}
              <TouchableOpacity onPress={() => { close(); }}>
                <Text style={[styles.button, { backgroundColor: 'red' }]}>Return</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 7, paddingBottom: '3%' }}>
              <ScrollView>
                {this.categoryInformation()}
              </ScrollView>
            </View>
          </View>
        </Modal>
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
    textAlign: 'center',
  },

  container: {
    width: '100%',
    flexDirection: 'row',
    height: '50%',
    backgroundColor: 'white',
    position: 'absolute',
    top: '25%',
    opacity: 0.9,
  },

  text: {
    fontSize: 18,
    paddingLeft: '8%',
    paddingRight: '3%'
  },

  title: {
    alignSelf: 'center',
    fontSize: 50,
    fontWeight: 'bold',
    color: 'black'
  },

  subtitle: {
    fontSize: 30,
    paddingTop: '10%',
    paddingLeft: '3%',
    fontWeight: 'bold',
    color: 'red'
  }
});
