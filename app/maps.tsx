import React from 'react';
import { View, Linking, Alert } from 'react-native';
import Svg, { Image, Rect, G } from 'react-native-svg';

const Maps = () => {
  const handleLink = (url: string) => {
    if (!url || url === '#') {
      Alert.alert('Info', 'Tidak ada aksi untuk area ini.');
    } else {
      Linking.openURL(url).catch(() =>
        Alert.alert('Error', 'Gagal membuka tautan: ' + url)
      );
    }
  };

  return (
    <View className="flex-1 bg-teal-700">
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 1536 1536"
      >
        {/* Background image */}
        <Image
          width={1536}
          height={1536}
          href={require('../assets/images/Masterplan-CitraLand-City-CPI-Makassar-1536x1536.jpg')}
        />

        {/* Cluster A */}
        <G onPress={() => handleLink('http://localhost:8081/home')}>
          <Rect
            x={493.037}
            y={460.946}
            width={160.456}
            height={262.564}
            fill="transparent"
            stroke="white"
            strokeWidth={2}
          />
        </G>

        {/* Cluster B */}
        <G onPress={() => handleLink('http://localhost:8081/BookingListScreen')}>
          <Rect
            x={694.336}
            y={703.088}
            width={129.823}
            height={154.621}
            fill="transparent"
            stroke="white"
            strokeWidth={2}
          />
        </G>
      </Svg>
    </View>
  );
};

export default Maps;
