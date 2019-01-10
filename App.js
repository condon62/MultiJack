import React from 'react';
import { StyleSheet, Text, View, Image, Button } from 'react-native';
import helpers from './helpers';
import images from './assets/images/images.js';
import Hand from './Hand';

export default class App extends React.Component {
  
  constructor() {
    super();

		this.state = {
			deck: ['c2', 'd2', 'h2', 's2', 'c3', 'd3', 'h3', 's3', 'c4', 'd4', 'h4', 's4', 'c5', 'd5', 'h5', 's5',
					'c6', 'd6', 'h6', 's6', 'c7', 'd7', 'h7', 's7', 'c8', 'd8', 'h8', 's8', 'c9', 'd9', 'h9', 's9',
					'c10', 'd10', 'h10', 's10', 'cj', 'dj', 'hj', 'sj', 'cq', 'dq', 'hq', 'sq', 'ck', 'dk', 'hk', 'sk',
					'ca', 'da', 'ha', 'sa'].shuffle(),
			// playerCards: [],
			playerHand: [],
			// computerCards: [],
			computerHand: [],
    };
		
		// let i = 0;
		// while (i < 4) {
		// 	this.addCard("player");
		// 	this.addCard("computer");
		// 	i++;
		// }
  }
  
  componentWillMount() {
    let updatedDeck = this.state.deck;
    let updatedPlayerHand = [];
    let updatedComputerHand = [];
    let card;
    let i = 0;
    while(i < 2) {
      card = updatedDeck.pop();
      console.log(card);
      updatedPlayerHand.push(card);
      card = updatedDeck.pop();
      updatedComputerHand.push(card);
      i++;
    }
    
    this.setState({
      deck: updatedDeck,
      playerHand: updatedPlayerHand,
      computerHand: updatedComputerHand,
    });
  }
	
	updateHands = (type) => {
		if (type == "player") {
			
			this.setState({
				deck: deckTemp,
				playerCards: cardsTemp,
				playerHand: handTemp,
			});
		} else {
			this.setState({
				deck: deckTemp,
				computerCards: cardsTemp,
				computerHand: handTemp,
			});
		}
	}

//   addCard = (type) => {
// 		let deckTemp = this.state.deck;
// 		let card = deckTemp.pop();
// 		let cardsTemp;
// 		if (type == "player") {
// 			cardsTemp = this.state.playerCards;
// 		} else {
// 			cardsTemp = this.state.computerCards;
// 		}
// 		cardsTemp.push(card);
// 		const handTemp = cardsTemp.map((card) => <Image source={images[card]} />);
//   }

	addCard = (hand) => {
    let updatedDeck = this.state.deck;
    let card = updatedDeck.pop();
    console.log('card: ' + card);
    hand.push(card);
    
    this.setState({
      deck: updatedDeck,
      playerHand: hand,
    });
  }
  
  render() {
    console.log('deck size: ' + this.state.deck.length);
    playerHand = this.state.playerHand;
    computerHand = this.state.computerHand;
    return (
      <View style={styles.container}>
        <Hand hand={computerHand} />
        <View style={styles.buttons}>
          <Button
            onPress={() => {this.addCard(playerHand)}}
            title='Hit'
            color='red'
          />
        </View>
        <Hand hand={playerHand} />
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
		width: '100%',
		backgroundColor: 'yellow',
		justifyContent: 'center',
		alignItems: 'center',
  },
});
