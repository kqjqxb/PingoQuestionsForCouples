import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Easing } from 'react-native';

const Loader = () => {
  // Створюємо 3 анімованих значення для кружечків та 3 для "тіней"
  const circleAnim1 = useRef(new Animated.Value(0)).current;
  const circleAnim2 = useRef(new Animated.Value(0)).current;
  const circleAnim3 = useRef(new Animated.Value(0)).current;
  const shadowAnim1 = useRef(new Animated.Value(0)).current;
  const shadowAnim2 = useRef(new Animated.Value(0)).current;
  const shadowAnim3 = useRef(new Animated.Value(0)).current;

  // Функція для запуску анімації з затримкою
  const runLoopAnimation = (animValue, delay) => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(animValue, {
          toValue: 1,
          duration: 500,
          easing: Easing.ease,
          useNativeDriver: false,
        }),
        Animated.timing(animValue, {
          toValue: 0,
          duration: 500,
          easing: Easing.ease,
          useNativeDriver: false,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    runLoopAnimation(circleAnim1, 0);
    runLoopAnimation(circleAnim2, 200);
    runLoopAnimation(circleAnim3, 300);
    runLoopAnimation(shadowAnim1, 0);
    runLoopAnimation(shadowAnim2, 200);
    runLoopAnimation(shadowAnim3, 300);
  }, []);

  // Інтерполяція для кружечків: вертикальне переміщення та змінна висота
  const circleStyle = (anim) => {
    const translateY = anim.interpolate({
      inputRange: [0, 1],
      outputRange: [60, 0],
    });
    const height = anim.interpolate({
      inputRange: [0, 0.4, 1],
      outputRange: [5, 20, 20],
    });
    const scaleX = anim.interpolate({
      inputRange: [0, 0.4, 1],
      outputRange: [1.7, 1, 1],
    });
    return {
      transform: [{ translateY }, { scaleX }],
      height,
      width: 20,
      borderRadius: 10,
      backgroundColor: '#fff',
      position: 'absolute',
    };
  };

  // Інтерполяція для тіней: масштаб та прозорість
  const shadowStyle = (anim) => {
    const scaleX = anim.interpolate({
      inputRange: [0, 0.4, 1],
      outputRange: [1.5, 1, 0.2],
    });
    const opacity = anim.interpolate({
      inputRange: [0, 0.4, 1],
      outputRange: [1, 0.7, 0.4],
    });
    return {
      transform: [{ scaleX }],
      opacity,
      height: 4,
      width: 20,
      borderRadius: 10,
      backgroundColor: 'rgba(0,0,0,0.9)',
      position: 'absolute',
      top: 62,
    };
  };

  return (
    <View style={styles.wrapper}>
      <Animated.View style={[circleStyle(circleAnim1), { left: '15%' }]} />
      <Animated.View style={[circleStyle(circleAnim2), { left: '45%' }]} />
      <Animated.View style={[circleStyle(circleAnim3), { right: '15%' }]} />

      <Animated.View style={[shadowStyle(shadowAnim1), { left: '15%' }]} />
      <Animated.View style={[shadowStyle(shadowAnim2), { left: '45%' }]} />
      <Animated.View style={[shadowStyle(shadowAnim3), { right: '15%' }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: 200,
    height: 70,
    position: 'relative',
    zIndex: 1,
    alignSelf: 'center',
  },
});

export default Loader;