import { View, Text, Alert, ActivityIndicator, SafeAreaView, Dimensions, TouchableOpacity } from "react-native";
import Svg, { Image as SvgImage, Text as SvgText, Rect, G, Circle, Polygon } from "react-native-svg";
import { ReactNativeZoomableView } from "@openspacelabs/react-native-zoomable-view";
import { getClusters } from "@/src/repositories/clusterRepo";
import BottomNavbar from "@/src/components/BottomNavbar";
import CustomModal from "@/src/components/CustomModal";
import React, { useEffect, useState } from "react";
import { X } from "lucide-react-native";
import { router } from "expo-router";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("screen");
const baseSize = SCREEN_HEIGHT >= SCREEN_WIDTH ? SCREEN_HEIGHT : SCREEN_WIDTH;

const Maps = () => {
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [masterplanUrl, setMasterplanUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedCluster, setSelectedCluster] = useState<Cluster | null>(null);

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

  function handleClusterPress(cluster: Cluster) {
    setModalOpen(true);
    setSelectedCluster(cluster);
  }

  function renderHotspot(spot: ImageHotspot, name: string, key: number, callback: Function) {
    const FONT_SIZE = 40;
    const TEXT_RECT_HEIGHT = 70;
    const VERTICAL_TEXT_OFFSET = FONT_SIZE * 0.35;

    const MIN_TEXT_RECT_WIDTH = 80;
    const HORIZONTAL_PADDING = 20;

    const estimatedTextWidth = name.length * (FONT_SIZE * 0.5);
    const dynamicTextRectWidth = Math.max(MIN_TEXT_RECT_WIDTH, estimatedTextWidth + 2 * HORIZONTAL_PADDING);

    let centerX: number;
    let centerY: number;

    switch (spot.shape) {
      case "rectangle":
        centerX = spot.x + spot.width / 2;
        centerY = spot.y + spot.height / 2;
        return (
          <G key={key} onPressOut={() => callback()}>
            <Rect {...spot} fill="transparent" />
            <Rect
              x={centerX - dynamicTextRectWidth / 2}
              y={centerY - TEXT_RECT_HEIGHT / 2}
              rx={10}
              ry={10}
              width={dynamicTextRectWidth}
              height={TEXT_RECT_HEIGHT}
              fill="#0F7480"
            />
            <SvgText
              x={centerX}
              y={centerY + VERTICAL_TEXT_OFFSET}
              fontSize={FONT_SIZE}
              fontWeight="bold"
              textAnchor="middle"
              fill="white"
            >
              {name}
            </SvgText>
          </G>
        );

      case "circle":
        centerX = spot.x;
        centerY = spot.y;
        return (
          <G key={key} onPressOut={() => callback()}>
            <Circle cx={spot.x} cy={spot.y} r={spot.radius} fill="transparent" />
            <Rect
              x={centerX - dynamicTextRectWidth / 2}
              y={centerY - TEXT_RECT_HEIGHT / 2}
              rx={10}
              ry={10}
              width={dynamicTextRectWidth}
              height={TEXT_RECT_HEIGHT}
              fill="#0F7480"
            />
            <SvgText
              x={centerX}
              y={centerY + VERTICAL_TEXT_OFFSET}
              fontSize={FONT_SIZE}
              fontWeight="bold"
              textAnchor="middle"
              fill="white"
            >
              {name}
            </SvgText>
          </G>
        );

      case "polygon":
        let minX = Infinity,
          minY = Infinity,
          maxX = -Infinity,
          maxY = -Infinity;
        spot.points.forEach((p) => {
          minX = Math.min(minX, p.x);
          minY = Math.min(minY, p.y);
          maxX = Math.max(maxX, p.x);
          maxY = Math.max(maxY, p.y);
        });

        centerX = minX + (maxX - minX) / 2;
        centerY = minY + (maxY - minY) / 2;

        const pointsStr = spot.points.map((p) => `${p.x},${p.y}`).join(" ");

        return (
          <G key={key} onPressOut={() => callback()}>
            <Polygon points={pointsStr} fill="transparent" />
            <Rect
              x={centerX - dynamicTextRectWidth / 2}
              y={centerY - TEXT_RECT_HEIGHT / 2}
              rx={10}
              ry={10}
              width={dynamicTextRectWidth}
              height={TEXT_RECT_HEIGHT}
              fill="#0F7480"
            />
            <SvgText
              x={centerX}
              y={centerY + VERTICAL_TEXT_OFFSET}
              fontSize={FONT_SIZE}
              fontWeight="bold"
              textAnchor="middle"
              fill="white"
            >
              {name}
            </SvgText>
          </G>
        );

      default:
        return null;
    }
  }

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
            initialZoom={1}
            contentWidth={baseSize}
            contentHeight={baseSize}
          >
            <Svg width={baseSize} height={baseSize} viewBox="0 0 1920 1920">
              <SvgImage href={{ uri: masterplanUrl }} />
              {clusters.map((cluster) =>
                cluster.image_hotspots?.map((spot) =>
                  renderHotspot(spot, cluster.name, cluster.id, () => handleClusterPress(cluster))
                )
              )}
            </Svg>
          </ReactNativeZoomableView>
        )}
      </View>

      <CustomModal isOpen={modalOpen}>
        <View className="w-full p-6 rounded-xl gap-y-4 bg-white">
          <TouchableOpacity
            className="absolute right-4 top-4"
            onPress={() => {
              setModalOpen(false);
            }}
          >
            <X size={24} color="#07484E" />
          </TouchableOpacity>

          <Text className="text-2xl font-extrabold text-[#07484E] text-center">{selectedCluster?.name}</Text>

          <Text className="text-base text-[#07484E] font-medium">
            <Text className="font-bold">Kategori:</Text>{" "}
            {selectedCluster?.category === "residential" ? "Residensial" : "Komersial"}
          </Text>
          <Text className="text-base text-[#07484E] font-medium">
            <Text className="font-bold">Alamat:</Text> {selectedCluster?.address}
          </Text>
          <Text className="text-base text-[#07484E] font-medium">
            <Text className="font-bold">Unit Tersedia:</Text> {selectedCluster?.available_unit}
          </Text>

          <TouchableOpacity
            className="bg-[#07484E] py-3 px-6 rounded-lg mt-4"
            onPress={() =>
              router.push({
                pathname: "/CombinedScreen",
                params: { clusterId: selectedCluster?.id },
              })
            }
          >
            <Text className="text-white text-center text-base font-semibold">Lihat Daftar Produk</Text>
          </TouchableOpacity>
        </View>
      </CustomModal>

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
