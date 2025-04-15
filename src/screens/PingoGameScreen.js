import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Dimensions,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    Image,
    Share,
    Modal,
    TouchableWithoutFeedback,
    Keyboard,
    Alert,
} from 'react-native';
import { ChevronLeftIcon } from 'react-native-heroicons/solid';
import LinearGradient from 'react-native-linear-gradient';
import GradientText from '../components/GradientText';
import { TextInput } from 'react-native-gesture-handler';

const balls = [
    {
        id: 1,
        image: require('../assets/images/ballsImages/ball1.png'),
    },
    {
        id: 2,
        image: require('../assets/images/ballsImages/ball2.png'),
    },
    {
        id: 3,
        image: require('../assets/images/ballsImages/ball3.png'),
    },
    {
        id: 4,
        image: require('../assets/images/ballsImages/ball4.png'),
    },
    {
        id: 5,
        image: require('../assets/images/ballsImages/ball5.png'),
    },
    {
        id: 6,
        image: require('../assets/images/ballsImages/ball6.png'),
    },
]


const fontNunitoBlack = 'Nunito-Black';
const fontNunitoRegular = 'Nunito-Regular';

const PingoGameScreen = ({ setSelectedPingoScreen, setBackgroundMusic }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));
    const styles = createPingoSettingsStyles(dimensions);

    const [isPingoGameStarted, setPingoGameStarted] = useState(false);
    const [selectedPingoGameMode, setSelectedPingoGameMode] = useState('');
    const [player1Name, setPlayer1Name] = useState('');
    const [player2Name, setPlayer2Name] = useState('');

    const [chooseBallModalVisible, setChooseBallModalVisible] = useState(false);

    const [selected1Ball, setSelected1Ball] = useState(balls[0]);
    const [selected2Ball, setSelected2Ball] = useState(balls[1]);

    const [selectBallForPlayer, setSelectBallForPlayer] = useState(1);



    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <SafeAreaView style={{ width: dimensions.width }}>
                {!isPingoGameStarted && (
                    <View style={{
                        width: dimensions.width * 0.9,
                        alignItems: 'center',
                        justifyContent: selectedPingoGameMode === '' ? 'center' : 'flex-start',
                        paddingHorizontal: dimensions.width * 0.05,
                        flexDirection: 'row',
                    }}>
                        <TouchableOpacity
                            onPress={() => {
                                if (isPingoGameStarted) {
                                    setPingoGameStarted(false);
                                } else setSelectedPingoScreen('Home');
                            }}
                            style={{
                                borderRadius: dimensions.width * 0.5,
                                width: dimensions.width * 0.18,
                                height: dimensions.width * 0.18,
                                alignItems: 'center',
                                justifyContent: 'center',
                                alignSelf: 'center',
                                backgroundColor: 'white',
                                marginLeft: selectedPingoGameMode === '' ? dimensions.width * 0.08 : 0,
                            }}
                        >
                            <ChevronLeftIcon size={dimensions.width * 0.12} color='#FA199A' style={{ marginRight: dimensions.width * 0.01 }} />
                        </TouchableOpacity>

                        {selectedPingoGameMode !== '' && (
                            <View style={{
                                backgroundColor: 'white',
                                width: dimensions.width * 0.5,
                                marginLeft: dimensions.width * 0.05,
                                height: dimensions.height * 0.05,
                                borderRadius: dimensions.width * 0.1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                alignSelf: 'center',
                            }}>
                                <GradientText
                                    text={selectedPingoGameMode}
                                    style={{

                                        textAlign: 'center',
                                        fontSize: dimensions.width * 0.035,
                                        maxWidth: dimensions.width * 0.89,
                                        alignSelf: 'center',
                                        fontFamily: fontNunitoBlack,
                                        textTransform: 'uppercase',
                                    }}
                                    gradientColors={['#EF1895', '#1D0C35']}
                                />
                            </View>
                        )}

                    </View>
                )}

                {!isPingoGameStarted ? (
                    <>
                        {selectedPingoGameMode === '' ? (
                            <>
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        fontFamily: fontNunitoBlack,
                                        fontSize: dimensions.width * 0.045,
                                        color: 'white',
                                        textTransform: 'uppercase',
                                        paddingHorizontal: dimensions.width * 0.07,
                                        marginTop: dimensions.height * 0.02,
                                    }}>
                                    Ready to play?
                                    {'\n'}Choose a mode and start having fun!
                                </Text>
                                <View style={{ marginTop: dimensions.height * 0.05 }} />
                                {['For two Players', 'Online Game'].map((mode) => (
                                    <TouchableOpacity
                                        key={mode}
                                        onPress={() => {
                                            setSelectedPingoGameMode(mode);
                                        }}
                                        style={{
                                            backgroundColor: 'white',
                                            width: dimensions.width * 0.7,
                                            height: dimensions.height * 0.08,
                                            borderRadius: dimensions.width * 0.1,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginTop: dimensions.height * 0.01,
                                            alignSelf: 'center',
                                        }}>
                                        <GradientText
                                            text={mode}
                                            style={{
                                                paddingHorizontal: dimensions.width * 0.05,
                                                textAlign: 'center',
                                                fontSize: dimensions.width * 0.05,
                                                maxWidth: dimensions.width * 0.89,
                                                alignSelf: 'center',
                                                fontFamily: fontNunitoBlack,
                                                textTransform: 'uppercase',
                                            }}
                                            gradientColors={['#EF1895', '#1D0C35']}
                                        />
                                    </TouchableOpacity>
                                ))}
                            </>
                        ) : (
                            <>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    width: dimensions.width * 0.9,
                                    alignSelf: 'center',
                                    marginTop: dimensions.height * 0.1,
                                }}>
                                    <View>
                                        <Text
                                            style={{
                                                textAlign: 'left',
                                                fontFamily: fontNunitoBlack,
                                                fontSize: dimensions.width * 0.04,
                                                color: 'white',
                                                textTransform: 'uppercase',
                                                marginTop: dimensions.height * 0.025,
                                            }}>
                                            Enter name 1
                                        </Text>

                                        <TextInput
                                            placeholder='NAME P1'
                                            placeholderTextColor='white'
                                            maxLength={15}
                                            placeholderStyle={{
                                                color: 'white',
                                                fontFamily: fontNunitoBlack,
                                                fontSize: dimensions.width * 0.04,
                                            }}
                                            value={player1Name}
                                            onChangeText={(text) => setPlayer1Name(text)}
                                            style={styles.textInputStyles}
                                        />
                                    </View>

                                    <View>
                                        <Text style={styles.chooseBallTextStyles}>
                                            Choose ball
                                        </Text>

                                        <TouchableOpacity
                                            onPress={() => {
                                                setSelectBallForPlayer(1);
                                                setChooseBallModalVisible(true);
                                            }}
                                            style={styles.touchableBallStyles}>
                                            <Image
                                                source={selected1Ball.image}
                                                style={{
                                                    width: dimensions.height * 0.048,
                                                    height: dimensions.height * 0.048,

                                                }}
                                            />

                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    width: dimensions.width * 0.9,
                                    alignSelf: 'center',
                                    marginTop: dimensions.height * 0.02,
                                }}>
                                    <View>
                                        <Text
                                            style={{
                                                textAlign: 'left',
                                                fontFamily: fontNunitoBlack,
                                                fontSize: dimensions.width * 0.04,
                                                color: 'white',
                                                textTransform: 'uppercase',
                                                marginTop: dimensions.height * 0.025,
                                            }}>
                                            Enter name 1
                                        </Text>

                                        <TextInput
                                            placeholder='NAME P2'
                                            placeholderTextColor='white'
                                            maxLength={15}
                                            placeholderStyle={{
                                                color: 'white',
                                                fontFamily: fontNunitoBlack,
                                                fontSize: dimensions.width * 0.04,
                                            }}
                                            value={player2Name}
                                            onChangeText={(text) => setPlayer2Name(text)}
                                            style={styles.textInputStyles}
                                        />
                                    </View>

                                    <View>
                                        <Text style={styles.chooseBallTextStyles}>
                                            Choose ball
                                        </Text>

                                        <TouchableOpacity
                                            onPress={() => {
                                                setSelectBallForPlayer(2);
                                                setChooseBallModalVisible(true);
                                            }}
                                            style={styles.touchableBallStyles}>
                                            <Image
                                                source={selected2Ball.image}
                                                style={{
                                                    width: dimensions.height * 0.048,
                                                    height: dimensions.height * 0.048,

                                                }}
                                            />

                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <TouchableOpacity
                                    disabled={
                                        player1Name.replace(/\s/g, '').length === 0 ||
                                        player2Name.replace(/\s/g, '').length === 0
                                    }
                                    onPress={() => {
                                        setPingoGameStarted(true);
                                    }}
                                    style={{
                                        backgroundColor: 'white',
                                        width: dimensions.width * 0.7,
                                        height: dimensions.height * 0.08,
                                        borderRadius: dimensions.width * 0.1,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        alignSelf: 'center',
                                        opacity:
                                            player1Name.replace(/\s/g, '').length === 0 ||
                                                player2Name.replace(/\s/g, '').length === 0 ? 0.5 : 1,

                                        marginTop: dimensions.height * 0.15,
                                    }}>
                                    <GradientText
                                        text='Start Play'
                                        style={styles.gradientTextStyles}
                                        gradientColors={['#EF1895', '#1D0C35']}
                                    />
                                </TouchableOpacity>
                            </>
                        )}
                    </>
                ) : (
                    <>
                        <View style={{
                            backgroundColor: 'white',
                            width: dimensions.width * 0.8,
                            height: dimensions.height * 0.09,
                            borderRadius: dimensions.width * 0.1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            alignSelf: 'center',
                        }}>
                            <GradientText
                                text='Cut the threads'
                                style={{

                                    textAlign: 'center',
                                    fontSize: dimensions.width * 0.05,
                                    maxWidth: dimensions.width * 0.89,
                                    alignSelf: 'center',
                                    fontFamily: fontNunitoBlack,
                                    textTransform: 'uppercase',
                                }}
                                gradientColors={['#EF1895', '#1D0C35']}
                            />
                        </View>
                    </>
                )}



                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={chooseBallModalVisible}
                    onRequestClose={() => {
                        setChooseBallModalVisible(!chooseBallModalVisible);
                    }}
                >
                    <View style={{ flex: 1 }}>
                        <LinearGradient
                            style={{ flex: 1, }}
                            colors={['#FA199A', '#1A0C34']}
                            start={{ x: 0.5, y: 0 }}
                            end={{ x: 0.5, y: 1 }}
                        >
                            <SafeAreaView style={{
                                flex: 1,
                            }}>
                                <View style={{
                                    backgroundColor: 'white',
                                    width: dimensions.width * 0.5,
                                    height: dimensions.height * 0.05,
                                    borderRadius: dimensions.width * 0.1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                }}>
                                    <GradientText
                                        text='Choose ball'
                                        style={{
                                            textAlign: 'center',
                                            fontSize: dimensions.width * 0.035,
                                            maxWidth: dimensions.width * 0.89,
                                            fontFamily: fontNunitoBlack,
                                            textTransform: 'uppercase',
                                        }}
                                        gradientColors={['#EF1895', '#1D0C35']}
                                    />
                                </View>

                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    width: dimensions.width * 0.9,
                                    alignSelf: 'center',
                                    marginTop: dimensions.height * 0.05,
                                    flexWrap: 'wrap',
                                }}>
                                    {balls.map((ball) => (
                                        <TouchableOpacity
                                            key={ball.id}
                                            onPress={() => {
                                                if (selectBallForPlayer === 1) {
                                                    if (selected2Ball && selected2Ball.id === ball.id) {
                                                        Alert.alert('Error', 'You cannot select the same ball for both players.');
                                                        return;
                                                    }
                                                    setSelected1Ball(ball);
                                                } else {
                                                    if (selected1Ball && selected1Ball.id === ball.id) {
                                                        Alert.alert('Error', 'You cannot select the same ball for both players.');
                                                        return;
                                                    }
                                                    setSelected2Ball(ball);
                                                }
                                            }}

                                            style={{
                                                backgroundColor: (selectBallForPlayer === 1 && selected1Ball === ball) || (selectBallForPlayer === 2 && selected2Ball === ball) ? 'white' : 'transparent',
                                                width: dimensions.height * 0.13,
                                                height: dimensions.height * 0.13,
                                                borderRadius: dimensions.width * 0.5,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                marginTop: dimensions.height * 0.01,
                                            }}
                                        >
                                            <Image
                                                source={ball.image}
                                                style={{
                                                    width: dimensions.height * 0.08,
                                                    height: dimensions.height * 0.08,
                                                }}
                                            />
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                <TouchableOpacity
                                    onPress={() => {
                                        setChooseBallModalVisible(false);
                                    }}
                                    style={{
                                        backgroundColor: 'white',
                                        width: dimensions.width * 0.7,
                                        height: dimensions.height * 0.08,
                                        borderRadius: dimensions.width * 0.1,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        alignSelf: 'center',

                                        position: 'absolute',
                                        bottom: dimensions.height * 0.1,
                                        marginTop: dimensions.height * 0.15,
                                    }}>
                                    <GradientText
                                        text='back'
                                        style={styles.gradientTextStyles}
                                        gradientColors={['#EF1895', '#1D0C35']}
                                    />
                                </TouchableOpacity>
                            </SafeAreaView>
                        </LinearGradient>
                    </View>
                </Modal>

            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};

const createPingoSettingsStyles = (dimensions) => StyleSheet.create({
    gradientTextStyles: {
        paddingHorizontal: dimensions.width * 0.05,
        textAlign: 'center',
        fontSize: dimensions.width * 0.05,
        maxWidth: dimensions.width * 0.89,
        alignSelf: 'center',
        fontFamily: fontNunitoBlack,
        textTransform: 'uppercase',
    },
    touchableBallStyles: {
        height: dimensions.height * 0.09,
        width: dimensions.height * 0.09,
        backgroundColor: 'white',
        borderRadius: dimensions.width * 0.5,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    chooseBallTextStyles: {
        textAlign: 'left',
        fontFamily: fontNunitoBlack,
        fontSize: dimensions.width * 0.04,
        color: 'white',
        textTransform: 'uppercase',
        marginTop: dimensions.height * 0.025,
        flex: 1
    },
    textInputStyles: {
        backgroundColor: 'transparent',
        borderColor: 'white',
        borderWidth: dimensions.width * 0.003,

        width: dimensions.width * 0.6,
        height: dimensions.height * 0.1,
        borderRadius: dimensions.width * 0.3,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: dimensions.height * 0.01,
        paddingHorizontal: dimensions.width * 0.05,
        fontFamily: fontNunitoBlack,
        fontSize: dimensions.width * 0.045,
        textTransform: 'uppercase',
        color: 'white',
    }
});

export default PingoGameScreen;
