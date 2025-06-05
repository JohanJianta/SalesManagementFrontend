import { View, Text, ScrollView, TouchableOpacity, Linking, SafeAreaView } from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import ImageCarousel from "@/src/components/ImageCarousel";
import { ArrowRight } from "lucide-react-native";
import React, { useLayoutEffect } from "react";

export default function ProductDetail() {
  const data = {
    id: 1,
    name: "Alexandrite",
    default_price: 3000000000,
    corner_price: 5000000000,
    product_units: [
      { id: 1, name: "No. 5", type: "standard" },
      { id: 2, name: "No. 6", type: "standard" },
      { id: 3, name: "No. 15", type: "sudut" },
    ],
    product_features: [
      { name: "Tanah", total: "119 m²" },
      { name: "Bangunan", total: "145 m²" },
      { name: "Lantai", total: "🏠2 Lantai" },
      { name: "Kamar Tidur", total: "🛏️4+1 Kamar Tidur" },
      { name: "Kamar Mandi", total: "🛁3+1 Kamar Mandi" },
      { name: "Dapur", total: "🍳1 Dapur" },
      { name: "Ruang Tamu", total: "🛋️2 Ruang Tamu" },
      { name: "Parkir Mobil", total: "🚗2 Parkir Mobil" },
    ],
    product_images: [
      "https://d1tqswfuhozddy.cloudfront.net/Treasure%20Island/Alexandrite_1.jpg?Expires=1749172693&Key-Pair-Id=K283S4CEHDJZ90&Signature=PlD~66ZUIBdO5T3Yy0~ThaofLJ4RmL~Qspc9bpDhAMiulCiocIrT~CK0HVfYYBHCZX28igUwxKEM3QWCREFkvzquCxWdrso~PtpwDc24lk~~QDCV0v-hUUzVA~daqlLfS4y4TOhW-DidNS4NKn~v5W9xTLPzBJTK3BV41g82l7fPMycMXUbH0RPD-ihXzItV2~qsIYJcHdRb6k-JPwKv2gxXxZrUW9s6k8gMcmoQAe86DZ91xZSHcp8TzJoC8WDdKPIDexs61~diGD3NUl4wWcrhzNOkpfz-h9qQWgiriwV6oM7flz5EgcgWp4tppFCFnf4c0FHi89jV0E7NWUYqZA__",
      "https://d1tqswfuhozddy.cloudfront.net/Treasure%20Island/Alexandrite_2.jpg?Expires=1749172693&Key-Pair-Id=K283S4CEHDJZ90&Signature=J58koqafAOl09EUrysFH2YEc0wweBmWkYOSiB4CQJjvWJSx7wLdK9vkHmjQX4WFSzIAYNjwJzpOn6h~jFfjrqJQZopg2cXML88-2uRonjlCbbZJkbVARQHa4D480PuXfp7M7I2iqNfTdVRWWZkwTeTSc5ZZkqzie47Uy2gWF~W6h6UMiDcZFZnRowlGY7YxGhvgFOic0KAfpb9LVqD4p9zI3LLXzc1sruhhBjvBZlph74F2F7huPLuRpQEwTl0V3thWD~udXDjpfUOrpfWRIVvP1x3l7lYe4hECtTPP9dX~W9xjaXohoTX5EoPfWpguMEJfnHnNGKTQAB6DK0xd~cw__",
    ],
    cluster_ref: {
      name: "Treasure Island",
      brochure_url: "https://example.com/brochure/treasure_island.jpg",
      promotions: [
        {
          id: 1,
          title: "Promotion Example",
          thumbnail_url: "https://example.com/thumbnail/promotion-1.jpg",
        },
      ],
    },
  };

  const { productId, propertyName } = useLocalSearchParams();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: propertyName?.toString() || "Detail Property Screen",
    });
  }, [navigation, propertyName]);

  const formatRupiah = (value: number) => {
    return "Rp " + value.toLocaleString("id-ID");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0F7480]">
      <ScrollView>
        <View className="flex-1 gap-4 pb-16">
          {/* Gambar Properti */}
          <ImageCarousel imageUrls={data.product_images} />

          {/* Luas Tanah & Bangunan */}
          <View className="flex-row justify-around px-4 mb-4">
            {data.product_features.slice(0, 2).map((feature, index) => (
              <View key={index} className="bg-white/80 rounded-xl p-3 w-[45%] items-center">
                <Text className="text-teal-800 font-bold">{feature.name}</Text>
                <Text className="text-lg text-teal-900 font-bold">{feature.total}</Text>
              </View>
            ))}
          </View>

          {/* Spesifikasi Detail */}
          <View className="bg-white/80 rounded-xl mx-4 p-3 space-y-2 mb-4">
            {data.product_features.slice(2).map((feature, index) => (
              <Text key={index} className="text-teal-900">
                • {feature.total}
              </Text>
            ))}
          </View>

          {/* Harga Unit */}
          <View className="flex-row justify-between items-center bg-white/90 mx-4 rounded-xl p-3 mb-3">
            <View>
              <Text className="text-teal-900 font-bold">
                {formatRupiah(data.default_price)} <Text className="text-xs">[Standar]</Text>
              </Text>
              <Text className="text-teal-900 font-bold">
                {formatRupiah(data.corner_price)} <Text className="text-xs">[Sudut]</Text>
              </Text>
            </View>
            <TouchableOpacity className="bg-teal-700 rounded-xl px-3 py-2 flex-row items-center">
              <Text className="text-white font-bold mr-2">Lihat KPR</Text>
              <ArrowRight size={16} color="white" />
            </TouchableOpacity>
          </View>

          {/* Unit Tersedia */}
          <View className="bg-white/90 mx-4 rounded-xl p-3 mb-5">
            <Text className="text-teal-900 font-bold mb-2">Unit Tersedia:</Text>
            {data.product_units.map((unit) => (
              <Text key={unit.id} className="text-teal-800">
                • {unit.name} [{unit.type}]
              </Text>
            ))}
          </View>

          {/* Tombol Lihat E-Brosur dan Promo */}
          <View className="flex-row justify-around px-4 mb-6">
            <TouchableOpacity
              onPress={() => Linking.openURL(data.cluster_ref.brochure_url)}
              className="bg-white rounded-xl px-4 py-3 w-[48%] items-center"
            >
              <Text className="text-teal-900 font-bold">Lihat E-Brosur</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (data.cluster_ref.promotions.length > 0) {
                  Linking.openURL(data.cluster_ref.promotions[0].thumbnail_url);
                }
              }}
              className="bg-white rounded-xl px-4 py-3 w-[48%] items-center"
            >
              <Text className="text-teal-900 font-bold">Cek Promo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
