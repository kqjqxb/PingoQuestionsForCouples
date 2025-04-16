import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Keyboard,
  Dimensions,
  SafeAreaView,
  TouchableWithoutFeedback,
  Text,
} from 'react-native';
import GradientText from '../components/GradientText';

import LinearGradient from 'react-native-linear-gradient';
import PingoSettingsScreen from './PingoSettingsScreen';
import PingoHowToPlayScreen from './PingoHowToPlayScreen';
import PingoYourMomentsScreen from './PingoYourMomentsScreen';
import PingoGameScreen from './PingoGameScreen';

const pingoButtons = [
  {
    id: 1,
    pingoTitle: 'Start the game',
    pingoScreen: 'PingoGame',
  },
  {
    id: 2,
    pingoTitle: 'Settings',
    pingoScreen: 'PingoSettings',
  },
  {
    id: 3,
    pingoTitle: 'How to play?',
    pingoScreen: 'PingoRules',
  },
  {
    id: 4,
    pingoTitle: 'Your moments',
    pingoScreen: 'PingoMoments',
  },
]

const fontNunitoBlack = 'Nunito-Black';
const fontNunitoRegular = 'Nunito-Regular';

const PingoHomeScreen = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [selectedPingoScreen, setSelectedPingoScreen] = useState('Home');

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{
        backgroundColor: '#160002',
        width: '100%',
        height: dimensions.height,
        flex: 1,
      }}>
        <LinearGradient
          style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
          colors={['#FA199A', '#1A0C34']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
        {selectedPingoScreen === 'Home' ? (
          <SafeAreaView style={{
            flex: 1,
            alignItems: 'center',
          }}>
            <Image
              source={require('../assets/images/homeImage.png')}
              style={{
                width: dimensions.width * 0.65,
                height: dimensions.width * 0.65,
              }}
              resizeMode='contain'
            />

            <Text
              style={{
                paddingHorizontal: dimensions.width * 0.05,
                textAlign: 'center',
                color: 'white',
                fontSize: dimensions.width * 0.09,
                maxWidth: dimensions.width * 0.89,
                alignSelf: 'center',
                fontFamily: fontNunitoBlack,
                marginTop: dimensions.height * 0.02,
                textTransform: 'uppercase',
                marginBottom: dimensions.height * 0.02,
              }}>
              Welcome!
            </Text>

            {pingoButtons.map((oingoBtn) => (
              <TouchableOpacity
                key={oingoBtn.id}
                onPress={() => {
                  setSelectedPingoScreen(oingoBtn.pingoScreen);
                }}
                style={{
                  backgroundColor: 'white',
                  width: dimensions.width * 0.8,
                  height: dimensions.height * 0.09,
                  borderRadius: dimensions.width * 0.1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: dimensions.height * 0.01,
                }}>
                <GradientText
                  text={oingoBtn.pingoTitle}
                  style={{
                    paddingHorizontal: dimensions.width * 0.05,
                    textAlign: 'center',
                    fontSize: dimensions.width * 0.06,
                    maxWidth: dimensions.width * 0.89,
                    alignSelf: 'center',
                    fontFamily: fontNunitoBlack,
                    textTransform: 'uppercase',
                  }}
                  gradientColors={['#EF1895', '#1D0C35']}
                />
              </TouchableOpacity>
            ))}
          </SafeAreaView>
        ) : selectedPingoScreen === 'PingoSettings' ? (
          <PingoSettingsScreen setSelectedPingoScreen={setSelectedPingoScreen} selectedPingoScreen={selectedPingoScreen} />
        ) : selectedPingoScreen === 'PingoMoments' ? (
          <PingoYourMomentsScreen setSelectedPingoScreen={setSelectedPingoScreen} />
        ) : selectedPingoScreen === 'PingoGame' ? (
          <PingoGameScreen setSelectedPingoScreen={setSelectedPingoScreen} 
          />
        ) : selectedPingoScreen === 'PingoRules' ? (
          <PingoHowToPlayScreen setSelectedPingoScreen={setSelectedPingoScreen}  />
        ) : null}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default PingoHomeScreen;
