import { View, Text, Image, TouchableOpacity, Dimensions, ImageBackground } from "react-native";
import { ChevronDown, ChevronUp, House } from "lucide-react-native";
import { formatPriceRange } from "@/src/shared/formatUtils";
import React, { useState } from "react";

const { width: windowWidth } = Dimensions.get("window");

type Props = {
  product: BriefProduct;
  onPress: () => void;
};

export default function PropertyCard({ product, onPress }: Props) {
  const [expanded, setExpanded] = useState(false);

  // Determine card width dynamically based on device width (mobile vs tablet)
  const getCardWidth = () => {
    if (windowWidth >= 1024) {
      return windowWidth / 3.2; // Tablet landscape atau desktop
    } else if (windowWidth >= 768) {
      return windowWidth / 2.2; // Tablet potrait
    } else {
      return windowWidth * 0.9; // Mobile
    }
  };

  const { name, thumbnail_url, default_price, corner_price, product_units } = product;

  const imageSource = thumbnail_url ? { uri: thumbnail_url } : require("@/assets/images/Treasure-Island-Diamond.jpg");
  const priceRange = formatPriceRange(default_price, corner_price);

  return (
    <View className="items-center">
      <View className="bg-[#07484E] rounded-2xl min-h-[175px] overflow-hidden" style={{ width: getCardWidth() }}>
        <TouchableOpacity onPress={onPress}>
          {expanded ? (
            <ImageBackground
              source={imageSource}
              className="w-full h-[140px] justify-center items-center"
              resizeMode="cover"
            >
              <View className="absolute inset-0 bg-black opacity-50" />
              <Text className="text-white text-3xl font-extrabold tracking-[3px]">{name}</Text>
            </ImageBackground>
          ) : (
            <View className="flex-row items-center gap-4 p-6">
              <Image source={imageSource} className="w-28 h-28" resizeMethod="resize" />
              <View className="flex-1 gap-4">
                <Text className="text-white text-xl font-extrabold">{name}</Text>
                <View className="flex-row flex-wrap justify-between gap-x-4 gap-y-2">
                  <View className="flex-row items-center gap-2">
                    <Text className="text-white font-medium opacity-80">{`Rp  ${priceRange}`}</Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <House size={20} color="#ffffff" opacity={0.8} />
                    <Text className="text-white font-medium opacity-80">{`${product_units.length} unit`}</Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        </TouchableOpacity>

        {expanded && (
          <View className="px-6 py-3 gap-4">
            <View className="gap-2">
              <Text className="text-white font-extrabold">Harga unit</Text>
              <View>
                <View className="flex-row gap-4">
                  <Text className="text-white opacity-80 w-16">Standar</Text>
                  <Text className="text-white opacity-80">=</Text>
                  <Text className="text-white opacity-80">{`Rp  ${default_price.toLocaleString("id-ID")}`}</Text>
                </View>
                <View className="flex-row gap-4">
                  <Text className="text-white opacity-80 w-16">Sudut</Text>
                  <Text className="text-white opacity-80">=</Text>
                  <Text className="text-white opacity-80">{`Rp  ${corner_price.toLocaleString("id-ID")}`}</Text>
                </View>
              </View>
            </View>

            <View className="gap-2">
              <Text className="text-white font-extrabold">Unit Tersedia</Text>
              <View className="flex-row flex-wrap justify-between gap-x-4">
                {product_units.map((unit, index) => (
                  <View key={index} className="flex-row gap-2 w-[47.5%] max-w-[250px]">
                    <Text className="text-white opacity-80">•</Text>
                    <Text className="text-white opacity-80 flex-1">{`${unit.name} (${unit.type})`}</Text>
                  </View>
                ))}
                {product_units.length === 0 && <Text className="text-white opacity-80">Tidak ada</Text>}
              </View>
            </View>
          </View>
        )}

        <TouchableOpacity onPress={() => setExpanded(!expanded)} className="bg-[#073A3E] w-full items-center py-3">
          {expanded ? <ChevronUp size={24} color="#fbfcfc" /> : <ChevronDown size={24} color="#fbfcfc" />}
        </TouchableOpacity>
      </View>
    </View>
  );
}
