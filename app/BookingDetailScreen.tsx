import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Alert, ActivityIndicator } from "react-native";
import { getBookingById, updateBooking } from "@/src/repositories/bookingRepo";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { formatLocalDate, formatRupiah } from "@/src/shared/formatUtils";
import React, { useEffect, useLayoutEffect, useState } from "react";

export default function BookingDetailScreen() {
  const [booking, setBooking] = useState<DetailBooking | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const { bookingId } = useLocalSearchParams();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "Detail Booking",
    });
  }, [navigation]);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const bookingResponse = await getBookingById(+bookingId);
        setBooking(bookingResponse);
      } catch (error: any) {
        Alert.alert("Error", error.message || "Gagal mengambil data Booking.");
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, []);

  const updateStatus = async (newStatus: "completed" | "cancelled") => {
    try {
      await updateBooking(+bookingId, newStatus);
      Alert.alert("Sukses", "Status pemesanan properti berhasil diperbarui", [
        {
          text: "OK",
          onPress: () => {
            router.dismissAll();
            router.replace("/BookingListScreen");
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Gagal memperbarui status Booking.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0F7480]">
      {loading || !booking ? (
        <ActivityIndicator testID="activity-indicator" size="large" color="#fff" className="flex-1" />
      ) : (
        <ScrollView>
          <View className="flex-1 gap-4 px-6 pb-6 pt-4">
            <View className="flex-1 flex-row justify-between gap-4">
              <View className="flex-1 bg-white/80 p-4 rounded-xl">
                <Text className="text-[#07484E] font-extrabold mb-1">Status</Text>
                <Text className="text-[#07484E] font-medium capitalize">
                  {booking.status === "completed" ? "Selesai" : booking.status === "pending" ? "Menunggu" : "Batal"}
                </Text>
              </View>

              <View className="flex-1 bg-white/80 p-4 rounded-xl">
                <Text className="text-[#07484E] font-extrabold mb-1">Tanggal Booking</Text>
                <Text className="text-[#07484E] font-medium">{formatLocalDate(booking.created_at)}</Text>
              </View>
            </View>

            <View className="bg-white/80 p-4 rounded-xl">
              <Text className="text-[#07484E] font-extrabold mb-1">Harga DP</Text>
              <Text className="text-[#07484E] font-medium">{formatRupiah(booking.dp_price)}</Text>
            </View>

            <View className="bg-white/80 p-4 rounded-xl">
              <Text className="text-[#07484E] font-extrabold mb-2">Data Customer</Text>
              <Text className="text-[#07484E] font-medium">Nama: {booking.customer_data.name}</Text>
              <Text className="text-[#07484E] font-medium">NIK: {booking.customer_data.identification_number}</Text>
              <Text className="text-[#07484E] font-medium">No HP: {booking.customer_data.phones.join(", ")}</Text>
            </View>

            <View className="bg-white/80 p-4 rounded-xl">
              <Text className="text-[#07484E] font-extrabold mb-2">Data Properti</Text>
              <Text className="text-[#07484E] font-medium">Kluster: {booking.property_data.cluster}</Text>
              <Text className="text-[#07484E] font-medium">Produk: {booking.property_data.product}</Text>
              <Text className="text-[#07484E] font-medium">Unit: {booking.property_data.unit}</Text>
            </View>

            {booking.status === "pending" && (
              <View className="flex-row justify-between gap-4 mt-2">
                <TouchableOpacity
                  className="flex-1 py-4 rounded-xl bg-green-600 items-center"
                  onPress={() => updateStatus("completed")}
                >
                  <Text className="text-white font-bold">Tandai Selesai</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 py-4 rounded-xl bg-red-600 items-center"
                  onPress={() => updateStatus("cancelled")}
                >
                  <Text className="text-white font-bold">Batalkan</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
