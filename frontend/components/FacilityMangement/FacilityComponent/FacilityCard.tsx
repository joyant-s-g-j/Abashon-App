import { Facility } from "../types/facility";
import { Image, Text, View } from "react-native";
import ActionButtons from "@/components/ActionButtons";

interface FacilityCardProps {
  facility: Facility;
  onEdit: () => void;
  onDelete: () => void;
  isLoading: boolean;
}

const FacilityCard: React.FC<FacilityCardProps> = ({
  facility,
  onEdit,
  onDelete,
  isLoading
}) => {
  return (
    <View className='bg-white rounded-xl p-6 mb-4 shadow-sm border border-gray-100'>
      <View className='flex-row items-center justify-between mb-4'>
        <View className='flex-row items-center flex-1'>
          <View className='size-12 bg-primary-100 rounded-xl items-center justify-center mr-4'>
            <Image
              source={{ uri: facility.icon as string }}
              className='size-8'
              resizeMode="contain"
            />
          </View>
          <View className='flex-1'>
            <Text className='text-lg font-rubik-semibold text-black-300'>
              {facility.name}
            </Text>
            <Text className='text-xs font-rubik text-black-200 mt-1'>
              ID: {facility._id}
            </Text>
            {facility.createdAt && (
              <Text className='text-xs font-rubik text-black-200 mt-1'>
                Created: {new Date(facility.createdAt).toLocaleDateString()}
              </Text>
            )}
          </View>
        </View>
      </View>
      
      <ActionButtons
        onEdit={onEdit}
        onDelete={onDelete}
        disabled={isLoading}
      />
    </View>
  );
};

export default FacilityCard;