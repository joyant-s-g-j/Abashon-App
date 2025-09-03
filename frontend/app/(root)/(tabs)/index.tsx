import { Card, FeaturedCard } from "@/components/Cards";
import Filters from "@/components/Filters";
import { filterProperties, useProperties } from "@/components/PropertyManagement";
import Search from "@/components/Search";
import icons from "@/constants/icons";
import images from "@/constants/images";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const [user, setUser] = useState<{ name: string; profilePic: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('')
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const parsed = JSON.parse(userData);
          setUser(parsed);
        }
      } catch (error) {
        console.error("Failed to load user:", error);
      }
    };

    loadUser();
  }, []);
  const { properties } = useProperties()
  const filteredProperties = filterProperties(properties, searchQuery)
  const featuredProperties = properties.filter((item) => item.isFeatured)

  const formatDataForColumns = (data: any[], numColumns: number) => {
    const numberOfFullRows = Math.floor(data.length / numColumns)
    let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns)

    while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
      data.push({key: `blank-${numberOfElementsLastRow}`, empty: true})
      numberOfElementsLastRow++;
    }
    return data;
  }

  const formattedProperties = formatDataForColumns([...filteredProperties], 2)
  
  return (
    <SafeAreaView className="bg-white h-full">
      <FlatList
        data={formattedProperties}
        renderItem={({ item }) => {
          if (item.empty === true) {
            return <View style={{ flex: 1, margin: 10 }} />;
          }
          return (
            <Card 
              id={item._id.toString()}
              property={item}
            />
          );
        }}
        keyExtractor={(item) => item._id?.toString() || item.key}
        numColumns={2}
        contentContainerClassName="pb-32"
        columnWrapperClassName="flex gap-5 px-5"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View className="px-5">
            <View className="flex flex-row items-center justify-between mt-5">
              <View className="flex flex-row items-center">
                <Image
                  source={
                    user?.profilePic === "local" || !user?.profilePic
                      ? images.avatar
                      : { uri: user.profilePic }
                  }
                  className="size-12 rounded-full"
                />
                <View className="flex flex-col items-start ml-2 justify-center">
                  <Text className="text-xs font-rubik text-black-100">Good Morning</Text>
                  <Text className="text-base font-rubik-medium text-black-300">{user?.name}</Text>
                </View>
              </View>
              <Image source={icons.bell} className="size-6" />
            </View>

            <Search />

            <View className="my-5">
              <View className="flex flex-row items-center justify-between">
                <Text className="text-xl font-rubik-bold text-black-300">Featured</Text>
                <TouchableOpacity>
                  <Text className="text-base font-rubik-bold text-primary-300">See All</Text>
                </TouchableOpacity>
              </View>

              <FlatList
                data={featuredProperties}
                renderItem={({item}) => (
                  <FeaturedCard 
                    id={item._id.toString()}
                    property={item}
                  />
                )}
                keyExtractor={(item) => item._id.toString()}
                horizontal
                bounces={false}
                showsHorizontalScrollIndicator={false}
                contentContainerClassName="flex gap-5 mt-5"
              />
            </View>

            <View className="flex mt-5 flex-row items-center justify-between">
              <Text className="text-xl font-rubik-bold text-black-300">Our Recommendation</Text>
              <TouchableOpacity>
                <Text className="text-base font-rubik-bold text-primary-300">See All</Text>
              </TouchableOpacity>
            </View>

            <Filters /> 
          </View> 
          }
        />
        
    </SafeAreaView>
  );
}
