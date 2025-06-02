// DetailProperty.tsx
import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';

const ProductDetail = ({ navigation }: any) => {
  const data = {
    id: 1,
    name: 'Alexandrite',
    default_price: 3000000000,
    corner_price: 5000000000,
    product_units: [
      { id: 1, name: 'No. 5', type: 'standard' },
      { id: 2, name: 'No. 6', type: 'standard' },
      { id: 3, name: 'No. 15', type: 'sudut' }
    ],
    product_features: [
      { name: 'Tanah', total: '119 m²' },
      { name: 'Bangunan', total: '145 m²' },
      { name: 'Lantai', total: '🏠2 Lantai' },
      { name: 'Kamar Tidur', total: '🛏️4+1 Kamar Tidur' },
      { name: 'Kamar Mandi', total: '🛁3+1 Kamar Mandi' },
      { name: 'Dapur', total: '🍳1 Dapur' },
      { name: 'Ruang Tamu', total: '🛋️2 Ruang Tamu' },
      { name: 'Parkir Mobil', total: '🚗2 Parkir Mobil' }
    ],
    
    cluster_ref: {
      name: 'Treasure Island',
      brochure_url: 'https://example.com/brochure/treasure_island.jpg',
      promotions: [
        {
          id: 1,
          title: 'Promotion Example',
          thumbnail_url: 'https://example.com/thumbnail/promotion-1.jpg'
        }
      ]
    }
  };

  const formatRupiah = (value: number) => {
    return 'Rp ' + value.toLocaleString('id-ID');
  };

  return (
    <ScrollView className="flex-1 bg-teal-600">
      {/* Gambar Properti & Judul */}
      <View className="w-full aspect-[3/2] rounded-xl overflow-hidden mt-4">
        <View className="px-4 py-7 flex items-center justify-center">
          <Text className="text-white text-lg font-bold">{data.cluster_ref.name}</Text>
          <Text className="text-white text-xl font-bold -mt-1">{data.name}</Text>
        </View>

        <Image
          source={require('../assets/images/Treasure-Island-Diamond.jpg')}
          resizeMode="cover"
          style={{
            width: '100%',
            height: '70%',
          }}
        />
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="absolute top-4 left-4 bg-white rounded-full p-1"
        >
          <ArrowLeft size={20} color="#155e61" />
        </TouchableOpacity>
      </View>

      {/* Luas Tanah & Bangunan */}
      <View className="flex-row justify-around px-4 mb-4">
        {data.product_features.slice(0, 2).map((feature, index) => (
          <View key={index} className="bg-white/80 rounded-xl p-3 w-[45%] items-center">
            <Text className="text-teal-800 font-bold">{feature.name}</Text>
            <Text className="text-lg text-teal-900 font-bold">{feature.total}</Text>
          </View>
        ))}
      </View>

      {/* Spesifikasi Detail */}
      <View className="bg-white/80 rounded-xl mx-4 p-3 space-y-2 mb-4">
        {data.product_features.slice(2).map((feature, index) => (
          <Text key={index} className="text-teal-900">• {feature.total}</Text>
        ))}
      </View>

      {/* Harga Unit */}
      <View className="flex-row justify-between items-center bg-white/90 mx-4 rounded-xl p-3 mb-3">
        <View>
          <Text className="text-teal-900 font-bold">
            {formatRupiah(data.default_price)} <Text className="text-xs">[Standar]</Text>
          </Text>
          <Text className="text-teal-900 font-bold">
            {formatRupiah(data.corner_price)} <Text className="text-xs">[Sudut]</Text>
          </Text>
        </View>
        <TouchableOpacity className="bg-teal-700 rounded-xl px-3 py-2 flex-row items-center">
          <Text className="text-white font-bold mr-2">Lihat KPR</Text>
          <ArrowRight size={16} color="white" />
        </TouchableOpacity>
      </View>

      {/* Unit Tersedia */}
      <View className="bg-white/90 mx-4 rounded-xl p-3 mb-5">
        <Text className="text-teal-900 font-bold mb-2">Unit Tersedia:</Text>
        {data.product_units.map(unit => (
          <Text key={unit.id} className="text-teal-800">• {unit.name} [{unit.type}]</Text>
        ))}
      </View>

      {/* Tombol Lihat E-Brosur dan Promo */}
      <View className="flex-row justify-around px-4 mb-6">
        <TouchableOpacity
          onPress={() => Linking.openURL(data.cluster_ref.brochure_url)}
          className="bg-white rounded-xl px-4 py-3 w-[48%] items-center"
        >
          <Text className="text-teal-900 font-bold">Lihat E-Brosur</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (data.cluster_ref.promotions.length > 0) {
              Linking.openURL(data.cluster_ref.promotions[0].thumbnail_url);
            }
          }}
          className="bg-white rounded-xl px-4 py-3 w-[48%] items-center"
        >
          <Text className="text-teal-900 font-bold">Cek Promo</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProductDetail;
