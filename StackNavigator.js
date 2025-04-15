import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';
import DeepDiveOnboardingScreen from './src/screens/DeepDiveOnboardingScreen';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { UserProvider, UserContext } from './src/context/UserContext';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import DeepLoadingDiveScreen from './src/screens/DeepLoadingDiveScreen';
import { AudioProvider } from './src/context/AudioContext';


const Stack = createNativeStackNavigator();

const DeepDiveStack = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <UserProvider>
          <SafeAreaProvider>
            <AppNavigator />
          </SafeAreaProvider>
        </UserProvider>
      </Provider>
    </GestureHandlerRootView>
  );
};

const AppNavigator = () => {




  return (
    <NavigationContainer>
      <AudioProvider>
        <Stack.Navigator initialRouteName={'LoadingDeepDivingScreen'}>
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="DeepDiveOnboardingScreen" component={DeepDiveOnboardingScreen} options={{ headerShown: false }} />
          <Stack.Screen name="LoadingDeepDivingScreen" component={DeepLoadingDiveScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </AudioProvider>
    </NavigationContainer>
  );
};


export default DeepDiveStack;
