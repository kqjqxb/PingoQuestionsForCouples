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
    Switch,
    Linking,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const fontPixelifySansRegular = 'PixelifySans-Regular';

const DeepDiveSettingsScreen = ({ setSelectedDeepDiveScreen, selectedDeepDiveScreen, backgroundMusic, setBackgroundMusic}) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));
    const styles = createDeepDiveAboutStyles(dimensions);
    
    const [sounds, setSounds] = useState(false);
    const [notifications, setNotifications] = useState(false);

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
                    setSelectedDeepDiveScreen('Home');
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
                    Settings
                </Text>
            </View>

            {[
                { label: 'Background Music', key: 'backgroundMusic', value: backgroundMusic, setter: setBackgroundMusic },
                { label: 'Sounds', key: 'sounds', value: sounds, setter: setSounds },
                { label: 'Notifications', key: 'notifications', value: notifications, setter: setNotifications },
            ].map((item, index) => (
                <View key={index} style={{
                    width: dimensions.width * 0.92,
                    alignSelf: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: dimensions.height * 0.05,
                }}>
                    <Text
                        style={{
                            textAlign: 'center',
                            fontWeight: '500',
                            fontFamily: fontPixelifySansRegular,
                            fontSize: dimensions.width * 0.06,
                            color: '#fff',
                        }}>
                        {item.label}
                    </Text>

                    <Switch
                        trackColor={{ false: "rgba(120, 120, 128, 0.6)", true: '#f99410' }}
                        thumbColor={'#fff'}
                        ios_backgroundColor="rgba(120, 120, 128, 0.6)"
                        onValueChange={() => {
                            const newValue = !item.value;
                            item.setter(newValue);
                            saveSetting(item.key, newValue);
                        }}
                        value={item.value}
                    />
                </View>
            ))}

            <TouchableOpacity style={{
                marginTop: dimensions.height * 0.05,
                paddingHorizontal: dimensions.width * 0.05,
            }}
                onPress={() => {
                    Linking.openURL('https://google.com');
                }}
            >
                <Text
                    style={{
                        textAlign: 'left',
                        fontWeight: '500',
                        fontFamily: fontPixelifySansRegular,
                        fontSize: dimensions.width * 0.06,
                        color: '#fff',
                        
                    }}>
                    Terms of use
                </Text>
            </TouchableOpacity>

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

export default DeepDiveSettingsScreen;
