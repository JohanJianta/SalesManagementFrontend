import { router, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { getPromotionById } from "@/src/repositories/promotionRepo";
import { formatLocalDate } from "@/src/shared/formatUtils";
import {
  View,
  SafeAreaView,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  Dimensions,
  TouchableOpacity,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("screen");

export default function PromoDetail() {
  const [loading, setLoading] = useState<boolean>(true);
  const [promo, setPromo] = useState<DetailPromotion | null>(null);
  const [imgHeight, setImgHeight] = useState<number | null>(null);
  const imgWidth = SCREEN_WIDTH;

  const { promoId } = useLocalSearchParams();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "Detail Promo",
    });
  }, [navigation]);

  useEffect(() => {
    const fetchPromo = async () => {
      try {
        const promoResponse = await getPromotionById(+promoId);
        setPromo(promoResponse);
      } catch (error: any) {
        Alert.alert("Error", error.message || "Gagal mengambil data Promo.");
      } finally {
        setLoading(false);
      }
    };
    fetchPromo();
  }, []);

  useEffect(() => {
    if (!promo?.thumbnail_url) return;

    Image.getSize(
      promo.thumbnail_url,
      (width, height) => {
        const scaledHeight = imgWidth / (width / height);
        setImgHeight(scaledHeight);
      },
      (_) => setImgHeight(500)
    );
  }, [promo?.thumbnail_url]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-[#0F7480]">
        <ActivityIndicator size="large" color="#fff" className="flex-1" />
      </SafeAreaView>
    );
  }

  if (!promo) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-[#0F7480] px-4">
        <Text className="text-red-600 text-center">Detail Promo tidak ditemukan atau terjadi kesalahan.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#0F7480]">
      <ScrollView>
        <Image
          source={
            promo.thumbnail_url ? { uri: promo.thumbnail_url } : require("@/assets/images/No-Image-Placeholder.png")
          }
          style={{ width: imgWidth, height: imgHeight ?? 500, maxHeight: 500 }}
          resizeMode="cover"
        />

        <View className="flex-1 p-6">
          <Text className="text-xl font-bold text-white">{promo.title}</Text>

          <Text className="text-sm text-gray-300 mt-1">
            {formatLocalDate(promo.created_at)}
            {promo.expired_at && ` - ${formatLocalDate(promo.expired_at)}`}
          </Text>

          <Text className="text-base mt-6 leading-relaxed text-white">{promo.content}</Text>

          {promo.cluster_id && (
            <TouchableOpacity
              className="bg-[#07484E] py-3 px-6 rounded-lg mt-6"
              testID="navigation-button"
              onPress={() =>
                router.push({
                  pathname: "/ClusterScreen",
                  params: { clusterId: promo.cluster_id },
                })
              }
            >
              <Text className="text-white text-center text-base font-extrabold">Lihat Daftar Produk</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
