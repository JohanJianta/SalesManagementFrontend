import React, { useState } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './app/home';
import BookingListScreen from './app/BookingListScreen';
import PromoScreen from './app/promo';
import AddPromo from './app/addpromo'; // ✅ Tambahkan ini
import BottomNavbar from './assets/Component/BottomNavbar';
import CombinedScreen from './app/CombinedScreen';

const Stack = createStackNavigator();

export default function App() {
  const [activeTab, setActiveTab] = useState('Home');

  const renderScreen = () => {
    switch (activeTab) {
      case 'Home':
        return <HomeScreen />;
      case 'Booking':
        return <BookingListScreen />;
      case 'Promo':
        return <PromoScreen />;
      case 'Upload':
        return <AddPromo />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Booking" component={BookingListScreen} />
        <Stack.Screen name="Promo" component={PromoScreen} />
        <Stack.Screen name="UploadPDF" component={AddPromo} />
        <Stack.Screen name="CombinedScreen" component={CombinedScreen} /> 
      </Stack.Navigator>

      <View className="flex-1">
        {renderScreen()}

        <View className="absolute bottom-0 left-0 right-0">
          <BottomNavbar activeTab={activeTab} onNavigate={setActiveTab} />
        </View>
      </View>
    </NavigationContainer>
  );
}
