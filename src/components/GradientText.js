import React from 'react';
import { Text, StyleSheet } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';

const GradientText = ({ text, style, gradientColors = ['#EF1895', '#1D0C35'] }) => {
  return (
    <MaskedView
      maskElement={<Text style={[style, styles.maskedText]}>{text}</Text>}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={[style, { opacity: 0 }]}>{text}</Text>
      </LinearGradient>
    </MaskedView>
  );
};

const styles = StyleSheet.create({
  maskedText: {
    backgroundColor: 'transparent',
  },
});

export default GradientText;