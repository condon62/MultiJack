import React from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import images from './assets/images/images.js';
import Card from './Card';

export default class Hand extends React.Component {
  
  constructor() {
    super();
        this.state = {
            score : 0,
        };
    }

    convertScore = (str) => {
        let value = 0;
        switch (str.substring(1)) {
            case 'j':
                value = 10;
                break;
            case 'q':
                value = 10;
                break;
            case 'k':
                value = 10;
                break;
            case 'a':
                value = 11;
                break;
            default:
                value = parseInt(str.substring(1));
        }
        return value;
    }
    
    getScore = () => {
        let score = 0;
        let i = 0;
        while(i < this.props.hand.length) {
            score += this.convertScore(this.props.hand[i]);
            i++;
        }
        if(this.props.hand.includes('as') || this.props.hand.includes('ah') || this.props.hand.includes('ad') || this.props.hand.includes('ac')) {
            // TODO:
        }
        return score;
    }

    addCard = (type) => {
        		let deckTemp = this.state.deck;
        		let card = deckTemp.pop();
        		let cardsTemp;
        		if (type == "player") {
        			cardsTemp = this.state.playerCards;
        		} else {
        			cardsTemp = this.state.computerCards;
        		}
        		cardsTemp.push(card);
        		const handTemp = cardsTemp.map((card) => <Image source={images[card]} />);
          }

    addCards = () => {
        const hand = this.props.hand.map((card) => <Card card={card} pos={`${this.props.hand.indexOf(card) * 27}%`} key={this.props.hand.indexOf(card)} />);
        return hand;
    }
  
    render() {
        const pos1 = '0%';
        const pos2 = '28%';
        return (
            <View style={styles.container}>
                {this.addCards()}
                <Text style={{position: 'absolute', bottom:'0%', color: 'white'}}>{this.getScore()}</Text> 
            </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
		flex: 1,
        width: '100%',
        height: '33%',
		backgroundColor: 'blue',
        alignItems: 'center',
        justifyContent: 'flex-start',
		flexDirection: 'column',
  },
});