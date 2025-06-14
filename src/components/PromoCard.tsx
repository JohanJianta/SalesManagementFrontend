import { TouchableOpacity, View, Text, Image } from "react-native";
import { formatLocalDate } from "../shared/formatUtils";
import { router } from "expo-router";
import React from "react";

type Props = {
  promo: BriefPromotion;
  onPress: () => void;
};

export default function PromoCard({ promo, onPress }: Props) {
  return (
    <View className="flex-1 bg-[#07484E] rounded-2xl overflow-hidden">
      <Image
        source={
          promo.thumbnail_url ? { uri: promo.thumbnail_url } : require("@/assets/images/No-Image-Placeholder.png")
        }
        className="w-full h-36"
        resizeMode="cover"
      />
      <View className="gap-2 p-4">
        <Text className="text-base text-white font-medium">{promo.title}</Text>
        <Text className="text-base text-gray-300 font-medium">{formatLocalDate(promo.created_at)}</Text>
      </View>
      <TouchableOpacity testID="promo-button" className="bg-[#073A3E] py-3 items-center" onPress={onPress}>
        <Text className="text-base text-white font-medium">Lihat Detail</Text>
      </TouchableOpacity>
    </View>
  );
}
