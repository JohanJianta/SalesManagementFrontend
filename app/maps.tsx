import Svg, { Image as SvgImage, Rect, G, Text, Circle, Polygon } from "react-native-svg";
import { View, Alert, ActivityIndicator, SafeAreaView, Dimensions } from "react-native";
import { ReactNativeZoomableView } from "@openspacelabs/react-native-zoomable-view";
import { getClusters } from "../src/repositories/clusterRepo";
import BottomNavbar from "@/src/components/BottomNavbar";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";

const { width, height } = Dimensions.get("screen");
const baseSize = height >= width ? height : width;

const Maps = () => {
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [masterplanUrl, setMasterplanUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchClusters = async () => {
    try {
      const clusterResponse = await getClusters();
      setClusters(clusterResponse.clusters);
      setMasterplanUrl(clusterResponse.masterplan_url);
    } catch (error) {
      Alert.alert("Error", "Gagal mengambil data cluster dari API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClusters();
  }, []);

  const handlePress = (clusterId: number) => {
    Alert.alert("Cluster", `Kamu memilih ${clusterId}`);
  };

  const renderHotspot = (spot: ImageHotspot, clusterName: string, key: number) => {
    switch (spot.shape) {
      case "rectangle":
        return (
          <G key={key} onPressOut={() => handlePress(key)}>
            <Rect {...spot} fill="transparent" stroke="white" strokeWidth={2} />
            <Rect x={spot.x} y={spot.y - 40} rx={10} ry={10} width={120} height={30} fill="green" />
            <Text x={spot.x + 60} y={spot.y - 20} fill="white" fontSize="18" fontWeight="bold" textAnchor="middle">
              {clusterName}
            </Text>
          </G>
        );

      case "circle":
        return (
          <G key={key} onPressOut={() => handlePress(key)}>
            <Circle cx={spot.x} cy={spot.y} r={spot.radius} fill="transparent" stroke="white" strokeWidth={2} />
            <Rect x={spot.x - 60} y={spot.y - spot.radius - 40} rx={10} ry={10} width={120} height={30} fill="green" />
            <Text
              x={spot.x}
              y={spot.y - spot.radius - 20}
              fill="white"
              fontSize="18"
              fontWeight="bold"
              textAnchor="middle"
            >
              {clusterName}
            </Text>
          </G>
        );

      case "polygon":
        const pointsStr = spot.points.map((p) => `${p.x},${p.y}`).join(" ");
        const labelPoint = spot.points[0];

        return (
          <G key={key} onPressOut={() => handlePress(key)}>
            <Polygon points={pointsStr} fill="transparent" stroke="white" strokeWidth={2} />
            <Rect x={labelPoint.x} y={labelPoint.y - 40} rx={10} ry={10} width={120} height={30} fill="green" />
            <Text
              x={labelPoint.x + 60}
              y={labelPoint.y - 20}
              fill="white"
              fontSize="18"
              fontWeight="bold"
              textAnchor="middle"
            >
              {clusterName}
            </Text>
          </G>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0F7480]">
      <View className="flex-1">
        {loading || !masterplanUrl ? (
          <ActivityIndicator size="large" color="#fff" className="flex-1" />
        ) : (
          <ReactNativeZoomableView
            maxZoom={2.5}
            minZoom={1}
            zoomStep={0.5}
            initialZoom={0.8}
            contentWidth={baseSize}
            contentHeight={baseSize}
          >
            <Svg width={baseSize} height={baseSize} viewBox="0 0 1920 1920">
              <SvgImage href={{ uri: masterplanUrl }} x="0" y="0" width={"100%"} height={"100%"} />
              {clusters.map((cluster) =>
                cluster.image_hotspots?.map((spot) => renderHotspot(spot, cluster.name, cluster.id))
              )}
            </Svg>
          </ReactNativeZoomableView>
        )}
      </View>

      <BottomNavbar
        activeTab="Map"
        onNavigate={(tab) => {
          console.log(`Navigating to ${tab}`);
        }}
      />
    </SafeAreaView>
  );
};

export default Maps;
