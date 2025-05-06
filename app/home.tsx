import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Dimensions, SafeAreaView } from 'react-native';
import BottomNavbar from '@/assets/Component/BottomNavbar';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const projects = [
    { title: 'AZURE APARTMENT', img: require('../assets/images/azure-apart.jpg') },
    { title: 'BUSINESS PARK', img: require('../assets/images/businesspark.jpg') },
    { title: 'AZURE APARTMENT', img: require('../assets/images/azure-apart.jpg') },
    { title: 'BUSINESS PARK', img: require('../assets/images/businesspark.jpg') },
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#155e61]">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
       {/* Logo Section */}
        <View className="items-center mt-6 mb-6 px-4">
        <Image className="w-[357px] h-[248px]"

            source={require('../assets/images/CPI-logo.png')}
          
            resizeMode="contain"
          />
        </View>

        {/* Button Section */}
        <View className="flex-row justify-center flex-wrap gap-2 mb-6 px-4">
          {['Semua', 'Residensial', 'Komersial'].map((label, idx) => (
            <TouchableOpacity
              key={idx}
              className={`${label === 'Semua' ? 'bg-[#0e4b4e]' : 'bg-white'} px-4 py-2 rounded-full`}
            >
              <Text className={`font-semibold ${label === 'Semua' ? 'text-white' : 'text-[#0e4b4e]'}`}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="px-4 py-6">
  <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {projects.map((item, idx) => (
      <View key={idx} className="bg-[#0e4b4e] overflow-hidden shadow-md">
        {/* Menggunakan ukuran responsif untuk gambar */}
        <View className="w-full sm:w-[357px] lg:w-[500px] h-[248px] sm:h-[248px] lg:h-[300px]">
          <Image
            source={item.img}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        </View>
        <Text className="text-white font-bold text-center py-2 text-lg md:text-xl mt-4">
          {item.title}
        </Text>
      </View>
    ))}
  </View>
</View>

      </ScrollView>

      {/* Bottom Navbar */}
      <BottomNavbar
        activeTab="Home"
        onNavigate={(tab) => {
          console.log(`Navigating to ${tab}`);
        }}
      />
    </SafeAreaView>
  );
}
