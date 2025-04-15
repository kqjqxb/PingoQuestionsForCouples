import React, { useState } from 'react';
import {
    View,
    Text,
    Dimensions,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const fontPixelifySansRegular = 'PixelifySans-Regular';
const fontPlay = 'Play-Regular';

const aboutFishes = [
    {
        id: 1,
        text: 'Blue Fish? Swipe in their direction',
        image: require('../assets/images/bluImageAbout.png'),
    },
    {
        id: 2,
        text: 'Green Fish? Swipe the opposite way',
        image: require('../assets/images/greenImageAbout.png'),
    },
    {
        id: 3,
        text: 'Yellow Fish? Always swipe up!',
        image: require('../assets/images/yellowImageAbout.png'),
    },
]

const DeepDiveAboutScreen = ({ setSelectedPingoScreen }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));
    const styles = createDeepDiveAboutStyles(dimensions);


    return (
        <SafeAreaView style={{ width: dimensions.width }}>
            <View style={{
                width: dimensions.width,
                height: dimensions.height,
                backgroundColor: 'rgba(22, 0, 2, 0.3)',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 0,
            }} />
            <View
                onPress={() => {
                }}
                style={[styles.gradientButtonsStyles, {
                    width: dimensions.width * 0.91,
                    height: dimensions.width * 0.14,
                    marginTop: dimensions.height * 0.015,
                    justifyContent: 'space-between',
                    paddingHorizontal: dimensions.width * 0.05,
                    flexDirection: 'row',
                    alignItems: 'center',
                }]}
            >
                <LinearGradient
                    style={[styles.deepOrangeGradient, {
                    }]}
                    colors={['#EA173B', '#FFC100']}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                />
                <TouchableOpacity style={{
                }} onPress={() => {
                    setSelectedPingoScreen('Home');
                }}>
                    <Image
                        source={require('../assets/icons/backDeepIcon.png')}
                        style={{
                            width: dimensions.width * 0.07,
                            height: dimensions.width * 0.07,
                        }}
                        resizeMode='contain'
                    />
                </TouchableOpacity>
                <Text
                    style={{
                        textAlign: 'center',
                        fontWeight: 700,
                        fontFamily: fontPixelifySansRegular,
                        fontSize: dimensions.width * 0.06,
                        color: '#fff',
                    }}>
                    About
                </Text>
            </View>

            <Text
                style={{
                    textAlign: 'left',
                    fontFamily: fontPlay,
                    fontSize: dimensions.width * 0.045,
                    color: '#fff',
                    paddingHorizontal: dimensions.width * 0.05,
                    marginTop: dimensions.height * 0.04,
                }}>
                Deep Dive Fishin’ Swipe is a fast-paced reflex game where one wrong swipe ends your fishing trip. Think fast, swipe right (or left... or up), and prove you've got the instincts of a true deep-sea master.
            </Text>

            <Text
                style={{
                    textAlign: 'left',
                    fontWeight: 600,
                    fontFamily: fontPixelifySansRegular,
                    fontSize: dimensions.width * 0.055,
                    color: '#fff',
                    paddingHorizontal: dimensions.width * 0.05,
                    marginTop: dimensions.height * 0.02,
                }}>
                🎣 How to Play:
            </Text>

            {aboutFishes.map((fish) => (
                <View key={fish.id} style={{
                    marginTop: dimensions.height * 0.02,
                }}>
                    <Text
                        style={{
                            textAlign: 'left',
                            fontFamily: fontPlay,
                            fontSize: dimensions.width * 0.045,
                            color: '#fff',
                            paddingHorizontal: dimensions.width * 0.05,
                            marginTop: dimensions.height * 0.01,
                            fontWeight: 300,
                        }}>
                        {fish.text}
                    </Text>

                    <Image
                        source={fish.image}
                        style={{
                            width: dimensions.width * 0.8,
                            height: dimensions.height * 0.1,
                            marginTop: dimensions.height * 0.02,
                            alignSelf: 'center',
                        }}
                        resizeMode='contain'
                    />
                </View>
            ))}
        </SafeAreaView>
    );
};

const createDeepDiveAboutStyles = (dimensions) => StyleSheet.create({
    deepOrangeGradient: {
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
    gradientButtonsStyles: {
        width: dimensions.width * 0.17,
        height: dimensions.width * 0.17,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },

});

export default DeepDiveAboutScreen;
