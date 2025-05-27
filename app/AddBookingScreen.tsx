import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar,
  ScrollView,
  Alert
} from 'react-native';
import { ArrowLeftIcon, ChevronDownIcon } from 'react-native-heroicons/outline';
import { useNavigation } from '@react-navigation/native';

// Define cluster options
const clusters = [
  'Golden Avenue',
  'Treasure Island',
  'Sunset Cove',
];

// Define tanda jadi options
const tandaJadiOptions = ['DP', 'Booking Fee', 'Full Payment'];

const AddBookingScreen = () => {
  const navigation = useNavigation();
  
  // Form state
  const [customerName, setCustomerName] = useState('');
  const [ktp, setKtp] = useState('');
  const [cluster, setCluster] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [houseType, setHouseType] = useState('');
  const [tandaJadi, setTandaJadi] = useState('');
  
  // Dropdown states
  const [isClusterOpen, setIsClusterOpen] = useState(false);
  const [isTandaJadiOpen, setIsTandaJadiOpen] = useState(false);
  
  const handleGoBack = () => {
    navigation.goBack();
  };
  
  const handleDone = () => {
    // Validate form
    if (!customerName || !ktp || !cluster || !houseNumber || !houseType || !tandaJadi) {
      Alert.alert('Error', 'Semua kolom harus diisi');
      return;
    }
    
    // Save booking data and navigate back
    console.log({
      customerName,
      ktp,
      cluster,
      houseNumber,
      houseType,
      tandaJadi
    });
    
    Alert.alert('Sukses', 'Booking berhasil ditambahkan', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-teal-600">
      <StatusBar barStyle="light-content" backgroundColor="#0d9488" />
      
      <View className="flex-1">
        {/* Header with back button */}
        <View className="flex-row items-center px-4 py-4">
          <TouchableOpacity 
            onPress={handleGoBack}
            className="mr-2"
          >
            <ArrowLeftIcon size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold">Booking List</Text>
        </View>
        
        <ScrollView className="flex-1 px-4">
          {/* Form fields */}
          <View className="mb-4">
            <Text className="text-white uppercase mb-1">Nama Customer</Text>
            <TextInput
              className="bg-white rounded p-2 h-12"
              placeholder="Text field data"
              value={customerName}
              onChangeText={setCustomerName}
            />
          </View>
          
          <View className="mb-4">
            <Text className="text-white uppercase mb-1">Nomor KTP</Text>
            <TextInput
              className="bg-white rounded p-2 h-12"
              placeholder="Text field data"
              keyboardType="numeric"
              value={ktp}
              onChangeText={setKtp}
            />
          </View>
          
          <View className="mb-4">
            <Text className="text-white uppercase mb-1">Nama Cluster</Text>
            <TouchableOpacity
              className="bg-white rounded p-2 h-12 justify-center"
              onPress={() => setIsClusterOpen(!isClusterOpen)}
            >
              <View className="flex-row justify-between items-center">
                <Text>{cluster || 'cluster'}</Text>
                <ChevronDownIcon size={20} color="black" />
              </View>
            </TouchableOpacity>
            
            {isClusterOpen && (
              <View className="bg-white rounded mt-1 shadow-lg">
                {clusters.map((item) => (
                  <TouchableOpacity
                    key={item}
                    className="p-3 border-b border-gray-100"
                    onPress={() => {
                      setCluster(item);
                      setIsClusterOpen(false);
                    }}
                  >
                    <Text>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          
          <View className="mb-4">
            <Text className="text-white uppercase mb-1">Nomor Rumah</Text>
            <TextInput
              className="bg-white rounded p-2 h-12"
              placeholder="Text field data"
              value={houseNumber}
              onChangeText={setHouseNumber}
            />
          </View>
          
          <View className="mb-4">
            <Text className="text-white uppercase mb-1">Tipe Rumah</Text>
            <TextInput
              className="bg-white rounded p-2 h-12"
              placeholder="Text field data"
              value={houseType}
              onChangeText={setHouseType}
            />
          </View>
          
          <View className="mb-8">
            <Text className="text-white uppercase mb-1">Tanda Jadi</Text>
            <TouchableOpacity
              className="bg-white rounded p-2 h-12 justify-center"
              onPress={() => setIsTandaJadiOpen(!isTandaJadiOpen)}
            >
              <View className="flex-row justify-between items-center">
                <Text>{tandaJadi || 'DP'}</Text>
                <ChevronDownIcon size={20} color="black" />
              </View>
            </TouchableOpacity>
            
            {isTandaJadiOpen && (
              <View className="bg-white rounded mt-1 shadow-lg">
                {tandaJadiOptions.map((item) => (
                  <TouchableOpacity
                    key={item}
                    className="p-3 border-b border-gray-100"
                    onPress={() => {
                      setTandaJadi(item);
                      setIsTandaJadiOpen(false);
                    }}
                  >
                    <Text>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          
          {/* Done button */}
          <TouchableOpacity
            className="bg-gray-800 rounded h-12 items-center justify-center mb-6"
            onPress={handleDone}
          >
            <Text className="text-white text-base font-medium">Done</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default AddBookingScreen;