import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TouchableHighlight, Modal } from 'react-native';

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
    let { category } = this.state;
    let categories = ['Scoring', 'Modes', 'Players', 'Difficulties'];
    let buttons = categories.map((cat) => 
      <TouchableOpacity onPress={() => {this.switchCategory(categories.indexOf(cat))}} disabled={categories.indexOf(cat) == category} key={categories.indexOf(cat)}>
        <Text style={[styles.button, {backgroundColor: 'black', opacity: categories.indexOf(cat) == category ? 1 : 0.5}]}>{cat}</Text>
      </TouchableOpacity> 
    );
    return buttons;
  }

  categoryInformation = () => {
    let { category } = this.state;
    let text = [];
    if (category == 0) {
      text.push(
        <Text style={{fontSize: 50, fontWeight: 'bold', color: 'black'}} key={1}>Scoring</Text>
      );
    } else if (category == 1) {
      text.push(
        <Text style={{fontSize: 50, fontWeight: 'bold', color: 'black'}} key={2}>Modes</Text>
      );
    } else {
      text.push(
        <Text key={3}>Hello World!</Text>
      );
    }
    return text;
  }

  render() {
    return (
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.props.visible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={styles.container}>
            <View style={{flex: 3}}>
              {this.categoryButtons()}
              <TouchableOpacity onPress={() => {this.props.close()}}>
                <Text style={[styles.button, {backgroundColor: 'red'}]}>Return</Text>
              </TouchableOpacity> 
            </View>
            <View style={{flex: 7}}>
              {this.categoryInformation()}
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
    textAlign:'center',
  },

  container: {
    width: '100%',
    flexDirection: 'row',
    marginTop: '12%',
  },
});