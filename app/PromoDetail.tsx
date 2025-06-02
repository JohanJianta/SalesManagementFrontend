import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute, useNavigation } from "@react-navigation/native";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { getFromStorage } from "@/src/shared/asyncStorageUtils";

interface PromoDetailData {
  cluster_id: number;
  title: string;
  content: string;
  thumbnail_url: string;
  created_at: string;
  expired_at: string;
}

const PromoDetail: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params as { id: number };

  const [promo, setPromo] = useState<PromoDetailData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPromoDetail = async () => {
      try {
        const token = await getFromStorage("token");
        if (!token) {
          console.error("Token tidak ditemukan.");
          setLoading(false);
          return;
        }

        const response = await fetch(`http://18.139.110.33:3000/api/promotions/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const err = await response.text();
          console.error("Gagal mengambil detail promo:", err);
          setLoading(false);
          return;
        }

        const data = await response.json();
        setPromo(data);
      } catch (error) {
        console.error("Terjadi kesalahan saat mengambil promo:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPromoDetail();
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#00bcd4" />
      </View>
    );
  }

  if (!promo) {
    return (
      <View className="flex-1 justify-center items-center bg-white px-4">
        <Text className="text-red-500 text-center">Detail promo tidak ditemukan atau terjadi kesalahan.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} className="mt-4 px-4 py-2 bg-teal-500 rounded-full">
          <Text className="text-white">Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white p-4">
      {/* Tombol Back */}
      <TouchableOpacity onPress={() => navigation.goBack()} className="mb-4 p-2 w-10">
        <ArrowLeftIcon size={28} color="black" />
      </TouchableOpacity>

      <Image
        source={{ uri: promo.thumbnail_url || "https://via.placeholder.com/300x200?text=No+Image" }}
        style={{ width: "100%", height: 200, borderRadius: 12 }}
        resizeMode="cover"
      />

      <Text className="text-xl font-bold mt-4 text-black">{promo.title}</Text>

      <Text className="text-sm text-gray-500 mt-1">
        {new Date(promo.created_at).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })}{" "}
        -{" "}
        {new Date(promo.expired_at).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })}
      </Text>

      <Text className="text-base mt-4 leading-relaxed text-black">{promo.content || "Tidak ada deskripsi promo."}</Text>
    </ScrollView>
  );
};

export default PromoDetail;
