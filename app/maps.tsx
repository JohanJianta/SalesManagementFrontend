import React from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';

const App = () => {
  return (
    <View style={styles.container}>
      {/* Background Peta */}
      <Image
        source={require('../assets/images/Masterplan-CitraLand-City-CPI-Makassar-1536x1536.jpg')}
        style={styles.mapImage}
        resizeMode="contain"
      />

      {/* Cluster 1 */}
      <View style={[styles.pin, { top: '20%', left: '35%', backgroundColor: 'red' }]}>
        <Text style={styles.label}>Cluster 1</Text>
      </View>

      {/* Cluster 2 */}
      <View style={[styles.pin, { top: '20%', left: '70%', backgroundColor: 'blue' }]}>
        <Text style={styles.label}>Cluster 2</Text>
      </View>

      {/* Cluster 3 */}
      <View style={[styles.pin, { top: '70%', left: '30%', backgroundColor: 'green' }]}>
        <Text style={styles.label}>Cluster 3</Text>
      </View>

      {/* Cluster 4 */}
      <View style={[styles.pin, { top: '70%', left: '70%', backgroundColor: 'orange' }]}>
        <Text style={styles.label}>Cluster 4</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  pin: {
    position: 'absolute',
    padding: 6,
    borderRadius: 12,
  },
  label: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default App;
