import React from 'react';
import {View, Text,Image,TouchableOpacity,ScrollView,Dimensions,SafeAreaView,} from 'react-native';
import BottomNavbar from '@/assets/Component/BottomNavbar';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#155e61]">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Logo Section */}
        <View className="items-center mt-6 mb-6 px-4">
          <Image
            source={require('../assets/images/CPI-logo.png')}
            style={{ width: width * 0.6, height: width * 0.2 }}
            resizeMode="contain"
          />
        </View>

        {/* Button*/}
        <View className="flex-row justify-center flex-wrap gap-2 mb-6 px-4">
          {['Semua', 'Residensial', 'Komersial'].map((label, idx) => (
            <TouchableOpacity
              key={idx}
              className={`${label === 'Semua' ? 'bg-[#0e4b4e]' : 'bg-white'
                } px-4 py-2 rounded-full`}
            >
              <Text
                className={`font-semibold ${label === 'Semua' ? 'text-white' : 'text-[#0e4b4e]'
                  }`}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        
        <View className="flex-col space-y-6 px-4">
          {[
            { title: 'AZURE APARTMENT', img: require('../assets/images/azure-apart.jpg') },
            { title: 'BUSINESS PARK', img: require('../assets/images/businesspark.jpg') },
            { title: 'AZURE APARTMENT', img: require('../assets/images/azure-apart.jpg') },
            { title: 'BUSINESS PARK', img: require('../assets/images/businesspark.jpg') },
          ].map((item, idx) => (
            <View key={idx} className="bg-[#0e4b4e] rounded-xl overflow-hidden shadow-md">
              <Image
                source={item.img}
                style={{
                  width: '100%',
                  height: (width - 30) * 0.6,
                }}
                resizeMode="cover"
              />
              <Text className="text-white font-bold text-center py-2 text-lg">
                {item.title}
              </Text>
            </View>
          ))}
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
