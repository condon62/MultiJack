import React from 'react';
import { StyleSheet, View, Image, PanResponder, Animated } from 'react-native';
import images from './assets/images/images.js';

export default class Card extends React.Component {
  
  constructor() {
    super();
    
    this.state = {
      showDraggable: true,
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
        if (this.isDropArea(gesture)) {
          this.props.dropped(true);
          Animated.timing(this.state.opacity, {
          toValue: 0,
          duration: 1000
          }).start(() =>
            this.setState({
              showDraggable: false
            })
          );
        } else {
          Animated.spring(this.state.pan, {
            toValue: { x: 0, y: 0 },
            friction: 5
          }).start();
        }
      }
    });
  }

  isDropArea(gesture) {
    return gesture.moveY < 700 && gesture.moveY > 500;
  }
  
  render() {

    let { pan } = this.state;
    let [translateX, translateY] = [pan.x, pan.y];
    let imageStyle = {transform: [{translateX}, {translateY}]};
    return (
      <View style={styles.container}>
        <Animated.View style={imageStyle} {...this._panResponder.panHandlers}>
          <Image source={images[this.props.card]} style={{top: this.props.pos,}} />
        </Animated.View>
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