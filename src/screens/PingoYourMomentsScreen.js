import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    Dimensions,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    Animated,
} from 'react-native';
import { ChevronLeftIcon } from 'react-native-heroicons/solid';
import GradientText from '../components/GradientText';
import { launchCamera } from 'react-native-image-picker';
import CameraRoll from '@react-native-community/cameraroll';

const fontNunitoBlack = 'Nunito-Black';
const fontNunitoRegular = 'Nunito-Regular';
const fontNunitoExtraBold = 'Nunito-ExtraBold';

const PingoYourMomentsScreen = ({ setSelectedPingoScreen}) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));
    const styles = createPingoSettingsStyles(dimensions);

    const [isImageOpened, setImageOpened] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [images, setImages] = useState([]);
    const successOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const loadStoredImages = async () => {
            try {
                const stored = await AsyncStorage.getItem('capturedImages');
                if (stored) {
                    setImages(JSON.parse(stored));
                }
            } catch (error) {
                console.error("Error loading stored images", error);
            }
        };
        loadStoredImages();
    }, []);

    const handleOpenCamera = async () => {
        const options = {
            mediaType: 'photo',
            cameraType: 'back',
            saveToPhotos: false,
        };

        try {
            const result = await launchCamera(options);
            if (result.assets && result.assets.length > 0) {
                const uri = result.assets[0].uri;
                const updatedImages = [...images, uri];
                setImages(updatedImages);
                await AsyncStorage.setItem('capturedImages', JSON.stringify(updatedImages));
            }
        } catch (error) {
            console.error("Error launching camera", error);
        }
    };

    const handleSaveImage = async () => {
        if (!selectedImage) return;
        try {
            const savedUri = await CameraRoll.save(selectedImage, { type: 'photo' });
            console.log('Image saved to gallery:', savedUri);
            Animated.sequence([
                Animated.timing(successOpacity, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.delay(1500),
                Animated.timing(successOpacity, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]).start();
        } catch (error) {
            console.error("Error saving image to gallery", error);
        }
    };

    const handleDeleteImage = async () => {
        if (!selectedImage) return;
        const updatedImages = images.filter(item => item !== selectedImage);
        setImages(updatedImages);
        await AsyncStorage.setItem('capturedImages', JSON.stringify(updatedImages));
        setImageOpened(false);
        setSelectedImage(null);
    };

    return (
        <SafeAreaView style={{ width: dimensions.width, flex: 1 }}>
            <TouchableOpacity
                onPress={() => {
                    if (isImageOpened) {
                        setImageOpened(false);
                        setSelectedImage(null);
                    } else setSelectedPingoScreen('Home');
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
                YOUR MOMENTS
            </Text>

            {!isImageOpened ? (
                <>
                    <ScrollView showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingBottom: dimensions.height * 0.15,
                        }}
                    >
                        <View style={{
                            alignSelf: 'center',
                            width: dimensions.width * 0.9,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: dimensions.height * 0.025,
                            flexWrap: 'wrap',
                        }}>
                            {images.length > 0 ? (
                                images.map((item, index) => (
                                    <TouchableOpacity key={index}
                                        onPress={() => {
                                            setSelectedImage(item);
                                            setImageOpened(true);
                                        }}>
                                        <Image
                                            source={{ uri: item }}
                                            style={{
                                                width: dimensions.width * 0.43,
                                                height: dimensions.width * 0.43,
                                                marginTop: dimensions.height * 0.01,
                                                alignSelf: 'center',
                                                borderRadius: dimensions.width * 0.05,
                                            }}
                                            resizeMode='cover'
                                        />
                                    </TouchableOpacity>
                                ))
                            ) : (
                                <>
                                    <Text
                                        style={{
                                            textAlign: 'center',
                                            textTransform: 'uppercase',
                                            fontFamily: fontNunitoRegular,
                                            fontSize: dimensions.width * 0.045,
                                            paddingHorizontal: dimensions.width * 0.05,
                                            marginTop: dimensions.height * 0.5,
                                            color: 'white',
                                        }}>
                                        You don't have moments, but you can make them now.
                                    </Text>
                                </>
                            )}
                        </View>
                    </ScrollView>

                    <TouchableOpacity
                        onPress={handleOpenCamera}
                        style={{
                            width: dimensions.width * 0.35,
                            height: dimensions.height * 0.1,
                            position: 'absolute',
                            bottom: dimensions.height * 0.03,
                            alignSelf: 'center',
                            backgroundColor: 'white',
                            borderRadius: dimensions.width * 0.15,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                        <Image
                            source={require('../assets/images/cameraImage.png')}
                            style={{
                                width: dimensions.width * 0.15,
                                height: dimensions.width * 0.15,
                                alignSelf: 'center',
                            }}
                            resizeMode='contain'
                        />
                    </TouchableOpacity>
                </>
            ) : (
                <>
                    <Image
                        source={{ uri: selectedImage }}
                        style={{
                            width: dimensions.width * 0.9,
                            height: dimensions.height * 0.4,
                            marginTop: dimensions.height * 0.01,
                            alignSelf: 'center',
                            borderRadius: dimensions.width * 0.05,
                        }}
                        resizeMode='cover'
                    />

                    <View style={{
                        width: dimensions.width * 0.9,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: dimensions.height * 0.025,
                        alignSelf: 'center',
                    }}>
                        <TouchableOpacity style={[{
                            backgroundColor: '#FF9A9A',
                        }, styles.buttonsDeleteSave]}
                            onPress={handleDeleteImage}
                        >
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

                        <TouchableOpacity style={[{
                            backgroundColor: 'white',
                        }, styles.buttonsDeleteSave]}
                            onPress={handleSaveImage}
                        >
                            <GradientText
                                text='Save'
                                style={{
                                    paddingHorizontal: dimensions.width * 0.05,
                                    alignSelf: 'center',
                                    fontSize: dimensions.width * 0.05,
                                    maxWidth: dimensions.width * 0.89,
                                    textTransform: 'uppercase',
                                    fontFamily: fontNunitoBlack,
                                    textAlign: 'center',
                                }}
                                gradientColors={['#EF1895', '#1D0C35']}
                            />
                        </TouchableOpacity>
                    </View>
                </>
            )}

            <Animated.View style={{
                position: 'absolute',
                top: dimensions.height / 2 - 40,
                left: dimensions.width * 0.1,
                right: dimensions.width * 0.1,
                opacity: successOpacity,
                justifyContent: 'center',
                padding: 15,
                borderRadius: 10,
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
            }}>
                <Text style={{
                    color: 'white',
                    fontFamily: fontNunitoExtraBold,
                    fontSize: 18,
                    textAlign: 'center',
                }}>
                    Image saved successfully!
                </Text>
            </Animated.View>
        </SafeAreaView>
    );
};

const createPingoSettingsStyles = (dimensions) => StyleSheet.create({
    buttonsDeleteSave: {
        width: dimensions.width * 0.43,
        height: dimensions.height * 0.08,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: dimensions.width * 0.1,
        marginTop: dimensions.height * 0.02,
        alignSelf: 'center',
    }
});

export default PingoYourMomentsScreen;
