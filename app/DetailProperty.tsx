import { router, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { getProductById } from "@/src/repositories/productRepo";
import ImageCarousel from "@/src/components/ImageCarousel";
import CustomModal from "@/src/components/CustomModal";
import { Image } from "react-native";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  ArrowRight,
  House,
  MapPinned,
  ChevronDown,
  ChevronRight,
  FileText,
  BadgePercent,
  X,
} from "lucide-react-native";

export default function ProductDetail() {
  const [loading, setLoading] = useState<boolean>(true);
  const [product, setProduct] = useState<DetailProduct | null>(null);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const { productId, propertyName } = useLocalSearchParams();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: propertyName?.toString() || "Detail Property Screen",
    });
  }, [navigation, propertyName]);

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const productResponse = await getProductById(+productId);
      setProduct(productResponse);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Gagal mengambil data Product.");
    } finally {
      setLoading(false);
    }
  };

  const formatRupiah = (value: number) => {
    return "Rp " + value.toLocaleString("id-ID");
  };

  if (loading || !product) {
    return (
      <SafeAreaView className="flex-1 bg-[#0F7480]">
        <ActivityIndicator testID="activity-indicator" size="large" color="#fff" className="flex-1" />
      </SafeAreaView>
    );
  }

  const { product_specifications: specs, product_units: units, cluster_ref: clusRef } = product;
  const mainFeatures = product.product_features.filter((f) => f.name === "Tanah" || f.name === "Bangunan");
  const subFeatures = product.product_features.filter((f) => f.name !== "Tanah" && f.name !== "Bangunan");

  return (
    <SafeAreaView className="flex-1 bg-[#0F7480]">
      <ScrollView>
        <View className="flex-1 gap-4 pb-16">
          <ImageCarousel testID="image-carousel" imageUrls={product.product_images} />

          <View className="flex-1 gap-4 px-6 pb-6">
            {mainFeatures.length > 0 && (
              <View className="flex-1 flex-row justify-between gap-4">
                {mainFeatures.map((feature, index) => (
                  <View key={index} className="flex-1 flex-row items-center gap-4 px-4 py-3 bg-white/80 rounded-xl">
                    {feature.name === "Tanah" ? (
                      <MapPinned size={40} color="#07484E" />
                    ) : (
                      <House size={40} color="#07484E" />
                    )}
                    <View className="flex-1 items-center gap-2">
                      <Text className="text-[#07484E] font-medium">{feature.name}</Text>
                      <Text className="text-[#07484E] font-extrabold">{`${feature.total}²`}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {subFeatures.length > 0 && (
              <View className="flex-1 flex-row flex-wrap justify-between gap-x-4 gap-y-2 px-4 py-3 bg-white/80 rounded-xl">
                {subFeatures.map((feature, index) => (
                  <View key={index} className="flex-row gap-2 w-[47.5%] max-w-[225px]">
                    <Text className="text-[#07484E] font-medium">{`•  ${feature.total} ${feature.name}`}</Text>
                  </View>
                ))}
              </View>
            )}

            <View className="flex-1 bg-white/80 rounded-lg overflow-hidden">
              <TouchableOpacity
                testID="toggle-button"
                className="min-h-[54px] flex-1 flex-row items-center py-3 px-6 bg-[#07484E]"
                onPress={() => setExpanded(!expanded)}
              >
                <Text className="flex-1 text-center text-white font-medium">Spesifikasi</Text>
                {expanded ? <ChevronDown size={40} color="#ffffff" /> : <ChevronRight size={40} color="#ffffff" />}
              </TouchableOpacity>
              {expanded && (
                <View className="px-4 py-3 gap-2">
                  {specs.length === 0 ? (
                    <Text className="text-center text-[#07484E] font-medium">
                      Tidak ada spesifikasi untuk properti ini
                    </Text>
                  ) : (
                    specs.map((spec, index) => (
                      <Text key={index} className="text-[#07484E] font-medium">{`${spec.name}: ${spec.detail}`}</Text>
                    ))
                  )}
                </View>
              )}
            </View>

            <View className="flex-1 flex-row justify-between items-center bg-white/80 rounded-xl overflow-hidden">
              <View className="flex-1 gap-2 px-4 py-3">
                <Text className="text-[#07484E] font-extrabold">
                  {formatRupiah(product.default_price)} <Text className="font-medium">[Standar]</Text>
                </Text>
                <Text className="text-[#07484E] font-extrabold">
                  {formatRupiah(product.corner_price)} <Text className="font-medium">[Sudut]</Text>
                </Text>
              </View>
              <TouchableOpacity
                className="w-1/3 h-full justify-center items-center gap-2 bg-[#07484E]"
                onPress={() =>
                  router.push({
                    pathname: "/KalkulatorKPR",
                    params: { defaultPrice: product.default_price, cornerPrice: product.corner_price },
                  })
                }
              >
                <Text testID="kpr-button" className="text-white font-medium">
                  Lihat KPR
                </Text>
                <ArrowRight size={20} color="white" />
              </TouchableOpacity>
            </View>

            <View className="flex-1 px-4 py-3 gap-2 bg-white/80 rounded-xl">
              <Text className="text-[#07484E] font-extrabold">Unit Tersedia:</Text>
              <View className="flex-1 flex-row flex-wrap gap-2 justify-between">
                {units.length === 0 ? (
                  <Text className="text-[#07484E] font-medium">Tidak ada</Text>
                ) : (
                  units.map((unit, index) => (
                    <Text key={index} className="text-[#07484E] font-medium w-[47.5%] max-w-[225px]">
                      {`•  ${unit.name} [${unit.type === "standard" ? "Standar" : "Sudut"}]`}
                    </Text>
                  ))
                )}
              </View>
            </View>

            <View className="flex-1 flex-row justify-between gap-4">
              <TouchableOpacity
                className="flex-1 flex-row items-center gap-4 px-4 py-3 bg-[#07484E] rounded-xl"
                testID="brochure-button"
                onPress={() => {
                  if (clusRef.brochure_url) {
                    Linking.openURL(clusRef.brochure_url);
                  } else {
                    Alert.alert("Notifikasi", "Tidak ada brosur yang tersedia untuk properti ini");
                  }
                }}
              >
                <FileText size={40} color="#ffffff" />
                <Text className="flex-1 text-center text-base/[24px] text-white font-medium">Lihat E-Brosur</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 flex-row items-center gap-4 px-4 py-3 bg-[#07484E] rounded-xl"
                testID="open-modal"
                onPress={() => setModalOpen(true)}
              >
                <BadgePercent size={40} color="#ffffff" />
                <Text className="flex-1 text-center text-base/[24px] text-white font-medium">Cek Promo</Text>
              </TouchableOpacity>
            </View>

            <CustomModal isOpen={modalOpen} testID="promo-modal">
              <View className="w-full h-3/5 p-6 rounded-xl gap-y-4 bg-white">
                <TouchableOpacity
                  testID="close-modal"
                  className="absolute right-4 top-4"
                  onPress={() => setModalOpen(false)}
                >
                  <X size={24} color="#07484E" />
                </TouchableOpacity>

                <Text className="text-2xl font-extrabold text-[#07484E] text-center">Daftar Promo</Text>

                {clusRef.promotions.length === 0 ? (
                  <Text className="flex-1 px-10 align-middle text-center text-[#07484E] text-base/[24px] font-medium">
                    Tidak ada promo yang tersedia untuk properti ini
                  </Text>
                ) : (
                  <ScrollView>
                    {clusRef.promotions.map((promo, index) => (
                      <View key={index} className={`mb-4 bg-white rounded-xl shadow overflow-hidden`}>
                        <Image
                          source={{
                            uri: promo.thumbnail_url || "https://via.placeholder.com/300x200.png?text=No+Image",
                          }}
                          resizeMode="cover"
                          className="w-full h-40"
                        />

                        <View className="p-2">
                          <Text className="text-sm font-semibold">{promo.title}</Text>
                          <Text className="text-xs text-gray-500">
                            {new Date(promo.created_at).toLocaleDateString("id-ID", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            })}
                          </Text>
                        </View>

                        <TouchableOpacity
                          className="bg-orange-500 p-2 items-center"
                          testID="promo-button"
                          onPress={() => {
                            setModalOpen(false);
                            router.push({
                              pathname: "/PromoDetail",
                              params: { promoId: promo.id },
                            });
                          }}
                        >
                          <Text className="text-white text-sm font-semibold">Lihat Detail</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </ScrollView>
                )}
              </View>
            </CustomModal>

            <TouchableOpacity
              className="min-h-[54px] flex-1 items-center justify-center py-3 px-6 bg-[#07484E] rounded-lg"
              testID="navigation-button"
              onPress={() =>
                router.push({
                  pathname: "/AddBookingScreen",
                  params: { clusterId: clusRef.id, productId: product.id },
                })
              }
            >
              <Text className="text-white font-extrabold">Pesan Properti</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
