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
  StyleSheet,
  Dimensions,
} from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  DetailProperty: undefined;
};

const { width: windowWidth } = Dimensions.get('window');

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
}: {
  title: string;
  priceRange: string;
  totalUnit: number;
  image: any;
  units: number;
  unitDetails: UnitDetail[];
  availableUnits: string[];
}) => {
  const [expanded, setExpanded] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const getCardWidth = () => {
    if (windowWidth >= 1024) {
      return windowWidth / 3.2;
    } else if (windowWidth >= 768) {
      return windowWidth / 2.2;
    } else {
      return windowWidth * 0.9;
    }
  };

  return (
    <View style={styles.cardContainer}>
      <View
        className="bg-[#155e61] rounded-2xl p-3 min-h-[240px]"
        style={{ width: getCardWidth() }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image source={image} style={styles.image} resizeMode="cover" />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.price}>Rp {priceRange}</Text>
            <Text style={styles.unitCount}>{units} unit</Text>
          </View>
        </View>

        <TouchableOpacity onPress={toggleExpand} style={styles.expandButton}>
          {expanded ? (
            <ChevronUp size={24} color="#fbfcfc" />
          ) : (
            <ChevronDown size={24} color="#fbfcfc" />
          )}
        </TouchableOpacity>

        {expanded && (
          <View style={styles.expandContent}>
            <Text style={styles.expandTitle}>Harga unit:</Text>
            {unitDetails.map((unit, index) => (
              <Text key={index} style={styles.expandText}>
                {unit.type} = Rp {unit.price}
              </Text>
            ))}

            <Text style={[styles.expandTitle, { marginTop: 12 }]}>Unit tersedia:</Text>
            {availableUnits.map((unit, index) => (
              <Text key={index} style={styles.expandText}>
                No. {unit}
              </Text>
            ))}

            <TouchableOpacity
              className="bg-teal-700 rounded-xl px-5 py-4 flex-row items-center justify-end w-20 mt-3"
              onPress={() => navigation.navigate('DetailProperty')}
            >
              <Text className="text-white font-bold text-xs">Detail</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default function PropertyCardPage() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0d7377' }}>
      <ScrollView contentContainerStyle={{ paddingVertical: 20 }}>
        <View
          style={{
            flexDirection: windowWidth >= 768 ? 'row' : 'column',
            justifyContent: windowWidth >= 768 ? 'space-evenly' : 'center',
            flexWrap: 'wrap',
          }}
        >
          {/* Card 1 */}
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
          />

          {/* Card 2 */}
          <PropertyCard
            title="Emerald"
            priceRange="3~5 miliar"
            totalUnit={10}
            units={10}
            image={require('../assets/images/azure-apart.jpg')}
            unitDetails={[
              { type: 'Standar', price: '3 Miliar' },
              { type: 'Sudut', price: '5 Miliar' },
            ]}
            availableUnits={['No. 1', 'No. 2', 'No. 3']}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    paddingHorizontal: 7.3,
    paddingVertical: 7.3,
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 150,
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  price: {
    color: '#fff',
    fontSize: 14,
    marginTop: 4,
  },
  unitCount: {
    color: '#fff',
    fontSize: 14,
    marginTop: 4,
  },
  expandButton: {
    marginTop: 10,
    alignSelf: 'center',
    padding: 6,
  },
  expandContent: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#3dd9d8',
    paddingTop: 10,
  },
  expandTitle: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 20,
    marginBottom: 4,
  },
  expandText: {
    color: '#fff',
    fontSize: 15,
  },
});
