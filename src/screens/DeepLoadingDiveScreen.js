import { useNavigation } from '@react-navigation/native';
import { Dimensions, Image, View, } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { useDispatch } from 'react-redux';

import React, { useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadUserData } from '../redux/userSlice';
import { UserContext } from '../context/UserContext';

const DeepLoadingDiveScreen = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isDeepDiveOnbVisibledYet, setDeepDiveOnbVisibledYet] = useState(false);
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    setTimeout(() => {
      if (isDeepDiveOnbVisibledYet) {
        navigation.replace('DeepDiveOnboardingScreen');
      }
      else navigation.replace('Home');
    }, 1500);
  }, []);

  useEffect(() => {
    dispatch(loadUserData());
  }, [dispatch]);

  useEffect(() => {
    const loadDeepDiveUser = async () => {
      try {
        const deviceId = await DeviceInfo.getUniqueId();
        const storageKey = `currentUser_${deviceId}`;
        const storedDeepDiveUser = await AsyncStorage.getItem(storageKey);
        const isDeepDiveOnbWasVis = await AsyncStorage.getItem('isDeepDiveOnbWasVis');

        if (storedDeepDiveUser) {
          setUser(JSON.parse(storedDeepDiveUser));
          setDeepDiveOnbVisibledYet(false);
        } else if (isDeepDiveOnbWasVis) {
          setDeepDiveOnbVisibledYet(false);
        } else {
          setDeepDiveOnbVisibledYet(true);
          await AsyncStorage.setItem('isDeepDiveOnbWasVis', 'true');
        }
      } catch (error) {
        console.error('Error loading of montYou Real user', error);
      }
    };
    loadDeepDiveUser();
  }, [setUser]);

  return (
    <View style={{
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1,
      flex: 1,
      width: '100%',
    }}>
      <Image
        source={require('../assets/images/loaderImage.png')}
        style={{
          width: dimensions.width,
          height: dimensions.height,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
        }}
        resizeMode="contain"
      />
    </View>
  );
};

export default DeepLoadingDiveScreen;
