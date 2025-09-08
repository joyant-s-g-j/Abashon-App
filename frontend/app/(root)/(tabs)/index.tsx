import { Card, FeaturedCard } from "@/components/Cards";
import Filters from "@/components/Filters";
import { filterProperties, useProperties } from "@/components/PropertyManagement";
import { EmptyState } from "@/components/ReusableComponent";
import SearchInput from "@/components/SearchInput";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const [user, setUser] = useState<{ name: string; profilePic: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('')
  const params = useLocalSearchParams<{filter?: string}>()
  const selectedFilter = params.filter || "All"
  const { properties } = useProperties()
  const featuredProperties = properties.filter((item) => item.isFeatured)
  const filteredProperties = useMemo(() => {
    let filtered = filterProperties(properties, searchQuery)

    if(selectedFilter !== "All") {
      filtered = filtered.filter(property => {
        if(typeof property.type === "object" && property.type.name) {
          return property.type.name === selectedFilter
        }
        return false
      })
    }
    return filtered
  }, [properties, searchQuery, selectedFilter])

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

  const getGreeting = () => {
    const currentHour = new Date().getHours()

    if(currentHour >= 5 && currentHour < 12) return "Good Moring";
    if(currentHour >= 12 && currentHour < 15) return "Good Noon";
    if(currentHour >= 15 && currentHour < 17) return "Good Afternoon";
    if(currentHour >= 17 && currentHour < 21) return "Good Evening";
    return "Good Night"
  }
  
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
        ListEmptyComponent={
          <EmptyState 
            isEmpty={filteredProperties.length === 0}
            icon='business-outline'
            title='No Properties found'
            message={
                searchQuery || selectedFilter !== "All" 
                  ? "Try adjusting you search"
                  : "Add your first properties to get started"
            }
        />
        }
        ListHeaderComponent={
          <View className="px-5">
            <View className="flex flex-row items-center justify-between mt-5">
              <TouchableOpacity
                onPress={() => router.push("/(root)/(tabs)/profile")}
              >
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
                    <Text className="text-xs font-rubik text-black-100">{getGreeting()}</Text>
                    <Text className="text-base font-rubik-medium text-black-300">{user?.name}</Text>
                  </View>
                </View>
              </TouchableOpacity>
              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={() => router.push("/(root)/messages/users-list")}
                >
                <Ionicons  name="chatbubble-outline" size={24} />
              </TouchableOpacity>
              <Ionicons  name="notifications-outline" size={24}/>
              </View>
            </View>

            <SearchInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search Properties..."
            />

            <View className="my-5">
              <View className="flex flex-row items-center justify-between">
                <Text className="text-xl font-rubik-bold text-black-300">Featured</Text>
                <TouchableOpacity
                  onPress={() => router.push("/explore")}
                >
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
              <TouchableOpacity
                onPress={() => router.push("/explore")}
              >
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
