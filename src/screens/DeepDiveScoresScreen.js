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
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const fontPixelifySansRegular = 'PixelifySans-Regular';
const fontPlay = 'Play-Regular';

const DeepDiveScoresScreen = ({ setSelectedPingoScreen, selectedPingoScreen }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));
    const styles = createDeepDiveAboutStyles(dimensions);
    const [scores, setScores] = useState([]);

    const [selectedDeepGameCategory, setSelectedDeepGameCategory] = useState('Quick Catch');

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const scoresValue = await AsyncStorage.getItem('scores');
                if (scoresValue !== null) setScores(JSON.parse(scoresValue));
            } catch (error) {
                console.error("Error loading settings:", error);
            }
        };
        loadSettings();
    }, []);

    return (
        <SafeAreaView style={{ width: dimensions.width }}>
            <View
                style={[styles.deepGradientButtonsStyles, {
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
                    style={[styles.deepYellowOrangGradient]}
                    colors={['#EA173B', '#FFC100']}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                />
                <TouchableOpacity onPress={() => {
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
                        fontWeight: '700',
                        fontFamily: fontPixelifySansRegular,
                        fontSize: dimensions.width * 0.06,
                        color: '#fff',
                    }}>
                    Scores
                </Text>
            </View>

            <View style={{
                flexDirection: 'row',
                alignSelf: 'center',
                justifyContent: 'space-between',
                width: dimensions.width * 0.9,
                marginVertical: dimensions.height * 0.02,
            }}>
                {['Quick Catch', 'Deep Drift', 'Endless Voyage'].map((item, index) => (
                    <TouchableOpacity
                        onPress={() => {
                            setSelectedDeepGameCategory(item);
                        }}
                        key={item}
                        style={[styles.deepGradientButtonsStyles, {
                            width: dimensions.width * 0.28,
                            height: dimensions.width * 0.19,
                            marginTop: dimensions.height * 0.015,
                            backgroundColor: selectedDeepGameCategory === item ? 'transparent' : '#003186',
                            alignSelf: 'center',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }]}
                    >
                        {selectedDeepGameCategory === item && (
                            <LinearGradient
                                style={[styles.deepYellowOrangGradient, {
                                }]}
                                colors={['#EA173B', '#FFC100']}
                                start={{ x: 0.5, y: 0 }}
                                end={{ x: 0.5, y: 1 }}
                            />

                        )}
                        <Text
                            style={{
                                textAlign: 'center',
                                fontWeight: 700,
                                fontFamily: fontPixelifySansRegular,
                                fontSize: dimensions.width * 0.05,
                                color: '#fff',
                                marginRight: dimensions.width * 0.025,
                            }}>
                            {item}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={{ marginTop: dimensions.height * 0.03 }}></View>
            {
                (() => {
                    const filteredScores = scores.filter(
                        (property) => property.gameType === selectedDeepGameCategory
                    );
                    const sortedScores = filteredScores.sort((a, b) => b.score - a.score);
                    const topScores = sortedScores.slice(0, 10);
                    if (topScores.length > 0) {
                        return topScores.map((score, index) => (
                            <View
                                key={index}
                                style={{
                                    flexDirection: 'row',
                                    alignSelf: 'center',
                                    justifyContent: 'space-between',
                                    width: dimensions.width * 0.9,
                                    marginTop: dimensions.height * 0.01,
                                }}
                            >
                                <Text
                                    style={{
                                        textAlign: 'left',
                                        fontWeight: '400',
                                        fontFamily: fontPlay,
                                        fontSize: dimensions.width * 0.06,
                                        color: '#fff',
                                        alignSelf: 'center',
                                    }}
                                >
                                    {index + 1}. Total Fish Cought
                                </Text>

                                <Text
                                    style={{
                                        textAlign: 'left',
                                        fontWeight: '400',
                                        fontFamily: fontPlay,
                                        fontSize: dimensions.width * 0.06,
                                        color: '#fff',
                                        alignSelf: 'center',
                                    }}
                                >
                                    {score.score}
                                </Text>
                            </View>
                        ));
                    } else {
                        return (
                            <Text
                                style={{
                                    textAlign: 'center',
                                    fontWeight: '500',
                                    fontFamily: fontPixelifySansRegular,
                                    fontSize: dimensions.width * 0.06,
                                    color: '#fff',
                                    alignSelf: 'center',
                                }}
                            >
                                There are no scores yet.
                            </Text>
                        );
                    }
                })()
            }

        </SafeAreaView>
    );
};

const createDeepDiveAboutStyles = (dimensions) => StyleSheet.create({
    deepYellowOrangGradient: {
        left: 0,
        right: 0,
        top: 0,
        position: 'absolute',
        zIndex: 0,
        shadowOpacity: 0.2,
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
    },

});

export default DeepDiveScoresScreen;
