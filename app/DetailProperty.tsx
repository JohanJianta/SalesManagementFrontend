import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';
export default function DetailProperty({ navigation }: any) {


    return (
        <ScrollView className="flex-1 bg-teal-600">
            {/* Gambar Properti */}
            <View className="w-full aspect-[3/2] rounded-xl overflow-hidden mt-4">
                {/* Judul */}
                <View className="px-4 py-7 flex items-center justify-center">
                    <Text className="text-white text-lg font-bold">Treasure Island</Text>
                    <Text className="text-white text-xl font-bold -mt-1">Alexandrite</Text>
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
                <View className="bg-white/80 rounded-xl p-3 w-[45%] items-center">
                    <Text className="text-teal-800 font-bold">Tanah</Text>
                    <Text className="text-lg text-teal-900 font-bold">119 m²</Text>
                </View>
                <View className="bg-white/80 rounded-xl p-3 w-[45%] items-center">
                    <Text className="text-teal-800 font-bold">Bangunan</Text>
                    <Text className="text-lg text-teal-900 font-bold">145 m²</Text>
                </View>
            </View>

            {/* Spesifikasi Detail */}
            <View className="bg-white/80 rounded-xl mx-4 p-3 space-y-2 mb-4">
                <Text className="text-teal-900">🏠 2 Lantai</Text>
                <Text className="text-teal-900">🛏️ 4+1 Kamar Tidur</Text>
                <Text className="text-teal-900">🛁 3+1 Kamar Mandi</Text>
                <Text className="text-teal-900">🍳 1 Dapur</Text>
                <Text className="text-teal-900">🛋️ 2 Ruang Tamu</Text>
                <Text className="text-teal-900">🚗 2 Parkir Mobil</Text>
            </View>

            {/* Harga Unit */}
            <View className="flex-row justify-between items-center bg-white/90 mx-4 rounded-xl p-3 mb-3">
                <View>
                    <Text className="text-teal-900 font-bold">Rp 3.000.000.000 <Text className="text-xs">[Standar]</Text></Text>
                    <Text className="text-teal-900 font-bold">Rp 5.000.000.000 <Text className="text-xs">[Sudut]</Text></Text>
                </View>
                <TouchableOpacity className="bg-teal-700 rounded-xl px-3 py-2 flex-row items-center">
                    <Text className="text-white font-bold mr-2">Lihat KPR</Text>
                    <ArrowRight size={16} color="white" />
                </TouchableOpacity>
            </View>

            {/* Unit Tersedia */}
            <View className="bg-white/90 mx-4 rounded-xl p-3 mb-5">
                <Text className="text-teal-900 font-bold mb-2">Unit Tersedia:</Text>
                <Text className="text-teal-800">• No. 5 [standar]</Text>
                <Text className="text-teal-800">• No. 6 [standar]</Text>
                <Text className="text-teal-800">• No. 15 [standar]</Text>
            </View>

            {/* Tombol Bawah: Lihat E-Brosur dan Cek Promo */}
            <View className="flex-row justify-around px-4 mb-6">
                <TouchableOpacity className="bg-white rounded-xl px-4 py-3 w-[48%] items-center">
                    <Text className="text-teal-900 font-bold">Lihat E-Brosur</Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-white rounded-xl px-4 py-3 w-[48%] items-center">
                    <Text className="text-teal-900 font-bold">Cek Promo</Text>
                </TouchableOpacity>
            </View>

        </ScrollView>
    );
}
