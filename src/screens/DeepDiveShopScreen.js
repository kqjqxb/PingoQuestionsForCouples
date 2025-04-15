import React, { useEffect, useRef, useState } from 'react';
import { View, FlatList, Animated, Text, TouchableOpacity, Dimensions, Image, SafeAreaView, StyleSheet, ScrollView, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { LockClosedIcon } from 'react-native-heroicons/solid';
import AsyncStorage from '@react-native-async-storage/async-storage';
const fontPixelifySansRegular = 'PixelifySans-Regular';
const fontPlay = 'Play-Regular';

const DeepDiveShopScreen = ({ setSelectedPingoScreen, deepBackgrounds, fishSkins, setSelectedFishSkin, setSelectedDeepBackground, userFishesAmount, setUserFishesAmount }) => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [bgCurrentIndex, setBgCurrentIndex] = useState(0);
  const [fishSkinCurrentIndex, setFishSkinCurrentIndex] = useState(0);
  const styles = createDeepDiveStyles(dimensions);
  const [ownedBackgrounds, setOwnedBackgrounds] = useState([1]);
  const [ownedFishSkins, setOwnedFishSkins] = useState([1]);


  useEffect(() => {
    const loadData = async () => {
      try {
        const storedBackgrounds = await AsyncStorage.getItem('ownedBackgrounds');
        const storedFishSkins = await AsyncStorage.getItem('ownedFishSkins');

        if (storedBackgrounds !== null) {
          setOwnedBackgrounds(JSON.parse(storedBackgrounds));
        } else {
          setOwnedBackgrounds([1]);
          await AsyncStorage.setItem('ownedBackgrounds', JSON.stringify([1]));
        }

        if (storedFishSkins !== null) {
          setOwnedFishSkins(JSON.parse(storedFishSkins));
        } else {
          setOwnedFishSkins([1]);
          await AsyncStorage.setItem('ownedFishSkins', JSON.stringify([1]));
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

  const deepBackgroundsAction = async (propsBg) => {
    if (ownedBackgrounds.includes(propsBg.id)) {
      setSelectedDeepBackground(propsBg.deepBg);
      AsyncStorage.setItem('selectedDeepBackground', JSON.stringify(propsBg.deepBg));
    } else {
      if (userFishesAmount >= 30) {
        Alert.alert('Buy Background', 'Do you want to buy this background?', [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'OK', onPress: () => {
              setOwnedBackgrounds([...ownedBackgrounds, propsBg.id]);
              setSelectedDeepBackground(propsBg.deepBg);
              AsyncStorage.setItem('ownedBackgrounds', JSON.stringify([...ownedBackgrounds, propsBg.id]));
              const newAmount = userFishesAmount - 30;
              setUserFishesAmount(newAmount);
              AsyncStorage.setItem('userFishesAmount', JSON.stringify(newAmount));
              AsyncStorage.setItem('selectedDeepBackground', JSON.stringify(propsBg.deepBg));
            }
          }
        ]);
      } else {
        Alert.alert('Not enough fishes', 'You need 30 fishes to buy this background');
      }
    }
  }

  const deepFishSkinsAction = async (propsFish) => {
    if (ownedFishSkins.includes(propsFish.id)) {
      setSelectedFishSkin(propsFish.id);
      AsyncStorage.setItem('selectedFishSkin', JSON.stringify(propsFish.id));
    } else {
      if (userFishesAmount >= 50) {
        Alert.alert('Buy Skins', 'Do you want to buy this fish skins?', [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'OK', onPress: () => {
              setOwnedFishSkins([...ownedFishSkins, propsFish.id]);

              setSelectedFishSkin(propsFish.id);
              AsyncStorage.setItem('selectedFishSkin', JSON.stringify(propsFish.id));

              AsyncStorage.setItem('ownedFishSkins', JSON.stringify([...ownedFishSkins, propsFish.id]));
              const newAmount = userFishesAmount - 50;
              setUserFishesAmount(newAmount);
              AsyncStorage.setItem('userFishesAmount', JSON.stringify(newAmount));
            }
          }
        ]);
      } else {
        Alert.alert('Not enough fishes', 'You need 50 fishes to buy this Skins');
      }
    }
  }

  const handleFishSkinScrollEnd = (e) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / dimensions.width);
    setFishSkinCurrentIndex(index);
  };


  useEffect(() => {
    const onChange = ({ window }) => {
      setDimensions(window);
    };
    const dimensionListener = Dimensions.addEventListener('change', onChange);
    return () => {
      dimensionListener.remove();
    };
  }, []);

  const handleBackgroundScrollEnd = (e) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / dimensions.width);
    setBgCurrentIndex(index);
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
          style={[styles.deepGradientButtonsStyles, {
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
            style={[styles.deepYellowOranGradient]}
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
            Shop
          </Text>
        </View>

        <View
          style={[styles.deepGradientButtonsStyles, {
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

      <Text
        style={{
          textAlign: 'left',
          fontFamily: fontPlay,
          fontSize: dimensions.width * 0.045,
          color: '#fff',
          paddingHorizontal: dimensions.width * 0.05,
          marginTop: dimensions.height * 0.04,
        }}>
        Tired of the same old sea? Freshen up your dive with new looks and legendary fish
      </Text>

      <Text style={[styles.galleryTitles, {
        marginTop: dimensions.height * 0.03,
      }]}>
        🌊 Backgrounds
      </Text>

      <View style={{
        width: dimensions.width,
        height: dimensions.height * 0.24,
      }}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleBackgroundScrollEnd}
          contentContainerStyle={{
            flexDirection: 'row',
            width: dimensions.width * 4,
          }}
          style={{
            zIndex: 555555,
            width: dimensions.width,
            height: dimensions.height,
            flex: 1,

          }}
        >
          {deepBackgrounds.map((deepBg, index) => (
            <TouchableOpacity
              onPress={() => { deepBackgroundsAction(deepBg) }}
              activeOpacity={0.8}
              key={index} style={{
                width: dimensions.width,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View style={styles.paginatorsStyles}>
                <LinearGradient
                  style={[styles.deepYellowOranGradient]}
                  colors={['#EA173B', '#FFC100']}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                />
                <Image
                  pointerEvents="none"
                  source={deepBg.deepBg}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                  resizeMode='cover'
                />
                {!ownedBackgrounds.includes(index + 1) && (
                  <View style={styles.blackAbsoluteItemView}>
                    <LockClosedIcon size={dimensions.height * 0.04} color='white' />
                    <View style={styles.priceView}>
                      <Text style={styles.priceText}>
                        30
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
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={{
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: dimensions.height * 0.01,
      }}>
        {[0, 1, 2, 3].map((paginatorIndex) => (
          <View
            key={paginatorIndex}
            style={{
              width: dimensions.width * 0.03,
              height: dimensions.width * 0.03,
              backgroundColor: bgCurrentIndex === paginatorIndex ? 'transparent' : '#fff',
              marginHorizontal: dimensions.width * 0.01,
            }}
          >
            {bgCurrentIndex === paginatorIndex && (
              <LinearGradient
                style={[styles.deepYellowOranGradient]}
                colors={['#EA173B', '#FFC100']}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
              />
            )}
          </View>
        ))}
      </View>

      <Text style={styles.galleryTitles}>
        🐠 Fish Skins
      </Text>

      <View style={{
        width: dimensions.width,
        height: dimensions.height * 0.24,
      }}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleFishSkinScrollEnd}
          contentContainerStyle={{
            flexDirection: 'row',
            width: dimensions.width * 2,
          }}
          style={{
            zIndex: 555555,
            width: dimensions.width,
            height: dimensions.height,
            flex: 1,
          }}
        >
          {fishSkins.map((deepFishSkins, index) => (
            <TouchableOpacity
              onPress={() => { deepFishSkinsAction(deepFishSkins) }}
              activeOpacity={0.8}
              key={index} style={{
                width: dimensions.width,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View style={styles.paginatorsStyles}>
                <LinearGradient
                  style={[styles.deepYellowOranGradient]}
                  colors={['#EA173B', '#FFC100']}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                />
                <Image
                  pointerEvents="none"
                  source={deepFishSkins.fishSkin}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                  resizeMode='stretch'
                />

                {!ownedFishSkins.includes(index + 1) && (
                  <View style={styles.blackAbsoluteItemView}>
                    <LockClosedIcon size={dimensions.height * 0.04} color='white' />
                    <View style={styles.priceView}>
                      <Text style={styles.priceText}>
                        50
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
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={{
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: dimensions.height * 0.01,
      }}>
        {[0, 1].map((paginatorIndex) => (
          <View
            key={paginatorIndex}
            style={{
              width: dimensions.width * 0.03,
              height: dimensions.width * 0.03,
              backgroundColor: fishSkinCurrentIndex === paginatorIndex ? 'transparent' : '#fff',
              marginHorizontal: dimensions.width * 0.01,
            }}
          >
            {fishSkinCurrentIndex === paginatorIndex && (
              <LinearGradient
                style={[styles.deepYellowOranGradient]}
                colors={['#EA173B', '#FFC100']}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
              />
            )}
          </View>
        ))}
      </View>
    </SafeAreaView>
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
  }
});

export default DeepDiveShopScreen;
