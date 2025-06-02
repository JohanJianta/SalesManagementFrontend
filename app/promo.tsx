import React, { useState, useCallback } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, useWindowDimensions, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomNavbar from "@/src/components/BottomNavbar";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getFromStorage } from "@/src/shared/asyncStorageUtils";

type RootStackParamList = {
  Promo: undefined;
  PromoDetail: { id: number };
};

type PromoScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Promo">;

interface Promotion {
  id: number;
  title: string;
  thumbnail_url: string;
  created_at: string;
}

const Promo: React.FC = () => {
  const navigation = useNavigation<PromoScreenNavigationProp>();
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;

  const [promos, setPromos] = useState<Promotion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchPromos = async () => {
        setLoading(true);
        try {
          const token = await getFromStorage("token");
          console.log("TOKEN SAAT AMBIL:", token);

          if (!token) {
            setError("Token tidak ditemukan. Silakan login terlebih dahulu.");
            setLoading(false);
            return;
          }

          const response = await fetch("http://18.139.110.33:3000/api/promotions", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error(`Gagal mengambil data promo (${response.status}):`, errorText);
            setError(`Gagal mengambil data promo (${response.status})`);
            setLoading(false);
            return;
          }

          const data = await response.json();

          if (!Array.isArray(data)) {
            console.error("Data dari API bukan array:", data);
            setError("Format data dari server tidak valid.");
            setLoading(false);
            return;
          }

          if (isActive) {
            setPromos(data);
            setError(null);
          }
        } catch (error) {
          console.error("Error saat mengambil promo:", error);
          if (isActive) {
            setError("Terjadi kesalahan saat mengambil data.");
          }
        } finally {
          setLoading(false);
        }
      };

      fetchPromos();

      return () => {
        isActive = false;
      };
    }, [])
  );

  return (
    <View className="flex-1 bg-teal-600">
      <ScrollView className="p-4">
        {loading && <ActivityIndicator size="large" color="#ffffff" className="mb-4" />}

        {error ? (
          <Text className="text-white text-center">{error}</Text>
        ) : (
          <View className="flex-row flex-wrap justify-evenly">
            {promos.map((item) => (
              <View
                key={item.id}
                className={`mb-4 bg-white rounded-xl shadow overflow-hidden ${
                  isLargeScreen ? "w-[40%] mx-2" : "w-[90%]"
                }`}
              >
                <Image
                  source={{
                    uri: item.thumbnail_url || "https://via.placeholder.com/300x200.png?text=No+Image",
                  }}
                  resizeMode="cover"
                  style={{
                    width: isLargeScreen ? "135%" : "100%",
                    height: isLargeScreen ? 180 : 128,
                    marginLeft: isLargeScreen ? -30 : 0,
                  }}
                />
                <View className="p-2">
                  <Text className="text-sm font-semibold">{item.title}</Text>
                  <Text className="text-xs text-gray-500">
                    {new Date(item.created_at).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </Text>
                </View>
                <TouchableOpacity
                  className="bg-orange-500 p-2 items-center"
                  onPress={() => navigation.navigate("PromoDetail", { id: item.id })}
                >
                  <Text className="text-white text-sm font-semibold">Lihat Detail</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
        <BottomNavbar
          activeTab="Promo"
          onNavigate={(tab) => {
            console.log(`Navigasi ke tab: ${tab}`);
          }}
        />
      </View>
    </View>
  );
};

export default Promo;
