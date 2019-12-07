/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import ImagePicker from './src/components/ImagePicker';
import {
  Root
} from 'native-base';

class App extends React.Component{
  render() {
    return (
      <Root>
        <ImagePicker />
      </Root>
    );
  }
};


export default App;