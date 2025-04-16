import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import PingoHomeScreen from './src/screens/PingoHomeScreen';
import PingoOnboardScreen from './src/screens/PingoOnboardScreen';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { UserProvider, UserContext } from './src/context/UserContext';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import LoadingPingoAppScreen from './src/screens/LoadingPingoAppScreen';

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
        <Stack.Navigator initialRouteName={'LoadingPingoCoupleScreen'}>
          <Stack.Screen name="Home" component={PingoHomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="PingoOnboardScreen" component={PingoOnboardScreen} options={{ headerShown: false }} />
          <Stack.Screen name="LoadingPingoCoupleScreen" component={LoadingPingoAppScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    </NavigationContainer>
  );
};


export default DeepDiveStack;
