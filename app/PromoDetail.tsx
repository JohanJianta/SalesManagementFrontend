import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';


const PromoDetail = () => {
    const route = useRoute();
    const navigation = useNavigation(); 
    const { id } = route.params as { id: number };

    const [promo, setPromo] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPromoDetail = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const response = await fetch(`http://18.139.110.33:3000/api/promotions/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    const err = await response.text();
                    console.error('Failed to fetch promo detail:', err);
                    return;
                }

                const data = await response.json();
                setPromo(data);
            } catch (error) {
                console.error('Error fetching promo detail:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPromoDetail();
    }, [id]);

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" color="#00bcd4" />
            </View>
        );
    }

    if (!promo) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <Text className="text-red-500">Promo detail not found.</Text>
            </View>
        );
    }

    return (
        <ScrollView className="flex-1 bg-white p-4">
            {/* Tombol Back */}
            <TouchableOpacity onPress={() => navigation.goBack()} className="mb-4 p-2">
                <ArrowLeftIcon size={28} color="black" />
            </TouchableOpacity>


            <Image
                source={{ uri: promo.thumbnail_url }}
                style={{ width: '100%', height: 200, borderRadius: 12 }}
                resizeMode="cover"
            />
            <Text className="text-xl font-bold mt-4">{promo.title}</Text>
            <Text className="text-sm text-gray-500 mt-1">
                {new Date(promo.created_at).toLocaleDateString()} - {new Date(promo.expired_at).toLocaleDateString()}
            </Text>
            <Text className="text-base mt-4 leading-relaxed">{promo.content}</Text>
        </ScrollView>
    );
};

export default PromoDetail;
