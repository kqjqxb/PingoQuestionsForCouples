import React, { useState } from 'react';
import {
    View,
    Text,
    Dimensions,
    SafeAreaView,
    TouchableOpacity,
    Image,
} from 'react-native';
import { ChevronLeftIcon } from 'react-native-heroicons/solid';
import GradientText from '../components/GradientText';

const howToPlayText = `Choose a game mode: 
for two or online.

Throw the ball - it will decide who will answer the question.

If you don't answer, make a wish!

Save your game moments and watch them later.`

const fontNunitoBlack = 'Nunito-Black';
const fontNunitoExtraBold = 'Nunito-ExtraBold';

const PingoHowToPlayScreen = ({ setSelectedPingoScreen, }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));

    return (
        <SafeAreaView style={{ width: dimensions.width }}>
            <TouchableOpacity
                onPress={() => {
                    setSelectedPingoScreen('Home');
                }}
                style={{
                    borderRadius: dimensions.width * 0.5,
                    width: dimensions.width * 0.18,
                    height: dimensions.width * 0.18,
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    backgroundColor: 'white'
                }}
            >
                <ChevronLeftIcon size={dimensions.width * 0.12} color='#FA199A' style={{ marginRight: dimensions.width * 0.01 }} />
            </TouchableOpacity>

            <Text
                style={{
                    textAlign: 'center',
                    fontFamily: fontNunitoBlack,
                    fontSize: dimensions.width * 0.06,
                    color: 'white',
                    textTransform: 'uppercase',
                    marginTop: dimensions.height * 0.025,
                }}>
                How to play
            </Text>

            <Image
                source={require('../assets/images/homeImage.png')}
                style={{
                    width: dimensions.width * 0.4,
                    height: dimensions.width * 0.4,
                    marginTop: dimensions.height * 0.04,
                    alignSelf: 'center',
                    borderRadius: dimensions.width * 0.12,
                }}
                resizeMode='contain'
            />

            <View style={{
                width: dimensions.width * 0.9,
                alignSelf: 'center',
                backgroundColor: 'white',
                borderRadius: dimensions.width * 0.05,
                paddingHorizontal: dimensions.width * 0.04,
                paddingVertical: dimensions.height * 0.025,
                marginTop: dimensions.height * 0.05,
            }}>
                <GradientText
                    text={howToPlayText}
                    style={{
                        textAlign: 'left',
                        fontSize: dimensions.width * 0.04,
                        alignSelf: 'flex-start',
                        fontFamily: fontNunitoExtraBold,
                        textTransform: 'uppercase',
                    }}
                    gradientColors={['#EF1895', '#1D0C35']}
                />

            </View>

        </SafeAreaView>
    );
};

export default PingoHowToPlayScreen;
