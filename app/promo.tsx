import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
import BottomNavbar from '@/assets/Component/BottomNavbar';

const promos = [
  {
    id: 1,
    image: require('../assets/images/promo.jpeg'),
    title: 'Promo Top Hotel - Liburan Tahun Baru',
    period: 'Periode 5 - 8 Dec 17',
  },

  {
    id: 1,
    image: require('../assets/images/promo.jpeg'),
    title: 'Promo Top Hotel - Liburan Tahun Baru',
    period: 'Periode 5 - 8 Dec 17',
  },
  // ...promo lainnya
];

const Promo = () => {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;

  return (

    <View className="flex-1 bg-teal-600">
      <ScrollView className="p-4">
        <View className="flex-row flex-wrap justify-center justify-evenly">
  {promos.map((item) => (
    <View
      key={item.id}
      className={`mb-4 bg-white rounded-xl shadow overflow-hidden
        ${isLargeScreen ? 'w-[40%] mx-2' : 'w-[90%]'}`}
    >
      <Image
        source={item.image}
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
      <TouchableOpacity className="bg-orange-500 p-2 items-center">
        <Text className="text-white text-sm font-semibold">See Detail</Text>
      </TouchableOpacity>
    </View>
  ))}
</View>

      </ScrollView>

      {/* BottomNavbar fixed di bawah */}
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
