import React, { useEffect, useRef, useState } from 'react';
import { View, FlatList, Animated, Text, TouchableOpacity, Dimensions, Image, SafeAreaView, StyleSheet } from 'react-native';
import onboardingPingoData from '../components/onboardingPingoData';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { ChevronLeftIcon, ChevronRightIcon } from 'react-native-heroicons/solid';


const fontNunitoBlack = 'Nunito-Black';
const fontNunitoRegular = 'Nunito-Regular';

const PingoOnboardScreen = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const styles = PingoGradientStyles(dimensions);
  const [currentCallEnSlideToSportIndex, setCurrentCallEnSlideToSportIndex] = useState(0);
  const callEnSlidesToSportRef = useRef(null);
  const callEnScrollToSportX = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  useEffect(() => {
    const onChange = ({ window }) => {
      setDimensions(window);
    };
    const dimensionListener = Dimensions.addEventListener('change', onChange);
    return () => {
      dimensionListener.remove();
    };
  }, []);

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentCallEnSlideToSportIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollToTheNextCallEnSportSlide = () => {
    if (currentCallEnSlideToSportIndex < onboardingPingoData.length - 1) {
      callEnSlidesToSportRef.current.scrollToIndex({ index: currentCallEnSlideToSportIndex + 1 });
    } else {
      navigation.replace('Home');
    }
  };

  const callEnRenderItem = ({ item }) => (
    <View style={{
      alignItems: 'center',

      justifyContent: 'space-between',

      flex: 1,

      width: dimensions.width,
    }}>
      <View style={{
        alignItems: 'center',
        alignSelf: 'flex-start',
        width: dimensions.width,
      }}>
        <Image
          source={item.callEnImage}
          style={{
            borderBottomLeftRadius: dimensions.width * 0.05,
            width: dimensions.width * 0.9,
            borderBottomRightRadius: dimensions.width * 0.05,
            alignSelf: 'center',
            height: dimensions.height * 0.4,
          }}
          resizeMode="stretch"
        />
        <Text
          style={{
            paddingHorizontal: dimensions.width * 0.05,
            textAlign: 'center',
            color: 'white',
            fontSize: dimensions.width * 0.06,
            maxWidth: dimensions.width * 0.89,
            alignSelf: 'center',
            fontFamily: fontNunitoBlack,
            marginTop: dimensions.height * 0.02,
            textTransform: 'uppercase',
          }}>
          {item.title}
        </Text>
        <Text
          style={{
            color: '#fff',
            marginTop: dimensions.height * 0.02,
            fontWeight: 400,
            textAlign: 'center',
            paddingHorizontal: dimensions.width * 0.05,
            fontFamily: fontNunitoRegular,
            alignSelf: 'center',
            fontSize: dimensions.width * 0.037,
            maxWidth: dimensions.width * 0.8,
          }}>
          {item.description}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={{ 
        alignItems: 'center', 
        backgroundColor: '#160002', 
        flex: 1, 
        justifyContent: 'space-between', 
      }}
    >
      <LinearGradient
        style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
        colors={['#1A0C34', '#FA199A']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      <View style={{ display: 'flex' }}>
        <FlatList
          bounces={false}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          renderItem={callEnRenderItem}
          data={onboardingPingoData}
          viewabilityConfig={viewConfig}
          keyExtractor={(item) => item.id.toString()}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: callEnScrollToSportX } } }], {
            useNativeDriver: false,
          })}
          ref={callEnSlidesToSportRef}
          scrollEventThrottle={32}
          onViewableItemsChanged={viewableItemsChanged}
        />
      </View>

      <TouchableOpacity
        onPress={() => {
          scrollToTheNextCallEnSportSlide();
        }}
        style={{
          borderRadius: dimensions.width * 0.5,
          width: dimensions.width * 0.2,
          height: dimensions.width * 0.2,
          alignItems: 'center',
          justifyContent: 'center',
          bottom: dimensions.height * 0.13,
          alignSelf: 'center',
          backgroundColor: 'white'
        }}
      >
        <ChevronRightIcon size={dimensions.width * 0.12} color='#FA199A' style={{marginLeft: dimensions.width * 0.01}}/>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const PingoGradientStyles = (dimensions) => StyleSheet.create({
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
});

export default PingoOnboardScreen;
