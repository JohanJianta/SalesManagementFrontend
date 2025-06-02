import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNavbar from '@/assets/Component/BottomNavbar';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// ✅ Definisikan type stack param list
type RootStackParamList = {
  Promo: undefined;
  PromoDetail: { id: number };
};

// ✅ Typing untuk navigation
type PromoScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Promo'
>;

interface Promotion {
  id: number;
  title: string;
  thumbnail_url: string;
  period: string;
}

const Promo: React.FC = () => {
  const navigation = useNavigation<PromoScreenNavigationProp>(); 
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;

  const [promos, setPromos] = useState<Promotion[]>([]);

  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const token = await AsyncStorage.getItem('token');

        if (!token) {
          console.warn('No token found!');
          return;
        }

        const response = await fetch('http://18.139.110.33:3000/api/promotions', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Failed to fetch promotions (${response.status}):`, errorText);
          return;
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          console.error('Expected array from API, got:', data);
          return;
        }

        const updatedData = data.map((promo) => ({
          ...promo,
          period: 'Periode tidak tersedia',
        }));

        setPromos(updatedData);
      } catch (error) {
        console.error('Failed to fetch promotions:', error);
      }
    };

    fetchPromos();
  }, []);

  return (
    <View className="flex-1 bg-teal-600">
      <ScrollView className="p-4">
        <View className="flex-row flex-wrap justify-evenly">
          {promos.map((item) => (
            <View
              key={item.id}
              className={`mb-4 bg-white rounded-xl shadow overflow-hidden ${
                isLargeScreen ? 'w-[40%] mx-2' : 'w-[90%]'
              }`}
            >
              <Image
                source={{ uri: item.thumbnail_url }}
                resizeMode="cover"
                style={{
                  width: isLargeScreen ? '135%' : '100%',
                  height: isLargeScreen ? 180 : 128,
                  marginLeft: isLargeScreen ? -30 : 0,
                }}
              />
              <View className="p-2">
                <Text className="text-sm font-semibold">{item.title}</Text>
                <Text className="text-xs text-gray-500">{item.period}</Text>
              </View>
              <TouchableOpacity
                className="bg-orange-500 p-2 items-center"
                onPress={() => navigation.navigate('PromoDetail', { id: item.id })}
              >
                <Text className="text-white text-sm font-semibold">See Detail</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        <BottomNavbar
          activeTab="Promo"
          onNavigate={(tab) => {
            console.log(`Navigating to ${tab}`);
          }}
        />
      </View>
    </View>
  );
};

export default Promo;
