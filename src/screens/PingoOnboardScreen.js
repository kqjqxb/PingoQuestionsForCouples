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
  const [currentPingoSlideIndex, setCurrentPingoSlideIndex] = useState(0);
  const pingoRef = useRef(null);
  const navigation = useNavigation();
  const pingoScrollX = useRef(new Animated.Value(0)).current;
  const styles = PingoGradientStyles(dimensions);

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
      setCurrentPingoSlideIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollToTheNextPingoSlideElement = () => {
    if (currentPingoSlideIndex < onboardingPingoData.length - 1) {
      pingoRef.current.scrollToIndex({ index: currentPingoSlideIndex + 1 });
    } else {
      navigation.replace('Home');
    }
  };

  const renderPingoItem = ({ item }) => (
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
          source={item.pingoImage}
          style={{
            alignSelf: 'center',
            borderBottomLeftRadius: dimensions.width * 0.05,
            height: dimensions.height * 0.4,
            borderBottomRightRadius: dimensions.width * 0.05,
            width: dimensions.width * 0.9,
          }}
          resizeMode="stretch"
        />
        <Text
          style={{
            marginTop: dimensions.height * 0.02,
            textAlign: 'center',
            textTransform: 'uppercase',
            color: 'white',
            fontSize: dimensions.width * 0.06,
            maxWidth: dimensions.width * 0.89,
            alignSelf: 'center',
            fontFamily: fontNunitoBlack,
            paddingHorizontal: dimensions.width * 0.05,
          }}>
          {item.title}
        </Text>
        <Text
          style={{
            fontSize: dimensions.width * 0.037,
            marginTop: dimensions.height * 0.02,
            maxWidth: dimensions.width * 0.8,
            fontWeight: 400,
            textAlign: 'center',
            paddingHorizontal: dimensions.width * 0.05,
            fontFamily: fontNunitoRegular,
            alignSelf: 'center',
            color: '#fff',
          }}>
          {item.pingoBottomOnbText}
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
          viewabilityConfig={viewConfig}
          data={onboardingPingoData}
          onViewableItemsChanged={viewableItemsChanged}
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          renderItem={renderPingoItem}
          horizontal
          keyExtractor={(item) => item.id.toString()}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: pingoScrollX } } }], {
            useNativeDriver: false,
          })}
          scrollEventThrottle={32}
          ref={pingoRef}
        />
      </View>

      <TouchableOpacity
        onPress={() => {
          scrollToTheNextPingoSlideElement();
        }}
        style={{
          alignSelf: 'center',
          width: dimensions.width * 0.2,
          backgroundColor: 'white',
          height: dimensions.width * 0.2,
          alignItems: 'center',
          justifyContent: 'center',
          bottom: dimensions.height * 0.13,
          borderRadius: dimensions.width * 0.5,
        }}
      >
        <ChevronRightIcon size={dimensions.width * 0.12} color='#FA199A' style={{marginLeft: dimensions.width * 0.01}}/>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const PingoGradientStyles = (dimensions) => StyleSheet.create({
});

export default PingoOnboardScreen;
