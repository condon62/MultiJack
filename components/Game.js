import React from 'react';
import {
  StyleSheet, Text, View, Image, Alert, TouchableOpacity, Modal
} from 'react-native';
import { AdMobInterstitial } from 'expo';
import { convertScore, getScore } from '../helpers';
// import helpers from '../helpers';
import Set from './Set';
import Card from './Card';

const BACK = require('../assets/images/back.jpg');

const TIMERLENGTH = 5;
// const INTERID = 'ca-app-pub-1898056984576377/7283699049';
const INTERID = 'ca-app-pub-1425926517331745/1141181467'; /////// Test ID

export default class Game extends React.Component {
  mounted = false;

  constructor(props) {
    super(props);

    AdMobInterstitial.setAdUnitID(INTERID);
    AdMobInterstitial.setTestDeviceID('EMULATOR');
    AdMobInterstitial.addEventListener('interstitialDidClose', () => { // Might need fixed for Android
      const { gameOver } = this.state;
      if (gameOver) {
        this.quit();
      } else {
        this.initializeHands();
      }
    });

    // AdMobInterstitial.addEventListener("adFailedToLoad", () => {
    //   //logic if ad have failed to load
    // });

    const { hands } = this.props;

    const deck = ['c2', 'd2', 'h2', 's2', 'c3', 'd3', 'h3', 's3', 'c4', 'd4', 'h4', 's4', 'c5', 'd5', 'h5', 's5',
      'c6', 'd6', 'h6', 's6', 'c7', 'd7', 'h7', 's7', 'c8', 'd8', 'h8', 's8', 'c9', 'd9', 'h9', 's9',
      'c10', 'd10', 'h10', 's10', 'cj', 'dj', 'hj', 'sj', 'cq', 'dq', 'hq', 'sq', 'ck', 'dk', 'hk', 'sk',
      'ca', 'da', 'ha', 'sa'].shuffle();

    const playerSet = [];
    const computerSet = [];
    let card;

    let i = 0;
    while (i < hands) {
      const playerHand = [];
      const computerHand = [];
      let j = 0;
      while (j < 2) {
        card = deck.pop();
        playerHand.push(card);
        card = deck.pop();
        computerHand.push(card);
        j += 1;
      }
      playerSet.push(playerHand);
      computerSet.push(computerHand);
      i += 1;
    }

    const playersTurn = (Math.floor(Math.random() * 2) === 0);

    this.state = {
      addCounter: 1,
      deck, // Remaining cards
      playerSet, // Set of player hands
      computerSet, // Set of computer hands
      card: '', // flipped card
      playerScore: 0,
      computerScore: 0,
      lastRoundScore: 0,
      hit: false,
      stay: false,
      playersTurn,
      stayCounter: 0,
      pass: true,
      computerTimer: TIMERLENGTH,
      gameOver: false,
      computerFeedbackVisible: false,
    };
  }

  /*
  ----------------------------------------------------------------
  Lifecycle Methods
  ----------------------------------------------------------------
  */

  componentDidMount() {
    const { playersTurn } = this.state;
    const { players } = this.props;
    this.mounted = true;
    if (players === 1) {
      if (playersTurn) {
        this.automatePlayer();
      }
      this.computersTurn();
    }
  }

