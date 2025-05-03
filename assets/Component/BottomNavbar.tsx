import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { Home,NotepadText, BadgePercent } from 'lucide-react-native';

interface Props {
  activeTab?: string;
  onNavigate?: (tab: string) => void;
}

export default function BottomNavbar({ activeTab = 'Home', onNavigate }: Props) {
  const navItems = [
    { label: 'Home', icon: Home },
    { label: 'Booking', icon: NotepadText },
    { label: 'Promo', icon: BadgePercent },
  ];

  return (
    <View
      className={`flex-row justify-around bg-[#014f50] py-3 px-4 ${
        Platform.OS === 'ios' ? 'shadow-md shadow-black' : 'elevation-4'
      } rounded-t-2xl`}
    >
      {navItems.map(({ label, icon: Icon }) => {
        const isActive = label === activeTab;
        return (
          <TouchableOpacity
            key={label}
            className="items-center flex-1 py-2"
            activeOpacity={0.7}
            onPress={() => onNavigate?.(label)}
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
