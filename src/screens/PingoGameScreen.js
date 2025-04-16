import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    Dimensions,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    Image,
    Modal,
    TouchableWithoutFeedback,
    Keyboard,
    Alert,
    PanResponder,
    Animated,
} from 'react-native';
import { ChevronLeftIcon } from 'react-native-heroicons/solid';
import LinearGradient from 'react-native-linear-gradient';
import GradientText from '../components/GradientText';
import { TextInput } from 'react-native-gesture-handler';

import coupleQuestionsPingoData from '../components/coupleQuestionsPingoData';
import desirePingoData from '../components/desirePingoData';

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

    const fallAnim1 = useRef(new Animated.Value(0)).current;
    const fallAnim2 = useRef(new Animated.Value(0)).current;

    const [threadCut1, setThreadCut1] = useState(false);
    const [threadCut2, setThreadCut2] = useState(false);

    const [winnerBall, setWinnerBall] = useState(null);
    const [isBallsFalled, setIsBallsFalled] = useState(false);
    const [isReadyVisibleNow, setIsReadyVisibleNow] = useState(true);
    const [answerWidth, setAnswerWidth] = useState(0);
    const [timerSeconds, setTimerSeconds] = useState(30);
    const [answerMessage, setAnswerMessage] = useState("Your ball has hit the hole,\nnow answer the questions");
    const timerBarAnim = useRef(new Animated.Value(0)).current;
    const [isAnswerGiven, setIsAnswerGiven] = useState(true);
    const [usedQuestions, setUsedQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [usedDesires, setUsedDesires] = useState([]);
    const [currentDesire, setCurrentDesire] = useState(null);

    useEffect(() => {
        if (winnerBall) {
            const delayTimeout = setTimeout(() => {
                Animated.timing(timerBarAnim, {
                    toValue: 1,
                    duration: 30000,
                    useNativeDriver: false,
                }).start(({ finished }) => {
                    if (finished) {
                        setAnswerMessage("You didn't answer the question, so you must fulfill your significant other's wishes.");
                        if (selectedPingoGameMode !== 'For two Players') {
                            handleGeneratePingoDesire();
                        }
                        setIsAnswerGiven(false);
                    }
                });

                const timerInterval = setInterval(() => {
                    setTimerSeconds(prev => {
                        if (prev <= 1) {
                            clearInterval(timerInterval);
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);

                return () => clearInterval(timerInterval);
            }, 1500);

            return () => clearTimeout(delayTimeout);
        }
    }, [winnerBall]);

    const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

    const progressBarWidth = timerBarAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [dimensions.width * 0.35, 0]
    });

    const dynamicBorderRadius = timerBarAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [dimensions.width * 0.02, dimensions.width * 0.04]
    });



    const handleGeneratePingoQuestion = () => {
        let availableQuestions = coupleQuestionsPingoData.filter(q => !usedQuestions.find(used => used.id === q.id));
        if (availableQuestions.length === 0) {
            setUsedQuestions([]);
            availableQuestions = coupleQuestionsPingoData;
        }
        const randomIndex = Math.floor(Math.random() * availableQuestions.length);
        const selectedQuestion = availableQuestions[randomIndex];
        setUsedQuestions(prev => [...prev, selectedQuestion]);
        setCurrentQuestion(selectedQuestion);
    };



    const handleGeneratePingoDesire = () => {
        let availableDesires = desirePingoData.filter(desire => !usedDesires.find(used => used.id === desire.id));
        if (availableDesires.length === 0) {
            setUsedDesires([]);
            availableDesires = desirePingoData;
        }
        const randomIndex = Math.floor(Math.random() * availableDesires.length);
        const selectedDesire = availableDesires[randomIndex];
        setUsedDesires(prev => [...prev, selectedDesire]);
        setCurrentDesire(selectedDesire);
    };


    const panStartXRef = useRef(0);

    const fullPanResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onPanResponderGrant: (evt, gestureState) => {
                panStartXRef.current = evt.nativeEvent.pageX;
                console.log("FullPan: onPanResponderGrant, startX =", panStartXRef.current);
            },
            onPanResponderRelease: (evt, gestureState) => {
                console.log("FullPan: onPanResponderRelease, dx =", gestureState.dx);
                const startX = panStartXRef.current;
                const thread1Center = dimensions.width * 0.25;
                const thread2Center = dimensions.width * 0.75;
                const thresholdDistance = 50;
                if (Math.abs(gestureState.dx) > 30) {
                    if (!threadCut1 && Math.abs(startX - thread1Center) < thresholdDistance) {
                        console.log("FullPan: Cutting thread1.");
                        setThreadCut1(true);
                        if (!winnerBall) {
                            setWinnerBall(selected1Ball);
                            setTimeout(() => {
                                setIsBallsFalled(true);
                                setTimeout(() => {
                                    setIsReadyVisibleNow(false);
                                }, 2500);
                            }, 1000);

                        }
                        Animated.timing(fallAnim1, {
                            toValue: dimensions.height * 0.5,
                            duration: 1000,
                            useNativeDriver: true,
                        }).start(() => {
                            console.log("FullPan: Thread1 fall animation complete.");
                        });
                    }
                    if (!threadCut2 && Math.abs(startX - thread2Center) < thresholdDistance) {
                        console.log("FullPan: Cutting thread2.");
                        setThreadCut2(true);
                        if (!winnerBall) {
                            setWinnerBall(selected2Ball);
                            setTimeout(() => {
                                setIsBallsFalled(true);
                                setTimeout(() => {
                                    setIsReadyVisibleNow(false);
                                }, 2500);
                            }, 1000);
                        }
                        Animated.timing(fallAnim2, {
                            toValue: dimensions.height * 0.5,
                            duration: 1000,
                            useNativeDriver: true,
                        }).start(() => {
                            console.log("FullPan: Thread2 fall animation complete.");
                        });
                    }
                }
            },
        })
    ).current;

    const renderGame = () => {
        const threadTop = dimensions.height * 0.1;
        const threadHeight = dimensions.height * 0.15;
        const ballInitialTop = threadTop + threadHeight;

        return (
            <>
                {!threadCut1 && (
                    <View
                        style={{
                            position: 'absolute',
                            left: dimensions.width * 0.25 - 25,
                            top: threadTop,
                            width: 50,
                            height: threadHeight,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <View
                            style={{
                                width: 2,
                                height: '100%',
                                backgroundColor: 'white',
                            }}
                        />
                    </View>
                )}
                {/* Куля 1 */}
                <Animated.View
                    style={{
                        position: 'absolute',
                        left: dimensions.width * 0.25 - (dimensions.height * 0.1) / 2,
                        top: ballInitialTop,
                        transform: [{ translateY: fallAnim1 }],
                    }}
                >
                    <Image
                        source={selected1Ball.image}
                        style={{
                            width: dimensions.height * 0.1,
                            height: dimensions.height * 0.1,
                        }}
                    />
                </Animated.View>

                {/* Нитка 2: рендеримо, якщо не перерізана */}
                {!threadCut2 && (
                    <View
                        style={{
                            position: 'absolute',
                            right: dimensions.width * 0.25 - 25,
                            top: threadTop,
                            width: 50,
                            height: threadHeight,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <View
                            style={{
                                width: 2,
                                height: '100%',
                                backgroundColor: 'white',
                            }}
                        />
                    </View>
                )}
                {/* Куля 2 */}
                <Animated.View
                    style={{
                        position: 'absolute',
                        right: dimensions.width * 0.25 - (dimensions.height * 0.1) / 2,
                        top: ballInitialTop,
                        transform: [{ translateY: fallAnim2 }],
                    }}
                >
                    <Image
                        source={selected2Ball.image}
                        style={{
                            width: dimensions.height * 0.1,
                            height: dimensions.height * 0.1,
                        }}
                    />
                </Animated.View>
            </>
        );
    };

    const winnerPlayer =
        winnerBall && winnerBall.id === selected1Ball.id ? player1Name : player2Name;

    const handlePlayNext = () => {
        const nextWinnerBall =
            winnerBall && winnerBall.id === selected1Ball.id ? selected2Ball : selected1Ball;
        setWinnerBall(nextWinnerBall);

        if (selectedPingoGameMode !== 'For two Players') {
            handleGeneratePingoQuestion();
        }

        timerBarAnim.setValue(0);
        setTimerSeconds(30);
        setAnswerMessage("Your ball has hit the hole,\nnow answer the questions");


        setIsReadyVisibleNow(true);
        setTimeout(() => {
            setIsReadyVisibleNow(false);
        }, 1500)
    };



    const handleNoAnswer = () => {
        Animated.timing(timerBarAnim, {
            toValue: 1,
            duration: 0,
            useNativeDriver: false,
        }).start();
        setTimerSeconds(0);
        setAnswerMessage("You didn't answer the question, so you must fulfill your significant other's wishes.");
        setIsAnswerGiven(false);

    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <SafeAreaView style={{ flex: 1, width: dimensions.width }}>
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
                                            maxLength={10}
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
                                            maxLength={10}
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
                                        if (selectedPingoGameMode !== 'For two Players') {
                                            handleGeneratePingoQuestion();
                                        }
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
                    !isBallsFalled ? (
                        <View style={{ flex: 1 }} {...fullPanResponder.panHandlers}>
                            <View
                                style={{
                                    backgroundColor: 'white',
                                    width: dimensions.width * 0.8,
                                    height: dimensions.height * 0.09,
                                    borderRadius: dimensions.width * 0.1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginTop: dimensions.height * 0.01,
                                    alignSelf: 'center',
                                }}>
                                <GradientText
                                    text='Cut the threads'
                                    style={styles.gradientTextStyles}
                                    gradientColors={['#EF1895', '#1D0C35']}
                                />
                            </View>
                            {renderGame()}
                        </View>
                    ) : (
                        isReadyVisibleNow ? (
                            <>
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        fontFamily: fontNunitoBlack,
                                        fontSize: dimensions.width * 0.08,
                                        color: 'white',
                                        textTransform: 'uppercase',
                                        paddingHorizontal: dimensions.width * 0.07,
                                        marginTop: dimensions.height * 0.02,
                                    }}>
                                    PLAYER WITH {'\n'}BALL ANSWERS
                                </Text>
                                <Image
                                    source={winnerBall.image}
                                    style={{
                                        width: dimensions.height * 0.25,
                                        height: dimensions.height * 0.25,
                                        alignSelf: 'center',
                                        marginTop: dimensions.height * 0.05,
                                    }}
                                />

                                <Text
                                    style={{
                                        textAlign: 'center',
                                        fontFamily: fontNunitoRegular,
                                        fontSize: dimensions.width * 0.08,
                                        color: 'white',
                                        textTransform: 'uppercase',
                                        paddingHorizontal: dimensions.width * 0.07,
                                        marginTop: dimensions.height * 0.05,
                                    }}>
                                    Get ready
                                </Text>
                            </>
                        ) : (
                            <>
                                {!isAnswerGiven && (
                                    <LinearGradient
                                        style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
                                        colors={['#FF0000', '#1A0C34']}
                                        start={{ x: 0.5, y: 0 }}
                                        end={{ x: 0.5, y: 1 }}
                                    />
                                )}
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        fontFamily: fontNunitoBlack,
                                        fontSize: dimensions.width * 0.055,
                                        color: 'white',
                                        textTransform: 'uppercase',
                                        paddingHorizontal: dimensions.width * 0.07,
                                        marginTop: dimensions.height * 0.02,
                                    }}>
                                    {!isAnswerGiven ? 'No answer given!' : 'Time for an answer!'}
                                </Text>

                                <View style={{
                                    alignSelf: 'center',
                                    width: dimensions.width * 0.8,
                                    backgroundColor: 'white',
                                    paddingHorizontal: dimensions.width * 0.05,
                                    paddingVertical: dimensions.height * 0.025,
                                    borderRadius: dimensions.width * 0.14,
                                    marginTop: dimensions.height * 0.04
                                }}>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            alignSelf: 'center',
                                            justifyContent: 'center'
                                        }}
                                        onLayout={(e) => setAnswerWidth(e.nativeEvent.layout.width)}
                                    >
                                        <Text
                                            style={{
                                                textAlign: 'center',
                                                fontFamily: fontNunitoBlack,
                                                fontSize: dimensions.width * 0.065,
                                                color: 'black',
                                                textTransform: 'uppercase',
                                            }}
                                        >
                                            {winnerPlayer}
                                        </Text>
                                        <Image
                                            source={winnerBall.image}
                                            style={{
                                                width: dimensions.height * 0.06,
                                                height: dimensions.height * 0.06,
                                                marginLeft: dimensions.width * 0.04,
                                            }}
                                        />
                                    </View>

                                    <View
                                        style={{
                                            width: answerWidth,
                                            borderRadius: answerWidth / 2,
                                            height: dimensions.height * 0.01,
                                            marginTop: dimensions.height * 0.01,
                                            alignSelf: 'center'
                                        }}
                                    >
                                        <LinearGradient
                                            style={{ flex: 1, borderRadius: answerWidth / 2 }}
                                            colors={['#FA199A', '#1A0C34']}
                                            start={{ x: 0, y: 0.5 }}
                                            end={{ x: 1, y: 0.5 }}
                                        />
                                    </View>

                                    <Text
                                        style={{
                                            textAlign: 'center',
                                            fontFamily: fontNunitoBlack,
                                            fontSize: dimensions.width * 0.034,
                                            color: 'black',
                                            textTransform: 'uppercase',
                                            marginTop: dimensions.height * 0.03,
                                        }}>
                                        {selectedPingoGameMode !== 'For two Players' && isAnswerGiven ? currentQuestion.pingoCoupleQUestion :
                                            selectedPingoGameMode !== 'For two Players' && !isAnswerGiven ? currentDesire.pingoCoupleDesireText : answerMessage}
                                    </Text>

                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        alignSelf: 'center',
                                        justifyContent: 'center',
                                        marginTop: dimensions.height * 0.03,
                                    }}>
                                        <View style={{
                                            width: dimensions.width * 0.4,
                                            backgroundColor: 'transparent',
                                            height: dimensions.height * 0.075,
                                            borderColor: '#DADADA',
                                            borderRadius: dimensions.width * 0.04,
                                            borderWidth: dimensions.width * 0.003,
                                            paddingHorizontal: dimensions.width * 0.025,
                                            alignItems: 'flex-start',
                                            justifyContent: 'center'
                                        }}>
                                            <Animated.View style={{
                                                width: progressBarWidth,
                                                height: dimensions.height * 0.055,
                                                borderRadius: dynamicBorderRadius,
                                            }}>
                                                <AnimatedLinearGradient
                                                    style={{ flex: 1, borderRadius: dynamicBorderRadius, }}
                                                    colors={['#FA199A', '#1A0C34']}
                                                    start={{ x: 0, y: 0.5 }}
                                                    end={{ x: 1, y: 0.5 }}
                                                />
                                            </Animated.View>
                                        </View>

                                        <GradientText
                                            text={`0:${timerSeconds < 10 ? '0' + timerSeconds : timerSeconds}`}
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
                                    </View>

                                    <Text
                                        style={{
                                            textAlign: 'center',
                                            fontFamily: fontNunitoRegular,
                                            fontWeight: 400,
                                            fontSize: dimensions.width * 0.035,
                                            color: '#7C7C7C',
                                            marginTop: dimensions.height * 0.03,
                                        }}>
                                        Question and answer time: 0:30
                                    </Text>

                                </View>

                                {isAnswerGiven ? (
                                    <>
                                        <TouchableOpacity
                                            onPress={handlePlayNext}
                                            style={{
                                                backgroundColor: 'white',
                                                width: dimensions.width * 0.8,
                                                height: dimensions.height * 0.09,
                                                borderRadius: dimensions.width * 0.1,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                marginTop: dimensions.height * 0.03,
                                                alignSelf: 'center'
                                            }}>
                                            <GradientText
                                                text='Play next'
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

                                        <TouchableOpacity
                                            onPress={handleNoAnswer}
                                            style={{
                                                backgroundColor: '#FF0000',
                                                width: dimensions.width * 0.8,
                                                height: dimensions.height * 0.09,
                                                borderRadius: dimensions.width * 0.1,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                marginTop: dimensions.height * 0.015,
                                                alignSelf: 'center'
                                            }}>
                                            <Text
                                                style={{
                                                    textAlign: 'center',
                                                    fontSize: dimensions.width * 0.055,
                                                    maxWidth: dimensions.width * 0.89,
                                                    alignSelf: 'center',
                                                    fontFamily: fontNunitoBlack,
                                                    textTransform: 'uppercase',
                                                    color: 'white',
                                                }}
                                            >
                                                No answer given
                                            </Text>
                                        </TouchableOpacity>
                                    </>
                                ) : (
                                    <>
                                        <Text
                                            style={{
                                                textAlign: 'center',
                                                fontFamily: fontNunitoRegular,
                                                fontWeight: 400,
                                                fontSize: dimensions.width * 0.04,
                                                color: 'white',
                                                textTransform: 'uppercase',
                                                marginTop: dimensions.height * 0.03,
                                            }}
                                        >
                                            Wish fullfilled? Continue
                                        </Text>
                                        <TouchableOpacity
                                            onPress={() => {
                                                handlePlayNext();
                                                setIsAnswerGiven(true);
                                            }}
                                            style={{
                                                backgroundColor: 'white',
                                                width: dimensions.width * 0.8,
                                                height: dimensions.height * 0.09,
                                                borderRadius: dimensions.width * 0.1,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                marginTop: dimensions.height * 0.01,
                                                alignSelf: 'center'
                                            }}>
                                            <GradientText
                                                text='Continue play'
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
                                    </>
                                )}


                                <TouchableOpacity
                                    onPress={() => {
                                        setSelectedPingoScreen('Home');
                                    }}
                                    style={{
                                        backgroundColor: 'white',
                                        width: dimensions.height * 0.1,
                                        height: dimensions.height * 0.1,
                                        borderRadius: dimensions.width * 0.5,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginTop: dimensions.height * 0.05,
                                        alignSelf: 'center'
                                    }}>
                                    <Image
                                        source={require('../assets/icons/homeImageIcon.png')}
                                        style={{
                                            width: dimensions.height * 0.04,
                                            height: dimensions.height * 0.04,
                                        }}
                                        resizeMode='contain'
                                    />
                                </TouchableOpacity>
                            </>
                        )
                    )
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