  componentDidUpdate() {
    const { playersTurn } = this.state;
    const { players } = this.props;
    this.gameOver();
    if (players === 1) {
      if (playersTurn) {
        this.automatePlayer();
      }
      this.computersTurn();
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  /*
  ----------------------------------------------------------------
  General Game Methods
  ----------------------------------------------------------------
  */

  addCard = () => {
    let { playersTurn } = this.state;
    const { deck, playerSet, computerSet } = this.state;
    let { computerFeedbackVisible } = this.state;
    const { players, hands } = this.props;
    let hit = true;
    let computerTimer = TIMERLENGTH;
    const card = deck.pop();
    if (hands === 1 && players === 1) {
      if (playersTurn) {
        playerSet[0].push(card);
        playersTurn = !playersTurn;
        hit = false;
      } else {
        computerFeedbackVisible = true;
        computerTimer = 2;
      }
    } else if (!playersTurn && players === 1) {
      computerTimer = 2;
      computerFeedbackVisible = true;
    }
    this.setState({
      card,
      hit,
      stay: false,
      deck,
      playerSet,
      computerSet,
      playersTurn,
      stayCounter: 0,
      computerTimer,
      computerFeedbackVisible,
    });
  }

  flipCard = (card) => {
    const { pass, hit, playersTurn } = this.state;
    const { hands, players } = this.props;
    if (hit) {
      let locked = false;
      let pos = 0;
      if (!playersTurn && players === 1) {
        pos = -1.25;
        locked = true;
      }
      return (
        <Card
          card={card}
          type="play"
          dropArea={zone => this.cardDropped(zone)}
          pos={pos}
          locked={locked}
          hands={hands}
          zones={this.legalZones()}
          pass={players === 2 ? pass : false}
        />
      );
    }
    return null;
  }

  gameOver = () => {
    const {
      playerScore, computerScore, lastRoundScore, gameOver
    } = this.state;
    const { players } = this.props;
    if (playerScore >= 50 && !gameOver) {
      let title = 'Game Won';
      let message = `Player wins round by a score of ${lastRoundScore} and game with a score of ${playerScore}`;
      if (players === 2) {
        title = 'Player 1 Won';
        message = `Player 1 wins round by a score of ${lastRoundScore} and game with a score of ${playerScore}`;
      }
      Alert.alert(
        title,
        message,
        [
          { Text: 'Home', onPress: () => this.openInterstitial() }
        ],
        { cancelable: false }
      );
      this.setState({
        gameOver: true,
      });
    }
    if (computerScore >= 50 && !gameOver) {
      this.openInterstitial();
      let title = 'Game Lost';
      let message = `Computer wins round by a score of ${lastRoundScore} and game with a score of ${computerScore}`;
      if (players === 2) {
        title = 'Player 2 Won';
        message = `Player 2 wins round by a score of ${lastRoundScore} and game with a score of ${computerScore}`;
      }
      Alert.alert(
        title,
        message,
        [
          { Text: 'Home', onPress: () => this.openInterstitial() }
        ],
        { cancelable: false }
      );
      this.setState({
        gameOver: true,
      });
    }
  }

  endRound = () => {
    const { addCounter } = this.state;
    if (addCounter % 4 === 0) {
      this.openInterstitial();
    } else {
      this.initializeHands();
    }
  }

  openInterstitial = async () => {
    await AdMobInterstitial.requestAdAsync();
    await AdMobInterstitial.showAdAsync();
  };

  initializeHands = () => {
    const { addCounter } = this.state;
    const { hands } = this.props;

    const updatedDeck = ['c2', 'd2', 'h2', 's2', 'c3', 'd3', 'h3', 's3', 'c4', 'd4', 'h4', 's4', 'c5', 'd5', 'h5', 's5',
      'c6', 'd6', 'h6', 's6', 'c7', 'd7', 'h7', 's7', 'c8', 'd8', 'h8', 's8', 'c9', 'd9', 'h9', 's9',
      'c10', 'd10', 'h10', 's10', 'cj', 'dj', 'hj', 'sj', 'cq', 'dq', 'hq', 'sq', 'ck', 'dk', 'hk', 'sk',
      'ca', 'da', 'ha', 'sa'].shuffle();
    const playerSet = [];
    const computerSet = [];
    let card;

    let i = 0;
    while (i < hands) {
      const playerHand = [];
      const computerHand = [];
      let j = 0;
      while (j < 2) {
        card = updatedDeck.pop();
        playerHand.push(card);
        card = updatedDeck.pop();
        computerHand.push(card);
        j += 1;
      }
      playerSet.push(playerHand);
      computerSet.push(computerHand);
      i += 1;
    }

    const playersTurn = (Math.floor(Math.random() * 2) === 0);

    this.setState({
      addCounter: addCounter + 1,
      deck: updatedDeck,
      playerSet,
      computerSet,
      lastRoundScore: 0,
      hit: false,
      stay: false,
      playersTurn,
      stayCounter: 0,
      pass: true,
      computerTimer: TIMERLENGTH,
      gameOver: false,
      computerFeedbackVisible: false,
    });
  }

  scoreboard = () => {
    const { playersTurn, playerScore, computerScore } = this.state;
    const { players } = this.props;
    const scores = [];

    scores.push(
      <View style={{ flex: 1 }} />
    );
    if (playersTurn) {
      scores.push(
        <View style={{ flex: 1, justifyContent: 'flex-end', padding: '4%' }} key={1}>
          <Text style={styles.score}>{(players === 1 ? 'Computer' : 'Player 2')}</Text>
          <Text style={styles.score}>{`Score: ${computerScore}`}</Text>
        </View>
      );
      scores.push(
        <View style={{ flex: 1, padding: '4%' }} key={2}>
          <Text style={styles.scoreHighlighted}>{(players === 1 ? 'PLAYER' : 'PLAYER 1')}</Text>
          <Text style={styles.score}>{`Score: ${playerScore}`}</Text>
        </View>
      );
    } else {
      scores.push(
        <View style={{ flex: 1, justifyContent: 'flex-end', padding: '4%' }} key={1}>
          <Text style={styles.scoreHighlighted}>{(players === 1 ? 'COMPUTER' : 'PLAYER 2')}</Text>
          <Text style={styles.score}>{`Score: ${computerScore}`}</Text>
        </View>
      );
      scores.push(
        <View style={{ flex: 1, padding: '4%' }} key={2}>
          <Text style={{ color: 'white', textAlign: 'right', fontSize: 20 }}>{(players === 1 ? 'Player' : 'Player 1')}</Text>
          <Text style={{ color: 'white', textAlign: 'right', fontSize: 20 }}>{`Score: ${playerScore}`}</Text>
        </View>
      );
    }
    scores.push(
      <View style={{ flex: 1 }} />
    );
    return scores;
  }

  stay = () => {
    let { computerTimer, stay } = this.state;
    const { playersTurn, stayCounter } = this.state;
    if (playersTurn) {
      computerTimer = TIMERLENGTH;
      stay = false;
    } else {
      computerTimer = 0;
      stay = true;
    }
    if (stayCounter === 1) { // End game
      computerTimer = 0;
      setTimeout(() => { this.updateScore(); }, 1000); // Make sure this is long enough
      this.setState({
        stayCounter: stayCounter + 1,
        computerTimer,
      });
    } else { // End turn
      this.setState({
        playersTurn: !playersTurn,
        stayCounter: stayCounter + 1,
        pass: true,
        computerTimer,
        stay,
        computerFeedbackVisible: false,
      });
    }
  }

  updateScore = () => {
    let { playerScore, computerScore } = this.state;
    const { playerSet, computerSet } = this.state;
    const { players } = this.props;

    let i = 0;
    let player = 0;
    let computer = 0;
    const pScores = [];
    const cScores = [];
    while (i < playerSet.length) {
      pScores[i] = getScore(playerSet[i]);
      if (pScores[i] > 21) {
        pScores[i] = -10;
      }
      cScores[i] = getScore(computerSet[i]);
      if (cScores[i] > 21) {
        cScores[i] = -10;
      }
      i += 1;
    }

    pScores.sort((a, b) => a - b);
    cScores.sort((a, b) => a - b);

    let j = 0;
    while (j < pScores.length) {
      if (pScores[j] === -10 && cScores[j] === -10) {
        player += 0;
      } else if (pScores[j] === -10) {
        player -= 10;
      } else if (cScores[j] === -10) {
        computer -= 10;
      } else if (pScores[j] > cScores[j]) {
        player += pScores[j] - cScores[j];
      } else {
        computer += cScores[j] - pScores[j];
      }
      j += 1;
    }

    let lastRoundScore = 0;
    let title = '';
    let message = '';

    if (player > computer) {
      playerScore += player - computer;
      lastRoundScore = player - computer;
      if (players === 1) {
        title = 'Round Won';
        message = `Player Wins by ${player - computer}`;
      } else {
        title = 'Player 1 Won Round';
        message = `Player 1 Wins by ${player - computer}`;
      }
    } else if (computer > player) {
      computerScore += computer - player;
      lastRoundScore = computer - player;
      if (players === 1) {
        title = 'Round Lost';
        message = `Computer Wins by ${computer - player}`;
      } else {
        title = 'Player 2 Won Round';
        message = `Player 2 Wins by ${computer - player}`;
      }
    } else {
      title = 'Draw';
      if (players === 1) {
        message = 'Player and Computer Tie';
      } else {
        message = 'Player 1 and Player 2 Tie';
      }
    }

    if (playerScore < 50 && computerScore < 50) {
      Alert.alert(
        title,
        message,
        [
          { Text: 'Next Round', onPress: () => this.endRound() }
        ],
        { cancelable: false }
      );
    }

    this.setState({
      playersTurn: true, ///////
      playerScore,
      computerScore,
      lastRoundScore,
      computerFeedbackVisible: false,
    });
  }

  quit = () => {
    const { quit } = this.props;
    clearInterval(this.computerTimer);
    quit();
  }

  /*
  ----------------------------------------------------------------
  Player Methods
  ----------------------------------------------------------------
  */

  automatePlayer = () => {
    if ((this.playerBusted())) {
      this.stay();
    }
  }

  cardDropped = (zone) => {
    const {
      playerSet, computerSet, card, playersTurn
    } = this.state;
    const { players } = this.props;
    let hand = [];
    if (!playersTurn && players === 2) {
      hand = computerSet[zone - 1];
      hand.push(card);
      computerSet[zone - 1] = hand;
    } else {
      hand = playerSet[zone - 1];
      hand.push(card);
      playerSet[zone - 1] = hand;
    }
    this.setState({
      playerSet,
      computerSet,
      hit: false,
      playersTurn: !playersTurn,
      pass: true,
    });
  }

  legalZones = () => {
    let { playerSet, computerSet } = this.state;
    const { playersTurn } = this.state;
    const { players } = this.props;
    let temp = [];
    if (!playersTurn && players === 2) {
      temp = playerSet;
      playerSet = computerSet;
      computerSet = temp;
    }
    const zones = [];
    let i = 0;
    while (i < playerSet.length) {
      if (getScore(playerSet[i]) > 21) {
        zones[i] = false;
      } else {
        zones[i] = true;
      }
      i += 1;
    }
    return zones;
  }

  passDevice = () => {
    const { players } = this.props;
    const { playersTurn, pass } = this.state;
    if (players === 2 && pass) {
      Alert.alert(
        `Player ${playersTurn ? 1 : 2}'s Turn`,
        `Pass device to player ${playersTurn ? 1 : 2}`,
        [
          { Text: 'Start Turn', onPress: () => this.passed() }
        ],
        { cancelable: false }
      );
    }
  }

  passed = () => {
    this.setState({
      pass: false,
    });
  }

  playerBusted = () => {
    let busted = true;
    let { playerSet, computerSet } = this.state;
    const { playersTurn } = this.state;
    const { players } = this.props;
    let temp = [];
    if (!playersTurn && players === 2) {
      temp = playerSet;
      playerSet = computerSet;
      computerSet = temp;
    }
    let i = 0;
    while (i < playerSet.length && busted === true) {
      if (getScore(playerSet[i]) < 21) {
        busted = false;
      }
      i += 1;
    }
    return busted;
  }

  /*
  ----------------------------------------------------------------
  Computer Methods
  ----------------------------------------------------------------
  */

  computerShouldHit = (lowest) => {
    const { deck } = this.state;
    const { difficulty } = this.props;
    let hit = false;
    if (difficulty === 1) {
      if (Math.floor(Math.random() * 2) === 0 && lowest < 21) {
        hit = true;
      }
    } else if (difficulty === 2) {
      let counter = 0;
      let i = 0;
      while (i < deck.length) {
        let current = convertScore(deck[i]);
        if (current === 11) {
          current = 1;
        }
        if ((lowest + current) <= 21) {
          counter += 1;
        }
        i += 1;
      }
      if ((counter / deck.length) > 0.5) {
        hit = true;
      }
    } else if (difficulty === 3) {
      if (lowest <= 13) {
        hit = true;
      }
    } else {
      let current = convertScore(deck[deck.length - 1]);
      if (current === 11) {
        current = 1;
      }
      if ((lowest + current) <= 21) {
        hit = true;
      }
    }
    return hit;
  }

  computerHit = () => {
    let { computerSet } = this.state;
    const { card } = this.state;
    computerSet = this.computerDropCard(computerSet, card);
    this.setState({
      computerSet,
      hit: false,
      computerTimer: 0,
      playersTurn: true,
      computerFeedbackVisible: false,
    });
  }

  computerHandScores = () => {
    const { computerSet } = this.state;
    const scores = [];
    let i = 0;
    while (i < computerSet.length) {
      const hand = computerSet[i];
      const aces = this.numberOfAces(hand);
      const currentScore = getScore(hand);
      scores.push(currentScore);
      if (aces > 0) {
        let altScore = 0;
        let j = 0;
        while (j < hand.length) {
          let value = convertScore(hand[j]);
          if (value === 11) {
            value = 1;
          }
          altScore += value;
          j += 1;
        }
        scores.push(altScore);
      }
      i += 1;
    }
    scores.sort((a, b) => a - b);
    return scores;
  }

  computerHitOrStay = () => {
    const { computerTimer, stayCounter, hit } = this.state;
    const scores = this.computerHandScores();
    if (computerTimer === TIMERLENGTH - 2) {
      if (this.computerShouldHit(scores[0])) {
        this.addCard();
      } else {
        this.setState({
          computerTimer: 2,
          stay: stayCounter === 0,
          computerFeedbackVisible: stayCounter === 0,
        });
      }
    } else if (hit) {
      this.computerHit();
    } else {
      this.stay();
    }
  }

  computerDropCard = (set, card) => {
    let hand = [];
    let best = -100;
    let index = 0;
    let i = 0;
    while (i < set.length) {
      // TODO: Which bust to take (22 vs 25 vs 30)
      hand = set[i];
      hand.push(card);
      const score = 21 - getScore(hand);
      hand.pop();
      if ((best < 0 && score > best) || (best > 0 && score > 0 && score < best)) {
        best = score;
        index = i;
      }
      i += 1;
    }
    set[index].push(card);
    return set;
  }

  computersTurn = () => {
    const { computerTimer, playersTurn } = this.state;
    const { players } = this.props;
    if (computerTimer <= 0) {
      clearInterval(this.computerTimer);
    }
    if (!playersTurn && players === 1) {
      if (computerTimer === TIMERLENGTH) {
        this.computerTimer = setInterval(
          () => this.setState(prevState => ({
            computerTimer: prevState.computerTimer - 1,
          })), 1000
        );
      } else if (computerTimer === TIMERLENGTH - 2) {
        this.computerHitOrStay();
      } else if (computerTimer === TIMERLENGTH - 4) {
        this.computerHitOrStay();
      }
    }
  }

  numberOfAces = (hand) => {
    let aces = 0;
    if (hand.includes('sa')) {
      aces += 1;
    }
    if (hand.includes('ca')) {
      aces += 1;
    }
    if (hand.includes('ha')) {
      aces += 1;
    }
    if (hand.includes('da')) {
      aces += 1;
    }
    return aces;
  }

  /*
  ----------------------------------------------------------------
  Render Method
  ----------------------------------------------------------------
  */

  render() {
    let { playerSet, computerSet } = this.state;
    const {
      pass, hit, card, playersTurn, computerFeedbackVisible, stay, stayCounter
    } = this.state;
    const { hands, players } = this.props;
    const transparent = true;
    let temp = [];
    if (!playersTurn && players === 2) {
      temp = playerSet;
      playerSet = computerSet;
      computerSet = temp;
    }
    return (
      <View style={styles.container}>
        <Modal
          animationType="fade"
          transparent={transparent}
          visible={computerFeedbackVisible}
        >
          <TouchableOpacity style={{ flex: 1, width: '100%' }} onPress={() => this.setState({ computerFeedbackVisible: false })}>
            <Text style={{
              alignSelf: 'center', top: '48%', color: 'white', fontSize: 25
            }}
            >
              {stay ? 'Stay' : null}
            </Text>
          </TouchableOpacity>
        </Modal>
        <Set
          set={computerSet}
          type="comp"
          turnComplete={!hit}
          numHands={hands}
          endRound={stayCounter >= 2}
          pass={players === 2 ? pass : false}
        />
        <View style={styles.pannel}>
          <View style={{ flex: 2, flexDirection: 'row' }}>
            <View style={styles.buttons}>
              <TouchableOpacity style={{ width: '100%' }} onPress={() => { this.stay(); }} disabled={hit || (players === 2 ? false : !playersTurn)}>
                <Text style={[styles.button, { backgroundColor: 'blue', opacity: (hit || (players === 2 ? false : !playersTurn)) ? 0.5 : 1 }]}>Stay</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ width: '100%' }} onPress={() => { this.quit(); }}>
                <Text style={[styles.button, { backgroundColor: 'black' }]}>Quit</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 0.5 }} />
            <View style={{ flex: 4, justifyContent: 'center', alignItems: 'center', }}>
              <Text style={{
                color: 'white', fontSize: 20, fontWeight: 'bold', position: 'absolute', alignSelf: 'center', top: '-20%'
              }}
              >
                {(this.playerBusted() || hit || (players === 2 ? false : !playersTurn)) ? null : 'Hit'}
              </Text>
              <TouchableOpacity style={{ width: '100%' }} onPress={() => { this.addCard(); }} disabled={this.playerBusted() || hit || (players === 2 ? false : !playersTurn)}>
                <Image
                  style={{
                    opacity:
                      (this.playerBusted() || hit || (players === 2 ? false : !playersTurn))
                        ? 0.5 : 1
                  }}
                  source={BACK}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {this.flipCard(card)}
          </View>
          <View style={styles.scoreboard}>
            {this.scoreboard()}
          </View>
        </View>
        <Set
          set={playerSet}
          type="play"
          turnComplete={!hit}
          numHands={hands}
          pass={players === 2 ? pass : false}
        />
        {this.passDevice()}
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
    fontSize: 20,
    fontWeight: 'bold',
    overflow: 'hidden',
    padding: 12,
    textAlign: 'center',
  },

  container: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
  },

  pannel: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },

  buttons: {
    flex: 4,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  scoreboard: {
    flexDirection: 'column',
    flex: 2,
    justifyContent: 'center',
  },

  score: {
    color: 'white',
    textAlign: 'right',
    fontSize: 18,
  },

  scoreHighlighted: {
    color: 'yellow',
    textAlign: 'right',
    fontSize: 25,
  },

  triangle: {
    justifyContent: 'flex-end',
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 45,
    borderRightWidth: 70,
    borderBottomWidth: 45,
    borderLeftWidth: 70,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },

});
