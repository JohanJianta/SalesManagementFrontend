import { Map, NotepadText, BadgePercent } from "lucide-react-native";
import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import React from "react";

interface Props {
  activeTab?: string;
  onNavigate: (tab: string) => void;
}

export default function BottomNavbar({ activeTab = "Map", onNavigate }: Props) {
  const navItems = [
    { label: "Map", icon: Map, route: "/MapScreen" },
    { label: "Booking", icon: NotepadText, route: "/BookingListScreen" },
    { label: "Promo", icon: BadgePercent, route: "/promo" },
  ];

  const handleNavigation = (route: string) => {
    if (route) {
      router.push(route as `/MapScreen` | `/BookingListScreen` | `/promo`);
    }
  };

  return (
    <View className={`flex-row bg-[#07484E] p-4`}>
      {navItems.map(({ label, icon: Icon, route }) => {
        const isActive = label === activeTab;
        return (
          <TouchableOpacity
            key={label}
            className={`items-center flex-1 gap-2 ${isActive ? "opacity-90" : "opacity-60"}`}
            onPress={() => {
              handleNavigation(route);
              onNavigate(label);
            }}
          >
            <Icon size={30} color="#ffffff" />
            <Text className={`text-base font-medium text-white`}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
