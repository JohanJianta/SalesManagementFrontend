import { View, FlatList, Image, Dimensions, StyleSheet, ViewToken } from "react-native";
import React, { useRef, useState } from "react";

const { width } = Dimensions.get("window");

interface Props {
  imageUrls: string[];
}

export default function ImageCarousel({ imageUrls }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index || 0);
    }
  }).current;

  return (
    <View>
      <FlatList
        data={imageUrls}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        renderItem={({ item }) => <Image source={{ uri: item }} style={styles.image} resizeMode="cover" />}
      />
      <View style={styles.pagination}>
        {imageUrls.map((_, index) => (
          <View key={index} style={[styles.dot, activeIndex === index ? styles.activeDot : {}]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width,
    height: 250,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#0F7480",
  },
});
