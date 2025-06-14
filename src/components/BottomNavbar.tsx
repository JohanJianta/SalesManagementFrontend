import { Map, NotepadText, BadgePercent } from "lucide-react-native";
import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import React from "react";

interface Props {
  activeTab?: string;
}

export default function BottomNavbar({ activeTab }: Props) {
  const navItems = [
    { label: "Map", icon: Map, route: "/MapScreen" },
    { label: "Booking", icon: NotepadText, route: "/BookingListScreen" },
    { label: "Promo", icon: BadgePercent, route: "/PromoListScreen" },
  ];

  const handleNavigation = (route: string) => {
    if (route) {
      router.push(route as `/MapScreen` | `/BookingListScreen` | `/PromoListScreen`);
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
            onPress={() => (!isActive ? handleNavigation(route) : null)}
          >
            <Icon size={30} color="#ffffff" />
            <Text className={`text-base font-medium text-white`}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
