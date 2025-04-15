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
} from 'react-native';
import { ChevronLeftIcon } from 'react-native-heroicons/solid';
import LinearGradient from 'react-native-linear-gradient';
import GradientText from '../components/GradientText';


const fontNunitoBlack = 'Nunito-Black';
const fontNunitoRegular = 'Nunito-Regular';

const PingoSettingsScreen = ({ setSelectedDeepDiveScreen, selectedDeepDiveScreen, backgroundMusic, setBackgroundMusic }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));
    const styles = createDeepDiveAboutStyles(dimensions);

    const [sounds, setSounds] = useState(false);
    const [notifications, setNotifications] = useState(false);
    const [textWidths, setTextWidths] = useState({});
    const [selectedPingoCategory, setSelectedPingoCategory] = useState('Settings');

    const onTextLayout = (item, event) => {
        const { width } = event.nativeEvent.layout;
        setTextWidths(prev => ({ ...prev, [item]: width }));
    };

    const saveSetting = async (key, value) => {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error("Error saving setting:", error);
        }
    };

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const bgMusicValue = await AsyncStorage.getItem('backgroundMusic');
                if (bgMusicValue !== null) setBackgroundMusic(JSON.parse(bgMusicValue));

                const soundsValue = await AsyncStorage.getItem('sounds');
                if (soundsValue !== null) setSounds(JSON.parse(soundsValue));

                const notificationsValue = await AsyncStorage.getItem('notifications');
                if (notificationsValue !== null) setNotifications(JSON.parse(notificationsValue));
            } catch (error) {
                console.error("Error loading settings:", error);
            }
        };
        loadSettings();
    }, []);

    const sharePingoApp = async () => {
        try {
            await Share.share({
                message: `Join Pingo Questions for Couples! A fun game to get to know each other better. Download it now!`,
            });
        } catch (error) {
        }
    };

    return (
        <SafeAreaView style={{ width: dimensions.width }}>
            <TouchableOpacity
                onPress={() => {
                    setSelectedDeepDiveScreen('Home');
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

            <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: -dimensions.height * 0.01,
            }}>
                {['Settings', 'About'].map((item, index) => (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        key={index}
                        onPress={() => {
                            setSelectedPingoCategory(item);
                        }}
                        style={{
                            width: dimensions.width * 0.4,
                            alignSelf: 'center',
                            alignItems: 'center',
                            marginTop: dimensions.height * 0.05,
                            borderBottomColor: 'white',
                            marginHorizontal: dimensions.width * 0.05,
                        }}>
                        <Text
                            onLayout={(event) => onTextLayout(item, event)}
                            style={{
                                textAlign: 'center',
                                fontFamily: fontNunitoBlack,
                                fontSize: dimensions.width * 0.06,
                                color: 'white',
                                textTransform: 'uppercase',
                            }}>
                            {item}
                        </Text>

                        <View style={{
                            backgroundColor: selectedPingoCategory === item ? 'white' : 'transparent',
                            borderRadius: textWidths[item] ? textWidths[item] / 2 : 0,
                            width: textWidths[item] || 0,
                            height: dimensions.height * 0.008,
                            marginTop: dimensions.height * 0.005,
                        }} />
                    </TouchableOpacity>
                ))}
            </View>

            {selectedPingoCategory === 'Settings' ? (
                <>
                    {[
                        { label: 'Sounds', key: 'sounds', value: sounds, setter: setSounds },
                        { label: 'Vibration', key: 'notifications', value: notifications, setter: setNotifications },
                    ].map((item, index) => (
                        <View key={index} style={{
                            width: dimensions.width * 0.92,
                            alignSelf: 'center',
                            alignItems: 'center',
                            marginTop: dimensions.height * 0.05,
                        }}>
                            <Text
                                style={{
                                    textAlign: 'center',
                                    textTransform: 'uppercase',
                                    fontFamily: fontNunitoBlack,
                                    fontSize: dimensions.width * 0.06,
                                    color: '#fff',
                                }}>
                                {item.label}
                            </Text>

                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: dimensions.height * 0.02,
                            }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        const newValue = !item.value;
                                        item.setter(newValue);
                                        saveSetting(item.key, newValue);
                                    }}
                                    style={{
                                        width: dimensions.width * 0.3,
                                        height: dimensions.height * 0.06,
                                        justifyContent: 'center',
                                        alignItems: item.value ? 'flex-end' : 'flex-start',
                                        backgroundColor: 'white',
                                        borderRadius: dimensions.width * 0.1,
                                        paddingHorizontal: dimensions.width * 0.02,
                                    }}>
                                    <View style={{
                                        width: dimensions.width * 0.1,
                                        height: dimensions.width * 0.1,
                                        borderRadius: dimensions.width * 0.5,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                        <LinearGradient
                                            style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, borderRadius: dimensions.width * 0.5 }}
                                            colors={['#1A0C34', '#FA199A']}
                                            start={{ x: 0.5, y: 0 }}
                                            end={{ x: 0.5, y: 1 }}
                                        />

                                    </View>
                                </TouchableOpacity>

                                <Text
                                    style={{
                                        textAlign: 'center',
                                        fontFamily: fontNunitoBlack,
                                        fontSize: dimensions.width * 0.06,
                                        color: 'white',
                                        textTransform: 'uppercase',
                                        marginLeft: dimensions.width * 0.03,
                                    }}>
                                    {item.value ? 'On' : 'Off'}
                                </Text>
                            </View>
                        </View>
                    ))}

                    <Text
                        style={{
                            textAlign: 'center',
                            textTransform: 'uppercase',
                            fontFamily: fontNunitoBlack,
                            fontSize: dimensions.width * 0.05,
                            color: '#fff',
                            marginTop: dimensions.height * 0.05,
                        }}>
                        Delete photo from app
                    </Text>

                    <TouchableOpacity style={{
                        width: dimensions.width * 0.45,
                        height: dimensions.height * 0.08,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#FF9A9A',
                        borderRadius: dimensions.width * 0.1,
                        marginTop: dimensions.height * 0.02,
                        alignSelf: 'center',
                    }}
                        onPress={() => {

                        }}>
                        <Text
                            style={{
                                textAlign: 'center',
                                textTransform: 'uppercase',
                                fontFamily: fontNunitoBlack,
                                fontSize: dimensions.width * 0.05,
                                color: '#960000',
                            }}>
                            Delete
                        </Text>
                    </TouchableOpacity>
                </>
            ) : (
                <>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: dimensions.height * 0.03,
                        paddingHorizontal: dimensions.width * 0.05,
                    }}>
                        <Image
                            source={require('../assets/images/homeImage.png')}
                            style={{
                                width: dimensions.width * 0.45,
                                height: dimensions.width * 0.45,
                            }}
                            resizeMode='contain'
                        />
                        <Text
                            style={{
                                textAlign: 'left',
                                textTransform: 'uppercase',
                                fontFamily: fontNunitoBlack,
                                fontSize: dimensions.width * 0.025,
                                maxWidth: dimensions.width * 0.42,
                                color: 'white',
                            }}>
                            Pingo: Questions for Couples is a fun and dynamic game created for couples in love who want to get to know each other better. The game combines simplicity and interactivity, allowing you to ask questions and receive answers through an exciting ball game mechanism.
                        </Text>
                    </View>

                    <Text
                        style={{
                            textAlign: 'left',
                            textTransform: 'uppercase',
                            fontFamily: fontNunitoBlack,
                            fontSize: dimensions.width * 0.025,

                            color: 'white',
                            marginTop: dimensions.height * 0.03,
                            paddingHorizontal: dimensions.width * 0.05,
                        }}>
                        Features:{'\n'}

                        {'\n'}Two-player mode: Play with a partner, throw balls and answer each other's questions.{'\n'}

                        {'\n'}Online game: Play with a partner, answering questions that we have come up with for you, if you lack imagination or the questions are poorly formulated.{'\n'}

                        {'\n'}Sound and vibration: Adjust the sound of the ball falling and vibration during the game.{'\n'}

                        {'\n'}Game moments: After each game, you can take a photo of the moment and save it for viewing.{'\n'}

                        {'\n'}Remember, this is not only a way to spend time together, but also an opportunity to learn more about your partner in an entertaining and relaxed way.
                    </Text>

                    <TouchableOpacity
                        onPress={sharePingoApp}
                        style={{
                            width: dimensions.width * 0.4,
                            height: dimensions.height * 0.08,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'white',
                            borderRadius: dimensions.width * 0.1,
                            marginTop: dimensions.height * 0.05,
                            alignSelf: 'flex-start',
                            marginLeft: dimensions.width * 0.05,
                            flexDirection: 'row',
                        }}>
                        <GradientText
                            text='Share'
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

                        <Image
                            source={require('../assets/icons/sharePingoIcon.png')}
                            style={{
                                width: dimensions.width * 0.05,
                                height: dimensions.width * 0.05,
                                marginLeft: dimensions.width * 0.025,
                            }}
                            resizeMode='contain'
                        />
                    </TouchableOpacity>
                </>
            )}

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

export default PingoSettingsScreen;
