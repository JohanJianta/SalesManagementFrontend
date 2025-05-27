import React, { useEffect, useState } from 'react';
import { View, Alert, ActivityIndicator, Dimensions } from 'react-native';
import Svg, { Image as SvgImage, Rect, G, Text, Circle } from 'react-native-svg';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNavbar from '@/assets/Component/BottomNavbar';
const { width, height } = Dimensions.get('window');
import { router } from 'expo-router';


const Maps = () => {
  const [clusters, setClusters] = useState<any[]>([]);
  const [masterplanUrl, setMasterplanUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchClusters = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Token tidak ditemukan.');

      const response = await axios.get('http://18.139.110.33:3000/api/clusters', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setClusters(response.data.clusters || []);
      setMasterplanUrl(response.data.masterplan_url || null);
    } catch (error) {
      console.error('Gagal memuat cluster:', error);
      Alert.alert('Error', 'Gagal mengambil data cluster dari API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClusters();
  }, []);

  const handlePress = (clusterName: string) => {
    Alert.alert('Cluster', `Kamu memilih ${clusterName}`);
  };

  return (
    <View className="flex-1 bg-teal-700">
      {loading || !masterplanUrl ? (
        <ActivityIndicator size="large" color="#fff" className="mt-10" />
      ) : (
        <Svg width="100%" height="90%" viewBox="0 0 1536 1536">
          <SvgImage
            
            href={{ uri: masterplanUrl }}
            preserveAspectRatio="xMidYMid slice"
          />

          {clusters.map((cluster) =>
            cluster.image_hotspots?.map((spot: any, index: number) => (
              <G key={`${cluster.id}-${index}`} onPressOut={() => router.push('/CombinedScreen')}>

                {spot.shape === 'rectangle' && (
                  <>
                    <Rect
                      x={spot.x}
                      y={spot.y}
                      width={spot.width}
                      height={spot.height}
                      fill="transparent"
                      stroke="transparent"
                      strokeWidth={2}
                    />
                    <Rect
                      x={spot.x}
                      y={spot.y - 40}
                      rx={10}
                      ry={10}
                      width={120}
                      height={30}
                      fill="green"
                    />
                    <Text
                      x={spot.x + 60}
                      y={spot.y - 20}
                      fill="white"
                      fontSize="18"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {cluster.name}
                    </Text>
                  </>
                )}

                {spot.shape === 'circle' && (
                  <>
                    <Circle
                      cx={spot.x}
                      cy={spot.y}
                      r={spot.radius}
                      fill="transparent"
                      stroke="transparent"
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
                    <Text
                      x={spot.x}
                      y={spot.y - spot.radius - 20}
                      fill="white"
                      fontSize="18"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {cluster.name}
                    </Text>
                  </>
                )}
              </G>
            ))
          )}
        </Svg>
        
      )}
      {/* Bottom Navbar */}
            <BottomNavbar
              activeTab="Map"
              onNavigate={(tab) => {
                console.log(`Navigating to ${tab}`);
              }}
            />
    </View>
    
  );
};

export default Maps;
