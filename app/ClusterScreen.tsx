import { ReactNativeZoomableView } from "@openspacelabs/react-native-zoomable-view";
import { View, Alert, Text, ActivityIndicator, Image } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { getClusterById } from "@/src/repositories/clusterRepo";
import HotspotRenderer from "@/src/components/HotspotRenderer";
import Svg, { Image as SvgImage } from "react-native-svg";
import { SafeAreaView, ScrollView } from "react-native";
import PropertyCard from "./propertycard";

export default function ClusterScreen() {
  const [cluster, setCluster] = useState<DetailCluster | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const { clusterId, clusterName } = useLocalSearchParams();
  const navigation = useNavigation();

  useEffect(() => {
    fetchCluster();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: clusterName?.toString() || "Cluster Screen",
    });
  }, [navigation, clusterName]);

  const fetchCluster = async () => {
    try {
      const clusterResponse = await getClusterById(+clusterId);
      setCluster(clusterResponse);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Gagal mengambil data Cluster.");
    } finally {
      setLoading(false);
    }
  };

  const handleProductPress = (productName: string) => {
    Alert.alert("Product", `Kamu memilih ${productName}`);
  };

  const renderContent = () => {
    if (loading || !cluster) {
      return <ActivityIndicator size="large" color="#fff" className="flex-1" />;
    }

    if (!cluster.map_url) return;

    return (
      <ReactNativeZoomableView
        maxZoom={2.5}
        minZoom={1}
        zoomStep={0.5}
        initialZoom={1}
        contentWidth={500}
        contentHeight={500}
      >
        <Svg width={500} height={500} viewBox="0 0 1920 1920">
          <SvgImage href={{ uri: cluster.map_url }} />
          {cluster.products.map((product) =>
            product.image_hotspots.map((spot) => (
              <HotspotRenderer
                key={product.id}
                spot={spot}
                name={product.name}
                onPress={() => handleProductPress(product.name)}
              />
            ))
          )}
        </Svg>
      </ReactNativeZoomableView>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0F7480]">
      <View className="h-[55%]">
        <View className="absolute inset-0" pointerEvents="none" />
        {renderContent()}
      </View>

      <View className="h-[45%] rounded-t-3xl -mt-6">
        <Text className="text-white text-xl font-bold px-4 pt-4 pb-2">Daftar Produk</Text>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
          <PropertyCard />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
