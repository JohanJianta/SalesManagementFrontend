import React, { useState } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './app/home';
import BookingListScreen from './app/BookingListScreen';
import BottomNavbar from './assets/Component/BottomNavbar';

export default function App() {
  const [activeTab, setActiveTab] = useState('Home');

  const renderScreen = () => {
    switch (activeTab) {
      case 'Home':
        return <HomeScreen />;
      case 'Booking':
        return <BookingListScreen />;
      // case 'Promo':
      //   return <PromoScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <NavigationContainer>
      <View className="flex-1">
        {renderScreen()}
        <View className="absolute bottom-0 left-0 right-0">
          <BottomNavbar activeTab={activeTab} onNavigate={setActiveTab} />
        </View>
      </View>
    </NavigationContainer>
  );
}
