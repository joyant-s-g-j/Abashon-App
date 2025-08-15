import { Text, View } from "react-native";
import { Facility } from "../types/facility";
import FacilityCard from "./FacilityCard";
import { LoadingBox } from "@/components/ReusableComponent";

interface FacilityListProps {
  facilities: Facility[];
  searchQuery: string;
  isLoading: boolean;
  onEditFacility: (facility: Facility) => void;
  onDeleteFacility: (facility: Facility) => void;
}

const FacilityList: React.FC<FacilityListProps> = ({
  facilities,
  searchQuery,
  isLoading,
  onEditFacility,
  onDeleteFacility
}) => {
  <LoadingBox isLoading={isLoading} message="Loading facilities" />
  
  if (facilities.length === 0) {
    return (
      <View className='bg-white rounded-xl p-8 items-center justify-center shadow-sm'>
        <Text className='text-3xl mb-2'>🏊</Text>
        <Text className='text-black-300 font-rubik-medium mb-1'>No Facilities found</Text>
        <Text className='text-black-200 font-rubik text-center'>
          {searchQuery ? 'Try adjusting your search' : 'Add your first facility to get started'}
        </Text>
      </View>
    );
  }

  return (
    <View>
      <Text className='text-lg font-rubik-semibold text-black-300 mb-4'>
        All Facilities ({facilities.length})
      </Text>
      {facilities.map((facility, index) => (
        <FacilityCard
          key={facility._id || index}
          facility={facility}
          onEdit={() => onEditFacility(facility)}
          onDelete={() => onDeleteFacility(facility)}
          isLoading={isLoading}
        />
      ))}
    </View>
  );
};

export default FacilityList;