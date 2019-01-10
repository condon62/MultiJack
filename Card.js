import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import images from './assets/images/images.js';

export default class Card extends React.Component {
  
  constructor() {
    super();
		
	}
  
    render() {
        return (
            <View style={styles.container}>
                <Image source={images[this.props.card]} style={{top: this.props.pos,}} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        position: 'absolute',
		flexDirection: 'row',
  },
});