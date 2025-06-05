import { View, Text, Alert, ActivityIndicator, SafeAreaView, Dimensions, TouchableOpacity } from "react-native";
import { ReactNativeZoomableView } from "@openspacelabs/react-native-zoomable-view";
import HotspotRenderer from "@/src/components/HotspotRenderer";
import { getClusters } from "@/src/repositories/clusterRepo";
import Svg, { Image as SvgImage } from "react-native-svg";
import BottomNavbar from "@/src/components/BottomNavbar";
import CustomModal from "@/src/components/CustomModal";
import React, { useEffect, useState } from "react";
import { X } from "lucide-react-native";
import { router } from "expo-router";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("screen");
const baseSize = SCREEN_HEIGHT >= SCREEN_WIDTH ? SCREEN_HEIGHT : SCREEN_WIDTH;

export default function MapScreen() {
  const [clusters, setClusters] = useState<BriefCluster[]>([]);
  const [masterplanUrl, setMasterplanUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedCluster, setSelectedCluster] = useState<BriefCluster | null>(null);

  useEffect(() => {
    fetchClusters();
  }, []);

  const fetchClusters = async () => {
    try {
      const clusterResponse = await getClusters();
      setClusters(clusterResponse.clusters);
      setMasterplanUrl(clusterResponse.masterplan_url);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Gagal mengambil data Map.");
    } finally {
      setLoading(false);
    }
  };

  function handleClusterPress(cluster: BriefCluster) {
    setModalOpen(true);
    setSelectedCluster(cluster);
  }

  return (
    <SafeAreaView className="flex-1 bg-[#0F7480]">
      <View className="flex-1">
        {loading || !masterplanUrl ? (
          <ActivityIndicator testID="activity-indicator" size="large" color="#fff" className="flex-1" />
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
                cluster.image_hotspots.map((spot) => (
                  <HotspotRenderer
                    key={cluster.id}
                    spot={spot}
                    name={cluster.name}
                    onPress={() => handleClusterPress(cluster)}
                  />
                ))
              )}
            </Svg>
          </ReactNativeZoomableView>
        )}
      </View>

      <CustomModal isOpen={modalOpen}>
        <View className="w-full p-6 rounded-xl gap-y-4 bg-white">
          <TouchableOpacity className="absolute right-4 top-4" onPress={() => setModalOpen(false)}>
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
            onPress={() => {
              setModalOpen(false);
              router.push({
                pathname: "/ClusterScreen",
                params: { clusterId: selectedCluster?.id, clusterName: selectedCluster?.name },
              });
            }}
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
}
