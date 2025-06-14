import { View, Alert, Text, ActivityIndicator, Dimensions, Image, ScrollView, SafeAreaView } from "react-native";
import { ReactNativeZoomableView } from "@openspacelabs/react-native-zoomable-view";
import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { getClusterById } from "@/src/repositories/clusterRepo";
import HotspotRenderer from "@/src/components/HotspotRenderer";
import Svg, { Image as SvgImage } from "react-native-svg";
import CustomHandle from "@/src/components/CustomHandle";
import PropertyCard from "@/src/components/ProductCard";
import HotspotMask from "@/src/components/HotspotMask";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("screen");

interface MapSize {
  width: number;
  height: number;
}

export default function ClusterScreen() {
  const [loading, setLoading] = useState<boolean>(true);
  const [cluster, setCluster] = useState<DetailCluster | null>(null);
  const [mapSize, setMapSize] = useState<MapSize | null>(null);
  const [expandedProductId, setExpandedProductId] = useState<number | null>(null);

  const { clusterId, clusterName } = useLocalSearchParams();
  const navigation = useNavigation();
  const snapPoints = useMemo(() => ["25%", "50%", "90%", "100%"], []);

  useEffect(() => {
    fetchCluster();
  }, []);

  useEffect(() => {
    if (!cluster?.map_url) return;

    Image.getSize(
      cluster.map_url,
      (width, height) => {
        setMapSize({ width, height });
      },
      () => setMapSize({ width: 594, height: 668 })
    );
  }, [cluster?.map_url]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: clusterName?.toString() || cluster?.name || "Cluster Screen",
    });
  }, [navigation, clusterName, cluster?.name]);

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

  const handleProductPress = (productId: number) => {
    setExpandedProductId((prevId) => (prevId === productId ? null : productId));
  };

  const renderMap = () => {
    if (!cluster?.map_url) return;

    if (!mapSize) {
      return (
        <View className="w-full h-[65%] items-center justify-center">
          <ActivityIndicator testID="activity-indicator" size="large" color="#fff" className="flex-1" />
        </View>
      );
    }

    const mapRatio = mapSize.width / mapSize.height;
    const minHeight = SCREEN_HEIGHT * 0.65;

    let displayWidth = SCREEN_WIDTH;
    let displayHeight = displayWidth / mapRatio;

    if (displayHeight < minHeight) {
      displayHeight = minHeight;
      displayWidth = displayHeight * mapRatio;
    }

    return (
      <View style={{ height: displayHeight }} className="min-h-[400px] max-h-[700px]">
        <ReactNativeZoomableView
          maxZoom={2.5}
          minZoom={1}
          zoomStep={0.5}
          initialZoom={1}
          contentWidth={displayWidth}
          contentHeight={displayHeight}
        >
          <Svg width={displayWidth} height={displayHeight} viewBox={`0 0 ${mapSize.width} ${mapSize.height}`}>
            <SvgImage testID="cluster-map-svg" href={{ uri: cluster.map_url }} />

            {expandedProductId && (
              <HotspotMask
                maskId="multi-hole-mask"
                hotspots={cluster.products.find((p) => p.id === expandedProductId)?.image_hotspots || []}
              />
            )}

            {cluster.products.map((product) =>
              product.image_hotspots.map((spot, index) => (
                <HotspotRenderer
                  key={index}
                  spot={spot}
                  testID="hotspot-button"
                  onPress={() => handleProductPress(product.id)}
                />
              ))
            )}
          </Svg>
        </ReactNativeZoomableView>
      </View>
    );
  };

  const renderProductList = () => (
    <View className="flex-1 gap-4 p-6">
      <Text className="text-white text-xl font-bold">Daftar Produk</Text>
      <View className="flex-1 gap-4 flex-row flex-wrap justify-center">
        {cluster?.products.map((product, index) => (
          <PropertyCard
            key={index}
            product={product}
            expanded={expandedProductId === product.id}
            onToggle={() => handleProductPress(product.id)}
            onPress={() =>
              router.push({
                pathname: "/DetailPropertyScreen",
                params: {
                  productId: product.id,
                  propertyName: `${cluster.name} - ${product.name}`,
                },
              })
            }
          />
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#0F7480]">
      {loading || !cluster ? (
        <ActivityIndicator testID="activity-indicator" size="large" color="#fff" className="flex-1" />
      ) : cluster.map_url !== null ? (
        <>
          {renderMap()}
          <BottomSheet index={0} snapPoints={snapPoints} handleComponent={CustomHandle}>
            <BottomSheetScrollView testID="bottomsheet-scrollview" className="bg-[#0F7480]">
              {renderProductList()}
            </BottomSheetScrollView>
          </BottomSheet>
        </>
      ) : (
        <ScrollView testID="default-scrollview">{renderProductList()}</ScrollView>
      )}
    </SafeAreaView>
  );
}
