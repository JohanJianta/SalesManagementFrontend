import Svg, { Image as SvgImage, Rect, G, Text as SvgText, Circle } from "react-native-svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Alert, Text, ActivityIndicator } from "react-native";
import { SafeAreaView, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import PropertyCard from "./propertycard";
import axios from "axios";

/**
 * CombinedScreen brings together the interactive site‑plan map and the list of
 * property products in a single page.
 *
 * Layout –  portrait phone, 100% height:
 * ┌──────────────────────────────┐
 * │ 55%  Maps (tapable SVG)      │
 * ├──────────────────────────────┤
 * │ 45%  Product list (scroll)   │
 * └──────────────────────────────┘
 */
const CombinedScreen = () => {
  const [clusters, setClusters] = useState<any[]>([]);
  const [masterplanUrl, setMasterplanUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchClusters = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Token tidak ditemukan.");

      const response = await axios.get("http://18.139.110.33:3000/api/clusters", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setClusters(response.data.clusters || []);
      setMasterplanUrl(response.data.masterplan_url || null);
    } catch (error) {
      console.error("Gagal memuat cluster:", error);
      Alert.alert("Error", "Gagal mengambil data cluster dari API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClusters();
  }, []);

  const handlePress = (clusterName: string) => {
    Alert.alert("Cluster", `Kamu memilih ${clusterName}`);
  };
  return (
    <SafeAreaView className="flex-1 bg-teal-700">
      {/* MAP SECTION */}
      <View className="h-[55%]">
        {/* Optional dim overlay for higher contrast against the list below */}
        <View className="absolute inset-0" pointerEvents="none" />
        {loading || !masterplanUrl ? (
          <ActivityIndicator size="large" color="#fff" className="mt-10" />
        ) : (
          <Svg width="100%" height="100%" viewBox="0 0 1536 1536">
            <SvgImage href={{ uri: masterplanUrl }} preserveAspectRatio="xMidYMid slice" />

            {clusters.map((cluster) =>
              cluster.image_hotspots?.map((spot: any, index: number) => (
                <G key={`${cluster.id}-${index}`} onPressOut={() => handlePress(cluster.name)}>
                  {spot.shape === "rectangle" && (
                    <>
                      <Rect
                        x={spot.x}
                        y={spot.y}
                        width={spot.width}
                        height={spot.height}
                        fill="transparent"
                        stroke="white"
                        strokeWidth={2}
                      />
                      <Rect x={spot.x} y={spot.y - 40} rx={10} ry={10} width={130} height={30} fill="green" />
                      <SvgText
                        x={spot.x + 60}
                        y={spot.y - 20}
                        fill="white"
                        fontSize="21"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {cluster.name}
                      </SvgText>
                    </>
                  )}

                  {spot.shape === "circle" && (
                    <>
                      <Circle
                        cx={spot.x}
                        cy={spot.y}
                        r={spot.radius}
                        fill="transparent"
                        stroke="white"
                        strokeWidth={2}
                      />
                      <Rect
                        x={spot.x - 60}
                        y={spot.y - spot.radius - 40}
                        rx={10}
                        ry={10}
                        width={120}
                        height={30}
                        fill="green"
                      />
                      <SvgText
                        x={spot.x}
                        y={spot.y - spot.radius - 20}
                        fill="white"
                        fontSize="18"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {cluster.name}
                      </SvgText>
                    </>
                  )}
                </G>
              ))
            )}
          </Svg>
        )}
      </View>

      {/* PRODUCT LIST SECTION */}
      <View className="h-[45%] bg-teal-700 rounded-t-3xl -mt-6">
        <Text className="text-white text-xl font-bold px-4 pt-4 pb-2">Daftar Produk</Text>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
          {/* EXAMPLE CARD – duplicate / map over your data */}
          <PropertyCard />
          {/* Add more <PropertyCard />s here or render via FlatList */}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default CombinedScreen;
