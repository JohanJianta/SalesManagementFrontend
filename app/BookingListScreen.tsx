import { View, ScrollView, Text, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator } from "react-native";
import { getBookings } from "@/src/repositories/bookingRepo";
import { PlusIcon } from "react-native-heroicons/outline";
import BottomNavbar from "@/src/components/BottomNavbar";
import BookingCard from "@/src/components/BookingCard";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";

export default function BookingListScreen() {
  const [bookings, setBookings] = useState<BriefBooking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const bookingResponse = await getBookings();
      setBookings(bookingResponse);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Gagal mengambil data Booking.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0F7480]">
      {loading ? (
        <ActivityIndicator testID="activity-indicator" size="large" color="#fff" className="flex-1" />
      ) : (
        <>
          {bookings.length === 0 ? (
            <View className="flex-1 items-center justify-center">
              <Text className="text-white text-xl font-medium">Data booking tidak tersedia</Text>
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="flex-1 gap-4 p-6">
                {bookings.map((booking, index) => (
                  <BookingCard
                    key={index}
                    booking={booking}
                    onPress={() =>
                      router.push({
                        pathname: "/BookingDetailScreen",
                        params: { bookingId: booking.id },
                      })
                    }
                  />
                ))}
              </View>
            </ScrollView>
          )}

          <TouchableOpacity
            onPress={() => router.push("/AddBookingScreen")}
            className="absolute bottom-32 right-6 bg-white w-14 h-14 rounded-full items-center justify-center"
          >
            <PlusIcon size={30} color="#0F7480" />
          </TouchableOpacity>
        </>
      )}
      <BottomNavbar activeTab="Booking" />
    </SafeAreaView>
  );
}
