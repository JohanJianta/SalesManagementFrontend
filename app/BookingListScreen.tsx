import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from "react-native";
import { StarIcon, PlusIcon } from "react-native-heroicons/outline";
import BottomNavbar from "@/src/components/BottomNavbar";
import { router } from "expo-router";
import React from "react";

// Define the type for a booking item
type BookingItem = {
  id: string;
  customerName: string;
  clusterName: string;
};

const BookingListScreen: React.FC = () => {
  // Sample booking data
  const bookings: BookingItem[] = [
    { id: "1", customerName: "Nama Customer", clusterName: "Nama Cluster" },
    { id: "2", customerName: "Nama Customer", clusterName: "Nama Cluster" },
    { id: "3", customerName: "Nama Customer", clusterName: "Nama Cluster" },
    { id: "4", customerName: "Nama Customer", clusterName: "Nama Cluster" },
  ];

  const handleAddBooking = () => {
    // Handle add booking functionality
    console.log("Add new booking");
  };

  return (
    <SafeAreaView className="flex-1 bg-teal-600">
      <StatusBar barStyle="light-content" backgroundColor="#0d9488" />

      <View className="flex-1 px-4 pt-6">
        {/* Header */}
        <Text className="text-white text-3xl font-bold mb-6 text-center">Booking List</Text>

        {/* Booking List */}
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {bookings.map((booking) => (
            <View key={booking.id} className="bg-white rounded-lg p-4 mb-4 shadow-md">
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center">
                  <StarIcon size={20} color="#000" />
                  <Text className="text-base font-medium ml-2">{booking.customerName}</Text>
                </View>
                <Text className="text-base font-bold">A</Text>
              </View>
              <Text className="text-gray-500 ml-7">{booking.clusterName}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Add Button */}
        <TouchableOpacity
          onPress={() => router.push("/AddBookingScreen")} // Use router.push() to navigate
          className="absolute bottom-6 right-6 bg-white w-14 h-14 rounded-full items-center justify-center shadow-lg"
        >
          <PlusIcon size={30} color="#0d9488" />
        </TouchableOpacity>
      </View>
      <BottomNavbar
        activeTab="Booking"
        onNavigate={(tab) => {
          console.log(`Navigating to ${tab}`);
        }}
      />
    </SafeAreaView>
  );
};

export default BookingListScreen;
