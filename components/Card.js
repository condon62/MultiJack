import React from 'react';
import { StyleSheet, View, Image, PanResponder, Animated } from 'react-native';
import images from '../assets/images/images.js';

export default class Card extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      dropAreaValues: null,
      pan: new Animated.ValueXY(),
      opacity: new Animated.Value(1)
    };

    this._panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
  
      // Initially, set the value of x and y to 0 (the center of the screen)
      onPanResponderGrant: (e, gestureState) => {
        // Set the initial value to the current state
        this.state.pan.setOffset({x: this.state.pan.x._value, y: this.state.pan.y._value});
        this.state.pan.setValue({x: 0, y: 0});
      },
  
      // When we drag/pan the object, set the delate to the states pan position
      onPanResponderMove: Animated.event([
        null, {dx: this.state.pan.x, dy: this.state.pan.y},
      ]),
  
      onPanResponderRelease: (e, gesture) => {
        this.state.pan.flattenOffset();
        let dropArea = this.getDropArea(gesture);
        if (dropArea <= this.props.hands && gesture.moveY < 700 && gesture.moveY > 500) {
          this.props.dropArea(dropArea);
        } else {
          Animated.spring(this.state.pan, {
            toValue: { x: 0, y: 0 },
            friction: 5
          }).start();
        }
      }
    });
  }

  getDropArea = (gesture) => {
    const start = 40;
    const end = 340;
    const interval = 300 / this.props.hands;
    let dropArea = this.props.hands + 1;

    let i = 1; // Initialize dropzone
    while (i <= this.props.hands && dropArea == this.props.hands + 1) { // For all drop zones
      let upper = start + interval * i; // Current dropzone upper extreme
      let lower = upper - interval; // Current dropzone lower extreme
      if (i == 1) { // Extend lower extreme for first zone
        lower -= interval;
      }
      if (i == this.props.hands) { // Extend upper extreme for last zone 
        upper += interval;
      }
      if (gesture.moveX < upper && gesture.moveX > lower && this.props.zones[i - 1] == true) { // If x position in current dropzone and dropzone is legal (not busted)
        dropArea = i;
      }
      i++;
    }
    return dropArea;
  }

  isAnimated = () => {
    if (this.props.locked == true) {
      if (this.props.type == 'play' || this.props.pos > 0 || this.props.endRound) {
        if (this.props.score > 21 && (this.props.type == 'play' || this.props.endRound)) {
          return (
            <View>
              <Image source={images[this.props.card]} style={{top: `${this.props.pos * 20}%`, opacity: 0.5}} />
            </View>
          );
        } else {
          return (
            <View>
              <Image source={images[this.props.card]} style={{top: `${this.props.pos * 20}%`}} />
            </View>
          );
        }
      } else {
        return (
          <View>
            <Image source={require('../assets/images/back.jpg')} style={{top: `${this.props.pos * 20}%`,}} />
          </View>
        );
      }
    } else {
      let { pan } = this.state;
      let [translateX, translateY] = [pan.x, pan.y];
      let imageStyle = {transform: [{translateX}, {translateY}]};
      return (
        <Animated.View style={imageStyle} {...this._panResponder.panHandlers}>
          <Image source={images[this.props.card]} style={{top: this.props.pos}} />
        </Animated.View>
      );
    }
  }
  
  render() {
    return (
      <View style={styles.container}>
        {this.isAnimated()}
      </View>
    );
  }
}

let CIRCLE_RADIUS = 30;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    position: 'absolute',
    flexDirection: 'row',
  },
});