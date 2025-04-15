import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, Text, TouchableOpacity, Dimensions, Image, SafeAreaView, StyleSheet, PanResponder, Modal } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Sound from 'react-native-sound';

const fontPixelifySansRegular = 'PixelifySans-Regular';
const fontPlay = 'Play-Regular';

const fishes = {
  simple: [
    {
      id: 1,
      skin: require('../assets/images/fishes/fish2.png'),
      move: 'left',
    },
    {
      id: 2,
      skin: require('../assets/images/fishes/fish3.png'),
      move: 'right',
    },
    {
      id: 3,
      skin: require('../assets/images/fishes/fish1.png'),
      move: 'up',
    },
  ]
}

const proFishes = {
  simple: [
    {
      id: 1,
      skin: require('../assets/images/fishes/fish5.png'),
      move: 'left',
    },
    {
      id: 2,
      skin: require('../assets/images/fishes/fish6.png'),
      move: 'right',
    },
    {
      id: 3,
      skin: require('../assets/images/fishes/fish4.png'),
      move: 'up',
    },
  ]
}

const DeepDiveGameScreen = ({ setSelectedDeepDiveScreen, userFishesAmount, setUserFishesAmount, isSoundEnabled, selectedFishesSkin }) => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const styles = createDeepDiveStyles(dimensions);
  const [isDeepDiveStarted, setIsDeepDiveStarted] = useState(false);
  const [selectedDeepGameType, setSelectedDeepGameType] = useState('Quick Catch');
  const [fishScore, setFishScore] = useState(0);
  const [currentFish, setCurrentFish] = useState(null);
  const timerWidth = useRef(new Animated.Value(dimensions.width * 0.9)).current;
  const [modalVisible, setModalVisible] = useState(false);

  const currentFishRef = useRef(null);

  const generateNextFish = () => {
    let newFish;

    if (selectedFishesSkin === 1) {
      do {
        newFish = fishes.simple[Math.floor(Math.random() * fishes.simple.length)];
      } while (currentFishRef.current && newFish.id === currentFishRef.current.id);
    } else {
      do {
        newFish = proFishes.simple[Math.floor(Math.random() * proFishes.simple.length)];
      } while (currentFishRef.current && newFish.id === currentFishRef.current.id);
    }
    currentFishRef.current = newFish;
    setCurrentFish(newFish);
  };

  useEffect(() => {
    generateNextFish();
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => {
        console.log('onStartShouldSetPanResponder triggered');
        return true;
      },
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        console.log('onMoveShouldSetPanResponder dx:', gestureState.dx, 'dy:', gestureState.dy);
        return Math.abs(gestureState.dx) > 20 || Math.abs(gestureState.dy) > 20;
      },
      onPanResponderGrant: (evt, gestureState) => {
        console.log('PanResponder granted');
      },
      onPanResponderRelease: (evt, gestureState) => {
        console.log('Gesture released with dx:', gestureState.dx, 'dy:', gestureState.dy);
        let direction = null;
        if (Math.abs(gestureState.dx) > Math.abs(gestureState.dy)) {
          direction = gestureState.dx > 0 ? 'right' : 'left';
        } else {
          direction = gestureState.dy > 0 ? 'down' : 'up';
        }
        console.log('Swipe direction detected:', direction);
        if (currentFishRef.current && direction === currentFishRef.current.move) {
          console.log('Correct swipe! Expected:', currentFishRef.current.move);
          setFishScore(prevScore => prevScore + 1);
          if (isSoundEnabled) playSound(sound);
        } else {
          console.log('Incorrect swipe. Expected:', currentFishRef.current ? currentFishRef.current.move : 'none');
        }
        generateNextFish();
      },
    })
  ).current;

  const sound = 'single-beep.wav'

  Sound.setCategory('Playback');

  const playSound = (soundFile) => {
    const sound = new Sound(soundFile, Sound.MAIN_BUNDLE, (error) => {
      sound.setVolume(1);
      if (error) {
        console.log('Помилка при завантаженні файлу:', error);
        return;
      }
      sound.play((success) => {
        if (!success) {
          console.log('Помилка при відтворенні звуку');
        }
      });
    });
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedUserFishesAmount = await AsyncStorage.getItem('userFishesAmount');

        if (storedUserFishesAmount !== null) {
          setUserFishesAmount(JSON.parse(storedUserFishesAmount));
        } else {
          setUserFishesAmount(0);
          await AsyncStorage.setItem('userFishesAmount', JSON.stringify(0));
        }
      } catch (error) {
        console.error('Error loading stored data', error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('userFishesAmount', JSON.stringify(userFishesAmount));
  }, [userFishesAmount]);


  const gameActiveRef = useRef(isDeepDiveStarted);
  useEffect(() => {
    gameActiveRef.current = isDeepDiveStarted;
  }, [isDeepDiveStarted]);

  useEffect(() => {
    let animation;
    if (isDeepDiveStarted) {
      timerWidth.setValue(dimensions.width * 0.9);
      animation = Animated.timing(timerWidth, {
        toValue: 0,
        duration: 50000,
        useNativeDriver: false,
      });
      animation.start(() => {
        console.log('Timer ended');
        if (gameActiveRef.current) {
          setTimeout(() => {
            setModalVisible(true);
            setIsDeepDiveStarted(false);
          }, 0);
        }
      });
    } else {
      setUserFishesAmount(prev => {
        const newAmount = prev + fishScore;
        AsyncStorage.setItem('userFishesAmount', JSON.stringify(newAmount));
        const scoreResult = {
          score: fishScore,
          gameType: selectedDeepGameType,
        };
        if (modalVisible) {
          handleSaveResult(scoreResult);
        }
        return newAmount;
      });
    }
    return () => {
      if (animation) {
        animation.stop();
      }
    };
  }, [isDeepDiveStarted, dimensions.width]);

  const handleSaveResult = async (scoreResult) => {
    try {
      const storedScores = await AsyncStorage.getItem('scores');
      let scores = storedScores ? JSON.parse(storedScores) : [];
      if (!Array.isArray(scores)) {
        scores = [];
      }
      const newScores = [...scores, scoreResult];
      await AsyncStorage.setItem('scores', JSON.stringify(newScores));
    } catch (error) {
      console.error('Error saving scores:', error);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: dimensions.width * 0.93,
        alignSelf: 'center',
      }}>
        <View
          style={[styles.gradientButtonsStyles, {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: dimensions.width * 0.65,
            height: dimensions.width * 0.14,
            marginTop: dimensions.height * 0.015,
            paddingHorizontal: dimensions.width * 0.05,
          }]}
        >
          <LinearGradient
            style={[styles.deepOrangeGradient]}
            colors={['#EA173B', '#FFC100']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
          />
          <TouchableOpacity onPress={() => {
            if (!isDeepDiveStarted)
              setSelectedDeepDiveScreen('Home');
            else {
              setIsDeepDiveStarted(false);
              setModalVisible(false);
              // setFishScore(0);
            }
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
              fontSize: dimensions.width * 0.05,
              color: '#fff',
            }}>
            {!isDeepDiveStarted ? 'Set Up' : selectedDeepGameType}
          </Text>
        </View>

        <View
          style={[styles.gradientButtonsStyles, {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',

            width: dimensions.width * 0.25,
            height: dimensions.width * 0.14,
            marginTop: dimensions.height * 0.015,
            paddingHorizontal: dimensions.width * 0.01,
            backgroundColor: '#003186',
          }]}
        >
          <Text
            style={{
              textAlign: 'center',
              fontWeight: 700,
              fontFamily: fontPlay,
              fontSize: dimensions.width * 0.05,
              color: '#fff',
              marginRight: dimensions.width * 0.025,
            }}>
            {userFishesAmount ? userFishesAmount : 0}
          </Text>
          <Image
            source={require('../assets/images/fishImage.png')}
            style={{
              width: dimensions.width * 0.07,
              height: dimensions.width * 0.07,
            }}
            resizeMode='contain'
          />
        </View>
      </View>

      {!isDeepDiveStarted ? (
        <>
          <Image
            source={require('../assets/images/fisherman.png')}
            style={{
              width: dimensions.width * 0.6,
              height: dimensions.height * 0.5,
              position: 'absolute',
              bottom: dimensions.height * 0.05,
              right: -dimensions.width * 0.1,
            }}
            resizeMode='contain'
          />
          <Text style={[styles.galleryTitles, {
            marginTop: dimensions.height * 0.03,
            textAlign: 'left',
            paddingHorizontal: dimensions.width * 0.05,
            fontSize: dimensions.width * 0.05,
          }]}>
            Every great fisher knows — timing is everything!{'\n'}Set how long you wanna stay out in the deep.{'\n'}Longer sessions test your instincts, shorter ones sharpen your reflexes
          </Text>

          <View style={{
            alignSelf: 'center',
            marginTop: dimensions.height * 0.03,
            justifyContent: 'flex-start',
            width: dimensions.width * 0.9,
            alignItems: 'flex-start',
          }}>
            {['Quick Catch', 'Deep Drift', 'Endless Voyage'].map((item, index) => (
              <TouchableOpacity
                onPress={() => {
                  setSelectedDeepGameType(item);
                }}
                key={item}
                style={[styles.gradientButtonsStyles, {
                  width: dimensions.width * 0.55,
                  height: dimensions.width * 0.14,
                  marginTop: dimensions.height * 0.015,
                  backgroundColor: selectedDeepGameType === item ? 'transparent' : '#003186',
                  alignSelf: 'flex-start',
                }]}
              >
                {selectedDeepGameType === item && (
                  <LinearGradient
                    style={[styles.deepOrangeGradient, {
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
                    fontSize: dimensions.width * 0.045,
                    color: '#fff',
                    marginRight: dimensions.width * 0.025,
                  }}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            onPress={() => {
              setIsDeepDiveStarted(true);
            }}
            disabled={selectedDeepGameType === ''}
            style={[styles.gradientButtonsStyles, {
              width: dimensions.width * 0.8,
              height: dimensions.width * 0.14,
              marginTop: dimensions.height * 0.015,

              alignSelf: 'center',
              backgroundColor: selectedDeepGameType !== '' ? 'transparent' : '#003186',
              position: 'absolute',
              bottom: dimensions.height * 0.05,
              shadowColor: 'black',
              shadowOffset: {
                width: dimensions.width * 0.002,
                height: dimensions.height * 0.01
              },
              shadowOpacity: 0.4,
              shadowRadius: dimensions.width * 0.03,
            }]}
          >
            <LinearGradient
              style={[styles.deepOrangeGradient, {
              }]}
              colors={['#EA173B', '#FFC100']}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
            />
            <Text
              style={{
                textAlign: 'center',
                fontWeight: 700,
                fontFamily: fontPixelifySansRegular,
                fontSize: dimensions.width * 0.045,
                color: '#fff',
                marginRight: dimensions.width * 0.025,
              }}>
              Start
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <Animated.View
          {...panResponder.panHandlers}
          style={{
            width: dimensions.width,
            height: dimensions.height,
            alignSelf: 'center',
          }}
        >
          <View style={{
            width: dimensions.width * 0.9,
            height: dimensions.height * 0.012,
            marginTop: dimensions.height * 0.03,
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            borderRadius: dimensions.width * 0.1,
          }}>
            <Animated.View style={{
              width: timerWidth,
              height: dimensions.height * 0.012,
              backgroundColor: '#FFC100',
              alignSelf: 'flex-start',
              borderRadius: dimensions.width * 0.1,
            }} />
          </View>
          <View
            style={[styles.gradientButtonsStyles, {
              alignItems: 'center',
              justifyContent: 'center',

              width: dimensions.width * 0.25,
              height: dimensions.width * 0.14,
              marginTop: dimensions.height * 0.015,
              paddingHorizontal: dimensions.width * 0.05,
              backgroundColor: '#003186',
            }]}
          >
            <Text
              style={{
                textAlign: 'center',
                fontWeight: 700,
                fontFamily: fontPixelifySansRegular,
                fontSize: dimensions.width * 0.0555,
                alignSelf: 'center',
                color: '#fff',
              }}>
              {fishScore}
            </Text>
          </View>


          {currentFish && (
            <Image
              source={currentFish.skin}
              style={{
                width: dimensions.width * 0.6,
                height: dimensions.height * 0.2,
                marginTop: dimensions.height * 0.3,
                alignSelf: 'center',
              }}
              resizeMode='contain'
            />
          )}
        </Animated.View>
      )}

      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <SafeAreaView style={{
          width: dimensions.width,
          height: dimensions.height,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Image
            source={require('../assets/images/modalImage.png')}
            style={{
              width: dimensions.width,
              height: dimensions.height,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />

          <View
            style={[styles.gradientButtonsStyles, {
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: dimensions.width * 0.65,
              height: dimensions.width * 0.14,
              marginTop: dimensions.height * 0.015,
              paddingHorizontal: dimensions.width * 0.05,
              justifyContent: 'center',
            }]}
          >
            <LinearGradient
              style={[styles.deepOrangeGradient]}
              colors={['#EA173B', '#FFC100']}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
            />
            <Text style={styles.pixelifyText}>
              ⏳ Dive Complete!
            </Text>
          </View>

          <View style={{
            width: dimensions.width * 0.9,
            paddingHorizontal: dimensions.width * 0.05,
            backgroundColor: '#003186',
          }}>
            <View
              style={[styles.gradientButtonsStyles, {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }]}
            >
              <Text
                style={{
                  textAlign: 'center',
                  fontWeight: 700,
                  fontFamily: fontPlay,
                  fontSize: dimensions.width * 0.06,
                  color: '#fff',
                  marginRight: dimensions.width * 0.025,
                }}>
                {fishScore ? fishScore : 0}
              </Text>
              <Image
                source={require('../assets/images/fishImage.png')}
                style={{
                  width: dimensions.width * 0.07,
                  height: dimensions.width * 0.07,
                }}
                resizeMode='contain'
              />

            </View>

            <Text
              style={{
                textAlign: 'center',
                fontWeight: 400,
                fontFamily: fontPlay,
                fontSize: dimensions.width * 0.045,
                color: '#fff',
                marginRight: dimensions.width * 0.025,
                marginTop: dimensions.height * 0.01,
              }}>
              You stayed sharp the whole time — no fish escaped.{'\n'}Let’s check your results!
            </Text>

            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                setIsDeepDiveStarted(true);
                setFishScore(0);

              }}
              style={{
                width: dimensions.width * 0.8,
                height: dimensions.height * 0.06,
                backgroundColor: '#FFC100',
                marginTop: dimensions.height * 0.03,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={styles.pixelifyText}>
                Play Again
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                setSelectedDeepDiveScreen('Home');
                setIsDeepDiveStarted(false);
              }}
              style={{
                width: dimensions.width * 0.8,
                height: dimensions.height * 0.06,
                marginTop: dimensions.height * 0.015,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: dimensions.height * 0.02,
              }}>
              <Text style={styles.pixelifyText}>
                Quit menu
              </Text>
            </TouchableOpacity>
          </View>

        </SafeAreaView>

      </Modal>

    </SafeAreaView>
  );
};

const createDeepDiveStyles = (dimensions) => StyleSheet.create({
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
  galleryTitles: {
    textAlign: 'center',
    fontWeight: '500',
    fontFamily: fontPixelifySansRegular,
    fontSize: dimensions.width * 0.06,
    color: '#fff',
    marginTop: dimensions.height * 0.05,
  },
  paginatorsStyles: {
    width: dimensions.width * 0.4,
    height: dimensions.height * 0.23,
    marginTop: dimensions.height * 0.01,
    padding: dimensions.width * 0.017,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blackAbsoluteItemView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceText: {
    textAlign: 'center',
    fontWeight: 700,
    fontFamily: fontPlay,
    fontSize: dimensions.width * 0.06,
    color: '#fff',
    marginRight: dimensions.width * 0.025,
  },
  priceView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: dimensions.height * 0.01,
  },
  pixelifyText: {
    textAlign: 'center',
    fontWeight: '700',
    fontFamily: fontPixelifySansRegular,
    fontSize: dimensions.width * 0.05,
    color: '#fff',
  }
});

export default DeepDiveGameScreen;
