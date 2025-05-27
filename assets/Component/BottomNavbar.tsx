import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { Map, NotepadText, BadgePercent } from 'lucide-react-native';
import { router } from 'expo-router'; // import expo-router

interface Props {
  activeTab?: string;
  onNavigate: (tab: string) => void; // Make onNavigate a required property
}

export default function BottomNavbar({ activeTab = 'Home', onNavigate }: Props) {
  const navItems = [
    { label: 'Map', icon: Map, route: '/maps' },
    { label: 'Booking', icon: NotepadText, route: '/BookingListScreen' },
    { label: 'Promo', icon: BadgePercent, route: '/promo' }, // Promo route is empty
  ];

  const handleNavigation = (route: string) => {
    if (route) {
      router.push(route as `/maps` | `/BookingListScreen` | `/promo`);
    }
  };

  return (
    <View
      className={`flex-row justify-around bg-[#014f50] py-3 px-4 ${
        Platform.OS === 'ios' ? 'shadow-md shadow-black' : 'elevation-4'
      } rounded-t-2xl`}
    >
      {navItems.map(({ label, icon: Icon, route }) => {
        const isActive = label === activeTab;
        return (
          <TouchableOpacity
            key={label}
            className="items-center flex-1 py-2"
            activeOpacity={0.7}
            onPress={() => {
              handleNavigation(route);
              onNavigate(label); // Call onNavigate when an item is pressed
            }}
          >
            <Icon size={26} color={isActive ? '#22d3ee' : '#ffffff'} />
            <Text className={`text-xs mt-1 ${isActive ? 'text-cyan-300 font-semibold' : 'text-white'}`}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
