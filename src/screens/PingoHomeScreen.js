import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Keyboard,
  Dimensions,
  SafeAreaView,
  TouchableWithoutFeedback,
  Text,
} from 'react-native';
import DeepDiveAboutScreen from './DeepDiveAboutScreen';
import GradientText from '../components/GradientText';

import LinearGradient from 'react-native-linear-gradient';
import PingoSettingsScreen from './PingoSettingsScreen';
import DeepDiveShopScreen from './DeepDiveShopScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeepDiveGameScreen from './DeepDiveGameScreen';
import DeepDiveScoresScreen from './DeepDiveScoresScreen';

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
  const [selectedDeepDiveScreen, setSelectedDeepDiveScreen] = useState('Home');

  const styles = createDeepDiveStyles(dimensions);

  const [userFishesAmount, setUserFishesAmount] = useState(0);
  const [selectedFishesSkin, setSelectedFishSkin] = useState(1);

  const [isSoundEnabled, setSoundEnabled] = useState(true);
  const [backgroundMusic, setBackgroundMusic] = useState(true);

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
        {selectedDeepDiveScreen === 'Home' ? (
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
                  setSelectedDeepDiveScreen(oingoBtn.pingoScreen);
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
        ) : selectedDeepDiveScreen === 'AboutDeepDive' ? (
          <DeepDiveAboutScreen setSelectedDeepDiveScreen={setSelectedDeepDiveScreen} />
        ) : selectedDeepDiveScreen === 'PingoSettings' ? (
          <PingoSettingsScreen setSelectedDeepDiveScreen={setSelectedDeepDiveScreen} selectedDeepDiveScreen={selectedDeepDiveScreen} backgroundMusic={backgroundMusic} setBackgroundMusic={setBackgroundMusic} />
        ) : selectedDeepDiveScreen === 'Shop' ? (
          <DeepDiveShopScreen setSelectedDeepDiveScreen={setSelectedDeepDiveScreen} selectedDeepBackground={selectedDeepBackground} setSelectedDeepBackground={setSelectedDeepBackground} deepBackgrounds={deepBackgrounds} fishSkins={fishSkins} setSelectedFishSkin={setSelectedFishSkin} userFishesAmount={userFishesAmount} setUserFishesAmount={setUserFishesAmount} />
        ) : selectedDeepDiveScreen === 'DeepDiveGame' ? (
          <DeepDiveGameScreen setSelectedDeepDiveScreen={setSelectedDeepDiveScreen} selectedDeepBackground={selectedDeepBackground} setSelectedDeepBackground={setSelectedDeepBackground} deepBackgrounds={deepBackgrounds} fishSkins={fishSkins} setSelectedFishSkin={setSelectedFishSkin} userFishesAmount={userFishesAmount} setUserFishesAmount={setUserFishesAmount}
            isSoundEnabled={isSoundEnabled} setSoundEnabled={setSoundEnabled} selectedFishesSkin={selectedFishesSkin}
          />
        ) : selectedDeepDiveScreen === 'Score' ? (
          <DeepDiveScoresScreen setSelectedDeepDiveScreen={setSelectedDeepDiveScreen} userFishesAmount={userFishesAmount} setUserFishesAmount={setUserFishesAmount} />
        ) : null}
      </View>
    </TouchableWithoutFeedback>
  );
};

const createDeepDiveStyles = (dimensions) => StyleSheet.create({
  deepYellowOranGradient: {
    left: 0,
    right: 0,
    top: 0,
    position: 'absolute',
    zIndex: 0,
    shadowOpacity: 0.4,
    shadowColor: 'black',
    shadowRadius: dimensions.width * 0.03,
    elevation: 7,
    bottom: 0,
    shadowOffset: {
      width: dimensions.width * 0.002,
      height: dimensions.height * 0.01
    },
  },
  deepGradientButtonsStyles: {
    width: dimensions.width * 0.17,
    height: dimensions.width * 0.17,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  }
});

export default PingoHomeScreen;
