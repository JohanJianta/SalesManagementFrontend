import React, { useState } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'; // Import Stack Navigator
import HomeScreen from './app/home';
import BookingListScreen from './app/BookingListScreen';
import BottomNavbar from './assets/Component/BottomNavbar';
import PromoScreen from './app/promo';

const Stack = createStackNavigator(); // Membuat stack navigator

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
      default:
        return <HomeScreen />;
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}> {/* Mengatur header untuk tidak ditampilkan */}
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Booking" component={BookingListScreen} />
        <Stack.Screen name="Promo" component={PromoScreen} />
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
