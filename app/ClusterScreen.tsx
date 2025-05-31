import { ReactNativeZoomableView } from "@openspacelabs/react-native-zoomable-view";
import { View, Alert, Text, ActivityIndicator, Dimensions, Image } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { getClusterById } from "@/src/repositories/clusterRepo";
import HotspotRenderer from "@/src/components/HotspotRenderer";
import Svg, { Image as SvgImage } from "react-native-svg";
import { SafeAreaView, ScrollView } from "react-native";
import PropertyCard from "@/src/components/ProductCard";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("screen");
const baseSize = SCREEN_HEIGHT >= SCREEN_WIDTH ? SCREEN_HEIGHT : SCREEN_WIDTH;

export default function ClusterScreen() {
  const [cluster, setCluster] = useState<DetailCluster | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [mapSize, setMapSize] = useState<{ width: number; height: number }>({ width: 594, height: 668 });

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

    Image.getSize(
      cluster.map_url,
      (width, height) => {
        setMapSize({ width, height });
      },
      (_) => {
        console.error("Failed to get original image size.");
        console.error("Default value (594, 668) will be used instead");
        setMapSize({ width: 594, height: 668 });
      }
    );

    if (!mapSize) {
      return <ActivityIndicator size="large" color="#fff" className="flex-1" />;
    }

    return (
      <ReactNativeZoomableView
        maxZoom={1.5}
        minZoom={1}
        zoomStep={0.5}
        initialZoom={1}
        contentWidth={402}
        contentHeight={460}
      >
        <Svg width={402} height={460} viewBox={`0 0 ${mapSize.width} ${mapSize.height}`}>
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
      {/* {renderContent()} */}

      <View className="flex-1 rounded-t-3xl -mt-6">
        <Text className="text-white text-xl font-bold px-4 pt-4 pb-2">Daftar Produk</Text>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
          {cluster?.products.map((product, index) => (
            <PropertyCard
              key={index}
              product={product}
              onPress={() => console.log(`Pindah ke Halaman Product ${product.name} (${product.id})`)}
            />
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
