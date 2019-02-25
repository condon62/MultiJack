import React from 'react';
import {
  StyleSheet, View, Image, PanResponder, Animated
} from 'react-native';
import images from '../assets/images/images';

const BACK = require('../assets/images/back.jpg');

export default class Card extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pan: new Animated.ValueXY(),
    };

    const { pan } = this.state;

    this.panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,

      // Initially, set the value of x and y to 0 (the center of the screen)
      onPanResponderGrant: () => {
        // Set the initial value to the current state
        pan.setOffset({ x: pan.x._value, y: pan.y._value });
        pan.setValue({ x: 0, y: 0 });
      },

      // When we drag/pan the object, set the delate to the states pan position
      onPanResponderMove: Animated.event([
        null, { dx: pan.x, dy: pan.y },
      ]),

      onPanResponderRelease: (e, gesture) => {
        const { hands, dropArea } = this.props;
        pan.flattenOffset();
        const area = this.getDropArea(gesture);
        if (area <= hands && gesture.moveY > 500) {
          dropArea(area);
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            friction: 5
          }).start();
        }
      }
    });
  }

  getDropArea = (gesture) => {
    const { hands, zones } = this.props;
    const start = 40;
    const interval = 300 / hands;
    let dropArea = hands + 1;

    let i = 1; // Initialize dropzone
    while (i <= hands && dropArea === hands + 1) { // For all drop zones
      let upper = start + interval * i; // Current dropzone upper extreme
      let lower = upper - interval; // Current dropzone lower extreme
      if (i === 1) { // Extend lower extreme for first zone
        lower -= interval;
      }
      if (i === hands) { // Extend upper extreme for last zone
        upper += interval;
      }
      // If x position in current dropzone and dropzone is legal (not busted)
      if (gesture.moveX < upper && gesture.moveX > lower && zones[i - 1] === true) {
        dropArea = i;
      }
      i += 1;
    }
    return dropArea;
  }

  isAnimated = () => {
    const {
      locked, type, pos, endRound, score, pass, card
    } = this.props;
    let cardBlock;
    if (locked === true) {
      if ((type === 'play' || pos > 0 || endRound) && !pass) {
        if (score > 21 && (type === 'play' || endRound)) {
          cardBlock = (
            <View>
              <Image source={images[card]} style={{ top: `${25 + pos * 20}%`, opacity: 0.5 }} />
            </View>
          );
        } else {
          cardBlock = (
            <View>
              <Image source={images[card]} style={{ top: `${25 + pos * 20}%` }} />
            </View>
          );
        }
      } else {
        cardBlock = (
          <View>
            <Image source={BACK} style={{ top: `${25 + pos * 20}%`, }} />
          </View>
        );
      }
    } else {
      const { pan } = this.state;
      const [translateX, translateY] = [pan.x, pan.y];
      const imageStyle = { transform: [{ translateX }, { translateY }] };
      cardBlock = (
        <Animated.View style={imageStyle} {...this.panResponder.panHandlers}>
          <Image source={images[card]} style={{ top: pos }} />
        </Animated.View>
      );
    }
    return cardBlock;
  }

  render() {
    return (
      <View style={styles.container}>
        {this.isAnimated()}
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
