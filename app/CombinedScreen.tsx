import React from 'react';
import { SafeAreaView, View, Text, ScrollView } from 'react-native';
import Maps from '../app/maps';
import PropertyCard from '../app/propertycard'; //  <-- make sure PropertyCard is the *component*, not the page

/**
 * CombinedScreen brings together the interactive site‑plan map and the list of
 * property products in a single page.
 *
 * Layout –  portrait phone, 100% height:
 * ┌──────────────────────────────┐
 * │ 55%  Maps (tapable SVG)      │
 * ├──────────────────────────────┤
 * │ 45%  Product list (scroll)   │
 * └──────────────────────────────┘
 */
const CombinedScreen = () => {
  return (
    
    <SafeAreaView className="flex-1 bg-teal-700">
      {/* MAP SECTION */}
      <View className="h-[55%]">
       
        {/* Optional dim overlay for higher contrast against the list below */}
        <View className="absolute inset-0" pointerEvents="none" />
        <Maps />
      </View>

      {/* PRODUCT LIST SECTION */}
      <View className="h-[45%] bg-teal-700 rounded-t-3xl -mt-6">
        <Text className="text-white text-xl font-bold px-4 pt-4 pb-2">Daftar Produk</Text>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 32 }}
        >
          {/* EXAMPLE CARD – duplicate / map over your data */}
          <PropertyCard
           
          />
          {/* Add more <PropertyCard />s here or render via FlatList */}
        </ScrollView>
      </View>
    </SafeAreaView>
    
  );
};

export default CombinedScreen;
