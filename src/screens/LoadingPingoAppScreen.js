import { useNavigation } from '@react-navigation/native';
import { View } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { useDispatch } from 'react-redux';
import React, { useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadUserData } from '../redux/userSlice';
import { UserContext } from '../context/UserContext';
import LinearGradient from 'react-native-linear-gradient';
import Loader from '../components/Loader';

const LoadingPingoAppScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isWasPingoOnboardingVisible, setWasPingoOnboardingVisible] = useState(false);
  const [isLoadingPingo, setLoadingPingo] = useState(false);
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    const loadPingoUser = async () => {
      try {
        const deviceId = await DeviceInfo.getUniqueId();
        const storageKey = `currentUser_${deviceId}`;
        const storedPingoUser = await AsyncStorage.getItem(storageKey);
        const isPingoOnboardingVisibleYet = await AsyncStorage.getItem('isPingoOnboardingVisibleYet');

        if (storedPingoUser || isPingoOnboardingVisibleYet) {
          setWasPingoOnboardingVisible(true);
          if (!isPingoOnboardingVisibleYet) {
            await AsyncStorage.setItem('isPingoOnboardingVisibleYet', 'true');
          }
          setUser(JSON.parse(storedPingoUser || '{}'));
        } else {
          setWasPingoOnboardingVisible(false);
          await AsyncStorage.setItem('isPingoOnboardingVisibleYet', 'true');
        }
      } catch (error) {
        console.error('Error loading DeepDive user', error);
      }
      setLoadingPingo(true);
    };
    loadPingoUser();
  }, [setUser]);

  useEffect(() => {
    dispatch(loadUserData());
  }, [dispatch]);

  useEffect(() => {
    if (isLoadingPingo) {
      setTimeout(() => {
        if (isWasPingoOnboardingVisible) {
          navigation.replace('Home');
        } else {
          navigation.replace('PingoOnboardScreen');
        }
      }, 4000);
    }
  }, [isLoadingPingo, isWasPingoOnboardingVisible, navigation]);

  return (
    <View style={{
      alignItems: 'center',
      width: '100%',
      flex: 1,
      zIndex: 1,
      justifyContent: 'center',
    }}>
      <LinearGradient
        style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
        colors={['#FA199A', '#1A0C34']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      <Loader />
    </View>
  );
};

export default LoadingPingoAppScreen;
