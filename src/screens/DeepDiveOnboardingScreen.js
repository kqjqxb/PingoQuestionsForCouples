import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Image, SafeAreaView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

const fontPixelifySansRegular = 'PixelifySans-Regular';

const DeepDiveOnboardingScreen = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const styles = createDeepDiveStyles(dimensions);
  const navigation = useNavigation();

  return (
    <SafeAreaView
      style={{
        alignItems: 'center',
        backgroundColor: '#160002',
        flex: 1,
        justifyContent: 'flex-end',
      }}
    >
      <Image
        source={require('../assets/images/onboardingDeepDiveImage.png')}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
          width: dimensions.width,
          height: dimensions.height,
        }}
      />
      <View style={{
        width: dimensions.width,
        height: dimensions.height,
        backgroundColor: 'rgba(3, 63, 159, 0.4)',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
      }} />

      <Image
        source={require('../assets/images/welkomeTextImage.png')}
        style={{
          zIndex: 0,
          width: dimensions.width * 0.8,
          height: dimensions.height * 0.15,
          alignSelf: 'center',
        }}
        resizeMode='contain'
      />
      <Text
        style={{
          textAlign: 'left',
          fontWeight: 700,
          fontFamily: fontPixelifySansRegular,
          fontSize: dimensions.width * 0.06,
          color: '#fff',
          marginRight: dimensions.width * 0.025,
          alignSelf: 'flex-start',
          paddingHorizontal: dimensions.width * 0.05,
          marginBottom: dimensions.height * 0.03,
        }}>
        Ready to test your reflexes beneath the waves?Out here, it’s just you, the fish... and the swipe.
      </Text>


      <TouchableOpacity
        onPress={() => {
          navigation.replace('Home');
        }}
        style={[styles.gradientButtonsStyles, {
          width: dimensions.width * 0.85,
          height: dimensions.width * 0.14,
          marginBottom: dimensions.height * 0.03,
        }]}
      >
        <LinearGradient
          style={[styles.deepYellowGradient, {
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
            fontSize: dimensions.width * 0.06,
            color: '#fff',
          }}>
          Next
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const createDeepDiveStyles = (dimensions) => StyleSheet.create({
  deepYellowGradient: {
    left: 0,
    top: 0,
    shadowOpacity: 0.4,
    zIndex: 0,
    right: 0,
    elevation: 7,
    shadowColor: 'black',
    shadowRadius: dimensions.width * 0.03,
    position: 'absolute',
    bottom: 0,
    shadowOffset: {
      width: dimensions.width * 0.002,
      height: dimensions.height * 0.01
    },
  },
  gradientButtonsStyles: {
    height: dimensions.width * 0.17,
    width: dimensions.width * 0.17,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  }
});

export default DeepDiveOnboardingScreen;
