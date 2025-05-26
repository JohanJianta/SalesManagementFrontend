import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  SafeAreaView,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type UnitDetail = {
  type: string;
  price: string;
};

const PropertyCard = ({
  title,
  priceRange,
  totalUnit,
  image,
  units,
  unitDetails,
  availableUnits,
  cardWidth,
}: {
  title: string;
  priceRange: string;
  totalUnit: number;
  image: any;
  units: number;
  unitDetails: UnitDetail[];
  availableUnits: string[];
  cardWidth: number;
}) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View className="bg-[#155e61] rounded-xl p-4 mb-4" style={{ width: cardWidth }}>
      <View className="flex-row items-center">
        <Image source={image} style={{ width: 120, height: 120, borderRadius: 8 }} />
        <View className="flex-1 ml-3">
          <Text className="text-white font-bold text-base">{title}</Text>
          <Text className="text-white text-sm mt-1">Rp {priceRange}</Text>
          <Text className="text-white text-sm mt-1">{units} unit</Text>
        </View>
      </View>

      <TouchableOpacity onPress={toggleExpand} className="mt-3 self-center">
        {expanded ? (
          <ChevronUp size={24} color="#fbfcfc" />
        ) : (
          <ChevronDown size={24} color="#fbfcfc" />
        )}
      </TouchableOpacity>

      {expanded && (
        <View className="mt-3 border-t border-teal-300 pt-3">
          <Text className="text-white font-semibold text-base mb-2">Harga unit:</Text>
          {unitDetails.map((unit, index) => (
            <Text key={index} className="text-white text-sm">
              {unit.type} = Rp {unit.price}
            </Text>
          ))}
          <Text className="text-white font-semibold text-base mt-4 mb-2">Unit tersedia:</Text>
          {availableUnits.map((unit, index) => (
            <Text key={index} className="text-white text-sm">No. {unit}</Text>
          ))}
        </View>
      )}
    </View>
  );
};

export default function PropertyCardPage() {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;

  const cardWidth = isLargeScreen ? width * 0.42 : width * 0.9;

  return (
    <SafeAreaView className="flex-1 bg-[#0d7377]">
      <ScrollView contentContainerStyle={{ paddingVertical: 20, paddingHorizontal: 10 }}>
        <View className={`flex-row flex-wrap ${isLargeScreen ? 'justify-evenly' : 'justify-center'}`}>
          <PropertyCard
            title="Alexandrite"
            priceRange="3~5 miliar"
            totalUnit={3}
            units={3}
            image={require('../assets/images/azure-apart.jpg')}
            unitDetails={[
              { type: 'Standar', price: '3 Miliar' },
              { type: 'Sudut', price: '5 Miliar' },
            ]}
            availableUnits={['5 (standar)', '6 (standar)', '15 (standar)']}
            cardWidth={cardWidth}
          />

          <PropertyCard
            title="Emerald"
            priceRange="4~6 miliar"
            totalUnit={10}
            units={10}
            image={require('../assets/images/azure-apart.jpg')}
            unitDetails={[
              { type: 'Standar', price: '4 Miliar' },
              { type: 'Sudut', price: '6 Miliar' },
            ]}
            availableUnits={['No. 1', 'No. 2', 'No. 3', 'No. 4']}
            cardWidth={cardWidth}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
