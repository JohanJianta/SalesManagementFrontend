import { View, SafeAreaView, ScrollView, ActivityIndicator, Alert } from "react-native";
import { getPromotions } from "@/src/repositories/promotionRepo";
import BottomNavbar from "@/src/components/BottomNavbar";
import React, { useState, useEffect } from "react";
import PromoCard from "@/src/components/PromoCard";
import { router } from "expo-router";

export default function PromoScreen() {
  const [promos, setPromos] = useState<BriefPromotion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const promoResponse = await getPromotions();
        setPromos(promoResponse);
      } catch (error: any) {
        Alert.alert("Error", error.message || "Gagal mengambil data Promo.");
      } finally {
        setLoading(false);
      }
    };
    fetchPromos();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-[#0F7480]">
      {loading ? (
        <ActivityIndicator size="large" color="#fff" className="flex-1" />
      ) : (
        <ScrollView>
          <View className="flex-1 gap-4 p-6">
            {promos.map((item, index) => (
              <PromoCard
                key={index}
                promo={item}
                onPress={() => router.push({ pathname: "/PromoDetailScreen", params: { promoId: item.id } })}
              />
            ))}
          </View>
        </ScrollView>
      )}
      <BottomNavbar activeTab="Promo" />
    </SafeAreaView>
  );
}
